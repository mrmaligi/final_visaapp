# DAY 2 SPRINT - USER FEATURES + PAYMENTS
## Date: March 18, 2026 (Continuing same day)

---

## HOUR 1-2: VISA BROWSING

### Tasks:
1. **Visa Categories Page** (`/visas`)
   - Grid of 6 visa categories
   - Search bar
   - Filter by category
   - Sort options

2. **Visa Detail Page** (`/visas/[id]`)
   - Hero with visa name/subclass
   - Quick facts (processing time, fee)
   - Tab navigation
   - Premium unlock CTA
   - Lawyer section

3. **Visa Card Component**
   - Reusable card for visa listings
   - Shows name, subclass, description
   - Processing time badge
   - Price badge

---

## HOUR 3-4: STRIPE PAYMENTS

### Tasks:
1. **Stripe Setup**
   - Install stripe package
   - Configure API keys
   - Create checkout session endpoint

2. **Checkout Page** (`/visas/[id]/checkout`)
   - Order summary
   - Stripe Elements
   - Payment form
   - Security badges

3. **Success/Cancel Pages**
   - Payment success confirmation
   - Payment cancel handling
   - Redirect logic

4. **Webhook Handler**
   - Stripe webhook endpoint
   - Create visa_purchase record
   - Grant access

---

## HOUR 5-6: USER DASHBOARD

### Tasks:
1. **Dashboard Home** (`/user/dashboard`)
   - Welcome message
   - Stats cards (applications, documents, consultations)
   - Recent applications list
   - Quick actions

2. **My Visas Page** (`/user/visas`)
   - List of purchased visas
   - Progress indicators
   - Continue application buttons

3. **Documents Page** (`/user/documents`)
   - Document upload interface
   - File list with categories
   - Delete/replace functionality

---

## HOUR 7-8: APPLICATION FORMS

### Tasks:
1. **Premium Form Page** (`/visas/[id]/premium`)
   - Multi-step form layout
   - Progress sidebar
   - Form sections (Personal, Travel, Employment, Documents)
   - Auto-save functionality

2. **Form Components**
   - Text input with tooltips
   - Date picker
   - Select dropdown
   - File upload
   - Textarea

3. **Document Upload**
   - Drag and drop zone
   - Category selection
   - Progress indicator
   - File preview

---

## DELIVERABLES

By end of Day 2:
- ✅ Visa browsing works
- ✅ Payments process ($49 unlock)
- ✅ User dashboard shows data
- ✅ Application forms save progress
- ✅ Document upload functional

---

## AGENTS TO SPAWN

1. **Visa Pages Agent** - Build browsing pages
2. **Stripe Agent** - Payment integration
3. **Dashboard Agent** - User dashboard
4. **Forms Agent** - Application forms + upload

---

## STARTING NOW