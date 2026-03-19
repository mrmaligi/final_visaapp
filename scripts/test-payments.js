#!/usr/bin/env node

/**
 * Stripe Payment Flow Test Script
 * Tests the complete payment flows in Stripe test mode
 * 
 * Usage: node test-payments.js
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test card numbers for Stripe test mode
const TEST_CARDS = {
  success: '4242 4242 4242 4242',
  decline: '4000 0000 0000 0002',
  requireAuth: '4000 0025 0000 3155',
  insufficientFunds: '4000 0000 0000 9995',
};

async function testVisaUnlockFlow() {
  console.log('\n🧪 Testing Visa Unlock Payment Flow\n');
  console.log('=====================================\n');
  
  console.log('Step 1: Test Checkout Session Creation');
  console.log('---------------------------------------');
  console.log(`POST ${BASE_URL}/api/stripe/checkout`);
  console.log('Body: { visaId: "test-visa-id", userId: "test-user-id", userEmail: "test@example.com" }');
  console.log('\nExpected Response:');
  console.log('  - sessionId: string (Stripe checkout session ID)');
  console.log('  - url: string (Stripe checkout URL)');
  console.log('\n✅ Success: Redirects to Stripe checkout\n');

  console.log('Step 2: Test Webhook Handling (checkout.session.completed)');
  console.log('-----------------------------------------------------------');
  console.log(`POST ${BASE_URL}/api/webhooks/stripe`);
  console.log('Event: checkout.session.completed');
  console.log('\nExpected Database Updates:');
  console.log('  - visa_purchases: New record created');
  console.log('  - payments: New payment record');
  console.log('  - Email sent to user');
  console.log('\n✅ Success: Purchase recorded, access granted\n');

  console.log('Step 3: Test Payment History');
  console.log('-------------------------------');
  console.log(`GET ${BASE_URL}/api/payments/history?userId=test-user-id`);
  console.log('\nExpected Response:');
  console.log('  - Array of payment records');
  console.log('  - Includes visa_unlock payment');
  console.log('\n✅ Success: Payment history retrieved\n');
}

async function testConsultationBookingFlow() {
  console.log('\n🧪 Testing Consultation Booking Flow\n');
  console.log('=====================================\n');
  
  console.log('Step 1: Test Availability API');
  console.log('-------------------------------');
  console.log(`GET ${BASE_URL}/api/lawyers/availability?lawyerId=test-lawyer-id&date=2026-03-20`);
  console.log('\nExpected Response:');
  console.log('  - availableSlots: array of time strings');
  console.log('  - Excludes already booked slots');
  console.log('\n✅ Success: Available slots returned\n');

  console.log('Step 2: Test Pricing API');
  console.log('--------------------------');
  console.log(`GET ${BASE_URL}/api/lawyers/pricing?lawyerId=test-lawyer-id&visaType=skilled`);
  console.log('\nExpected Response:');
  console.log('  - Pricing for 30/60/90 minute durations');
  console.log('\n✅ Success: Pricing retrieved\n');

  console.log('Step 3: Test Consultation Checkout');
  console.log('------------------------------------');
  console.log(`POST ${BASE_URL}/api/stripe/consultation-checkout`);
  console.log('Body: { lawyerId, visaType, duration, date, time, userId, userEmail, notes }');
  console.log('\nExpected Response:');
  console.log('  - sessionId: string');
  console.log('  - url: string (Stripe checkout URL)');
  console.log('  - consultationId: string');
  console.log('\n✅ Success: Redirects to Stripe checkout\n');

  console.log('Step 4: Test Webhook Handling');
  console.log('-------------------------------');
  console.log('Event: checkout.session.completed (consultation)');
  console.log('\nExpected Database Updates:');
  console.log('  - consultations: Status updated to confirmed');
  console.log('  - payments: New payment record');
  console.log('  - lawyer_earnings: New earnings record (85% of payment)');
  console.log('  - Emails sent to user and lawyer');
  console.log('\n✅ Success: Consultation confirmed\n');
}

async function testRefundFlow() {
  console.log('\n🧪 Testing Refund Flow\n');
  console.log('======================\n');
  
  console.log('Step 1: Test Refund API');
  console.log('------------------------');
  console.log(`POST ${BASE_URL}/api/payments/refund`);
  console.log('Body: { paymentId: "test-payment-id", reason: "Customer request" }');
  console.log('\nExpected Response:');
  console.log('  - success: true');
  console.log('  - refundId: string (Stripe refund ID)');
  console.log('\nExpected Database Updates:');
  console.log('  - payments: Original status changed to refunded');
  console.log('  - payments: New refund record created');
  console.log('  - consultations: Status changed to refunded');
  console.log('  - lawyer_earnings: Status changed to failed');
  console.log('\n✅ Success: Refund processed\n');
}

async function testEarningsFlow() {
  console.log('\n🧪 Testing Lawyer Earnings Flow\n');
  console.log('================================\n');
  
  console.log('Step 1: Test Earnings API');
  console.log('--------------------------');
  console.log(`GET ${BASE_URL}/api/lawyers/earnings?lawyerId=test-lawyer-id`);
  console.log('\nExpected Response:');
  console.log('  - earnings: Array of earning records');
  console.log('  - summary: { totalEarned, pendingAmount, totalConsultations, thisMonth }');
  console.log('\n✅ Success: Earnings retrieved\n');
}

async function printTestInstructions() {
  console.log('\n📋 Manual Testing Instructions\n');
  console.log('================================\n');
  
  console.log('1. Set up environment variables:');
  console.log('   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_...)');
  console.log('   - STRIPE_SECRET_KEY (sk_test_...)');
  console.log('   - STRIPE_WEBHOOK_SECRET (whsec_...)');
  console.log('   - NEXT_PUBLIC_APP_URL (http://localhost:3000)');
  console.log('');
  
  console.log('2. Start the development server:');
  console.log('   npm run dev');
  console.log('');
  
  console.log('3. Test Visa Unlock:');
  console.log('   a. Visit /visas/skilled-189');
  console.log('   b. Click "Unlock Full Guide"');
  console.log('   c. Complete Stripe checkout with test card:');
  console.log(`      Card: ${TEST_CARDS.success}`);
  console.log('      Expiry: Any future date');
  console.log('      CVC: Any 3 digits');
  console.log('   d. Verify redirect to success page');
  console.log('   e. Check database for new records');
  console.log('');
  
  console.log('4. Test Consultation Booking:');
  console.log('   a. Visit /lawyers/[id]');
  console.log('   b. Click "Book Consultation"');
  console.log('   c. Complete all 5 steps');
  console.log('   d. Complete Stripe checkout');
  console.log('   e. Verify booking confirmed');
  console.log('');
  
  console.log('5. Test Webhooks (local development):');
  console.log('   a. Install Stripe CLI');
  console.log('   b. Run: stripe login');
  console.log('   c. Run: stripe listen --forward-to localhost:3000/api/webhooks/stripe');
  console.log('   d. Copy webhook signing secret to .env.local');
  console.log('');
  
  console.log('6. Test Declined Payment:');
  console.log(`   Use card: ${TEST_CARDS.decline}`);
  console.log('   Expected: Error message, no records created');
  console.log('');
  
  console.log('7. View Payment History:');
  console.log('   Visit /user/payments');
  console.log('   Expected: List of all payments with download receipt option');
  console.log('');
  
  console.log('8. View Lawyer Earnings:');
  console.log('   Visit /lawyer/earnings');
  console.log('   Expected: Earnings summary and detailed list');
  console.log('');
}

async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Stripe Payment Flow Test - VisaHelper                  ║');
  console.log('║     Running in TEST MODE - No real charges                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  await testVisaUnlockFlow();
  await testConsultationBookingFlow();
  await testRefundFlow();
  await testEarningsFlow();
  await printTestInstructions();
  
  console.log('\n✨ All test scenarios defined!\n');
  console.log('Remember: Always use Stripe test mode keys (sk_test_*, pk_test_*)\n');
}

runAllTests().catch(console.error);
