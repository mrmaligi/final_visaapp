import { createClient } from '@supabase/supabase-js';

export interface PaymentRecord {
  id: string;
  user_id: string;
  payment_type: 'visa_unlock' | 'consultation' | 'refund';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  stripe_payment_intent_id: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface LawyerEarning {
  id: string;
  lawyer_id: string;
  consultation_id: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  status: 'pending' | 'paid' | 'failed';
  paid_at: string | null;
  created_at: string;
}

// Create payment record
export async function createPaymentRecord(
  paymentData: Omit<PaymentRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('payments')
    .insert(paymentData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating payment record:', error);
    throw new Error('Failed to create payment record');
  }

  return data.id;
}

// Get user payment history
export async function getUserPaymentHistory(userId: string): Promise<PaymentRecord[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payment history:', error);
    throw new Error('Failed to fetch payment history');
  }

  return data || [];
}

// Get lawyer earnings
export async function getLawyerEarnings(lawyerId: string): Promise<LawyerEarning[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('lawyer_earnings')
    .select(`
      *,
      consultation:consultation_id (
        scheduled_at,
        visa_type
      )
    `)
    .eq('lawyer_id', lawyerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lawyer earnings:', error);
    throw new Error('Failed to fetch earnings');
  }

  return data || [];
}

// Calculate lawyer earnings summary
export async function getLawyerEarningsSummary(lawyerId: string): Promise<{
  totalEarned: number;
  pendingAmount: number;
  totalConsultations: number;
  thisMonth: number;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('lawyer_earnings')
    .select('net_amount, status, created_at')
    .eq('lawyer_id', lawyerId);

  if (error) {
    console.error('Error fetching earnings summary:', error);
    throw new Error('Failed to fetch earnings summary');
  }

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const summary = (data || []).reduce((acc, earning) => {
    acc.totalEarned += earning.net_amount;
    acc.totalConsultations += 1;
    
    if (earning.status === 'pending') {
      acc.pendingAmount += earning.net_amount;
    }

    const earningDate = new Date(earning.created_at);
    if (earningDate >= thisMonthStart) {
      acc.thisMonth += earning.net_amount;
    }

    return acc;
  }, {
    totalEarned: 0,
    pendingAmount: 0,
    totalConsultations: 0,
    thisMonth: 0
  });

  return summary;
}

// Process refund
export async function processRefund(
  paymentId: string,
  amount?: number
): Promise<{ success: boolean; message: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get payment record
  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (paymentError || !payment) {
    return { success: false, message: 'Payment not found' };
  }

  if (payment.status !== 'completed') {
    return { success: false, message: 'Payment is not eligible for refund' };
  }

  // Check if already refunded
  const { data: existingRefund } = await supabase
    .from('payments')
    .select('id')
    .eq('metadata->>original_payment_id', paymentId)
    .eq('payment_type', 'refund')
    .single();

  if (existingRefund) {
    return { success: false, message: 'Refund already processed for this payment' };
  }

  // Update original payment status
  const { error: updateError } = await supabase
    .from('payments')
    .update({ status: 'refunded', updated_at: new Date().toISOString() })
    .eq('id', paymentId);

  if (updateError) {
    return { success: false, message: 'Failed to update payment status' };
  }

  // Create refund record
  const refundAmount = amount || payment.amount;
  const { error: refundError } = await supabase
    .from('payments')
    .insert({
      user_id: payment.user_id,
      payment_type: 'refund',
      amount: -refundAmount,
      currency: payment.currency,
      status: 'completed',
      stripe_payment_intent_id: payment.stripe_payment_intent_id,
      description: `Refund for: ${payment.description}`,
      metadata: {
        original_payment_id: paymentId,
        original_amount: payment.amount,
        refund_reason: 'Customer request'
      }
    });

  if (refundError) {
    return { success: false, message: 'Failed to create refund record' };
  }

  return { success: true, message: 'Refund processed successfully' };
}

// Get payment by ID
export async function getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error) {
    console.error('Error fetching payment:', error);
    return null;
  }

  return data;
}
