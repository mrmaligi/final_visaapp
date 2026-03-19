import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { updateConsultationStatus } from '@/lib/actions/consultation-actions';
import { createPaymentRecord } from '@/lib/actions/payment-actions';
import { 
  sendPaymentConfirmationEmail, 
  sendBookingConfirmationEmail,
  sendLawyerBookingNotification 
} from '@/lib/email/notifications';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const purchaseType = session.metadata?.purchase_type;
        const userId = session.metadata?.user_id;
        
        if (!userId) {
          console.error('Missing user_id in session metadata');
          break;
        }

        if (purchaseType === 'visa_unlock') {
          await handleVisaUnlockPayment(session, supabase);
        } else if (purchaseType === 'consultation') {
          await handleConsultationPayment(session, supabase);
        }
        
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Async payment succeeded:', session.id);
        // Handle async payments if needed
        break;
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Async payment failed:', session.id);
        
        // Update consultation status to cancelled if applicable
        if (session.metadata?.purchase_type === 'consultation' && session.metadata?.consultation_id) {
          await updateConsultationStatus(
            session.metadata.consultation_id, 
            'cancelled'
          );
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Charge refunded:', charge.id);
        
        // Update payment record if refund was processed through Stripe
        if (charge.payment_intent) {
          await handleRefund(charge, supabase);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleVisaUnlockPayment(
  session: Stripe.Checkout.Session, 
  supabase: any
) {
  const userId = session.metadata?.user_id;
  const visaId = session.metadata?.visa_id;
  
  if (!userId || !visaId) {
    console.error('Missing metadata in visa unlock session');
    return;
  }

  // Get visa details for email
  const { data: visa } = await supabase
    .from('visas')
    .select('name, subclass')
    .eq('id', visaId)
    .single();

  // Get user details for email
  const { data: user } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single();

  // Check if already processed (idempotency)
  const { data: existingPurchase } = await supabase
    .from('visa_purchases')
    .select('id')
    .eq('stripe_payment_intent_id', session.payment_intent as string)
    .single();

  if (existingPurchase) {
    console.log('Visa purchase already processed, skipping');
    return;
  }

  // Create visa purchase record
  const { error: purchaseError } = await supabase
    .from('visa_purchases')
    .insert({
      user_id: userId,
      visa_id: visaId,
      stripe_payment_intent_id: session.payment_intent as string,
      amount_paid: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || 'USD',
      access_status: 'active',
    });

  if (purchaseError) {
    console.error('Failed to create purchase record:', purchaseError);
    return;
  }

  // Create payment record
  await createPaymentRecord({
    user_id: userId,
    payment_type: 'visa_unlock',
    amount: (session.amount_total || 0) / 100,
    currency: session.currency?.toUpperCase() || 'USD',
    status: 'completed',
    stripe_payment_intent_id: session.payment_intent as string,
    description: `${visa?.name || 'Visa'} Premium Unlock`,
    metadata: {
      visa_id: visaId,
      visa_name: visa?.name,
      session_id: session.id
    }
  });

  console.log('✅ Visa purchase recorded:', { userId, visaId });

  // Send confirmation email
  if (user?.email) {
    await sendPaymentConfirmationEmail({
      userEmail: user.email,
      userName: user.full_name || 'Valued Customer',
      amount: (session.amount_total || 0) / 100,
      currency: session.currency?.toUpperCase() || 'USD',
      description: `${visa?.name || 'Visa'} (Subclass ${visa?.subclass}) - Premium Access`,
      paymentId: session.payment_intent as string,
      date: new Date().toLocaleDateString('en-AU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    });
  }
}

async function handleConsultationPayment(
  session: Stripe.Checkout.Session, 
  supabase: any
) {
  const userId = session.metadata?.user_id;
  const lawyerId = session.metadata?.lawyer_id;
  const consultationId = session.metadata?.consultation_id;
  
  if (!userId || !lawyerId || !consultationId) {
    console.error('Missing metadata in consultation session');
    return;
  }

  const visaType = session.metadata?.visa_type || '';
  const duration = parseInt(session.metadata?.duration || '60');
  const amount = parseFloat(session.metadata?.amount || '0');

  // Get user details
  const { data: user } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single();

  // Get lawyer details
  const { data: lawyer } = await supabase
    .from('lawyers')
    .select('full_name, email')
    .eq('id', lawyerId)
    .single();

  // Check if already processed
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('id')
    .eq('stripe_payment_intent_id', session.payment_intent as string)
    .single();

  if (existingPayment) {
    console.log('Consultation payment already processed, skipping');
    return;
  }

  // Update consultation status to confirmed
  await updateConsultationStatus(
    consultationId, 
    'confirmed',
    session.payment_intent as string
  );

  // Create payment record
  await createPaymentRecord({
    user_id: userId,
    payment_type: 'consultation',
    amount: amount,
    currency: session.currency?.toUpperCase() || 'USD',
    status: 'completed',
    stripe_payment_intent_id: session.payment_intent as string,
    description: `Consultation with ${lawyer?.full_name || 'Lawyer'}`,
    metadata: {
      consultation_id: consultationId,
      lawyer_id: lawyerId,
      visa_type: visaType,
      duration,
      session_id: session.id
    }
  });

  // Calculate platform fee (15%)
  const platformFee = amount * 0.15;
  const lawyerEarnings = amount - platformFee;

  // Create lawyer earnings record
  const { error: earningsError } = await supabase
    .from('lawyer_earnings')
    .insert({
      lawyer_id: lawyerId,
      consultation_id: consultationId,
      gross_amount: amount,
      platform_fee: platformFee,
      net_amount: lawyerEarnings,
      status: 'pending',
    });

  if (earningsError) {
    console.error('Failed to create earnings record:', earningsError);
  }

  console.log('✅ Consultation payment recorded:', { userId, lawyerId, consultationId });

  // Get consultation details for email
  const { data: consultation } = await supabase
    .from('consultations')
    .select('scheduled_at, client_notes')
    .eq('id', consultationId)
    .single();

  const scheduledDate = consultation?.scheduled_at 
    ? new Date(consultation.scheduled_at) 
    : new Date();

  // Send booking confirmation to user
  if (user?.email) {
    await sendBookingConfirmationEmail({
      userEmail: user.email,
      userName: user.full_name || 'Valued Customer',
      lawyerName: lawyer?.full_name || 'Your Lawyer',
      visaType,
      duration,
      scheduledDate: scheduledDate.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      scheduledTime: scheduledDate.toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      amount,
      meetingLink: undefined // Will be added later
    });
  }

  // Send notification to lawyer
  if (lawyer?.email) {
    await sendLawyerBookingNotification(
      lawyer.email,
      lawyer.full_name || 'Lawyer',
      user?.full_name || 'Client',
      visaType,
      scheduledDate.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      scheduledDate.toLocaleTimeString('en-AU', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      duration,
      consultation?.client_notes
    );
  }
}

async function handleRefund(charge: Stripe.Charge, supabase: any) {
  // Find the original payment
  const { data: originalPayment } = await supabase
    .from('payments')
    .select('*')
    .eq('stripe_payment_intent_id', charge.payment_intent)
    .neq('payment_type', 'refund')
    .single();

  if (!originalPayment) {
    console.log('Original payment not found for refund');
    return;
  }

  // Update original payment status
  await supabase
    .from('payments')
    .update({ status: 'refunded', updated_at: new Date().toISOString() })
    .eq('id', originalPayment.id);

  // Create refund record
  const refundAmount = (charge.amount_refunded || 0) / 100;
  await supabase
    .from('payments')
    .insert({
      user_id: originalPayment.user_id,
      payment_type: 'refund',
      amount: -refundAmount,
      currency: originalPayment.currency,
      status: 'completed',
      stripe_payment_intent_id: charge.payment_intent as string,
      description: `Refund for: ${originalPayment.description}`,
      metadata: {
        original_payment_id: originalPayment.id,
        original_amount: originalPayment.amount,
        refund_reason: 'Processed through Stripe'
      }
    });

  // If this was a consultation, update the consultation status
  if (originalPayment.metadata?.consultation_id) {
    await updateConsultationStatus(
      originalPayment.metadata.consultation_id,
      'refunded'
    );
  }

  console.log('✅ Refund processed:', { 
    paymentId: originalPayment.id, 
    amount: refundAmount 
  });
}
