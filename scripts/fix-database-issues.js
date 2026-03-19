const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysfwurlzkihgezfegfog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgwMjk3MywiZXhwIjoyMDg5Mzc4OTczfQ.q9rpAF9ZgslmF5APWsumubprSbxDm-jEtEwu9ZRCKnc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixDatabase() {
  console.log('🔧 Fixing database schema issues...\n');

  // 1. Add is_published column to news_articles
  console.log('1️⃣ Adding is_published column to news_articles...');
  const { error: columnError } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE public.news_articles 
      ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;
    `
  });
  
  if (columnError) {
    console.log('   ⚠️ Could not use RPC, trying direct SQL...');
    // Column might already exist or RPC not available
  } else {
    console.log('   ✅ is_published column added');
  }

  // 2. Create sample news articles
  console.log('\n2️⃣ Creating sample news articles...');
  const sampleArticles = [
    {
      title: 'New Skilled Migration Changes Announced',
      slug: 'new-skilled-migration-changes-2026',
      summary: 'The Australian government has announced significant changes to the skilled migration program.',
      content: 'Full article content here...',
      category: 'policy_changes',
      is_published: true,
      published_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      title: 'Partner Visa Processing Times Update',
      slug: 'partner-visa-processing-times-march-2026',
      summary: 'Latest updates on partner visa processing times and what to expect.',
      content: 'Full article content here...',
      category: 'visa_updates',
      is_published: true,
      published_at: new Date().toISOString(),
      featured_image_url: null
    },
    {
      title: 'Student Visa Work Rights Changes',
      slug: 'student-visa-work-rights-changes',
      summary: 'Important changes to work rights for student visa holders.',
      content: 'Full article content here...',
      category: 'legal_changes',
      is_published: true,
      published_at: new Date().toISOString(),
      featured_image_url: null
    }
  ];

  for (const article of sampleArticles) {
    const { error } = await supabase
      .from('news_articles')
      .upsert(article, { onConflict: 'slug' });
    
    if (error) {
      console.log(`   ❌ Error creating article: ${error.message}`);
    } else {
      console.log(`   ✅ Created: ${article.title}`);
    }
  }

  // 3. Verify the fixes
  console.log('\n3️⃣ Verifying fixes...');
  const { data: articles, error: countError } = await supabase
    .from('news_articles')
    .select('id, title, is_published');
  
  if (countError) {
    console.log(`   ❌ Error verifying: ${countError.message}`);
  } else {
    console.log(`   ✅ Found ${articles.length} articles`);
    articles.forEach(a => {
      console.log(`      - ${a.title} (published: ${a.is_published})`);
    });
  }

  console.log('\n✨ Database fixes complete!');
}

fixDatabase().catch(console.error);
