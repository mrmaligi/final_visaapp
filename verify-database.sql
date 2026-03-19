-- =====================================================
-- VISAHELPER DATABASE VERIFICATION SCRIPT
-- Run this in Supabase SQL Editor to check database health
-- =====================================================

-- Output helper function
CREATE OR REPLACE FUNCTION log_check(category TEXT, item TEXT, status TEXT, details TEXT DEFAULT '')
RETURNS VOID AS $$
BEGIN
  RAISE NOTICE '[%] %: % - %', category, item, status, details;
END;
$$ LANGUAGE plpgsql;

-- 1. CHECK TABLES
-- =====================================================
DO $$
DECLARE
  expected_tables TEXT[] := ARRAY[
    'users', 'profiles', 'lawyers', 'lawyer_specializations', 'visas',
    'visa_premium_content', 'visa_purchases', 'purchases', 'user_documents',
    'documents', 'user_application_data', 'applications', 'consultations',
    'reviews', 'lawyer_pricing', 'lawyer_notes', 'tracker_entries',
    'news_articles', 'news_comments', 'saved_lawyers', 'platform_settings', 'activity_log'
  ];
  tbl TEXT;
  tbl_exists BOOLEAN;
  tbl_count INTEGER;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '1. TABLE VERIFICATION';
  RAISE NOTICE '========================================';
  
  FOREACH tbl IN ARRAY expected_tables LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = tbl
    ) INTO tbl_exists;
    
    IF tbl_exists THEN
      EXECUTE format('SELECT COUNT(*) FROM %I', tbl) INTO tbl_count;
      RAISE NOTICE '✅ %: EXISTS (% rows)', tbl, tbl_count;
    ELSE
      RAISE NOTICE '❌ %: MISSING', tbl;
    END IF;
  END LOOP;
END $$;

-- 2. CHECK RLS STATUS
-- =====================================================
DO $$
DECLARE
  tbl RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '2. ROW LEVEL SECURITY (RLS) STATUS';
  RAISE NOTICE '========================================';
  
  FOR tbl IN 
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'users', 'profiles', 'lawyers', 'lawyer_specializations', 'visas',
      'visa_premium_content', 'visa_purchases', 'purchases', 'user_documents',
      'documents', 'user_application_data', 'applications', 'consultations',
      'reviews', 'lawyer_pricing', 'lawyer_notes', 'tracker_entries',
      'news_articles', 'news_comments', 'saved_lawyers', 'platform_settings', 'activity_log'
    )
  LOOP
    IF tbl.rowsecurity THEN
      RAISE NOTICE '🔒 %: RLS ENABLED', tbl.tablename;
    ELSE
      RAISE NOTICE '⚠️  %: RLS DISABLED', tbl.tablename;
    END IF;
  END LOOP;
END $$;

-- 3. CHECK RLS POLICIES
-- =====================================================
DO $$
DECLARE
  pol RECORD;
  tbl_name TEXT;
  policy_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '3. RLS POLICIES';
  RAISE NOTICE '========================================';
  
  FOR tbl_name IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public'
    AND tablename IN (
      'users', 'profiles', 'lawyers', 'lawyer_specializations', 'visas',
      'visa_premium_content', 'visa_purchases', 'purchases', 'user_documents',
      'documents', 'user_application_data', 'applications', 'consultations',
      'reviews', 'lawyer_pricing', 'lawyer_notes', 'tracker_entries',
      'news_articles', 'news_comments', 'saved_lawyers', 'platform_settings', 'activity_log'
    )
  LOOP
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = tbl_name;
    
    IF policy_count > 0 THEN
      RAISE NOTICE '✅ %: % policies', tbl_name, policy_count;
    ELSE
      RAISE NOTICE '⚠️  %: NO POLICIES', tbl_name;
    END IF;
  END LOOP;
  
  -- List all policies
  RAISE NOTICE '';
  RAISE NOTICE '--- All Policies ---';
  FOR pol IN 
    SELECT tablename, policyname, permissive, roles, cmd, qual
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  LOOP
    RAISE NOTICE '  %.% (%)', pol.tablename, pol.policyname, pol.cmd;
  END LOOP;
END $$;

