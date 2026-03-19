const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysfwurlzkihgezfegfog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgwMjk3MywiZXhwIjoyMDg5Mzc4OTczfQ.q9rpAF9ZgslmF5APWsumubprSbxDm-jEtEwu9ZRCKnc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const additionalVisas = [
  { subclass: '491', name: 'Skilled Work Regional', category: 'work', short_description: 'Provisional visa for skilled workers in regional Australia', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491', application_fee: 4240, is_active: true },
  { subclass: '186', name: 'Employer Nomination Scheme', category: 'work', short_description: 'Permanent residence for skilled workers nominated by employer', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186', application_fee: 4240, is_active: true },
  { subclass: '494', name: 'Skilled Employer Sponsored Regional', category: 'work', short_description: 'Provisional visa for regional employer sponsorship', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-employer-sponsored-regional-494', application_fee: 4240, is_active: true },
  { subclass: '485', name: 'Temporary Graduate', category: 'student', short_description: 'Work temporarily after graduating from Australian institution', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485', application_fee: 1730, is_active: true },
  { subclass: '309/100', name: 'Partner (Offshore)', category: 'family', short_description: 'For partners outside Australia of Australian citizens', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore-309-100', application_fee: 8085, is_active: true },
  { subclass: '300', name: 'Prospective Marriage', category: 'family', short_description: 'For prospective spouses of Australian citizens', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/prospective-marriage-300', application_fee: 8085, is_active: true },
  { subclass: '101', name: 'Child', category: 'family', short_description: 'For children of Australian citizens or permanent residents', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/child-101', application_fee: 1745, is_active: true },
  { subclass: '601', name: 'Electronic Travel Authority', category: 'visitor', short_description: 'Electronic visa for short-term visits', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/electronic-travel-authority-601', application_fee: 0, is_active: true },
  { subclass: '651', name: 'eVisitor', category: 'visitor', short_description: 'Electronic visa for eligible passport holders', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/evisitor-651', application_fee: 0, is_active: true },
  { subclass: '188', name: 'Business Innovation and Investment', category: 'business', short_description: 'Provisional visa for business owners and investors', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188', application_fee: 6270, is_active: true },
  { subclass: '888', name: 'Business Innovation and Investment (Permanent)', category: 'business', short_description: 'Permanent visa for business innovation and investment', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-permanent-888', application_fee: 2985, is_active: true },
  { subclass: '132', name: 'Business Talent', category: 'business', short_description: 'Permanent visa for high-calibre business owners', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-talent-132', application_fee: 7980, is_active: true },
  { subclass: '866', name: 'Protection', category: 'protection', short_description: 'Permanent protection visa for refugees', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/protection-866', application_fee: 0, is_active: true },
  { subclass: '785', name: 'Temporary Protection', category: 'protection', short_description: 'Temporary protection visa for refugees', official_link: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-protection-785', application_fee: 0, is_active: true },
];

async function addMoreVisas() {
  console.log('🌱 Adding more visas to database...\n');

  for (const visa of additionalVisas) {
    const { error } = await supabase
      .from('visas')
      .upsert(visa, { onConflict: 'subclass' });
    
    if (error) {
      console.error(`❌ Error adding ${visa.subclass}:`, error.message);
    } else {
      console.log(`✅ Added/Updated: ${visa.subclass} - ${visa.name}`);
    }
  }

  console.log('\n✨ Done!');
}

addMoreVisas().catch(console.error);
