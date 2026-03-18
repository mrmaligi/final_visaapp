import { test, expect } from '@playwright/test';

const publicPages = [
  { path: '/', name: 'Landing' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact' },
  { path: '/faq', name: 'FAQ' },
  { path: '/visas', name: 'Visas List' },
  { path: '/visas/123e4567-e89b-12d3-a456-426614174000', name: 'Visa Detail' },
  { path: '/lawyers', name: 'Lawyers List' },
  { path: '/lawyers/123e4567-e89b-12d3-a456-426614174000', name: 'Lawyer Detail' },
  { path: '/news', name: 'News List' },
  { path: '/tracker', name: 'Processing Tracker' },
  { path: '/legal/privacy', name: 'Privacy Policy' },
  { path: '/legal/terms', name: 'Terms of Service' },
];

const authPages = [
  { path: '/auth/signin', name: 'Sign In' },
  { path: '/auth/signup', name: 'Sign Up' },
  { path: '/auth/forgot-password', name: 'Forgot Password' },
  { path: '/auth/reset-password', name: 'Reset Password' },
];

const userPages = [
  { path: '/user/dashboard', name: 'User Dashboard' },
  { path: '/user/visas', name: 'My Visas' },
  { path: '/user/documents', name: 'Documents' },
  { path: '/user/consultations', name: 'Consultations' },
  { path: '/user/settings', name: 'User Settings' },
];

const lawyerPages = [
  { path: '/lawyer/dashboard', name: 'Lawyer Dashboard' },
  { path: '/lawyer/clients', name: 'Lawyer Clients' },
  { path: '/lawyer/consultations', name: 'Lawyer Consultations' },
  { path: '/lawyer/pricing', name: 'Lawyer Pricing' },
  { path: '/lawyer/reviews', name: 'Lawyer Reviews' },
  { path: '/lawyers/signup', name: 'Lawyer Signup' },
  { path: '/lawyers/pending-verification', name: 'Pending Verification' },
];

const adminPages = [
  { path: '/admin/dashboard', name: 'Admin Dashboard' },
  { path: '/admin/visas', name: 'Admin Visas' },
  { path: '/admin/lawyers', name: 'Admin Lawyers' },
  { path: '/admin/users', name: 'Admin Users' },
  { path: '/admin/news', name: 'Admin News' },
  { path: '/admin/tracker', name: 'Admin Tracker' },
  { path: '/admin/settings', name: 'Admin Settings' },
];

test.describe('Public Pages', () => {
  for (const page of publicPages) {
    test(`${page.name} loads without errors`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBeLessThan(500);
      
      // Check for React error overlay
      const errorOverlay = await p.$('[data-nextjs-dialog-overlay]');
      expect(errorOverlay).toBeNull();
      
      // Check for common error messages
      const bodyText = await p.$eval('body', el => el.textContent);
      expect(bodyText).not.toContain('Application error');
      expect(bodyText).not.toContain('Internal Server Error');
    });
  }
});

test.describe('Auth Pages', () => {
  for (const page of authPages) {
    test(`${page.name} loads without errors`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBeLessThan(500);
      
      const errorOverlay = await p.$('[data-nextjs-dialog-overlay]');
      expect(errorOverlay).toBeNull();
    });
  }
});

test.describe('User Pages', () => {
  for (const page of userPages) {
    test(`${page.name} loads without errors`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBeLessThan(500);
      
      const errorOverlay = await p.$('[data-nextjs-dialog-overlay]');
      expect(errorOverlay).toBeNull();
    });
  }
});

test.describe('Lawyer Pages', () => {
  for (const page of lawyerPages) {
    test(`${page.name} loads without errors`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBeLessThan(500);
      
      const errorOverlay = await p.$('[data-nextjs-dialog-overlay]');
      expect(errorOverlay).toBeNull();
    });
  }
});

test.describe('Admin Pages', () => {
  for (const page of adminPages) {
    test(`${page.name} loads without errors`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBeLessThan(500);
      
      const errorOverlay = await p.$('[data-nextjs-dialog-overlay]');
      expect(errorOverlay).toBeNull();
    });
  }
});
