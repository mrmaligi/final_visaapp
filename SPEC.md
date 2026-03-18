# VISA HELPER PLATFORM - COMPLETE SPECIFICATION
## Australian Visa Application Platform

**Version:** 1.0 FINAL  
**Date:** March 17, 2026  
**Status:** Ready for Development  

---

## EXECUTIVE SUMMARY

### Purpose
The Visa Helper Platform simplifies Australian visa applications by connecting applicants with immigration information, guided tools, and verified immigration lawyers through a freemium model.

### Core Value Proposition
- **For Users**: Affordable ($49/visa) guided application process with optional lawyer consultations
- **For Lawyers**: Client acquisition and practice management platform with transparent pricing
- **For Platform**: Dual revenue streams (visa unlocks + future lawyer commissions)

### Key Metrics
- **User Roles:** 4 (Anonymous, User, Lawyer, Admin)
- **Revenue Streams:** 2 (Visa unlocks $49 + Consultations variable)
- **Total Pages:** 55+
- **Database Tables:** 25+

---

## TECHNOLOGY STACK

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14 (React) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend & Database | Supabase (PostgreSQL + Auth + Storage) |
| Authentication | Supabase Auth (Google OAuth + Email/Password) |
| Payment Processing | Stripe Checkout |
| File Storage | Supabase Storage with RLS |
| Hosting | Vercel |

---

## USER ROLES

### 1. Anonymous Users (No Auth)
- Browse visa categories
- View basic visa information
- Access processing time tracker
- Read news articles
- View lawyer directory (public profiles)

### 2. Registered Users (Google OAuth)
- **Registration:** One-click Google sign-in
- **Profile:** Auto-created with email, name, photo
- **Premium:** Pay $49 to unlock visa content
- **Features:**
  - Multi-step application forms with tooltips
  - Document upload and management
  - Book lawyer consultations (30/60 min)
  - Track application progress
  - Rate and review lawyers

### 3. Lawyers (Email/Password + Verification)
- **Registration:** Detailed form + document upload
- **Verification:** Admin approval required
- **Features:**
  - Set hourly rates and availability
  - Manage consultations
  - View client documents (with permission)
  - Private client notes
  - Contribute to tracker (3x weight)
  - Reply to reviews

### 4. Admin (Pre-configured)
- Full platform access
- Lawyer verification queue
- Visa content management
- User management
- Platform analytics

---

## CORE FEATURES

### Visa Application Flow
1. Browse visa categories (6 categories)
2. View visa details (free content)
3. Pay $49 to unlock premium
4. Complete guided application form
5. Upload required documents
6. Book lawyer consultation (optional)
7. Track progress

### Lawyer Consultation Flow
1. Browse lawyer directory
2. View profiles, ratings, pricing
3. Select duration (30/60 min)
4. Choose available time slot
5. Pay via Stripe
6. Attend consultation
7. Leave review

### Payment Structure

| Item | Price | Who Pays | Revenue Split |
|------|-------|----------|---------------|
| Visa Premium Unlock | $49 USD | User | 100% Platform |
| Consultation (30 min) | $75-150 | User | 100% Lawyer (MVP) |
| Consultation (60 min) | $150-300 | User | 100% Lawyer (MVP) |

**Future:** Stripe Connect with 15% platform commission

---

## DATABASE SCHEMA (25+ Tables)

### Core Tables
- **users** - Extended auth profiles
- **lawyers** - Lawyer profiles + verification
- **visas** - Visa types (6 categories)
- **visa_premium_content** - Dynamic forms + guides
- **visa_purchases** - Payment records
- **user_documents** - Uploaded files
- **user_application_data** - Form responses
- **consultations** - Booking records
- **reviews** - Lawyer ratings
- **lawyer_pricing** - Hourly rates
- **lawyer_notes** - Private client notes
- **tracker_entries** - Processing times
- **news_articles** - Content
- **news_comments** - Discussion

### Security
- Row Level Security (RLS) on ALL tables
- Storage bucket policies
- JWT authentication
- Role-based access

