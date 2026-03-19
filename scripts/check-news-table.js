const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ysfwurlzkihgezfegfog.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgwMjk3MywiZXhwIjoyMDg5Mzc4OTczfQ.q9rpAF9ZgslmF5APWsumubprSbxDm-jEtEwu9ZRCKnc';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTable() {
  console.log('Checking news_articles table structure...\n');
  
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Table exists. Sample record keys:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log('No records found');
    }
  }
}

checkTable();
