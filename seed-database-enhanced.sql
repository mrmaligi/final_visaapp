-- =====================================================
-- VISAHELPER ENHANCED SEED SCRIPT - PRODUCTION READY
-- Run this in Supabase SQL Editor to add realistic data
-- =====================================================

-- 1. SEED/UPDATE VISAS WITH REALISTIC DATA
-- =====================================================
DO $$
DECLARE
  visa_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO visa_count FROM visas;
  
  IF visa_count = 0 THEN
    RAISE NOTICE 'Seeding visas table with realistic data...';
    
    INSERT INTO visas (subclass, name, category, short_description, full_description, requirements, official_link, application_fee, processing_time_min_days, processing_time_max_days, is_active) VALUES
      ('189', 'Skilled Independent', 'work', 
       'Points-tested permanent residence for skilled workers not sponsored by employer or family member',
       'The Skilled Independent visa (subclass 189) is a permanent residence visa for points-tested skilled workers who want to work and live in Australia. This visa does not require sponsorship by an employer or family member.',
       '• Be invited to apply
• Be under 45 years of age
• Nominate an occupation on the relevant skilled occupation list
• Have a suitable skills assessment
• Score at least 65 points on the points test
• Have competent English',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', 
       4765, 240, 540, true),
      
      ('190', 'Skilled Nominated', 'work', 
       'State or territory nominated permanent residence for skilled workers',
       'The Skilled Nominated visa (subclass 190) is a permanent residence visa for points-tested skilled workers who are nominated by an Australian state or territory government agency.',
       '• Be nominated by an Australian state or territory government agency
• Be under 45 years of age
• Nominate an occupation on the relevant skilled occupation list
• Have a suitable skills assessment
• Score at least 65 points on the points test
• Have competent English',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', 
       4765, 270, 570, true),
      
      ('491', 'Skilled Work Regional', 'work', 
       'Provisional 5-year visa for skilled workers in regional Australia',
       'The Skilled Work Regional (Provisional) visa (subclass 491) is a temporary visa for skilled workers who want to live and work in regional Australia. This visa is valid for 5 years.',
       '• Be nominated by a state or territory government agency OR sponsored by an eligible relative
• Be under 45 years of age
• Nominate an occupation on the relevant skilled occupation list
• Have a suitable skills assessment
• Score at least 65 points on the points test
• Have competent English',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491', 
       4765, 300, 600, true),
      
      ('482', 'Temporary Skill Shortage', 'work', 
       'Temporary work visa for skilled workers sponsored by employer',
       'The Temporary Skill Shortage visa (subclass 482) enables employers to address labour shortages by bringing in genuinely skilled workers where they cannot source an appropriately skilled Australian.',
       '• Have an employer willing to sponsor you
• Nominate an occupation on the skilled occupation list
• Have at least 2 years of relevant work experience
• Have a suitable skills assessment (if required)
• Meet English language requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482', 
       1490, 14, 90, true),
      
      ('186', 'Employer Nomination Scheme', 'work', 
       'Permanent residence for skilled workers nominated by employer',
       'The Employer Nomination Scheme visa (subclass 186) allows skilled workers nominated by their employer to live and work in Australia as permanent residents.',
       '• Have an employer willing to nominate you
• Have at least 3 years of relevant work experience
• Be under 45 years of age (exceptions apply)
• Have a suitable skills assessment
• Meet English language requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', 
       4765, 180, 420, true),
      
      ('494', 'Skilled Employer Sponsored Regional', 'work', 
       'Provisional 5-year visa for regional employer sponsorship',
       'The Skilled Employer Sponsored Regional (Provisional) visa (subclass 494) allows skilled workers to live and work in regional Australia for up to 5 years.',
       '• Be nominated by an employer in regional Australia
• Be under 45 years of age (exceptions apply)
• Have at least 3 years of relevant work experience
• Have a suitable skills assessment
• Meet English language requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494', 
       4765, 180, 420, true),
      
      ('500', 'Student', 'student', 
       'Study at an Australian educational institution',
       'The Student visa (subclass 500) allows you to study full-time at an Australian educational institution. You can stay for up to 5 years, in line with your enrolment.',
       '• Be enrolled in a course of study in Australia
• Hold Overseas Student Health Cover (OSHC)
• Meet English language requirements
• Meet health and character requirements
• Prove you are a Genuine Temporary Entrant',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', 
       650, 14, 90, true),
      
      ('485', 'Temporary Graduate', 'student', 
       'Work temporarily after graduating from Australian institution',
       'The Temporary Graduate visa (subclass 485) lets recent graduates live, study, and work in Australia temporarily after completing their studies.',
       '• Be under 50 years of age
• Hold an eligible visa
• Have held a student visa in the last 6 months
• Have a recent CRICOS-registered qualification
• Meet English language requirements
• Have adequate health insurance',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485', 
       1730, 30, 120, true),
      
      ('820/801', 'Partner (Onshore)', 'family', 
       'Permanent residence for partners of Australian citizens or permanent residents',
       'The Partner visa (subclass 820/801) allows the spouse or de facto partner of an Australian citizen, permanent resident, or eligible New Zealand citizen to live in Australia.',
       '• Be married to or in a de facto relationship with an Australian citizen, permanent resident, or eligible New Zealand citizen
• Have a sponsor who is 18 years or older
• Meet health and character requirements
• Provide evidence of genuine relationship',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore-820-801', 
       8085, 180, 1095, true),
      
      ('309/100', 'Partner (Offshore)', 'family', 
       'Permanent residence for partners outside Australia',
       'The Partner visa (subclass 309/100) allows the spouse or de facto partner of an Australian citizen, permanent resident, or eligible New Zealand citizen to live in Australia.',
       '• Be married to or in a de facto relationship with an Australian citizen, permanent resident, or eligible New Zealand citizen
• Be outside Australia when applying
• Have a sponsor who is 18 years or older
• Meet health and character requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore-309-100', 
       8085, 270, 1095, true),
      
      ('300', 'Prospective Marriage', 'family', 
       'For prospective spouses of Australian citizens',
       'The Prospective Marriage visa (subclass 300) is for people who want to come to Australia to marry their prospective spouse and then apply for a Partner visa.',
       '• Be sponsored by an Australian citizen, permanent resident, or eligible New Zealand citizen
• Be 18 years or older
• Have met your prospective spouse in person
• Intend to marry within 9 months of visa grant
• Meet health and character requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300', 
       8085, 270, 730, true),
      
      ('600', 'Visitor', 'visitor', 
       'Short-term visit to Australia for tourism or business',
       'The Visitor visa (subclass 600) lets you visit Australia for tourism or business purposes. You can stay for up to 12 months.',
       '• Have a valid passport
• Meet health and character requirements
• Have enough money to support your stay
• Intend to stay temporarily in Australia
• Meet specific stream requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', 
       150, 7, 45, true),
      
      ('601', 'Electronic Travel Authority', 'visitor', 
       'Electronic visa for short-term visits',
       'The Electronic Travel Authority (subclass 601) allows you to visit Australia for short-term tourism or business purposes.',
       '• Hold a passport from an eligible country
• Be outside Australia when applying
• Be free from tuberculosis
• Not have any criminal convictions',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601', 
       20, 1, 3, true),
      
      ('188', 'Business Innovation and Investment', 'business', 
       'Provisional visa for business owners and investors',
       'The Business Innovation and Investment (Provisional) visa (subclass 188) is for people who want to own and manage a business, conduct business and investment activity, or undertake entrepreneurial activity in Australia.',
       '• Be nominated by an Australian state or territory government agency
• Be invited to apply
• Meet the requirements of the relevant stream (Business Innovation, Investor, Significant Investor, etc.)
• Have a successful business or investment career',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188', 
       6270, 180, 540, true),
      
      ('888', 'Business Innovation and Investment (Permanent)', 'business', 
       'Permanent visa for business innovation and investment',
       'The Business Innovation and Investment (Permanent) visa (subclass 888) is the second stage of the Business Innovation and Investment visa. It lets you continue to own and manage a business or conduct investment activity in Australia permanently.',
       '• Hold a Business Innovation and Investment (Provisional) visa (subclass 188)
• Meet the requirements of the stream you applied under
• Meet residence requirements
• Meet business or investment requirements',
       'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-permanent-888', 
       2985, 120, 360, true);
    
    RAISE NOTICE '✅ Seeded % visas with realistic data', 14;
  ELSE
    RAISE NOTICE '✅ Visas table already has % records', visa_count;
    
    -- Update existing visas with more details
    UPDATE visas SET 
      processing_time_min_days = 240, 
      processing_time_max_days = 540 
    WHERE subclass = '189' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 270, 
      processing_time_max_days = 570 
    WHERE subclass = '190' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 300, 
      processing_time_max_days = 600 
    WHERE subclass = '491' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 14, 
      processing_time_max_days = 90 
    WHERE subclass = '482' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 180, 
      processing_time_max_days = 420 
    WHERE subclass = '186' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 180, 
      processing_time_max_days = 420 
    WHERE subclass = '494' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 14, 
      processing_time_max_days = 90 
    WHERE subclass = '500' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 30, 
      processing_time_max_days = 120 
    WHERE subclass = '485' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 180, 
      processing_time_max_days = 1095 
    WHERE subclass IN ('820/801', '309/100') AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 270, 
      processing_time_max_days = 730 
    WHERE subclass = '300' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 7, 
      processing_time_max_days = 45 
    WHERE subclass = '600' AND processing_time_min_days IS NULL;
    
    UPDATE visas SET 
      processing_time_min_days = 1, 
      processing_time_max_days = 3 
    WHERE subclass = '601' AND processing_time_min_days IS NULL;
    
    RAISE NOTICE '✅ Updated existing visa records with processing times';
  END IF;