---

## PAGES (55+ Total)

### Public Pages (8)
1. Landing Page
2. Visa Categories
3. Visa Detail
4. Tracker
5. News Feed
6. News Article
7. Lawyer Directory
8. Lawyer Profile

### Auth Pages (6)
1. Sign In
2. Sign Up (User)
3. Lawyer Sign Up
4. Verification Pending
5. Forgot Password
6. Reset Password

### User Pages (15)
1. Dashboard
2. My Visas
3. Visa Checkout
4. Checkout Success
5. Premium Application Form
6. Documents
7. Consultations
8. Book Consultation
9. Booking Success
10. Profile Settings
11. Security
12. Notifications
13. Billing
14. Privacy
15. Activity

### Lawyer Pages (12)
1. Dashboard
2. Clients
3. Client Detail
4. Consultations
5. Pricing
6. Reviews
7. Profile Settings
8. Credentials
9. Availability
10. Tracker Contribution
11. News Comments

### Admin Pages (14)
1. Dashboard
2. Lawyers Management
3. Lawyer Verification
4. Users Management
5. User Detail
6. Visas Management
7. Visa Editor
8. Premium Content Editor
9. News Management
10. Article Editor
11. Tracker Management
12. Settings

---

## STRIPE INTEGRATION

### Visa Purchase Checkout
```javascript
const session = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${visa.name} (Subclass ${visa.subclass}) - Premium Access`
      },
      unit_amount: 4900 // $49.00
    },
    quantity: 1
  }],
  mode: 'payment',
  success_url: `${base_url}/visas/${visa_id}/success`,
  cancel_url: `${base_url}/visas/${visa_id}`,
  metadata: { user_id: user.id, visa_id: visa_id, purchase_type: 'visa_unlock' }
});
```

### Webhook Handler
```javascript
if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  await supabase.from('visa_purchases').insert({
    user_id: session.metadata.user_id,
    visa_id: session.metadata.visa_id,
    stripe_payment_intent_id: session.payment_intent,
    amount_paid: session.amount_total / 100,
    access_status: 'active'
  });
}
```

---

## ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ysfwurlzkihgezfegfog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## DEVELOPMENT PHASES

### Phase 1: MVP (8-12 weeks)
- User auth (Google OAuth)
- Visa browsing + $49 unlock
- Premium forms + document upload
- Tracker + News
- Admin panel

### Phase 2: Lawyer Integration (6-8 weeks)
- Lawyer registration + verification
- Consultation booking + payments
- Lawyer dashboard
- Reviews system

### Phase 3: Advanced Features
- Stripe Connect
- Mobile app
- AI document checking
- Multi-language

---

## SECURITY & COMPLIANCE

### Authentication
- Google OAuth + JWT tokens
- 7-day token expiry
- HTTPS only

### Document Security
- Supabase Storage with RLS
- User isolation
- Signed URLs (15-min expiry)
- File validation (PDF, JPG, PNG, DOCX, max 10MB)

### Payment Security
- PCI DSS via Stripe
- Webhook signature verification
- Idempotency keys

### Data Privacy (GDPR)
- Cookie consent banner
- Data export functionality
- Right to deletion
- Anonymized analytics

### Application Security
- Input validation
- SQL injection prevention
- XSS prevention (React)
- CSRF protection
- Rate limiting (100 req/min)

---

## NEXT STEPS

1. ✅ Database deployed to Supabase
2. ✅ UI designs generated in Stitch
3. 🔄 Jules building complete application
4. ⏳ Review PR when ready
5. ⏳ Deploy to Vercel
6. ⏳ Configure production Stripe keys

---

## PROJECT LINKS

- **Repository:** https://github.com/mrmaligi/final_visaapp
- **Database:** https://ysfwurlzkihgezfegfog.supabase.co
- **Designs:** `/designs/` folder in repo
- **Jules Session:** #1513255081816887201

---

*This specification is FINAL and COMPLETE. All features, pages, and database schema are documented and ready for implementation.*
