// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
        };
      };
      lawyers: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          registration_number: string;
          years_experience: number;
          base_hourly_rate: number;
          verification_status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          client_id: string;
          lawyer_id: string;
          visa_type: string;
          duration_minutes: number;
          scheduled_at: string;
          status: 'pending_payment' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
          amount_paid: number;
          stripe_payment_intent_id: string | null;
          client_notes: string | null;
          meeting_link: string | null;
          created_at: string;
        };
      };
      payments: {
        Row: {
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
        };
      };
      lawyer_earnings: {
        Row: {
          id: string;
          lawyer_id: string;
          consultation_id: string;
          gross_amount: number;
          platform_fee: number;
          net_amount: number;
          status: 'pending' | 'paid' | 'failed';
          paid_at: string | null;
          created_at: string;
        };
      };
      lawyer_pricing: {
        Row: {
          id: string;
          lawyer_id: string;
          visa_type: string;
          duration_30_price: number;
          duration_60_price: number;
          duration_90_price: number;
          currency: string;
          is_active: boolean;
          created_at: string;
        };
      };
      visa_purchases: {
        Row: {
          id: string;
          user_id: string;
          visa_id: string;
          stripe_payment_intent_id: string;
          amount_paid: number;
          currency: string;
          access_status: 'active' | 'expired' | 'refunded';
          created_at: string;
        };
      };
    };
  };
}