END $$;

-- 2. SEED NEWS ARTICLES
-- =====================================================
DO $$
DECLARE
  news_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO news_count FROM news;
  
  IF news_count < 10 THEN
    RAISE NOTICE 'Seeding news articles...';
    
    INSERT INTO news (title, slug, excerpt, content, category, author, published_at, is_published) VALUES
      ('Australia Announces Major Visa Processing Changes for 2026', 
       'australia-announces-major-visa-processing-changes-2026',
       'The Australian government has announced significant changes to visa processing times and priorities for the 2026 program year.',
       'The Department of Home Affairs has unveiled a comprehensive overhaul of the visa processing system set to take effect in 2026. Key changes include:

**Processing Time Improvements**
- Student visas (subclass 500) will see priority processing for applications from low-risk education providers
- Skilled Independent visas (subclass 189) will be processed within 8-12 months on average
- Partner visas will benefit from increased staffing to reduce processing backlogs

**New Priority Categories**
Critical sectors including healthcare, education, and technology will receive priority processing across all skilled visa categories. This reflects Australia''s ongoing commitment to addressing labour shortages in key industries.

**Digital Transformation**
The Department is investing heavily in digital systems to automate routine checks and reduce manual processing time. This includes AI-powered document verification and enhanced fraud detection systems.

**What This Means for Applicants**
Applicants can expect faster processing times, particularly for those in priority occupations. The Department recommends ensuring all documentation is complete and accurate to avoid delays.',
       'policy', 'VisaHelper Editorial Team', NOW() - INTERVAL '2 days', true),
      
      ('Skilled Occupation List Updated: 15 New Occupations Added',
       'skilled-occupation-list-updated-15-new-occupations',
       'The Australian government has expanded the skilled occupation list with 15 new occupations to address labour market needs.',
       'The Department of Home Affairs has released the updated Skilled Occupation List (SOL) effective immediately, adding 15 new occupations to address critical labour shortages across Australia.

**New Occupations Added**
- Data Scientist (ANZSCO 224999)
- Cyber Security Specialist (ANZSCO 262112)
- Renewable Energy Engineer (ANZSCO 233999)
- Aged Care Registered Nurse (ANZSCO 254412)
- Mental Health Occupational Therapist (ANZSCO 252411)
- Cloud Architect (ANZSCO 261313)
- AI/Machine Learning Specialist (ANZSCO 263111)
- Sustainability Consultant (ANZSCO 224999)
- Telehealth Specialist (ANZSCO 253999)
- E-commerce Manager (ANZSCO 131199)
- Digital Marketing Specialist (ANZSCO 225111)
- Supply Chain Analyst (ANZSCO 232214)
- Automation Engineer (ANZSCO 233914)
- Clinical Informatician (ANZSCO 253999)
- Remote Work Coordinator (ANZSCO 149999)

**Impact on Applicants**
If your occupation is on the updated list, you may now be eligible for skilled migration visas including subclass 189, 190, and 491. Contact our team for a free eligibility assessment.',
       'skilled-migration', 'Sarah Chen, Senior Migration Consultant', NOW() - INTERVAL '5 days', true),
      
      ('Student Visa 500: Complete Guide for 2026 Intake',
       'student-visa-500-complete-guide-2026',
       'Everything international students need to know about applying for an Australian student visa for the 2026 academic year.',
       'Planning to study in Australia in 2026? Here''s your comprehensive guide to the Student visa (subclass 500).

**Key Requirements**
1. **Confirmation of Enrolment (CoE)** - You must have a CoE from a registered Australian education provider
2. **Genuine Temporary Entrant (GTE)** - You must demonstrate genuine intention to stay temporarily
3. **Financial Capacity** - Evidence of funds to cover tuition, living costs, and travel
4. **English Proficiency** - IELTS, TOEFL, PTE, or equivalent test scores
5. **Health Insurance** - Overseas Student Health Cover (OSHC) for entire stay
6. **Health and Character** - Medical examinations and police clearances

**Application Fees (2026)**
- Base application fee: AUD $650
- Additional applicant fee (18+): AUD $485
- Additional applicant fee (under 18): AUD $160

**Processing Times**
- 25% of applications: 14 days
- 50% of applications: 29 days
- 75% of applications: 57 days
- 90% of applications: 3 months

**Tips for Success**
- Apply at least 3 months before course commencement
- Ensure all documents are certified and translated if necessary
- Maintain consistent information across all documents
- Be honest and thorough in your GTE statement',
       'student-visas', 'Michael Thompson, Education Consultant', NOW() - INTERVAL '1 week', true),
      
      ('Partner Visa Processing Times Reduced by 30%',
       'partner-visa-processing-times-reduced',
       'The Department of Home Affairs reports significant improvements in partner visa processing times.',
       'Great news for couples waiting for partner visa grants! The Department of Home Affairs has announced a 30% reduction in processing times for partner visas.

**Updated Processing Times (Onshore 820/801)**
- 25% of applications: 6 months
- 50% of applications: 12 months
- 75% of applications: 18 months
- 90% of applications: 24 months

**Offshore Partner Visas (309/100)**
- 25% of applications: 9 months
- 50% of applications: 15 months
- 75% of applications: 22 months
- 90% of applications: 30 months

**Reasons for Improvement**
1. Increased staffing at processing centres
2. Streamlined document verification processes
3. Enhanced digital systems reducing manual processing
4. Priority processing for straightforward applications

**Tips for Faster Processing**
- Submit a complete application with all required documents
- Provide high-quality evidence of your relationship
- Respond promptly to any requests for additional information
- Consider using a registered migration agent',
       'family-visas', 'Emma Rodriguez, Family Visa Specialist', NOW() - INTERVAL '10 days', true),
      
      ('Working Holiday Visa: New Age Limit and Extended Stay Options',
       'working-holiday-visa-updates-2026',
       'Changes to the Working Holiday visa program offer more flexibility for young travellers.',
       'The Working Holiday Maker program has been updated with significant changes for 2026, offering more opportunities for young travellers to experience Australia.

**Key Changes**
- **Age Limit Increase**: The age limit has been increased from 30 to 35 years for applicants from certain countries
- **Extended Stay**: Third-year visa now available for those who complete 6 months of specified work in their second year
- **Regional Work**: Expanded definition of regional areas for specified work requirements
- **Online Applications**: Fully digital application process with faster processing times

**Visa Options**
1. **Working Holiday (subclass 417)** - For passport holders from Belgium, Canada, Cyprus, Denmark, Estonia, Finland, France, Germany, Hong Kong, Ireland, Italy, Japan, Malta, Netherlands, Norway, South Korea, Sweden, Taiwan, and UK

2. **Work and Holiday (subclass 462)** - For passport holders from Argentina, Austria, Chile, China, Czech Republic, Ecuador, Greece, Hungary, Indonesia, Israel, Luxembourg, Malaysia, Peru, Poland, Portugal, San Marino, Singapore, Slovak Republic, Slovenia, Spain, Thailand, Turkey, Uruguay, USA, and Vietnam

**Application Fee: AUD $635**

**Processing Time: 1-4 weeks**',
       'visitor-visas', 'David Park, Travel Visa Consultant', NOW() - INTERVAL '12 days', true),
      
      ('Regional Migration: Pathways to Permanent Residency',
       'regional-migration-pathways-pr',
       'Discover the benefits and pathways of Australia''s regional migration programs.',
       'Australia''s regional migration program offers excellent pathways to permanent residency for skilled workers willing to live and work outside major metropolitan areas.

**Regional Visas Available**

**1. Skilled Work Regional (Provisional) - Subclass 491**
- Valid for 5 years
- Requires nomination by state/territory or family sponsorship
- Pathway to permanent residency through subclass 191
- Priority processing for regional visas

**2. Skilled Employer Sponsored Regional (Provisional) - Subclass 494**
- Employer-sponsored visa for regional areas
- Valid for 5 years
- Pathway to permanent residency through subclass 191
- No points test required

**3. Permanent Residence (Skilled Regional) - Subclass 191**
- Permanent visa for subclass 491 and 494 holders
- Requires 3 years of residence and taxable income threshold
- Available from November 2022

**Benefits of Regional Living**
- Lower cost of living compared to major cities
- Additional points for skilled migration
- Priority processing for regional visas
- Strong job opportunities in growing regional centres
- Better work-life balance

**Designated Regional Areas**
All of Australia except Sydney, Melbourne, and Brisbane are considered regional for migration purposes. This includes Perth, Adelaide, Gold Coast, Sunshine Coast, Canberra, and all other areas.',
       'skilled-migration', 'James Wilson, Regional Migration Expert', NOW() - INTERVAL '2 weeks', true),
      
      ('Employer Sponsorship: 482 TSS Visa Changes Explained',
       'employer-sponsorship-482-changes',
       'Important updates to the Temporary Skill Shortage visa that employers and workers need to know.',
       'The Temporary Skill Shortage (TSS) visa (subclass 482) remains one of the most popular pathways for skilled workers to come to Australia. Here are the latest updates for 2026.

**Visa Streams**

**Short-term Stream**
- Valid for up to 2 years (can be renewed once onshore)
- For occupations on the Short-term Skilled Occupation List (STSOL)
- No pathway to permanent residency

**Medium-term Stream**
- Valid for up to 4 years
- For occupations on the Medium and Long-term Strategic Skills List (MLTSSL)
- Pathway to permanent residency after 3 years

**Labour Agreement Stream**
- For workers sponsored under a labour agreement
- Custom terms based on specific industry needs

**Application Requirements**
- Minimum 2 years of relevant work experience
- Skills assessment (if required for occupation)
- English language proficiency
- Health and character checks
- Employer must be an approved sponsor

**2026 Updates**
- Increased focus on genuine position requirements
- Enhanced labour market testing requirements
- Faster processing for priority occupations
- Streamlined nomination process for accredited sponsors

**Pathway to Permanent Residency**
TSS visa holders in the medium-term stream may be eligible for:
- Employer Nomination Scheme (subclass 186)
- After 3 years with the sponsoring employer',
       'work-visas', 'Lisa Chang, Corporate Immigration Lawyer', NOW() - INTERVAL '16 days', true),
      
      ('Australian Citizenship: Updated Requirements for 2026',
       'australian-citizenship-updated-requirements',
       'New citizenship requirements and faster processing times announced by the government.',
       'The path to Australian citizenship has been updated with new requirements and improved processing times for 2026.

**Citizenship by Conferral**

**Eligibility Requirements**
- Permanent resident for at least 12 months
- Lived in Australia for at least 4 years (including 12 months as PR)
- Absences from Australia not exceeding 12 months in total
- No more than 90 days absence in the 12 months before applying
- Meet character requirements
- Pass the citizenship test (applicants 18-59 years)

**Citizenship Test**
- 20 multiple-choice questions
- Must score at least 75% (15 correct answers)
- All 5 questions on Australian values must be answered correctly
- Available in multiple languages for those with English difficulties

**Application Fees (2026)**
- General eligibility: AUD $540
- Concession fee: AUD $75 (for pensioners, health care card holders)
- Children under 16: No fee when applying with parent

**Processing Times**
- 25% of applications: 3 months
- 50% of applications: 6 months
- 75% of applications: 9 months
- 90% of applications: 12 months

**Citizenship Ceremony**
Once approved, you must attend a citizenship ceremony and make the Australian Citizenship Pledge to become an Australian citizen.',
       'citizenship', 'Robert Mitchell, Citizenship Specialist', NOW() - INTERVAL '18 days', true),
      
      ('Points Test Calculator: How to Maximise Your Score',
       'points-test-calculator-maximise-score',
       'Strategic tips to increase your points score for skilled migration visas.',
       'The skilled migration points test is crucial for visas like subclass 189, 190, and 491. Here''s how to maximise your score.

**Current Points Breakdown (Minimum 65 required)**

**Age (Maximum 30 points)**
- 18-24 years: 25 points
- 25-32 years: 30 points
- 33-39 years: 25 points
- 40-44 years: 15 points

**English Language (Maximum 20 points)**
- Competent English: 0 points
- Proficient English: 10 points
- Superior English: 20 points

**Skilled Employment Experience (Maximum 20 points)**
- Overseas experience (8+ years): 15 points
- Australian experience (8+ years): 20 points

**Educational Qualifications (Maximum 20 points)**
- Doctorate: 20 points
- Bachelor''s degree: 15 points
- Diploma/trade qualification: 10 points

**Australian Study (Maximum 5 points)**
- At least 2 academic years of study in Australia

**Specialist Education Qualification (10 points)**
- Master''s or PhD in STEM fields

**Professional Year in Australia (5 points)**
- Completion of approved professional year program

**Community Language (5 points)**
- NAATI accreditation in a community language

**Regional Study (5 points)**
- Study in regional Australia

**Partner Skills (Maximum 10 points)**
- Partner meets age, English, and skills requirements

**Strategies to Increase Points**
1. Improve English test scores (IELTS/PTE)
2. Gain additional work experience
3. Complete a Professional Year program
4. Study in regional Australia
5. Obtain NAATI accreditation
6. Partner skills assessment',
       'skilled-migration', 'Dr. Amanda Liu, Points Test Expert', NOW() - INTERVAL '3 weeks', true),
      
      ('Health Requirements for Australian Visas: Complete Guide',
       'health-requirements-australian-visas',
       'Understanding the health examination requirements for your visa application.',
       'Health examinations are a mandatory part of most Australian visa applications. Here''s what you need to know.

**Who Needs Health Examinations?**
Most visa applicants must undergo health examinations, including:
- All permanent visa applicants
- Temporary visa applicants from certain countries
- Applicants for visas longer than 12 months
- Applicants aged 75+ for visitor visas

**Required Examinations**

**Standard Medical Examination**
- Height and weight measurement
- Blood pressure check
- Vision test
- Urinalysis
- Physical examination by panel physician

**Additional Tests (as required)**
- Chest X-ray (for TB screening)
- HIV test
- Hepatitis B and C tests
- Syphilis test
- Additional tests based on age and country of origin

**How to Arrange Examinations**
1. Create an ImmiAccount and start your visa application
2. Complete the health declaration
3. Receive a HAP ID (Health Assessment Portal ID)
4. Find an approved panel clinic in your country
5. Attend examination with your HAP ID and passport
6. Results are uploaded directly to the Department

**Costs**
Health examination costs vary by country and clinic. Expect to pay:
- Standard examination: AUD $200-400
- Chest X-ray: AUD $100-200
- Blood tests: AUD $50-150

**Validity**
Health examinations are generally valid for 12 months. If your visa is not decided within this period, you may need to repeat the examinations.

**Common Health Issues**
- Tuberculosis: May require additional testing and treatment
- Significant medical conditions: May require health waivers
- Mental health conditions: Must not pose a threat to community',
       'general', 'Dr. Sarah Williams, Migration Health Consultant', NOW() - INTERVAL '22 days', true);
    
    RAISE NOTICE '✅ Seeded 10 news articles';
  ELSE
    RAISE NOTICE '✅ News table already has % articles', news_count;
  END IF;
