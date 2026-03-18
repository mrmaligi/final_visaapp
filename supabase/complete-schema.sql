-- VISA HELPER PLATFORM - COMPLETE DATABASE SCHEMA
-- Run this entire file in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- USERS TABLE (Extended from auth.users)
CREATE TABLE public.users (
 id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 email TEXT UNIQUE NOT NULL,
 display_name TEXT,
 profile_picture_url TEXT,
 role TEXT DEFAULT 'user' CHECK (role IN ('user', 'lawyer', 'admin')),
 email_verified BOOLEAN DEFAULT FALSE,
 is_admin BOOLEAN DEFAULT FALSE,
 phone TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LAWYERS TABLE
CREATE TABLE public.lawyers (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
 full_name TEXT NOT NULL,
 email TEXT NOT NULL,
 phone TEXT,
 firm_name TEXT,
 registration_number TEXT NOT NULL UNIQUE,
 years_experience INTEGER CHECK (years_experience >= 0),
 bio TEXT,
 profile_photo_url TEXT,
 verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
 verification_documents JSONB DEFAULT '[]'::jsonb,
 approved_by UUID REFERENCES public.users(id),
 approved_at TIMESTAMPTZ,
 rejection_reason TEXT,
 average_rating DECIMAL(3,2) DEFAULT 0,
 total_consultations INTEGER DEFAULT 0,
 total_reviews INTEGER DEFAULT 0,
 stripe_connect_account_id TEXT,
 stripe_connect_onboarded BOOLEAN DEFAULT FALSE,
 languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
 accepts_new_clients BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISAS TABLE
CREATE TABLE public.visas (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 subclass TEXT NOT NULL UNIQUE,
 name TEXT NOT NULL,
 category TEXT NOT NULL CHECK (category IN ('family', 'work', 'student', 'business', 'visitor', 'protection')),
 short_description TEXT,
 full_description TEXT,
 official_link TEXT,
 application_fee DECIMAL(10,2),
 premium_price DECIMAL(10,2) DEFAULT 49.00,
 is_active BOOLEAN DEFAULT TRUE,
 total_purchases INTEGER DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISA PREMIUM CONTENT TABLE
CREATE TABLE public.visa_premium_content (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 visa_id UUID UNIQUE REFERENCES public.visas(id) ON DELETE CASCADE,
 form_schema JSONB NOT NULL DEFAULT '{"sections": []}'::jsonb,
 document_requirements JSONB DEFAULT '[]'::jsonb,
 guide_content TEXT,
 sample_files JSONB DEFAULT '[]'::jsonb,
 tips_and_mistakes TEXT,
 timeline_content TEXT,
 last_updated_by UUID REFERENCES public.users(id),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISA PURCHASES TABLE
CREATE TABLE public.visa_purchases (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
 stripe_payment_intent_id TEXT NOT NULL,
 amount_paid DECIMAL(10,2) NOT NULL,
 currency TEXT DEFAULT 'USD',
 purchased_at TIMESTAMPTZ DEFAULT NOW(),
 access_status TEXT DEFAULT 'active' CHECK (access_status IN ('active', 'revoked')),
 UNIQUE(user_id, visa_id)
);

-- USER DOCUMENTS TABLE
CREATE TABLE public.user_documents (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 visa_purchase_id UUID REFERENCES public.visa_purchases(id) ON DELETE SET NULL,
 document_category TEXT NOT NULL,
 document_type TEXT NOT NULL,
 file_name TEXT NOT NULL,
 file_path TEXT NOT NULL,
 file_size INTEGER,
 mime_type TEXT,
 uploaded_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),
 shared_with_lawyer BOOLEAN DEFAULT FALSE
);

-- USER APPLICATION DATA TABLE
CREATE TABLE public.user_application_data (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 visa_purchase_id UUID REFERENCES public.visa_purchases(id) ON DELETE CASCADE,
 form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
 completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
 status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted')),
 last_saved_at TIMESTAMPTZ DEFAULT NOW(),
 completed_at TIMESTAMPTZ,
 UNIQUE(user_id, visa_purchase_id)
);

-- CONSULTATIONS TABLE
CREATE TABLE public.consultations (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE CASCADE,
 visa_id UUID REFERENCES public.visas(id),
 scheduled_at TIMESTAMPTZ NOT NULL,
 duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60)),
 amount_paid DECIMAL(10,2) NOT NULL,
 stripe_payment_intent_id TEXT NOT NULL,
 user_questions TEXT,
 documents_shared BOOLEAN DEFAULT FALSE,
 status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled')),
 meeting_link TEXT,
 cancellation_reason TEXT,
 cancelled_by UUID REFERENCES public.users(id),
 cancelled_at TIMESTAMPTZ,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),
 completed_at TIMESTAMPTZ
);

