const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysfwurlzkihgezfegfog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgwMjk3MywiZXhwIjoyMDg5Mzc4OTczfQ.q9rpAF9ZgslmF5APWsumubprSbxDm-jEtEwu9ZRCKnc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
  console.log('🔧 Creating missing database tables...\n');

  // 1. Create user_application_data table
  console.log('1️⃣ Creating user_application_data table...');
  const { error: appError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });
  
  if (appError) {
    console.log('   ⚠️ RPC not available, will need manual SQL execution');
    console.log('   Error:', appError.message);
  } else {
    console.log('   ✅ user_application_data table created');
  }

  // 2. Create consultation_documents table
  console.log('\n2️⃣ Creating consultation_documents table...');
  const { error: docError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });
  
  if (docError) {
    console.log('   ⚠️ Error:', docError.message);
  } else {
    console.log('   ✅ consultation_documents table created');
  }

  // 3. Create consultation_messages table
  console.log('\n3️⃣ Creating consultation_messages table...');
  const { error: msgError } = await supabase.rpc('exec_sql', {
    sql: `
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
    `
  });
  
  if (msgError) {
    console.log('   ⚠️ Error:', msgError.message);
  } else {
    console.log('   ✅ consultation_messages table created');
  }

  console.log('\n✨ Table creation complete!');
  console.log('\nNote: If RPC failed, run the SQL manually in Supabase SQL Editor');
}

createMissingTables().catch(console.error);
