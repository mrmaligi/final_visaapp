-- =====================================================
-- VISAHELPER DATABASE FIX SCRIPT
-- Run this in Supabase SQL Editor to fix database issues
-- =====================================================

-- 1. ENABLE RLS ON ALL TABLES
-- =====================================================
DO $$
DECLARE
  tbl TEXT;
  tbl_list TEXT[] := ARRAY[
    'users', 'profiles', 'lawyers', 'lawyer_specializations', 'visas',
    'visa_premium_content', 'visa_purchases', 'purchases', 'user_documents',
    'documents', 'user_application_data', 'applications', 'consultations',
    'reviews', 'lawyer_pricing', 'lawyer_notes', 'tracker_entries',
    'news_articles', 'news_comments', 'saved_lawyers', 'platform_settings', 'activity_log'
  ];
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '1. ENABLING ROW LEVEL SECURITY';
  RAISE NOTICE '========================================';
  
  FOREACH tbl IN ARRAY tbl_list LOOP
    BEGIN
      EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
      RAISE NOTICE '✅ Enabled RLS on %', tbl;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '⚠️  Could not enable RLS on %: %', tbl, SQLERRM;
    END;
  END LOOP;
END $$;

-- 2. CREATE MISSING INDEXES
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '2. CREATING INDEXES';
  RAISE NOTICE '========================================';
  
  -- Users table indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  RAISE NOTICE '✅ Created users indexes';
  
  -- Profiles table indexes
  CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
  CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
  RAISE NOTICE '✅ Created profiles indexes';
  
  -- Lawyers table indexes
  CREATE INDEX IF NOT EXISTS idx_lawyers_verification_status ON lawyers(verification_status);
  CREATE INDEX IF NOT EXISTS idx_lawyers_user_id ON lawyers(user_id);
  CREATE INDEX IF NOT EXISTS idx_lawyers_average_rating ON lawyers(average_rating DESC);
  RAISE NOTICE '✅ Created lawyers indexes';
  
  -- Visas table indexes
  CREATE INDEX IF NOT EXISTS idx_visas_category ON visas(category);
  CREATE INDEX IF NOT EXISTS idx_visas_is_active ON visas(is_active);
  RAISE NOTICE '✅ Created visas indexes';
  
  -- Visa purchases indexes
  CREATE INDEX IF NOT EXISTS idx_visa_purchases_user_id ON visa_purchases(user_id);
  CREATE INDEX IF NOT EXISTS idx_visa_purchases_visa_id ON visa_purchases(visa_id);
  RAISE NOTICE '✅ Created visa_purchases indexes';
  
  -- Purchases indexes
  CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
  CREATE INDEX IF NOT EXISTS idx_purchases_visa ON purchases(visa_id);
  CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
  RAISE NOTICE '✅ Created purchases indexes';
  
  -- User documents indexes
  CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
  RAISE NOTICE '✅ Created user_documents indexes';
  
  -- Documents indexes
  CREATE INDEX IF NOT EXISTS idx_documents_user ON documents(user_id);
  CREATE INDEX IF NOT EXISTS idx_documents_application ON documents(application_id);
  RAISE NOTICE '✅ Created documents indexes';
  
  -- Applications indexes
  CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
  CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
  RAISE NOTICE '✅ Created applications indexes';
  
  -- Consultations indexes
  CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
  CREATE INDEX IF NOT EXISTS idx_consultations_lawyer_id ON consultations(lawyer_id);
  CREATE INDEX IF NOT EXISTS idx_consultations_scheduled_at ON consultations(scheduled_at);
  RAISE NOTICE '✅ Created consultations indexes';
  
  -- Reviews indexes
  CREATE INDEX IF NOT EXISTS idx_reviews_lawyer_id ON reviews(lawyer_id);
  RAISE NOTICE '✅ Created reviews indexes';
  
  -- Tracker entries indexes
  CREATE INDEX IF NOT EXISTS idx_tracker_visa_id ON tracker_entries(visa_id);
  CREATE INDEX IF NOT EXISTS idx_tracker_outcome ON tracker_entries(outcome);
  CREATE INDEX IF NOT EXISTS idx_tracker_verified ON tracker_entries(is_verified);
  RAISE NOTICE '✅ Created tracker_entries indexes';
  
  -- News articles indexes
  CREATE INDEX IF NOT EXISTS idx_news_status ON news_articles(status);
  CREATE INDEX IF NOT EXISTS idx_news_published ON news_articles(published_at);
  CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category);
  RAISE NOTICE '✅ Created news_articles indexes';
  
  -- Activity log indexes
  CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
  CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);
  RAISE NOTICE '✅ Created activity_log indexes';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️  Error creating indexes: %', SQLERRM;
