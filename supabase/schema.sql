-- Visa Application Platform Database Schema
-- final_visaapp

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    nationality VARCHAR(100),
    date_of_birth DATE,
    passport_number VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin', 'agent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visa applications
CREATE TABLE IF NOT EXISTS visa_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    visa_type VARCHAR(100) NOT NULL,
    destination_country VARCHAR(100) NOT NULL,
    purpose VARCHAR(255),
    intended_entry_date DATE,
    intended_exit_date DATE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'completed')),
    priority VARCHAR(20) DEFAULT 'standard' CHECK (priority IN ('standard', 'express', 'urgent')),
    application_fee DECIMAL(10, 2),
    notes TEXT,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents for applications
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES visa_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Application timeline/status history
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES visa_applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visa types catalogue
CREATE TABLE IF NOT EXISTS visa_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    requirements TEXT[],
    processing_time VARCHAR(100),
    fee_amount DECIMAL(10, 2),
    valid_duration VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages between applicants and agents
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES visa_applications(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    attachments JSONB,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visa_applications_user_id ON visa_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_visa_applications_status ON visa_applications(status);
CREATE INDEX IF NOT EXISTS idx_documents_application_id ON documents(application_id);
CREATE INDEX IF NOT EXISTS idx_status_history_application_id ON application_status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_application_id ON messages(application_id);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Visa applications policies
CREATE POLICY "Users can view own applications" ON visa_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own applications" ON visa_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON visa_applications FOR UPDATE USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (
    EXISTS (SELECT 1 FROM visa_applications WHERE id = documents.application_id AND user_id = auth.uid())
);
CREATE POLICY "Users can upload own documents" ON documents FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM visa_applications WHERE id = documents.application_id AND user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages for their applications" ON messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM visa_applications WHERE id = messages.application_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'agent'))
);

-- Insert sample visa types
INSERT INTO visa_types (name, country, code, description, requirements, processing_time, fee_amount, valid_duration) VALUES
('Tourist Visa', 'Australia', 'SUBCLASS_600', 'For tourism and visiting family/friends', ARRAY['Valid passport', 'Proof of funds', 'Travel itinerary', 'Health insurance'], '15-30 days', 150.00, '3-12 months'),
('Student Visa', 'Australia', 'SUBCLASS_500', 'For international students', ARRAY['Valid passport', 'COE from institution', 'Proof of funds', 'Health insurance (OSHC)', 'English proficiency'], '30-60 days', 650.00, 'Duration of course'),
('Work Visa', 'Australia', 'SUBCLASS_482', 'Temporary Skill Shortage visa', ARRAY['Valid passport', 'Job offer', 'Skills assessment', 'Health check', 'Police clearance'], '30-90 days', 2770.00, '1-4 years'),
('Business Visa', 'Australia', 'SUBCLASS_188', 'Business Innovation and Investment', ARRAY['Valid passport', 'Business history', 'Investment funds', 'Business plan'], '12-18 months', 5450.00, '4 years'),
('Visitor Visa', 'USA', 'B1_B2', 'For tourism, business, or medical treatment', ARRAY['Valid passport', 'DS-160 form', 'Photo', 'Proof of funds', 'Ties to home country'], '3-5 weeks', 185.00, 'Up to 10 years'),
('Student Visa', 'USA', 'F1', 'For academic studies', ARRAY['Valid passport', 'I-20 form', 'SEVIS fee', 'Proof of funds', 'English proficiency'], '2-4 weeks', 350.00, 'Duration of study'),
('Tourist Visa', 'UK', 'STANDARD_VISITOR', 'For tourism, business, or short study', ARRAY['Valid passport', 'Proof of funds', 'Travel itinerary', 'Accommodation details'], '3-6 weeks', 115.00, '6 months'),
('Work Visa', 'UK', 'SKILLED_WORKER', 'For skilled workers with job offer', ARRAY['Valid passport', 'COS from employer', 'English proficiency', 'Proof of funds'], '3-8 weeks', 625.00, 'Up to 5 years');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_applications_updated_at BEFORE UPDATE ON visa_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
