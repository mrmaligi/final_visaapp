-- Document Management Database Schema
-- Run this in Supabase SQL Editor to set up the document management tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('identity', 'financial', 'employment', 'education', 'health', 'character', 'other')),
    visa_application_id UUID REFERENCES visa_applications(id) ON DELETE SET NULL,
    shared_with_lawyer BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    url TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    expires_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document versions table (for version control)
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document checklists table (requirements per visa type)
CREATE TABLE IF NOT EXISTS document_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_type_id UUID NOT NULL REFERENCES visa_types(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    required BOOLEAN DEFAULT TRUE,
    category TEXT NOT NULL CHECK (category IN ('identity', 'financial', 'employment', 'education', 'health', 'character', 'other')),
    document_types TEXT[] DEFAULT ARRAY['pdf', 'jpg', 'png'],
    max_file_size BIGINT DEFAULT 10485760, -- 10MB in bytes
    max_files INTEGER DEFAULT 1,
    expires_after_days INTEGER, -- Days until document expires
    template_url TEXT,
    example_url TEXT,
    guidelines TEXT[],
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(visa_type_id, name)
);

-- Document checklist progress table (tracks user progress)
CREATE TABLE IF NOT EXISTS document_checklist_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES document_checklists(id) ON DELETE CASCADE,
    visa_application_id UUID NOT NULL REFERENCES visa_applications(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'not_required')),
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, requirement_id, visa_application_id)
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    form_id TEXT NOT NULL,
    form_version TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    progress JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES lawyers(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_visa_application ON documents(visa_application_id);
CREATE INDEX IF NOT EXISTS idx_documents_is_deleted ON documents(is_deleted) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_documents_shared_with_lawyer ON documents(shared_with_lawyer) WHERE shared_with_lawyer = TRUE;
CREATE INDEX IF NOT EXISTS idx_documents_expires_at ON documents(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);

CREATE INDEX IF NOT EXISTS idx_document_checklists_visa_type ON document_checklists(visa_type_id);

CREATE INDEX IF NOT EXISTS idx_checklist_progress_user ON document_checklist_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_application ON document_checklist_progress(visa_application_id);
CREATE INDEX IF NOT EXISTS idx_checklist_progress_status ON document_checklist_progress(status);

CREATE INDEX IF NOT EXISTS idx_form_submissions_user ON form_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view their own documents" 
    ON documents FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" 
    ON documents FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
    ON documents FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
    ON documents FOR DELETE 
    USING (auth.uid() = user_id);

-- Document versions policies
CREATE POLICY "Users can view versions of their documents" 
    ON document_versions FOR SELECT 
    USING (EXISTS (SELECT 1 FROM documents WHERE documents.id = document_versions.document_id AND documents.user_id = auth.uid()));

-- Document checklists policies (public read)
CREATE POLICY "Document checklists are viewable by all authenticated users" 
    ON document_checklists FOR SELECT 
    TO authenticated 
    USING (true);

-- Document checklist progress policies
CREATE POLICY "Users can view their own checklist progress" 
    ON document_checklist_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own checklist progress" 
    ON document_checklist_progress FOR ALL 
    USING (auth.uid() = user_id);

-- Form submissions policies
CREATE POLICY "Users can view their own form submissions" 
    ON form_submissions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own form submissions" 
    ON form_submissions FOR ALL 
    USING (auth.uid() = user_id);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_checklists_updated_at BEFORE UPDATE ON document_checklists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checklist_progress_updated_at BEFORE UPDATE ON document_checklist_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at BEFORE UPDATE ON form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get document statistics for a user
CREATE OR REPLACE FUNCTION get_document_stats(user_uuid UUID)
RETURNS TABLE (
    total BIGINT,
    pending BIGINT,
    verified BIGINT,
    rejected BIGINT,
    expiring_soon BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total,
        COUNT(*) FILTER (WHERE status = 'pending')::BIGINT as pending,
        COUNT(*) FILTER (WHERE status = 'verified')::BIGINT as verified,
        COUNT(*) FILTER (WHERE status = 'rejected')::BIGINT as rejected,
        COUNT(*) FILTER (WHERE expires_at IS NOT NULL AND expires_at < NOW() + INTERVAL '30 days' AND expires_at > NOW())::BIGINT as expiring_soon
    FROM documents
    WHERE user_id = user_uuid AND is_deleted = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get expiring documents
CREATE OR REPLACE FUNCTION get_expiring_documents(user_uuid UUID, days_threshold INTEGER DEFAULT 30)
RETURNS SETOF documents AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM documents
    WHERE user_id = user_uuid 
      AND is_deleted = FALSE 
      AND expires_at IS NOT NULL 
      AND expires_at <= NOW() + (days_threshold || ' days')::INTERVAL
      AND expires_at > NOW()
    ORDER BY expires_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data for document checklists (optional - for testing)
-- Uncomment if you want sample data

/*
-- Insert sample checklist items for a visa type (replace visa_type_id with actual UUID)
INSERT INTO document_checklists (visa_type_id, name, description, required, category, guidelines, sort_order)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'Passport', 'Current passport bio-data page', true, 'identity', 
     ARRAY['Must be valid for at least 6 months', 'All pages must be clearly visible', 'Scan must be in color'], 1),
    ('00000000-0000-0000-0000-000000000001', 'Birth Certificate', 'Full birth certificate', true, 'identity', 
     ARRAY['Must be certified copy'], 2),
    ('00000000-0000-0000-0000-000000000001', 'Bank Statements', 'Last 3 months', true, 'financial', 
     ARRAY['Must show account holder name', 'Official bank documents only'], 3),
    ('00000000-0000-0000-0000-000000000001', 'Employment Contract', 'Current contract or letter', true, 'employment', 
     ARRAY['Must be on company letterhead', 'Must include salary details'], 4),
    ('00000000-0000-0000-0000-000000000001', 'Degree Certificate', 'Highest qualification', true, 'education', 
     ARRAY['Must show institution name', 'Certified copies preferred'], 5);
*/
