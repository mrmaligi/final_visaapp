const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysfwurlzkihgezfegfog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgwMjk3MywiZXhwIjoyMDg5Mzc4OTczfQ.q9rpAF9ZgslmF5APWsumubprSbxDm-jEtEwu9ZRCKnc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const visas = [
  { subclass: '189', name: 'Skilled Independent', category: 'work', short_description: 'Points-tested permanent residence for skilled workers', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189', application_fee: 4240, is_active: true },
  { subclass: '190', name: 'Skilled Nominated', category: 'work', short_description: 'State or territory nominated permanent residence', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190', application_fee: 4240, is_active: true },
  { subclass: '491', name: 'Skilled Work Regional', category: 'work', short_description: 'Provisional visa for skilled workers in regional Australia', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491', application_fee: 4240, is_active: true },
  { subclass: '482', name: 'Temporary Skill Shortage', category: 'work', short_description: 'Temporary work visa for skilled workers', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482', application_fee: 1290, is_active: true },
  { subclass: '186', name: 'Employer Nomination Scheme', category: 'work', short_description: 'Permanent residence for skilled workers nominated by employer', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', application_fee: 4240, is_active: true },
  { subclass: '494', name: 'Skilled Employer Sponsored Regional', category: 'work', short_description: 'Provisional visa for regional employer sponsorship', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494', application_fee: 4240, is_active: true },
  { subclass: '500', name: 'Student', category: 'student', short_description: 'Study in Australia at an educational institution', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500', application_fee: 650, is_active: true },
  { subclass: '485', name: 'Temporary Graduate', category: 'student', short_description: 'Work temporarily after graduating from Australian institution', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485', application_fee: 1730, is_active: true },
  { subclass: '820/801', name: 'Partner (Onshore)', category: 'family', short_description: 'For partners of Australian citizens or permanent residents', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore-820-801', application_fee: 8085, is_active: true },
  { subclass: '309/100', name: 'Partner (Offshore)', category: 'family', short_description: 'For partners outside Australia of Australian citizens', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore-309-100', application_fee: 8085, is_active: true },
  { subclass: '300', name: 'Prospective Marriage', category: 'family', short_description: 'For prospective spouses of Australian citizens', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300', application_fee: 8085, is_active: true },
  { subclass: '101', name: 'Child', category: 'family', short_description: 'For children of Australian citizens or permanent residents', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/child-101', application_fee: 1745, is_active: true },
  { subclass: '600', name: 'Visitor', category: 'visitor', short_description: 'Short-term visit to Australia for tourism or business', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/visitor-600', application_fee: 150, is_active: true },
  { subclass: '601', name: 'Electronic Travel Authority', category: 'visitor', short_description: 'Electronic visa for short-term visits', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601', application_fee: 0, is_active: true },
  { subclass: '651', name: 'eVisitor', category: 'visitor', short_description: 'Electronic visa for eligible passport holders', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651', application_fee: 0, is_active: true },
  { subclass: '188', name: 'Business Innovation and Investment', category: 'business', short_description: 'Provisional visa for business owners and investors', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188', application_fee: 6270, is_active: true },
  { subclass: '888', name: 'Business Innovation and Investment (Permanent)', category: 'business', short_description: 'Permanent visa for business innovation and investment', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-permanent-888', application_fee: 2985, is_active: true },
  { subclass: '132', name: 'Business Talent', category: 'business', short_description: 'Permanent visa for high-calibre business owners', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-talent-132', application_fee: 7980, is_active: true },
  { subclass: '866', name: 'Protection', category: 'protection', short_description: 'Permanent protection visa for refugees', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/protection-866', application_fee: 0, is_active: true },
  { subclass: '785', name: 'Temporary Protection', category: 'protection', short_description: 'Temporary protection visa for refugees', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-protection-785', application_fee: 0, is_active: true },
];

const settings = [
  { setting_key: 'default_visa_price', setting_value: '49.00', description: 'Default premium unlock price for visas' },
  { setting_key: 'platform_commission', setting_value: '0.15', description: 'Platform commission percentage on consultations (15%)' },
  { setting_key: 'maintenance_mode', setting_value: 'false', description: 'Enable/disable maintenance mode' },
  { setting_key: 'allow_lawyer_registration', setting_value: 'true', description: 'Allow new lawyer registrations' },
  { setting_key: 'default_consultation_duration', setting_value: '60', description: 'Default consultation duration in minutes' },
  { setting_key: 'min_consultation_duration', setting_value: '30', description: 'Minimum consultation duration in minutes' },
  { setting_key: 'max_consultation_duration', setting_value: '120', description: 'Maximum consultation duration in minutes' },
  { setting_key: 'enable_payments', setting_value: 'true', description: 'Enable/disable payment processing' },
  { setting_key: 'enable_reviews', setting_value: 'true', description: 'Enable/disable lawyer reviews' },
  { setting_key: 'enable_tracker', setting_value: 'true', description: 'Enable/disable processing time tracker' },
  { setting_key: 'contact_email', setting_value: 'support@visahelper.com', description: 'Platform contact email' },
  { setting_key: 'support_phone', setting_value: '+61 2 9000 0000', description: 'Platform support phone' },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  // Seed visas
  console.log('📋 Seeding visas...');
  const { data: existingVisas, error: countError } = await supabase
    .from('visas')
    .select('id');
  
  if (countError) {
    console.error('❌ Error checking visas:', countError.message);
    return;
  }

  if (existingVisas && existingVisas.length > 0) {
    console.log(`✅ Visas table already has ${existingVisas.length} records, skipping...`);
  } else {
    const { error: visaError } = await supabase
      .from('visas')
      .insert(visas);
    
    if (visaError) {
      console.error('❌ Error seeding visas:', visaError.message);
    } else {
      console.log(`✅ Seeded ${visas.length} visas`);
    }
  }

  // Seed platform settings
  console.log('\n⚙️  Seeding platform settings...');
  const { data: existingSettings, error: settingsCountError } = await supabase
    .from('platform_settings')
    .select('id');
  
  if (settingsCountError) {
    console.error('❌ Error checking settings:', settingsCountError.message);
    return;
  }

  if (existingSettings && existingSettings.length > 0) {
    console.log(`✅ Platform settings already has ${existingSettings.length} records, skipping...`);
  } else {
    const { error: settingsError } = await supabase
      .from('platform_settings')
      .insert(settings);
    
    if (settingsError) {
      console.error('❌ Error seeding settings:', settingsError.message);
    } else {
      console.log(`✅ Seeded ${settings.length} platform settings`);
    }
  }

  console.log('\n✨ Database seeding complete!');
}

seedDatabase().catch(console.error);