-- 4. CHECK INDEXES
-- =====================================================
DO $$
DECLARE
  idx RECORD;
  expected_indexes TEXT[] := ARRAY[
    'idx_users_email', 'idx_users_role',
    'idx_lawyers_verification_status', 'idx_lawyers_user_id', 'idx_lawyers_average_rating',
    'idx_visas_category', 'idx_visas_is_active',
    'idx_visa_purchases_user_id', 'idx_visa_purchases_visa_id',
    'idx_purchases_user', 'idx_purchases_visa', 'idx_purchases_status',
    'idx_user_documents_user_id',
    'idx_documents_user', 'idx_documents_application',
    'idx_applications_user', 'idx_applications_status',
    'idx_consultations_user_id', 'idx_consultations_lawyer_id', 'idx_consultations_scheduled_at',
    'idx_reviews_lawyer_id',
    'idx_tracker_visa_id', 'idx_tracker_outcome', 'idx_tracker_verified',
    'idx_news_status', 'idx_news_published', 'idx_news_category',
    'idx_activity_user', 'idx_activity_created'
  ];
  exp_idx TEXT;
  idx_exists BOOLEAN;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '4. INDEX VERIFICATION';
  RAISE NOTICE '========================================';
  
  -- List all indexes
  RAISE NOTICE '--- Existing Indexes ---';
  FOR idx IN 
    SELECT indexname, tablename
    FROM pg_indexes
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname
  LOOP
    RAISE NOTICE '  ✅ % on %', idx.indexname, idx.tablename;
  END LOOP;
  
  -- Check expected indexes
  RAISE NOTICE '';
  RAISE NOTICE '--- Expected Index Check ---';
  FOREACH exp_idx IN ARRAY expected_indexes LOOP
    SELECT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE schemaname = 'public' AND indexname LIKE '%' || exp_idx || '%'
    ) INTO idx_exists;
    
    IF idx_exists THEN
      RAISE NOTICE '✅ %', exp_idx;
    ELSE
      RAISE NOTICE '❌ %: MISSING', exp_idx;
    END IF;
  END LOOP;
END $$;

-- 5. CHECK FOREIGN KEYS
-- =====================================================
DO $$
DECLARE
  fk RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '5. FOREIGN KEY CONSTRAINTS';
  RAISE NOTICE '========================================';
  
  FOR fk IN 
    SELECT
      tc.table_name,
      kcu.column_name,
      ccu.table_name AS foreign_table,
      ccu.column_name AS foreign_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    ORDER BY tc.table_name
  LOOP
    RAISE NOTICE '🔗 %.% → %.%', 
      fk.table_name, fk.column_name, 
      fk.foreign_table, fk.foreign_column;
  END LOOP;
END $$;

-- 6. CHECK TRIGGERS
-- =====================================================
DO $$
DECLARE
  trig RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '6. TRIGGERS';
  RAISE NOTICE '========================================';
  
  FOR trig IN 
    SELECT 
      event_object_table AS table_name,
      trigger_name,
      event_manipulation AS event,
      action_timing AS timing
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
    ORDER BY event_object_table, trigger_name
  LOOP
    RAISE NOTICE '⚡ %.% (% %)', 
      trig.table_name, trig.trigger_name, 
      trig.timing, trig.event;
  END LOOP;
END $$;

-- 7. CHECK CONSTRAINTS
-- =====================================================
DO $$
DECLARE
  con RECORD;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '7. CHECK CONSTRAINTS';
  RAISE NOTICE '========================================';
  
  FOR con IN 
    SELECT 
      table_name,
      constraint_name,
      constraint_type
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
    AND constraint_type IN ('CHECK', 'UNIQUE', 'PRIMARY KEY')
    ORDER BY table_name, constraint_type
  LOOP
    RAISE NOTICE '📋 %.% (%)', 
      con.table_name, con.constraint_name, con.constraint_type;
  END LOOP;
END $$;

-- 8. DATA INTEGRITY CHECK
-- =====================================================
DO $$
DECLARE
  visa_count INTEGER;
  orphan_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '8. DATA INTEGRITY CHECK';
  RAISE NOTICE '========================================';
  
  -- Check visas
  SELECT COUNT(*) INTO visa_count FROM visas;
  RAISE NOTICE '📊 Visas: % records', visa_count;
  
  -- Check for orphaned records (example)
  SELECT COUNT(*) INTO orphan_count 
  FROM applications a
  LEFT JOIN profiles p ON a.user_id = p.id
  WHERE p.id IS NULL;
  
  IF orphan_count > 0 THEN
    RAISE NOTICE '⚠️  Orphaned applications: %', orphan_count;
  ELSE
    RAISE NOTICE '✅ No orphaned applications found';
  END IF;
END $$;

RAISE NOTICE '';
RAISE NOTICE '========================================';
RAISE NOTICE 'VERIFICATION COMPLETE';
RAISE NOTICE '========================================';
