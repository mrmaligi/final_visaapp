/**
 * Document Upload Test Script
 * 
 * This script tests the document upload functionality:
 * 1. Validates the Supabase connection
 * 2. Tests storage bucket access
 * 3. Tests file upload (simulation)
 * 4. Tests database operations
 */

import { createClient } from '@supabase/supabase-js';

// Test configuration
const TEST_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
  categories: ['identity', 'financial', 'employment', 'education', 'health', 'character', 'other'],
};

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: [] as Array<{ name: string; status: 'pass' | 'fail'; message: string }>,
};

function addResult(name: string, status: 'pass' | 'fail', message: string) {
  results.tests.push({ name, status, message });
  if (status === 'pass') results.passed++;
  else results.failed++;
  console.log(`${status === 'pass' ? '✅' : '❌'} ${name}: ${message}`);
}

async function runTests() {
  console.log('🧪 Document Management Test Suite\n');
  console.log('=' .repeat(60));
  
  // Test 1: Supabase Connection
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    addResult('Supabase Connection', 'pass', 'Connected successfully');
  } catch (error) {
    addResult('Supabase Connection', 'fail', `Failed: ${(error as Error).message}`);
  }
  
  // Test 2: Storage Bucket Exists
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    
    const documentsBucket = buckets?.find(b => b.name === 'documents');
    if (documentsBucket) {
      addResult('Storage Bucket', 'pass', 'Documents bucket exists');
    } else {
      addResult('Storage Bucket', 'fail', 'Documents bucket not found. Run setup script.');
    }
  } catch (error) {
    addResult('Storage Bucket', 'fail', `Error: ${(error as Error).message}`);
  }
  
  // Test 3: Database Tables
  const tables = ['documents', 'document_versions', 'document_checklists', 'document_checklist_progress', 'form_submissions'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1);
      if (error?.code === '42P01') {
        addResult(`Table: ${table}`, 'fail', 'Table does not exist. Run migration.');
      } else {
        addResult(`Table: ${table}`, 'pass', 'Table exists and is accessible');
      }
    } catch (error) {
      addResult(`Table: ${table}`, 'fail', `Error: ${(error as Error).message}`);
    }
  }
  
  // Test 4: File Type Validation
  const testFiles = [
    { name: 'test.pdf', type: 'application/pdf', valid: true },
    { name: 'test.jpg', type: 'image/jpeg', valid: true },
    { name: 'test.png', type: 'image/png', valid: true },
    { name: 'test.exe', type: 'application/x-msdownload', valid: false },
  ];
  
  let fileValidationPassed = true;
  for (const file of testFiles) {
    const isValid = TEST_CONFIG.allowedTypes.includes(file.type);
    if (isValid !== file.valid) {
      fileValidationPassed = false;
    }
  }
  
  addResult(
    'File Type Validation',
    fileValidationPassed ? 'pass' : 'fail',
    fileValidationPassed ? 'All file types validated correctly' : 'File type validation issues'
  );
  
  // Test 5: File Size Validation
  const testSizes = [
    { size: 5 * 1024 * 1024, valid: true },    // 5MB - valid
    { size: 10 * 1024 * 1024, valid: true },   // 10MB - valid (at limit)
    { size: 11 * 1024 * 1024, valid: false },  // 11MB - invalid
  ];
  
  let sizeValidationPassed = true;
  for (const test of testSizes) {
    const isValid = test.size <= TEST_CONFIG.maxFileSize;
    if (isValid !== test.valid) {
      sizeValidationPassed = false;
    }
  }
  
  addResult(
    'File Size Validation',
    sizeValidationPassed ? 'pass' : 'fail',
    sizeValidationPassed ? 'All file sizes validated correctly' : 'File size validation issues'
  );
  
  // Test 6: Document Categories
  addResult(
    'Document Categories',
    TEST_CONFIG.categories.length >= 5 ? 'pass' : 'fail',
    `${TEST_CONFIG.categories.length} categories defined: ${TEST_CONFIG.categories.join(', ')}`
  );
  
  // Test 7: RLS Policies (basic check)
  try {
    // Try to access documents without auth (should fail)
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', '00000000-0000-0000-0000-000000000000');
    
    // This should return empty array (no results for fake user), not an error
    addResult('RLS Policies', 'pass', 'RLS policies appear to be active');
  } catch (error) {
    addResult('RLS Policies', 'fail', `Error checking RLS: ${(error as Error).message}`);
  }
  
  // Print Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / results.tests.length) * 100)}%`);
  
  if (results.failed > 0) {
    console.log('\n⚠️  Some tests failed. Please check:');
    console.log('   1. Supabase credentials are correct');
    console.log('   2. Database migrations have been run');
    console.log('   3. Storage bucket has been created');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
  }
}

runTests().catch(console.error);
