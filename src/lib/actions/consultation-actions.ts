import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/client';

// Types for lawyer pricing
export interface LawyerPricing {
  id: string;
  lawyer_id: string;
  visa_type: string;
  duration_30_price: number;
  duration_60_price: number;
  duration_90_price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsultationBookingData {
  lawyerId: string;
  visaType: string;
  duration: number;
  date: string;
  time: string;
  notes?: string;
  userId: string;
  userEmail: string;
}

export interface ConsultationRecord {
  id: string;
  client_id: string;
  lawyer_id: string;
  visa_type: string;
  duration_minutes: number;
  scheduled_at: string;
  status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  amount_paid: number;
  client_notes?: string;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

// Get lawyer pricing
export async function getLawyerPricing(lawyerId: string): Promise<LawyerPricing[]> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('lawyer_pricing')
    .select('*')
    .eq('lawyer_id', lawyerId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching lawyer pricing:', error);
    throw new Error('Failed to fetch lawyer pricing');
  }

  return data || [];
}

// Get lawyer pricing for specific visa type
export async function getLawyerPricingForVisa(
  lawyerId: string, 
  visaType: string
): Promise<LawyerPricing | null> {
  const supabase = createServerClient();
  
  const { data, error } = await supabase
    .from('lawyer_pricing')
    .select('*')
    .eq('lawyer_id', lawyerId)
    .eq('visa_type', visaType)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching lawyer pricing:', error);
    throw new Error('Failed to fetch lawyer pricing');
  }

  return data;
}

// Calculate consultation price
export function calculateConsultationPrice(
  pricing: LawyerPricing | null,
  duration: number
): number {
  if (!pricing) {
    // Default pricing if no custom pricing set
    const defaultPrices: Record<number, number> = {
      30: 150,
      60: 250,
      90: 350
    };
    return defaultPrices[duration] || 250;
  }

  switch (duration) {
    case 30:
      return pricing.duration_30_price;
    case 60:
      return pricing.duration_60_price;
    case 90:
      return pricing.duration_90_price;
    default:
      return pricing.duration_60_price;
  }
}

// Create consultation record (pending payment)
export async function createConsultationRecord(
  bookingData: ConsultationBookingData,
  amount: number
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Combine date and time into scheduled_at
  const scheduledAt = new Date(`${bookingData.date}T${bookingData.time}`);

  const { data, error } = await supabase
    .from('consultations')
    .insert({
      client_id: bookingData.userId,
      lawyer_id: bookingData.lawyerId,
      visa_type: bookingData.visaType,
      duration_minutes: bookingData.duration,
      scheduled_at: scheduledAt.toISOString(),
      status: 'pending_payment',
      amount_paid: amount,
      client_notes: bookingData.notes,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating consultation:', error);
    throw new Error('Failed to create consultation record');
  }

  return data.id;
}

// Get lawyer availability for a date
export async function getLawyerAvailability(
  lawyerId: string,
  date: string
): Promise<string[]> {
  const supabase = createServerClient();

  // Get all time slots (this could be customized per lawyer in the future)
  const allTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Get existing consultations for this date
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);

  const { data: existingConsultations, error } = await supabase
    .from('consultations')
    .select('scheduled_at')
    .eq('lawyer_id', lawyerId)
    .gte('scheduled_at', startOfDay.toISOString())
    .lte('scheduled_at', endOfDay.toISOString())
    .in('status', ['confirmed', 'pending_payment']);

  if (error) {
    console.error('Error fetching lawyer availability:', error);
    throw new Error('Failed to fetch availability');
  }

  // Extract booked time slots
  const bookedSlots = existingConsultations?.map(consultation => {
    const date = new Date(consultation.scheduled_at);
    return date.toTimeString().slice(0, 5); // Format as HH:MM
  }) || [];

  // Filter out booked slots
  const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

  return availableSlots;
}

// Get user consultations
export async function getUserConsultations(userId: string): Promise<ConsultationRecord[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      lawyer:lawyer_id (
        full_name,
        avatar_url
      )
    `)
    .eq('client_id', userId)
    .order('scheduled_at', { ascending: false });

  if (error) {
    console.error('Error fetching user consultations:', error);
    throw new Error('Failed to fetch consultations');
  }

  return data || [];
}

// Get lawyer consultations
export async function getLawyerConsultations(lawyerId: string): Promise<ConsultationRecord[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      client:client_id (
        full_name,
        email
      )
    `)
    .eq('lawyer_id', lawyerId)
    .order('scheduled_at', { ascending: false });

  if (error) {
    console.error('Error fetching lawyer consultations:', error);
    throw new Error('Failed to fetch consultations');
  }

  return data || [];
}

// Update consultation status after payment
export async function updateConsultationStatus(
  consultationId: string,
  status: 'confirmed' | 'cancelled' | 'completed' | 'refunded',
  stripePaymentIntentId?: string
): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const updateData: Record<string, any> = { 
    status,
    updated_at: new Date().toISOString()
  };
  
  if (stripePaymentIntentId) {
    updateData.stripe_payment_intent_id = stripePaymentIntentId;
  }

  const { error } = await supabase
    .from('consultations')
    .update(updateData)
    .eq('id', consultationId);

  if (error) {
    console.error('Error updating consultation:', error);
    throw new Error('Failed to update consultation status');
  }
}