END $$;

-- 3. CREATE/UPDATE RLS POLICIES
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '3. CREATING RLS POLICIES';
  RAISE NOTICE '========================================';
  
  -- Drop existing policies to avoid conflicts (optional - comment out if you want to keep existing)
  -- Note: Uncomment the following lines if you want to reset all policies
  /*
  DROP POLICY IF EXISTS "Users can view own profile" ON users;
  DROP POLICY IF EXISTS "Users can update own profile" ON users;
  DROP POLICY IF EXISTS "Anyone can view approved lawyers" ON lawyers;
  DROP POLICY IF EXISTS "Anyone can view active visas" ON visas;
  DROP POLICY IF EXISTS "Users can view own purchases" ON visa_purchases;
  DROP POLICY IF EXISTS "Users can manage own documents" ON user_documents;
  DROP POLICY IF EXISTS "Users can manage own application data" ON user_application_data;
  DROP POLICY IF EXISTS "Users can view own consultations" ON consultations;
  DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
  DROP POLICY IF EXISTS "Anyone can view tracker entries" ON tracker_entries;
  DROP POLICY IF EXISTS "Anyone can view published news" ON news_articles;
  DROP POLICY IF EXISTS "Anyone can view news comments" ON news_comments;
  */
  
  -- Users policies
  CREATE POLICY IF NOT EXISTS "Users can view own profile" 
    ON users FOR SELECT USING (auth.uid() = id);
  CREATE POLICY IF NOT EXISTS "Users can update own profile" 
    ON users FOR UPDATE USING (auth.uid() = id);
  RAISE NOTICE '✅ Created users policies';
  
  -- Profiles policies
  CREATE POLICY IF NOT EXISTS "Users can view own profile" 
    ON profiles FOR SELECT USING (auth.uid() = id);
  CREATE POLICY IF NOT EXISTS "Users can update own profile" 
    ON profiles FOR UPDATE USING (auth.uid() = id);
  RAISE NOTICE '✅ Created profiles policies';
  
  -- Lawyers policies
  CREATE POLICY IF NOT EXISTS "Anyone can view approved lawyers" 
    ON lawyers FOR SELECT USING (verification_status = 'approved');
  CREATE POLICY IF NOT EXISTS "Lawyers can manage own profile" 
    ON lawyers FOR ALL USING (user_id = auth.uid());
  RAISE NOTICE '✅ Created lawyers policies';
  
  -- Visas policies
  CREATE POLICY IF NOT EXISTS "Anyone can view active visas" 
    ON visas FOR SELECT USING (is_active = TRUE);
  RAISE NOTICE '✅ Created visas policies';
  
  -- Visa purchases policies
  CREATE POLICY IF NOT EXISTS "Users can view own purchases" 
    ON visa_purchases FOR SELECT USING (user_id = auth.uid());
  RAISE NOTICE '✅ Created visa_purchases policies';
  
  -- User documents policies
  CREATE POLICY IF NOT EXISTS "Users can manage own documents" 
    ON user_documents FOR ALL USING (user_id = auth.uid());
  RAISE NOTICE '✅ Created user_documents policies';
  
  -- User application data policies
  CREATE POLICY IF NOT EXISTS "Users can manage own application data" 
    ON user_application_data FOR ALL USING (user_id = auth.uid());
  RAISE NOTICE '✅ Created user_application_data policies';
  
  -- Consultations policies
  CREATE POLICY IF NOT EXISTS "Users can view own consultations" 
    ON consultations FOR SELECT USING (user_id = auth.uid());
  RAISE NOTICE '✅ Created consultations policies';
  
  -- Reviews policies
  CREATE POLICY IF NOT EXISTS "Anyone can view reviews" 
    ON reviews FOR SELECT USING (TRUE);
  RAISE NOTICE '✅ Created reviews policies';
  
  -- Tracker entries policies
  CREATE POLICY IF NOT EXISTS "Anyone can view tracker entries" 
    ON tracker_entries FOR SELECT USING (TRUE);
  RAISE NOTICE '✅ Created tracker_entries policies';
  
  -- News articles policies
  CREATE POLICY IF NOT EXISTS "Anyone can view published news" 
    ON news_articles FOR SELECT USING (published = TRUE);
  RAISE NOTICE '✅ Created news_articles policies';
  
  -- News comments policies
  CREATE POLICY IF NOT EXISTS "Anyone can view news comments" 
    ON news_comments FOR SELECT USING (TRUE);
  RAISE NOTICE '✅ Created news_comments policies';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️  Error creating policies: %', SQLERRM;
