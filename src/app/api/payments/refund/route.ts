import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount, reason } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: paymentId' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Payment is not eligible for refund' },
        { status: 400 }
      );
    }

    // Check if already refunded
    const { data: existingRefund } = await supabase
      .from('payments')
      .select('id')
      .eq('metadata->>original_payment_id', paymentId)
      .eq('payment_type', 'refund')
      .single();

    if (existingRefund) {
      return NextResponse.json(
        { error: 'Refund already processed for this payment' },
        { status: 400 }
      );
    }

    // Process refund with Stripe
    const refundAmount = amount 
      ? Math.round(amount * 100) 
      : undefined;

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id,
      amount: refundAmount,
      reason: 'requested_by_customer',
      metadata: {
        original_payment_id: paymentId,
        refund_reason: reason || 'Customer request'
      }
    });

    if (refund.status === 'failed') {
      return NextResponse.json(
        { error: 'Refund failed in Stripe' },
        { status: 400 }
      );
    }

    // Update original payment status
    await supabase
      .from('payments')
      .update({ 
        status: 'refunded', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', paymentId);

    // Create refund record
    const refundAmountInDollars = refundAmount 
      ? refundAmount / 100 
      : payment.amount;

    await supabase
      .from('payments')
      .insert({
        user_id: payment.user_id,
        payment_type: 'refund',
        amount: -refundAmountInDollars,
        currency: payment.currency,
        status: 'completed',
        stripe_payment_intent_id: refund.id,
        description: `Refund for: ${payment.description}`,
        metadata: {
          original_payment_id: paymentId,
          original_amount: payment.amount,
          refund_reason: reason || 'Customer request',
          stripe_refund_id: refund.id
        }
      });

    // If consultation, update status
    if (payment.metadata?.consultation_id) {
      await supabase
        .from('consultations')
        .update({ 
          status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.metadata.consultation_id);

      // Update lawyer earnings status
      await supabase
        .from('lawyer_earnings')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('consultation_id', payment.metadata.consultation_id);
    }

    return NextResponse.json({ 
      success: true, 
      refundId: refund.id,
      amount: refundAmountInDollars
    });

  } catch (error: any) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process refund' },
      { status: 500 }
    );
  }
}
