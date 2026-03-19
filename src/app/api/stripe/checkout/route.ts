import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visaId, userId, userEmail } = body;

    if (!visaId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: visaId, userId' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get visa details
    const { data: visa, error: visaError } = await supabase
      .from('visas')
      .select('name, subclass, premium_price')
      .eq('id', visaId)
      .single();

    if (visaError || !visa) {
      return NextResponse.json(
        { error: 'Visa not found' },
        { status: 404 }
      );
    }

    // Check if user already purchased this visa
    const { data: existingPurchase, error: purchaseError } = await supabase
      .from('visa_purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('visa_id', visaId)
      .eq('access_status', 'active')
      .single();

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You have already purchased this visa' },
        { status: 400 }
      );
    }

    const priceInCents = Math.round((visa.premium_price || 49) * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${visa.name} (Subclass ${visa.subclass}) - Premium Access`,
              description: 'Lifetime access to premium visa application content, forms, and guides.',
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/visas/${visaId}/premium?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/visas/${visaId}?canceled=true`,
      customer_email: userEmail,
      metadata: {
        user_id: userId,
        visa_id: visaId,
        purchase_type: 'visa_unlock',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
