-- =====================================================
-- VISAHELPER DATABASE SEED SCRIPT
-- Run this in Supabase SQL Editor to add test data
-- =====================================================

-- 1. SEED VISAS (if empty)
-- =====================================================
DO $$
DECLARE
  visa_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO visa_count FROM visas;
  
  IF visa_count = 0 THEN
    RAISE NOTICE 'Seeding visas table...';
    
    INSERT INTO visas (subclass, name, category, short_description, official_link, application_fee, is_active) VALUES
      ('189', 'Skilled Independent', 'work', 'Points-tested permanent residence for skilled workers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', 4240, true),
      ('190', 'Skilled Nominated', 'work', 'State or territory nominated permanent residence', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', 4240, true),
      ('491', 'Skilled Work Regional', 'work', 'Provisional visa for skilled workers in regional Australia', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491', 4240, true),
      ('482', 'Temporary Skill Shortage', 'work', 'Temporary work visa for skilled workers', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482', 1290, true),
      ('186', 'Employer Nomination Scheme', 'work', 'Permanent residence for skilled workers nominated by employer', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', 4240, true),
      ('494', 'Skilled Employer Sponsored Regional', 'work', 'Provisional visa for regional employer sponsorship', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494', 4240, true),
      ('500', 'Student', 'student', 'Study in Australia at an educational institution', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', 650, true),
      ('485', 'Temporary Graduate', 'student', 'Work temporarily after graduating from Australian institution', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485', 1730, true),
      ('820/801', 'Partner (Onshore)', 'family', 'For partners of Australian citizens or permanent residents', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore-820-801', 8085, true),
      ('309/100', 'Partner (Offshore)', 'family', 'For partners outside Australia of Australian citizens', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore-309-100', 8085, true),
      ('300', 'Prospective Marriage', 'family', 'For prospective spouses of Australian citizens', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300', 8085, true),
      ('101', 'Child', 'family', 'For children of Australian citizens or permanent residents', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/child-101', 1745, true),
      ('600', 'Visitor', 'visitor', 'Short-term visit to Australia for tourism or business', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', 150, true),
      ('601', 'Electronic Travel Authority', 'visitor', 'Electronic visa for short-term visits', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601', 0, true),
      ('651', 'eVisitor', 'visitor', 'Electronic visa for eligible passport holders', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651', 0, true),
      ('188', 'Business Innovation and Investment', 'business', 'Provisional visa for business owners and investors', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188', 6270, true),
      ('888', 'Business Innovation and Investment (Permanent)', 'business', 'Permanent visa for business innovation and investment', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-permanent-888', 2985, true),
      ('132', 'Business Talent', 'business', 'Permanent visa for high-calibre business owners', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-talent-132', 7980, true),
      ('866', 'Protection', 'protection', 'Permanent protection visa for refugees', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/protection-866', 0, true),
      ('785', 'Temporary Protection', 'protection', 'Temporary protection visa for refugees', 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-protection-785', 0, true);
    
    RAISE NOTICE '✅ Seeded % visas', 20;
  ELSE
    RAISE NOTICE '✅ Visas table already has % records, skipping', visa_count;
  END IF;
END $$;

-- 2. SEED PLATFORM SETTINGS (if empty)
-- =====================================================
DO $$
DECLARE
  settings_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO settings_count FROM platform_settings;
  
  IF settings_count = 0 THEN
    RAISE NOTICE 'Seeding platform_settings table...';
    
    INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
      ('default_visa_price', '"49.00"', 'Default premium unlock price for visas'),
      ('platform_commission', '"0.15"', 'Platform commission percentage on consultations (15%)'),
      ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
      ('allow_lawyer_registration', 'true', 'Allow new lawyer registrations'),
      ('default_consultation_duration', '60', 'Default consultation duration in minutes'),
      ('min_consultation_duration', '30', 'Minimum consultation duration in minutes'),
      ('max_consultation_duration', '120', 'Maximum consultation duration in minutes'),
      ('enable_payments', 'true', 'Enable/disable payment processing'),
      ('enable_reviews', 'true', 'Enable/disable lawyer reviews'),
      ('enable_tracker', 'true', 'Enable/disable processing time tracker'),
      ('contact_email', '"support@visahelper.com"', 'Platform contact email'),
      ('support_phone', '"+61 2 9000 0000"', 'Platform support phone');
    
    RAISE NOTICE '✅ Seeded % platform settings', 12;
  ELSE
    RAISE NOTICE '✅ Platform settings already has % records, skipping', settings_count;
  END IF;
END $$;

-- 3. SEED SAMPLE LAWYERS (only if no approved lawyers exist)
-- =====================================================
DO $$
DECLARE
  lawyer_count INTEGER;
  test_user_id UUID;
BEGIN
  SELECT COUNT(*) INTO lawyer_count FROM lawyers WHERE verification_status = 'approved';
  
  IF lawyer_count = 0 THEN
    RAISE NOTICE 'No approved lawyers found. Note: Lawyers require auth.users entries.';
    RAISE NOTICE 'To create test lawyers, you need to:';
    RAISE NOTICE '  1. Create auth users via Supabase Auth';
    RAISE NOTICE '  2. Insert corresponding profiles';
    RAISE NOTICE '  3. Insert lawyer records with user_id references';
    
    -- Show sample lawyer data structure
    RAISE NOTICE '';
    RAISE NOTICE 'Sample lawyer insert (requires valid user_id):';
    RAISE NOTICE '  INSERT INTO lawyers (user_id, full_name, email, registration_number, years_experience, bio, verification_status)';
    RAISE NOTICE '  VALUES (gen_random_uuid(), ''John Smith'', ''john@lawfirm.com'', ''L12345'', 10, ''Experienced migration lawyer'', ''approved'');';
  ELSE
    RAISE NOTICE '✅ Found % approved lawyers, skipping lawyer seed', lawyer_count;
  END IF;
END $$;

-- 4. SEED SAMPLE NEWS ARTICLES (if empty)
-- =====================================================
DO $$
DECLARE
  news_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO news_count FROM news_articles;
  
  IF news_count = 0 THEN
    RAISE NOTICE 'Seeding news_articles table...';
    
    INSERT INTO news_articles (title, slug, summary, content, category, published, published_at) VALUES
      (
        'Major Changes to Skilled Migration Program 2024',
        'major-changes-skilled-migration-2024',
        'The Australian government has announced significant changes to the skilled migration program, including new occupation lists and increased quotas.',
        'Full article content about skilled migration changes...',
        'visa_updates',
        true,
        NOW() - INTERVAL '2 days'
      ),
      (
        'Student Visa Processing Times Improve',
        'student-visa-processing-times-improve',
        'Processing times for student visa applications have decreased by an average of 30% over the past quarter.',
        'Full article content about student visa processing improvements...',
        'visa_updates',
        true,
        NOW() - INTERVAL '5 days'
      ),
      (
        'New Pathway to Permanent Residency for Temporary Visa Holders',
        'new-pathway-permanent-residency-temporary',
        'A new pathway to permanent residency has been introduced for certain temporary visa holders who have been in Australia for extended periods.',
        'Full article content about the new pathway...',
        'policy_changes',
        true,
        NOW() - INTERVAL '1 week'
      ),
      (
        'Understanding the Points Test for Skilled Visas',
        'understanding-points-test-skilled-visas',
        'A comprehensive guide to understanding how the points test works for Australian skilled visas.',
        'Full guide content about points test...',
        'general',
        true,
        NOW() - INTERVAL '2 weeks'
      ),
      (
        'Partner Visa Requirements Updated',
        'partner-visa-requirements-updated',
        'Recent changes to partner visa requirements aim to streamline the application process and reduce processing times.',
        'Full article content about partner visa updates...',
        'legal_changes',
        false,
        NULL
      );
    
    RAISE NOTICE '✅ Seeded % news articles', 5;
  ELSE
    RAISE NOTICE '✅ News articles already has % records, skipping', news_count;
  END IF;
END $$;

-- 5. SEED SAMPLE TRACKER ENTRIES (if empty)
-- =====================================================
DO $$
DECLARE
  tracker_count INTEGER;
  visa_189_id UUID;
  visa_190_id UUID;
  visa_482_id UUID;
BEGIN
  SELECT COUNT(*) INTO tracker_count FROM tracker_entries;
  
  -- Get visa IDs
  SELECT id INTO visa_189_id FROM visas WHERE subclass = '189' LIMIT 1;
  SELECT id INTO visa_190_id FROM visas WHERE subclass = '190' LIMIT 1;
  SELECT id INTO visa_482_id FROM visas WHERE subclass = '482' LIMIT 1;
  
  IF tracker_count = 0 AND visa_189_id IS NOT NULL THEN
    RAISE NOTICE 'Seeding tracker_entries table...';
    
    INSERT INTO tracker_entries (visa_id, submitted_by_type, submitted_by_id, lodgement_date, decision_date, outcome, complexity_notes, verified) VALUES
      (visa_189_id, 'user', gen_random_uuid(), '2024-01-15', '2024-04-20', 'approved', 'Standard application, no complications', true),
      (visa_189_id, 'user', gen_random_uuid(), '2024-02-01', '2024-05-15', 'approved', 'Professional occupation, fast processing', true),
      (visa_190_id, 'user', gen_random_uuid(), '2024-01-20', NULL, 'pending', 'Waiting for state nomination', false),
      (visa_482_id, 'user', gen_random_uuid(), '2024-03-01', '2024-03-25', 'approved', 'Sponsorship by established company', true),
      (visa_189_id, 'user', gen_random_uuid(), '2023-11-10', '2024-02-28', 'approved', 'Medical check delayed processing slightly', true),
      (visa_190_id, 'user', gen_random_uuid(), '2024-02-15', NULL, 'pending', 'Additional documents requested', false);
    
    RAISE NOTICE '✅ Seeded % tracker entries', 6;
  ELSE
    RAISE NOTICE '✅ Tracker entries already has % records or no visas found, skipping', tracker_count;
  END IF;
END $$;

-- 6. VERIFY SEED DATA
-- =====================================================
DO $$
DECLARE
  v_count INTEGER;
  l_count INTEGER;
  n_count INTEGER;
  t_count INTEGER;
  p_count INTEGER;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED DATA VERIFICATION';
  RAISE NOTICE '========================================';
  
  SELECT COUNT(*) INTO v_count FROM visas;
  SELECT COUNT(*) INTO l_count FROM lawyers;
  SELECT COUNT(*) INTO n_count FROM news_articles;
  SELECT COUNT(*) INTO t_count FROM tracker_entries;
  SELECT COUNT(*) INTO p_count FROM platform_settings;
  
  RAISE NOTICE 'Visas: % records', v_count;
  RAISE NOTICE 'Lawyers: % records', l_count;
  RAISE NOTICE 'News Articles: % records', n_count;
  RAISE NOTICE 'Tracker Entries: % records', t_count;
  RAISE NOTICE 'Platform Settings: % records', p_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run verify-database.sql to confirm all changes';
  RAISE NOTICE '  2. Create test users via Supabase Auth for lawyers';
  RAISE NOTICE '  3. Add test consultations and reviews';
END $$;
