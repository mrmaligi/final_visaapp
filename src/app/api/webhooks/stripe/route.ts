import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
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
        
        // Only process visa unlock payments
        if (session.metadata?.purchase_type === 'visa_unlock') {
          const userId = session.metadata.user_id;
          const visaId = session.metadata.visa_id;
          
          if (!userId || !visaId) {
            console.error('Missing metadata in session');
            break;
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
          } else {
            console.log('✅ Visa purchase recorded:', { userId, visaId });
          }
        }
        break;
      }

      case 'checkout.session.async_payment_succeeded': {
        // Handle async payment success (e.g., bank transfers)
        console.log('Async payment succeeded:', event.data.object.id);
        break;
      }

      case 'checkout.session.async_payment_failed': {
        // Handle failed async payments
        console.log('Async payment failed:', event.data.object.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
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