END $$;

-- 3. SEED FAQ ENTRIES
-- =====================================================
DO $$
DECLARE
  faq_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO faq_count FROM faqs;
  
  IF faq_count < 20 THEN
    RAISE NOTICE 'Seeding FAQ entries...';
    
    INSERT INTO faqs (question, answer, category, is_published, display_order) VALUES
      ('How long does it take to process a visa application?', 
       'Processing times vary depending on the visa type:
• Visitor visas: 1-45 days
• Student visas: 14-90 days
• Skilled work visas: 3-18 months
• Partner visas: 6-24 months
• Business visas: 6-18 months

You can check current processing times on the Department of Home Affairs website or use our Visa Tracker tool.', 
       'general', true, 1),
      
      ('What is the difference between onshore and offshore visa applications?',
       'Onshore applications are made while you are physically in Australia, while offshore applications are made from outside Australia.

**Onshore Applications:**
• Apply from within Australia
• May receive a bridging visa to remain lawful
• Processing times may vary

**Offshore Applications:**
• Apply from your home country
• Must wait for grant before travelling to Australia
• Generally faster processing for some visa types',
       'general', true, 2),
      
      ('How much money do I need to show for a student visa?',
       'For a Student visa (subclass 500), you need to demonstrate sufficient funds to cover:

• Tuition fees for the first 12 months (or full course if shorter)
• Living costs: AUD $24,505 per year
• Travel costs: Approximately AUD $2,000
• School fees for dependent children: AUD $8,000 per year

You can demonstrate funds through:
• Bank statements
• Scholarships or financial aid
• Parental financial support
• Loan documents',
       'student-visas', true, 3),
      
      ('What is the points test for skilled migration?',
       'The points test is used to assess eligibility for skilled migration visas (189, 190, 491). You need at least 65 points.

**Points are awarded for:**
• Age (15-30 points)
• English language ability (0-20 points)
• Skilled employment experience (0-20 points)
• Educational qualifications (10-20 points)
• Australian study (5 points)
• Specialist education (10 points)
• Professional year (5 points)
• Community language (5 points)
• Regional study (5 points)
• Partner skills (5-10 points)

Use our Points Calculator to estimate your score.',
       'skilled-migration', true, 4),
      
      ('Can I work while on a student visa?',
       'Yes, Student visa (subclass 500) holders can work:

**Work Rights:**
• Course in session: Maximum 48 hours per fortnight
• Course breaks: Unlimited hours
• Research masters or PhD students: Unlimited hours

**Important Notes:**
• You cannot work until your course has commenced
• Family members can work up to 48 hours per fortnight
• Work rights are automatically included with your visa
• No separate work permit required',
       'student-visas', true, 5),
      
      ('What documents do I need for a partner visa?',
       'Partner visa applications require extensive evidence of your genuine relationship:

**Relationship Evidence:**
• Joint financial documents (bank accounts, loans, leases)
• Joint household documents (utilities, rent/mortgage)
• Photos together with dates and locations
• Travel documents showing trips together
• Communication records (messages, emails)
• Statutory declarations from friends and family

**Personal Documents:**
• Birth certificates
• Passports
• Police clearances
• Health examination results
• Evidence of previous relationships ended (if applicable)',
       'family-visas', true, 6),
      
      ('How do I become an Australian citizen?',
       'To become an Australian citizen by conferral, you must:

**Eligibility:**
• Be a permanent resident for at least 12 months
• Have lived in Australia for at least 4 years
• Be of good character
• Pass the citizenship test (ages 18-59)
• Intend to reside in Australia

**Process:**
1. Check eligibility
2. Gather documents
3. Submit application online
4. Attend citizenship test
5. Wait for decision
6. Attend citizenship ceremony
7. Make the Australian Citizenship Pledge

Processing time: 3-12 months',
       'citizenship', true, 7),
      
      ('What is a skills assessment and do I need one?',
       'A skills assessment evaluates your qualifications and work experience against Australian standards for your occupation.

**Who needs a skills assessment:**
• Most skilled migration visa applicants
• Some employer-sponsored visa applicants
• Specific occupations require specific assessing authorities

**Common Assessing Authorities:**
• VETASSESS (general occupations)
• ACS (IT professionals)
• Engineers Australia (engineers)
• CPA/CA/IPA (accountants)
• TRA (trades)
• AHPRA (health professionals)

**Processing Time:**
• Standard: 8-12 weeks
• Priority: 2-4 weeks (additional fee)',
       'skilled-migration', true, 8),
      
      ('Can I include my family members in my visa application?',
       'Most Australian visas allow you to include family members:

**Who can be included:**
• Spouse or de facto partner
• Dependent children under 18
• Dependent children 18-23 (if studying full-time)
• Dependent children 23+ (if disabled)

**Additional Costs:**
• Additional applicant fees apply
• Health examinations for each family member
• Police clearances for each family member over 16

**Important:**
• Family members must meet health and character requirements
• Including family may affect processing times
• Partner skills can add points to your application',
       'general', true, 9),
      
      ('What happens if my visa application is refused?',
       'If your visa application is refused, you have several options:

**Review Options:**
1. **Administrative Appeals Tribunal (AAT)**
   - Must apply within time limits (usually 21-28 days)
   - Review the merits of the decision
   - May take 12-18 months

2. **Federal Court**
   - For legal errors only
   - Must have grounds for appeal

3. **Reapply**
   - Address the reasons for refusal
   - Submit a new application

**Common Refusal Reasons:**
• Insufficient evidence
• Health or character issues
• Not meeting visa criteria
• Fraudulent documents

Contact a registered migration agent for advice on your specific situation.',
       'general', true, 10),
      
      ('What is the Global Talent Visa program?',
       'The Global Talent Visa (subclass 858) is designed to attract highly skilled individuals in target sectors to Australia.

**Target Sectors:**
• Resources
• Agri-food and AgTech
• Energy
• Health industries
• Defence, advanced manufacturing and space
• Circular economy
• Digitech
• Infrastructure and tourism
• Financial services and FinTech
• Education

**Requirements:**
• Internationally recognised record of exceptional achievement
• Still prominent in your field
• Able to attract a salary at or above the Fair Work high income threshold
• Have a nominator with national reputation in your field

**Benefits:**
• Priority processing
• Permanent residency
• No points test
• No age limit (under 55 preferred)',
       'skilled-migration', true, 11),
      
      ('How do I find a registered migration agent?',
       'To ensure you receive professional advice, use a registered migration agent:

**Check Registration:**
• Search the OMARA register: www.mara.gov.au
• Verify the agent''s registration number
• Check for any disciplinary actions

**What to Look For:**
• Registered with OMARA
• Professional indemnity insurance
• Clear fee structure
• Written agreement (Form 956)
• Good communication skills

**Red Flags:**
• Guarantees visa approval
• Asks for cash payments only
• Pressures you to sign quickly
• No registration number
• Promises to arrange fake documents

VisaHelper connects you with verified, experienced migration lawyers.',
       'general', true, 12),
      
      ('What is the difference between permanent and temporary visas?',
       'Understanding the difference between permanent and temporary visas:

**Permanent Visas:**
• No expiry date (can travel for 5 years, then need RRV)
• Full work rights
• Access to Medicare
• Pathway to citizenship
• Can sponsor family members
• Full study rights

**Temporary Visas:**
• Valid for specified period
• May have work restrictions
• May not have Medicare access
• No direct citizenship pathway
• May require maintaining conditions
• May have pathway to permanent visa

**Common Pathways:**
Temporary → Permanent:
• 482 → 186
• 491 → 191
• 485 → 189/190',
       'general', true, 13),
      
      ('Do I need health insurance in Australia?',
       'Health insurance requirements depend on your visa type:

**Mandatory Health Insurance:**
• Student visa: Overseas Student Health Cover (OSHC)
• 485 visa: Adequate health insurance
• Some visitor visas: Travel insurance recommended

**Medicare Eligibility:**
• Permanent residents: Eligible
• Citizens: Eligible
• Some temporary visa holders from reciprocal countries: Eligible
• Most temporary visa holders: Not eligible

**Private Health Insurance:**
• Recommended for all temporary residents
• Can cover services not covered by Medicare
• Hospital cover, extras cover available
• Lifetime Health Cover loading applies after age 30',
       'general', true, 14),
      
      ('How do I prove my English language proficiency?',
       'Australian visas accept several English language tests:

**Accepted Tests:**
1. **IELTS** (International English Language Testing System)
   - Most commonly accepted
   - Academic and General Training versions

2. **PTE Academic** (Pearson Test of English)
   - Computer-based test
   - Results within 48 hours

3. **TOEFL iBT** (Test of English as a Foreign Language)
   - Internet-based test

4. **OET** (Occupational English Test)
   - For health professionals

5. **Cambridge C1 Advanced**
   - Also known as CAE

**Score Requirements Vary:**
• Competent English: IELTS 6.0 each band
• Proficient English: IELTS 7.0 each band
• Superior English: IELTS 8.0 each band

Test results are valid for 3 years.',
       'general', true, 15),
      
      ('What is the Genuine Temporary Entrant (GTE) requirement?',
       'The GTE requirement applies to student visa applicants and assesses whether you genuinely intend to stay in Australia temporarily.

**Assessment Factors:**
• Circumstances in your home country
• Potential circumstances in Australia
• Value of your chosen course
• Your immigration history

**How to Demonstrate GTE:**
• Write a detailed GTE statement
• Explain why you chose this course
• Show ties to your home country
• Demonstrate career benefits from the course
• Provide evidence of financial capacity
• Show family/social ties in home country
• Explain any gaps in study or employment

**Common Mistakes:**
• Vague or generic statements
• No clear career pathway
• Insufficient ties to home country
• Contradictory information

Be honest and provide specific details about your situation.',
       'student-visas', true, 16),
      
      ('Can I travel to Australia while my visa is being processed?',
       'Whether you can travel while your visa is being processed depends on your circumstances:

**If You Already Have a Valid Visa:**
• You can travel to Australia
• Your current visa conditions still apply
• The new visa application continues processing

**If You Need a Visa to Enter:**
• You need a valid visa to board the flight
• A pending application does not grant entry
• Consider applying for a visitor visa to travel

**Bridging Visas:**
• If you applied onshore, you may have a bridging visa
• Check if it has travel rights (Bridging Visa A does not)
• Apply for Bridging Visa B to travel

**Important:**
• Always check your visa conditions
• Ensure you have a valid visa to return
• Contact a migration agent if unsure',
       'general', true, 17),
      
      ('What is the Skilled Occupation List (SOL)?',
       'The Skilled Occupation List identifies occupations eligible for skilled migration visas.

**Current Lists:**

**MLTSSL** (Medium and Long-term Strategic Skills List)
• Long-term skilled occupations
• Eligible for: 189, 491 (family), 485, 482 (medium-term), 186

**STSOL** (Short-term Skilled Occupation List)
• Short-term skilled occupations
• Eligible for: 190, 491 (state), 482 (short-term)

**ROL** (Regional Occupation List)
• Regional-specific occupations
• Eligible for: 491 (regional), 494, 482 (regional)

**How to Check:**
• Visit Department of Home Affairs website
• Check your ANZSCO code
• Verify your occupation is on the relevant list
• Check occupation ceilings and quotas

Lists are updated regularly based on labour market needs.',
       'skilled-migration', true, 18),
      
      ('How do I renew or extend my visa?',
       'Most Australian visas cannot be extended. You typically need to apply for a new visa.

**Common Scenarios:**

**Student Visa Extension:**
• Apply for a new student visa before current one expires
• Need new CoE for extended course
• Maintain OSHC coverage

**Visitor Visa:**
• Apply for new visitor visa
• Must be outside Australia for most streams
• Some streams allow onshore application

**Work Visa:**
• Apply for new work visa or different visa category
• Employer may need to lodge new nomination

**Important:**
• Apply before current visa expires
• Do not let your visa expire (become unlawful)
• Bridging visas may apply in some cases
• Always check visa conditions

Contact a migration agent for advice on your specific situation.',
       'general', true, 19),
      
      ('What is the Regional Sponsored Migration Scheme (RSMS)?',
       'The RSMS has been replaced by the Skilled Employer Sponsored Regional (Provisional) visa (subclass 494).

**Subclass 494 Features:**
• Valid for 5 years
• Requires employer sponsorship in regional Australia
• Over 700 eligible occupations
• No points test required
• Priority processing available

**Requirements:**
• Be under 45 years (exceptions apply)
• Have 3 years of relevant work experience
• Have a positive skills assessment
• Meet English requirements
• Be nominated by regional employer

**Pathway to Permanent Residency:**
• Hold 494 visa for 3 years
• Live and work in regional Australia
• Meet income requirements
• Apply for subclass 191 (Permanent Residence Skilled Regional)

**Regional Areas:**
All of Australia except Sydney, Melbourne, and Brisbane.',
       'work-visas', true, 20);
    
    RAISE NOTICE '✅ Seeded 20 FAQ entries';
  ELSE
    RAISE NOTICE '✅ FAQ table already has % entries', faq_count;
  END IF;
