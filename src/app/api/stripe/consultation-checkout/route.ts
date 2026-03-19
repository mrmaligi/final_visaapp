import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { 
  createConsultationRecord, 
  calculateConsultationPrice, 
  getLawyerPricingForVisa 
} from '@/lib/actions/consultation-actions';

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    stripeClient = new Stripe(key, { apiVersion: '2026-02-25.clover' });
  }
  return stripeClient;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      lawyerId, 
      visaType, 
      duration, 
      date, 
      time, 
      notes, 
      userId, 
      userEmail,
      userName 
    } = body;

    // Validation
    if (!lawyerId || !visaType || !duration || !date || !time || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get lawyer details
    const { data: lawyer, error: lawyerError } = await supabase
      .from('lawyers')
      .select('id, full_name, email, base_hourly_rate')
      .eq('id', lawyerId)
      .eq('verification_status', 'approved')
      .single();

    if (lawyerError || !lawyer) {
      return NextResponse.json(
        { error: 'Lawyer not found or not approved' },
        { status: 404 }
      );
    }

    // Check if slot is still available
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const { data: existingConsultations, error: availabilityError } = await supabase
      .from('consultations')
      .select('scheduled_at')
      .eq('lawyer_id', lawyerId)
      .gte('scheduled_at', startOfDay.toISOString())
      .lte('scheduled_at', endOfDay.toISOString())
      .in('status', ['confirmed', 'pending_payment']);

    if (availabilityError) {
      console.error('Error checking availability:', availabilityError);
      return NextResponse.json(
        { error: 'Failed to check availability' },
        { status: 500 }
      );
    }

    // Check if time slot is taken
    const isSlotTaken = existingConsultations?.some(consultation => {
      const consultationTime = new Date(consultation.scheduled_at).toTimeString().slice(0, 5);
      return consultationTime === time;
    });

    if (isSlotTaken) {
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 409 }
      );
    }

    // Get pricing for this visa type
    const pricing = await getLawyerPricingForVisa(lawyerId, visaType);
    const amount = calculateConsultationPrice(pricing, duration);

    // Create consultation record (pending payment)
    const consultationId = await createConsultationRecord({
      lawyerId,
      visaType,
      duration,
      date,
      time,
      notes,
      userId,
      userEmail
    }, amount);

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Consultation with ${lawyer.full_name}`,
              description: `${duration} minute consultation for ${visaType} visa`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/consultations/${consultationId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/lawyers/${lawyerId}/book?canceled=true`,
      customer_email: userEmail,
      metadata: {
        user_id: userId,
        lawyer_id: lawyerId,
        consultation_id: consultationId,
        purchase_type: 'consultation',
        visa_type: visaType,
        duration: duration.toString(),
        scheduled_date: date,
        scheduled_time: time,
        amount: amount.toString(),
      },
    });

    return NextResponse.json({ 
      sessionId: session.id, 
      url: session.url,
      consultationId 
    });

  } catch (error) {
    console.error('Consultation checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
