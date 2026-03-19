-- =====================================================
-- CREATE MISSING TABLES FOR VISAHELPER
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. user_application_data table
CREATE TABLE IF NOT EXISTS public.user_application_data (
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

CREATE INDEX IF NOT EXISTS idx_app_data_user ON public.user_application_data(user_id);
CREATE INDEX IF NOT EXISTS idx_app_data_purchase ON public.user_application_data(visa_purchase_id);

ALTER TABLE public.user_application_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own application data" ON public.user_application_data;
CREATE POLICY "Users can manage own application data" 
  ON public.user_application_data FOR ALL 
  USING (user_id = auth.uid());

-- 2. consultation_documents table
CREATE TABLE IF NOT EXISTS public.consultation_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES public.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consult_docs_consultation ON public.consultation_documents(consultation_id);

ALTER TABLE public.consultation_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view consultation documents" ON public.consultation_documents;
CREATE POLICY "Users can view consultation documents" 
  ON public.consultation_documents FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_documents.consultation_id
      AND (c.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.lawyers l WHERE l.id = c.lawyer_id AND l.user_id = auth.uid()
      ))
    )
  );

-- 3. consultation_messages table
CREATE TABLE IF NOT EXISTS public.consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'lawyer')),
  message_text TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_consultation ON public.consultation_messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.consultation_messages(created_at);

ALTER TABLE public.consultation_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view consultation messages" ON public.consultation_messages;
CREATE POLICY "Users can view consultation messages" 
  ON public.consultation_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.consultations c
      WHERE c.id = consultation_messages.consultation_id
      AND (c.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.lawyers l WHERE l.id = c.lawyer_id AND l.user_id = auth.uid()
      ))
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON public.consultation_messages;
CREATE POLICY "Users can send messages" 
  ON public.consultation_messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

-- =====================================================
-- VERIFICATION
-- =====================================================
SELECT 'user_application_data' as table_name, COUNT(*) as row_count FROM public.user_application_data
UNION ALL
SELECT 'consultation_documents', COUNT(*) FROM public.consultation_documents
UNION ALL
SELECT 'consultation_messages', COUNT(*) FROM public.consultation_messages;
