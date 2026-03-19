import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Generate receipt/invoice data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Missing required parameter: paymentId' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get payment with user details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        user:user_id (
          full_name,
          email
        )
      `)
      .eq('id', paymentId)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Generate receipt data
    const receiptNumber = `RCP-${payment.id.slice(0, 8).toUpperCase()}`;
    const receiptDate = new Date(payment.created_at).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const receipt = {
      receiptNumber,
      date: receiptDate,
      customerName: payment.user?.full_name || 'Customer',
      customerEmail: payment.user?.email,
      description: payment.description,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: 'Credit Card (Stripe)',
      paymentId: payment.stripe_payment_intent_id,
      status: payment.status,
      items: [
        {
          description: payment.description,
          amount: payment.amount
        }
      ],
      subtotal: payment.amount,
      tax: 0,
      total: payment.amount
    };

    return NextResponse.json({ receipt });

  } catch (error) {
    console.error('Receipt error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