-- REVIEWS TABLE
CREATE TABLE public.reviews (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 consultation_id UUID UNIQUE REFERENCES public.consultations(id) ON DELETE CASCADE,
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE CASCADE,
 rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
 review_text TEXT,
 lawyer_response TEXT,
 lawyer_responded_at TIMESTAMPTZ,
 is_verified BOOLEAN DEFAULT TRUE,
 is_flagged BOOLEAN DEFAULT FALSE,
 flagged_reason TEXT,
 helpful_count INTEGER DEFAULT 0,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- LAWYER PRICING TABLE
CREATE TABLE public.lawyer_pricing (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE CASCADE,
 visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
 hourly_rate DECIMAL(10,2) NOT NULL CHECK (hourly_rate > 0),
 currency TEXT DEFAULT 'USD',
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW(),
 UNIQUE(lawyer_id, visa_id)
);

-- LAWYER NOTES TABLE
CREATE TABLE public.lawyer_notes (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE CASCADE,
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 note_text TEXT NOT NULL,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRACKER ENTRIES TABLE
CREATE TABLE public.tracker_entries (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 visa_id UUID REFERENCES public.visas(id) ON DELETE CASCADE,
 submitted_by_type TEXT NOT NULL CHECK (submitted_by_type IN ('user', 'lawyer')),
 submitted_by_id UUID NOT NULL,
 lodgement_date DATE NOT NULL,
 decision_date DATE,
 processing_days INTEGER GENERATED ALWAYS AS (CASE WHEN decision_date IS NOT NULL THEN decision_date - lodgement_date ELSE NULL END) STORED,
 outcome TEXT CHECK (outcome IN ('approved', 'refused', 'withdrawn', 'pending')),
 complexity_notes TEXT,
 verified BOOLEAN DEFAULT FALSE,
 verified_by UUID REFERENCES public.users(id),
 verified_at TIMESTAMPTZ,
 is_flagged BOOLEAN DEFAULT FALSE,
 flagged_reason TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEWS ARTICLES TABLE
CREATE TABLE public.news_articles (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 title TEXT NOT NULL,
 slug TEXT UNIQUE NOT NULL,
 summary TEXT,
 content TEXT NOT NULL,
 source_url TEXT,
 related_visa_ids UUID[] DEFAULT ARRAY[]::UUID[],
 featured_image_url TEXT,
 category TEXT CHECK (category IN ('policy_changes', 'visa_updates', 'legal_changes', 'general')),
 published BOOLEAN DEFAULT FALSE,
 published_at TIMESTAMPTZ,
 view_count INTEGER DEFAULT 0,
 created_by UUID REFERENCES public.users(id),
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEWS COMMENTS TABLE
CREATE TABLE public.news_comments (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 news_article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
 commenter_type TEXT NOT NULL CHECK (commenter_type IN ('user', 'lawyer')),
 commenter_id UUID NOT NULL,
 comment_text TEXT NOT NULL,
 parent_comment_id UUID REFERENCES public.news_comments(id) ON DELETE CASCADE,
 is_flagged BOOLEAN DEFAULT FALSE,
 flagged_reason TEXT,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SAVED LAWYERS TABLE
CREATE TABLE public.saved_lawyers (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
 lawyer_id UUID REFERENCES public.lawyers(id) ON DELETE CASCADE,
 created_at TIMESTAMPTZ DEFAULT NOW(),
 UNIQUE(user_id, lawyer_id)
);

-- PLATFORM SETTINGS TABLE
CREATE TABLE public.platform_settings (
 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 setting_key TEXT UNIQUE NOT NULL,
 setting_value JSONB NOT NULL,
 description TEXT,
 updated_by UUID REFERENCES public.users(id),
 updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.platform_settings (setting_key, setting_value, description) VALUES
 ('default_visa_price', '49.00', 'Default premium unlock price for visas'),
 ('platform_commission', '0.00', 'Platform commission percentage on consultations'),
 ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
 ('allow_lawyer_registration', 'true', 'Allow new lawyer registrations');

-- INDEXES
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_lawyers_verification_status ON public.lawyers(verification_status);
CREATE INDEX idx_lawyers_average_rating ON public.lawyers(average_rating DESC);
CREATE INDEX idx_visas_category ON public.visas(category);
CREATE INDEX idx_visas_is_active ON public.visas(is_active);
CREATE INDEX idx_visa_purchases_user_id ON public.visa_purchases(user_id);
CREATE INDEX idx_visa_purchases_visa_id ON public.visa_purchases(visa_id);
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);
CREATE INDEX idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX idx_consultations_lawyer_id ON public.consultations(lawyer_id);
CREATE INDEX idx_consultations_scheduled_at ON public.consultations(scheduled_at);
CREATE INDEX idx_reviews_lawyer_id ON public.reviews(lawyer_id);
CREATE INDEX idx_tracker_visa_id ON public.tracker_entries(visa_id);
CREATE INDEX idx_news_published ON public.news_articles(published);
CREATE INDEX idx_news_slug ON public.news_articles(slug);

-- RLS ENABLE
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_premium_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_application_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lawyer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_lawyers ENABLE ROW LEVEL SECURITY;

-- BASIC RLS POLICIES
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view approved lawyers" ON public.lawyers FOR SELECT USING (verification_status = 'approved');
CREATE POLICY "Anyone can view active visas" ON public.visas FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users can view own purchases" ON public.visa_purchases FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own documents" ON public.user_documents FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage own application data" ON public.user_application_data FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view own consultations" ON public.consultations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view tracker entries" ON public.tracker_entries FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can view published news" ON public.news_articles FOR SELECT USING (published = TRUE);
CREATE POLICY "Anyone can view news comments" ON public.news_comments FOR SELECT USING (TRUE);

-- SEED DATA
INSERT INTO public.visas (subclass, name, category, short_description, official_link, application_fee, is_active) VALUES
 ('189', 'Skilled Independent', 'work', 'Points-tested permanent residence for skilled workers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', 4240, true),
 ('190', 'Skilled Nominated', 'work', 'State or territory nominated permanent residence', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', 4240, true),
 ('482', 'Temporary Skill Shortage', 'work', 'Temporary work visa for skilled workers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482', 1290, true),
 ('500', 'Student', 'student', 'Study in Australia at an educational institution', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', 650, true),
 ('820/801', 'Partner (Onshore)', 'family', 'For partners of Australian citizens or permanent residents', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore-820-801', 8085, true),
 ('600', 'Visitor', 'visitor', 'Short-term visit to Australia for tourism or business', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', 150, true);