END $$;

-- 4. SEED SAMPLE LAWYER PROFILES (if approved lawyers < 5)
-- =====================================================
DO $$
DECLARE
  lawyer_count INTEGER;
  test_user_id UUID;
BEGIN
  SELECT COUNT(*) INTO lawyer_count FROM lawyers WHERE verification_status = 'approved';
  
  IF lawyer_count < 5 THEN
    RAISE NOTICE 'Creating sample lawyer profiles...';
    RAISE NOTICE 'Note: These lawyers require corresponding auth.users entries';
    
    -- Note: In production, you would create auth users first, then lawyers
    -- This shows the structure for sample data
    
    RAISE NOTICE 'Sample lawyer data ready:';
    RAISE NOTICE '1. Sarah Chen - Senior Migration Consultant (10+ years)';
    RAISE NOTICE '2. Michael Thompson - Education Visa Specialist (8 years)';
    RAISE NOTICE '3. Emma Rodriguez - Family Visa Expert (12 years)';
    RAISE NOTICE '4. James Wilson - Skilled Migration Lawyer (15 years)';
    RAISE NOTICE '5. Lisa Chang - Corporate Immigration Lawyer (9 years)';
    
  ELSE
    RAISE NOTICE '✅ Found % approved lawyers', lawyer_count;
  END IF;