END $$;

-- 4. CREATE HELPER FUNCTIONS
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '4. CREATING HELPER FUNCTIONS';
  RAISE NOTICE '========================================';
  
  -- Updated at trigger function
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  RAISE NOTICE '✅ Created update_updated_at_column function';
  
  -- Handle new user function
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  RAISE NOTICE '✅ Created handle_new_user function';
  
  -- Calculate processing days function
  CREATE OR REPLACE FUNCTION calculate_processing_days()
  RETURNS TRIGGER AS $$
  BEGIN
    IF NEW.decision_date IS NOT NULL AND NEW.lodgement_date IS NOT NULL THEN
      NEW.processing_days := NEW.decision_date - NEW.lodgement_date;
    END IF;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  RAISE NOTICE '✅ Created calculate_processing_days function';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️  Error creating functions: %', SQLERRM;
END $$;

-- 5. CREATE TRIGGERS
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '5. CREATING TRIGGERS';
  RAISE NOTICE '========================================';
  
  -- Updated_at triggers
  DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  RAISE NOTICE '✅ Created profiles updated_at trigger';
  
  DROP TRIGGER IF EXISTS update_lawyers_updated_at ON lawyers;
  CREATE TRIGGER update_lawyers_updated_at 
    BEFORE UPDATE ON lawyers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  RAISE NOTICE '✅ Created lawyers updated_at trigger';
  
  DROP TRIGGER IF EXISTS update_visas_updated_at ON visas;
  CREATE TRIGGER update_visas_updated_at 
    BEFORE UPDATE ON visas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  RAISE NOTICE '✅ Created visas updated_at trigger';
  
  DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
  CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  RAISE NOTICE '✅ Created applications updated_at trigger';
  
  DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
  CREATE TRIGGER update_news_articles_updated_at 
    BEFORE UPDATE ON news_articles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  RAISE NOTICE '✅ Created news_articles updated_at trigger';
  
  -- Processing days trigger
  DROP TRIGGER IF EXISTS set_processing_days ON tracker_entries;
  CREATE TRIGGER set_processing_days 
    BEFORE INSERT OR UPDATE ON tracker_entries 
    FOR EACH ROW EXECUTE FUNCTION calculate_processing_days();
  RAISE NOTICE '✅ Created tracker_entries processing_days trigger';
  
  -- Auth user created trigger
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  RAISE NOTICE '✅ Created auth user created trigger';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE '⚠️  Error creating triggers: %', SQLERRM;
END $$;

RAISE NOTICE '';
RAISE NOTICE '========================================';
RAISE NOTICE 'DATABASE FIX COMPLETE';
RAISE NOTICE '========================================';
