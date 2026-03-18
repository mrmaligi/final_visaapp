# VISA HELPER PLATFORM - PROJECT SPECIFICATION
## Complete Application Documentation

---

## PROJECT OVERVIEW

**Name:** Visa Helper Platform  
**Repository:** https://github.com/mrmaligi/final_visaapp  
**Database:** Supabase (PostgreSQL)  
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe  

---

## ARCHITECTURE

### Frontend
- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components with Tailwind
- **State Management:** React hooks + Supabase realtime

### Backend
- **API Routes:** Next.js API routes
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth (Google OAuth + Email)
- **File Storage:** Supabase Storage
- **Payments:** Stripe Checkout
- **Realtime:** Supabase Realtime subscriptions

---

## USER ROLES

### 1. Anonymous Users
- Browse visa categories
- View basic visa information
- Access processing time tracker
- Read news articles
- View lawyer directory

### 2. Registered Users
- Google OAuth authentication
- Purchase visa premium access ($49)
- Complete multi-step application forms
- Upload and manage documents
- Book lawyer consultations
- Track application progress
- Rate and review lawyers

### 3. Lawyers
- Email/password registration
- Verification process (admin approval)
- Set hourly rates and availability
- Manage consultations
- View client documents (with permission)
- Add private client notes
- Contribute to tracker data

### 4. Admin
- Full platform access
- Lawyer verification queue
- Visa content management
- User management
- Platform settings
- Analytics and reports

---

## CORE FEATURES

### Visa Application Flow
1. Browse visa categories
2. View visa details (free content)
3. Pay $49 to unlock premium
4. Complete guided application form
5. Upload required documents
6. Book lawyer consultation (optional)
7. Track progress

### Lawyer Consultation Flow
1. Browse lawyer directory
2. View lawyer profiles and reviews
3. Select consultation duration (30/60 min)
4. Choose available time slot
5. Pay via Stripe
6. Attend consultation (video/link)
7. Leave review

### Tracker System
- Community-contributed processing times
- Weighted data (lawyer submissions = 3x)
- Filter by visa type, date, outcome
- Statistics and trends

---

## DATABASE SCHEMA (25+ Tables)

### Core Tables
- **users** - Extended auth profiles
- **lawyers** - Lawyer profiles and verification
- **visas** - Visa types and categories
- **visa_premium_content** - Dynamic forms and guides
- **visa_purchases** - Payment records
- **user_documents** - Uploaded files
- **user_application_data** - Form responses
- **consultations** - Booking records
- **reviews** - Lawyer ratings
- **tracker_entries** - Processing time data
- **news_articles** - Content management
- **news_comments** - Community discussion

### Security
- Row Level Security (RLS) on all tables
- Storage bucket policies
- JWT-based authentication
- Role-based access control

---

## PAGES (55+ Total)

### Public Pages (8)
- Landing Page
- Visa Categories
- Visa Detail
- Tracker
- News Feed
- News Article
- Lawyer Directory
- Lawyer Profile

### Auth Pages (6)
- Sign In
- Sign Up (User)
- Lawyer Sign Up
- Verification Pending
- Forgot Password
- Reset Password

### User Pages (15)
- Dashboard
- My Visas
- Visa Checkout
- Checkout Success
- Premium Application Form
- Documents
- Consultations
- Book Consultation
- Booking Success
- Profile Settings
- Security
- Notifications
- Billing
- Privacy

### Lawyer Pages (12)
- Dashboard
- Clients
- Client Detail
- Consultations
- Pricing
- Reviews
- Profile Settings
- Credentials
- Availability
- Tracker Contribution
- News Comments

### Admin Pages (14)
- Dashboard
- Lawyers Management
- Lawyer Verification
- Users Management
- User Detail
- Visas Management
- Visa Editor
- Premium Content Editor
- News Management
- Article Editor
- Tracker Management
- Settings

---

## PAYMENT STRUCTURE

### Revenue Streams
1. **Visa Premium Unlock** - $49 per visa (100% to platform)
2. **Lawyer Consultations** - Variable (100% to lawyer in MVP)

### Future: Stripe Connect
- Platform commission: 15%
- Automatic payouts to lawyers

---

## DESIGN SYSTEM

### Colors
- Primary: Blue (#0052cc)
- Background: White/Light gray
- Text: Dark gray
- Success: Green
- Warning: Yellow
- Error: Red

### Typography
- Headlines: Inter, semi-bold
- Body: Inter, regular
- Labels: Inter, medium

### Components
- Buttons: Rounded, primary/secondary/outline
- Cards: Shadow, rounded corners
- Forms: Labels, tooltips, validation
- Badges: Status indicators
- Modals: Overlays, confirmations

---

## API INTEGRATION

### Supabase
- Authentication
- Database queries
- Realtime subscriptions
- File storage

### Stripe
- Checkout sessions
- Payment webhooks
- Refund handling (future)

---

## ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=
```

---

## DEVELOPMENT WORKFLOW

1. **Database** ✅ Complete schema deployed
2. **Designs** ✅ Stitch UI designs generated
3. **Code** 🔄 Jules building application
4. **Review** → PR review and merge
5. **Deploy** → Vercel + Supabase

---

## SESSIONS

### Jules Session
- **ID:** 1513255081816887201
- **Status:** Building complete application
- **Auto-PR:** Enabled

### Stitch Project
- **ID:** 15348568488048061051
- **Screens:** 5+ generated
- **Designs:** Located in `/designs/`

---

## NEXT STEPS

1. Monitor Jules session progress
2. Review generated PR
3. Test application locally
4. Configure production environment
5. Deploy to Vercel

---

## SUPPORT

- **Database:** Supabase Dashboard
- **Designs:** Stitch Project
- **Code:** GitHub PR
- **Deployment:** Vercel

---

*This specification is FINAL and COMPLETE. All features, pages, and database schema are documented.*