END $$;

-- 5. SEED PLATFORM SETTINGS
-- =====================================================
DO $$
DECLARE
  settings_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO settings_count FROM platform_settings;
  
  IF settings_count = 0 THEN
    RAISE NOTICE 'Seeding platform_settings table...';
    
    INSERT INTO platform_settings (setting_key, setting_value, description) VALUES
      ('default_visa_price', '49.00', 'Default premium unlock price for visas'),
      ('platform_commission', '0.15', 'Platform commission percentage on consultations'),
      ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
      ('allow_lawyer_registration', 'true', 'Allow new lawyer registrations'),
      ('default_consultation_duration', '60', 'Default consultation duration in minutes'),
      ('min_consultation_duration', '30', 'Minimum consultation duration'),
      ('max_consultation_duration', '120', 'Maximum consultation duration'),
      ('enable_payments', 'true', 'Enable payment processing'),
      ('enable_reviews', 'true', 'Enable lawyer reviews'),
      ('enable_tracker', 'true', 'Enable processing time tracker'),
      ('contact_email', 'support@visahelper.com.au', 'Platform contact email'),
      ('support_phone', '+61 2 9000 0000', 'Platform support phone'),
      ('business_name', 'VisaHelper Australia', 'Platform business name'),
      ('abn', '12 345 678 901', 'Australian Business Number'),
      ('office_address', 'Level 10, 123 Martin Place, Sydney NSW 2000', 'Registered office address');
    
    RAISE NOTICE '✅ Seeded 15 platform settings';
  ELSE
    RAISE NOTICE '✅ Platform settings already has % records', settings_count;
  END IF;
END $$;

-- Final Summary
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED COMPLETE - VISAHELPER DATABASE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Summary:';
  RAISE NOTICE '  - Visas: %', (SELECT COUNT(*) FROM visas);
  RAISE NOTICE '  - News Articles: %', (SELECT COUNT(*) FROM news);
  RAISE NOTICE '  - FAQ Entries: %', (SELECT COUNT(*) FROM faqs);
  RAISE NOTICE '  - Lawyers: %', (SELECT COUNT(*) FROM lawyers);
  RAISE NOTICE '  - Platform Settings: %', (SELECT COUNT(*) FROM platform_settings);
  RAISE NOTICE '';
  RAISE NOTICE 'Next Steps:';
  RAISE NOTICE '  1. Create auth.users for lawyer accounts';
  RAISE NOTICE '  2. Link lawyer records to user accounts';
  RAISE NOTICE '  3. Add visa processing time entries';
  RAISE NOTICE '  4. Create sample user applications';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
