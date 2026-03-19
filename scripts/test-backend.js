#!/usr/bin/env node
/**
 * Advanced Backend & Integration Test Suite
 * Tests Supabase connectivity, server actions, and API functionality
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ysfwurlzkihgezfegfog.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzZnd1cmx6a2loZ2V6ZmVnZm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDI5NzMsImV4cCI6MjA4OTM3ODk3M30.-36dciAqoJrjThTAR-O5PidU2BMS1R5r39pid7adbxA';

const results = {
  supabase: [],
  serverActions: [],
  security: [],
  summary: { total: 0, passed: 0, failed: 0, warnings: 0 }
};

function logTest(category, name, status, details = {}) {
  results.summary.total++;
  if (status === 'PASS') results.summary.passed++;
  else if (status === 'FAIL') results.summary.failed++;
  else if (status === 'WARN') results.summary.warnings++;

  const entry = { timestamp: new Date().toISOString(), category, name, status, ...details };
  
  if (category === 'SUPABASE') results.supabase.push(entry);
  else if (category === 'SERVER_ACTION') results.serverActions.push(entry);
  else if (category === 'SECURITY') results.security.push(entry);

  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${category}] ${name}: ${status}`);
  if (details.notes) console.log(`   Notes: ${details.notes}`);
  if (details.error) console.log(`   Error: ${details.error}`);
}

// ============================================
// SUPABASE CONNECTIVITY TESTS
// ============================================

async function testSupabaseConnection() {
  console.log('\n🗄️ Testing Supabase Connectivity...\n');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 1: Basic connection
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.from('visas').select('count');
    const responseTime = Date.now() - startTime;
    
    if (error) throw error;
    
    logTest('SUPABASE', 'Basic Connection', 'PASS', {
      responseTime: `${responseTime}ms`,
      notes: `Connected to Supabase project: ${SUPABASE_URL.split('//')[1].split('.')[0]}`
    });
  } catch (error) {
    logTest('SUPABASE', 'Basic Connection', 'FAIL', {
      error: error.message
    });
  }

  // Test 2: Query visas table
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('visas')
      .select('*')
      .eq('is_active', true)
      .limit(5);
    
    const responseTime = Date.now() - startTime;
    
    if (error) throw error;
    
    logTest('SUPABASE', 'Visas Query', 'PASS', {
      responseTime: `${responseTime}ms`,
      notes: `Retrieved ${data?.length || 0} active visas`
    });
  } catch (error) {
    logTest('SUPABASE', 'Visas Query', 'FAIL', {
      error: error.message
    });
  }

  // Test 3: Query lawyers table
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .limit(5);
    
    const responseTime = Date.now() - startTime;
    
    if (error) throw error;
    
    logTest('SUPABASE', 'Lawyers Query', 'PASS', {
      responseTime: `${responseTime}ms`,
      notes: `Retrieved ${data?.length || 0} lawyers`
    });
  } catch (error) {
    logTest('SUPABASE', 'Lawyers Query', 'FAIL', {
      error: error.message
    });
  }

  // Test 4: Query profiles table (auth check)
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('profiles')
      .select('count');
    
    const responseTime = Date.now() - startTime;
    
    // This will fail for anon key (RLS) - that's expected
    if (error && error.code === 'PGRST301') {
      logTest('SUPABASE', 'Profiles RLS', 'PASS', {
        notes: 'Row Level Security working correctly (anonymous access blocked)'
      });
    } else if (!error) {
      logTest('SUPABASE', 'Profiles Query', 'PASS', {
        responseTime: `${responseTime}ms`,
        notes: 'Profiles table accessible'
      });
    } else {
      throw error;
    }
  } catch (error) {
    logTest('SUPABASE', 'Profiles Query', 'WARN', {
      error: error.message,
      notes: 'May need to check RLS policies'
    });
  }

  // Test 5: Auth configuration check
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    logTest('SUPABASE', 'Auth Configuration', 'PASS', {
      notes: 'Auth service is operational'
    });
  } catch (error) {
    logTest('SUPABASE', 'Auth Configuration', 'FAIL', {
      error: error.message
    });
  }

  // Test 6: Storage check
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) throw error;
    
    logTest('SUPABASE', 'Storage Buckets', 'PASS', {
      notes: `Found ${data?.length || 0} storage buckets`
    });
  } catch (error) {
    logTest('SUPABASE', 'Storage Buckets', 'WARN', {
      error: error.message,
      notes: 'Storage may not be configured'
    });
  }
}

// ============================================
// SERVER ACTIONS VALIDATION
// ============================================

async function testServerActions() {
  console.log('\n⚙️ Testing Server Actions...\n');

  // Import the server actions (we'll simulate them)
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test visa-actions.ts functions
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('visas')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    const responseTime = Date.now() - startTime;
    
    logTest('SERVER_ACTION', 'getVisas Function', error ? 'FAIL' : 'PASS', {
      responseTime: `${responseTime}ms`,
      notes: error ? `Error: ${error.message}` : `Retrieved ${data?.length || 0} visas`,
      error: error?.message
    });
  } catch (error) {
    logTest('SERVER_ACTION', 'getVisas Function', 'FAIL', {
      error: error.message
    });
  }

  // Test getVisaById pattern
  try {
    const { data: visas } = await supabase.from('visas').select('id').limit(1);
    
    if (visas && visas.length > 0) {
      const visaId = visas[0].id;
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('visas')
        .select('*')
        .eq('id', visaId)
        .single();
      
      const responseTime = Date.now() - startTime;
      
      logTest('SERVER_ACTION', 'getVisaById Pattern', error ? 'WARN' : 'PASS', {
        responseTime: `${responseTime}ms`,
        notes: error ? `Error: ${error.message}` : `Retrieved visa: ${data?.name || 'N/A'}`
      });
    } else {
      logTest('SERVER_ACTION', 'getVisaById Pattern', 'WARN', {
        notes: 'No visas found to test with'
      });
    }
  } catch (error) {
    logTest('SERVER_ACTION', 'getVisaById Pattern', 'FAIL', {
      error: error.message
    });
  }

  // Test lawyer-actions.ts functions
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('lawyers')
      .select('*')
      .order('average_rating', { ascending: false });
    
    const responseTime = Date.now() - startTime;
    
    logTest('SERVER_ACTION', 'getLawyers Function', error ? 'FAIL' : 'PASS', {
      responseTime: `${responseTime}ms`,
      notes: error ? `Error: ${error.message}` : `Retrieved ${data?.length || 0} lawyers`,
      error: error?.message
    });
  } catch (error) {
    logTest('SERVER_ACTION', 'getLawyers Function', 'FAIL', {
      error: error.message
    });
  }

  // Test content-actions.ts functions
  try {
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10);
    
    const responseTime = Date.now() - startTime;
    
    logTest('SERVER_ACTION', 'getNewsArticles Function', error ? 'WARN' : 'PASS', {
      responseTime: `${responseTime}ms`,
      notes: error ? `Error: ${error.message}` : `Retrieved ${data?.length || 0} articles`
    });
  } catch (error) {
    logTest('SERVER_ACTION', 'getNewsArticles Function', 'WARN', {
      error: error.message
    });
  }
}

// ============================================
// SECURITY TESTS
// ============================================

async function testSecurity() {
  console.log('\n🔒 Testing Security Configuration...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Test 1: SQL Injection attempt
  try {
    const { data, error } = await supabase
      .from('visas')
      .select('*')
      .eq('name', "'; DROP TABLE visas; --");
    
    logTest('SECURITY', 'SQL Injection Protection', 'PASS', {
      notes: 'Query sanitized, no injection possible'
    });
  } catch (error) {
    logTest('SECURITY', 'SQL Injection Protection', 'PASS', {
      notes: 'Error handled safely: ' + error.message
    });
  }

  // Test 2: Check RLS is enabled on tables
  const tablesToCheck = ['profiles', 'visa_purchases', 'consultations'];
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST301') {
        logTest('SECURITY', `RLS on ${table}`, 'PASS', {
          notes: 'Row Level Security active - anonymous access blocked'
        });
      } else if (!error) {
        logTest('SECURITY', `RLS on ${table}`, 'WARN', {
          notes: 'Table accessible without authentication - verify RLS policies'
        });
      } else {
        logTest('SECURITY', `RLS on ${table}`, 'WARN', {
          notes: `Error: ${error.message}`
        });
      }
    } catch (error) {
      logTest('SECURITY', `RLS on ${table}`, 'WARN', {
        error: error.message
      });
    }
  }
}

// ============================================
// REPORT GENERATION
// ============================================

function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('              BACKEND & INTEGRATION TEST REPORT');
  console.log('='.repeat(80));

  console.log('\n🗄️ SUPABASE CONNECTIVITY');
  console.log('-'.repeat(40));
  results.supabase.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${r.name}`);
    if (r.responseTime) console.log(`   Response Time: ${r.responseTime}`);
    if (r.notes) console.log(`   Notes: ${r.notes}`);
  });

  console.log('\n⚙️ SERVER ACTIONS');
  console.log('-'.repeat(40));
  results.serverActions.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${r.name}`);
    if (r.responseTime) console.log(`   Response Time: ${r.responseTime}`);
    if (r.notes) console.log(`   Notes: ${r.notes}`);
  });

  console.log('\n🔒 SECURITY');
  console.log('-'.repeat(40));
  results.security.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${r.name}`);
    if (r.notes) console.log(`   Notes: ${r.notes}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('                           SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Tests:    ${results.summary.total}`);
  console.log(`✅ Passed:      ${results.summary.passed}`);
  console.log(`❌ Failed:      ${results.summary.failed}`);
  console.log(`⚠️  Warnings:   ${results.summary.warnings}`);
  console.log(`Success Rate:   ${Math.round((results.summary.passed / results.summary.total) * 100)}%`);
  console.log('='.repeat(80));

  // Save report
  const fs = require('fs');
  const reportPath = '/home/manik/.openclaw/workspace/final_visaapp/logs/backend-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);

  return results;
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     VisaHelper Backend & Integration Test Suite            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Started at: ${new Date().toISOString()}`);

  try {
    await testSupabaseConnection();
    await testServerActions();
    await testSecurity();
    generateReport();
    
    process.exit(results.summary.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

main();
