const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysfwurlzkihgezfegfog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgwMjk3MywiZXhwIjoyMDg5Mzc4OTczfQ.q9rpAF9ZgslmF5APWsumubprSbxDm-jEtEwu9ZRCKnc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addArticles() {
  console.log('📰 Adding sample news articles...\n');
  
  const sampleArticles = [
    {
      title: 'New Skilled Migration Changes Announced',
      slug: 'new-skilled-migration-changes-2026',
      summary: 'The Australian government has announced significant changes to the skilled migration program effective April 2026.',
      content: 'The Department of Home Affairs has announced major changes to the skilled migration program...',
      category: 'policy_changes',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Partner Visa Processing Times Update',
      slug: 'partner-visa-processing-times-march-2026',
      summary: 'Latest updates on partner visa processing times and what applicants can expect in 2026.',
      content: 'Partner visa processing times have been updated for March 2026...',
      category: 'visa_updates',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Student Visa Work Rights Changes',
      slug: 'student-visa-work-rights-changes-2026',
      summary: 'Important changes to work rights for student visa holders starting next month.',
      content: 'New regulations will affect student visa work rights...',
      category: 'legal_changes',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Business Innovation Visa Program Expansion',
      slug: 'business-innovation-visa-expansion',
      summary: 'The Business Innovation and Investment Program is expanding with new visa categories.',
      content: 'The Australian government is expanding opportunities for business migrants...',
      category: 'visa_updates',
      published: true,
      published_at: new Date().toISOString()
    },
    {
      title: 'Regional Visa Processing Priorities',
      slug: 'regional-visa-processing-priorities',
      summary: 'Regional visa applications now receiving priority processing across all categories.',
      content: 'Regional Australia continues to be a priority for immigration...',
      category: 'policy_changes',
      published: true,
      published_at: new Date().toISOString()
    }
  ];

  for (const article of sampleArticles) {
    const { error } = await supabase
      .from('news_articles')
      .upsert(article, { onConflict: 'slug' });
    
    if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else {
      console.log(`✅ Added: ${article.title}`);
    }
  }

  console.log('\n✨ Done!');
}

addArticles();
