export type User = {
  id: string;
  email: string;
  display_name?: string;
  profile_picture_url?: string;
  role: 'user' | 'lawyer' | 'admin';
  email_verified: boolean;
  is_admin: boolean;
  created_at: string;
};

export type Visa = {
  id: string;
  subclass: string;
  name: string;
  category: 'family' | 'work' | 'student' | 'business' | 'visitor' | 'protection';
  short_description?: string;
  full_description?: string;
  official_link?: string;
  application_fee?: number;
  premium_price: number;
  is_active: boolean;
  total_purchases: number;
};

export type Lawyer = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  firm_name?: string;
  registration_number: string;
  years_experience?: number;
  bio?: string;
  profile_photo_url?: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  average_rating: number;
  total_consultations: number;
  total_reviews: number;
  languages: string[];
  accepts_new_clients: boolean;
  created_at: string;
};
