# VISA HELPER PLATFORM - PHASED DEVELOPMENT PLAN
## Fresh Start with Automated Testing & Cron Jobs

**Date:** March 18, 2026  
**Status:** PHASE 1 READY TO START  
**Previous Sessions:** Stopped (Jules #1513255081816887201 archived)

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    VISA HELPER PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Core Foundation                                   │
│  Phase 2: User Features                                     │
│  Phase 3: Lawyer Features                                   │
│  Phase 4: Admin & Polish                                    │
├─────────────────────────────────────────────────────────────┤
│  Testing: Playwright E2E + Unit Tests                       │
│  Automation: Cron jobs for maintenance                      │
└─────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: CORE FOUNDATION (Week 1)

### 1.1 Project Setup
- [ ] Initialize Next.js 14 with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up Supabase client
- [ ] Set up environment variables
- [ ] Configure ESLint + Prettier

### 1.2 Database Connection
- [ ] Verify Supabase connection
- [ ] Test RLS policies
- [ ] Create database types

### 1.3 Authentication
- [ ] Google OAuth setup
- [ ] Email/Password auth
- [ ] Auth context/provider
- [ ] Protected routes middleware

### 1.4 Layout & Navigation
- [ ] Root layout with providers
- [ ] Header component
- [ ] Footer component
- [ ] Mobile navigation

### 1.5 Public Pages
- [ ] Landing page
- [ ] About page
- [ ] Contact page
- [ ] FAQ page

### Deliverables
- Working authentication flow
- Responsive layout
- Public pages live

---

## PHASE 2: USER FEATURES (Week 2-3)

### 2.1 Visa Browsing
- [ ] Visa categories page
- [ ] Visa detail page (free content)
- [ ] Search & filters
- [ ] Tracker page (read-only)

### 2.2 Payments
- [ ] Stripe integration
- [ ] Checkout page
- [ ] Payment success/cancel
- [ ] Webhook handlers

### 2.3 Premium Content
- [ ] Application form builder
- [ ] Document upload
- [ ] Progress tracking
- [ ] PDF export

### 2.4 User Dashboard
- [ ] Dashboard home
- [ ] My visas page
- [ ] Documents management
- [ ] Profile settings

### Deliverables
- Full user journey working
- Payments processing
- Document upload functional

---

## PHASE 3: LAWYER FEATURES (Week 4-5)

### 3.1 Lawyer Registration
- [ ] Lawyer signup form
- [ ] Document upload for verification
- [ ] Pending verification page

### 3.2 Lawyer Dashboard
- [ ] Dashboard home
- [ ] Client management
- [ ] Consultation management
- [ ] Availability calendar

### 3.3 Consultations
- [ ] Booking flow
- [ ] Payment for consultations
- [ ] Video/meeting integration
- [ ] Review system

### 3.4 Lawyer Public Profile
- [ ] Public profile page
- [ ] Reviews display
- [ ] Booking widget

### Deliverables
- Lawyer verification flow
- Consultation booking working
- Review system live

---

## PHASE 4: ADMIN & POLISH (Week 6)

### 4.1 Admin Dashboard
- [ ] Admin authentication
- [ ] Metrics overview
- [ ] User management
- [ ] Lawyer verification queue

### 4.2 Content Management
- [ ] Visa management
- [ ] News management
- [ ] Premium content editor

### 4.3 Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Plausible/GA)
- [ ] Cron job for maintenance

### 4.4 Final Polish
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Accessibility audit

### Deliverables
- Complete admin panel
- Production-ready app

---

## TESTING STRATEGY

### Unit Tests (Jest)
```
tests/unit/
├── components/
├── utils/
├── hooks/
└── api/
```

### E2E Tests (Playwright)
```
tests/e2e/
├── auth.spec.ts
├── visa-browsing.spec.ts
├── payments.spec.ts
├── lawyer-flow.spec.ts
└── admin.spec.ts
```

### Test Coverage Goals
- Unit: 70%+
- E2E: Critical paths covered

---

## CRON JOBS

### Daily (2 AM)
- [ ] Cleanup expired sessions
- [ ] Generate daily reports
- [ ] Backup database

### Weekly (Sunday 3 AM)
- [ ] Update visa processing time statistics
- [ ] Generate weekly analytics
- [ ] Cleanup old temp files

### Monthly (1st of month)
- [ ] Generate revenue reports
- [ ] Update lawyer ratings
- [ ] Archive old consultations

---

## FOLDER STRUCTURE

```
final_visaapp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   ├── (dashboard)/              # Dashboard group
│   ├── (public)/                 # Public pages
│   ├── admin/                    # Admin routes
│   ├── api/                      # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                       # Base UI components
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout components
│   └── features/                 # Feature components
├── lib/
│   ├── supabase/                 # Supabase client
│   ├── stripe/                   # Stripe client
│   ├── utils/                    # Utilities
│   └── constants/                # Constants
├── hooks/                        # Custom hooks
├── types/                        # TypeScript types
├── tests/
│   ├── unit/                     # Jest tests
│   └── e2e/                      # Playwright tests
├── cron/                         # Cron job scripts
├── docs/                         # Documentation
└── scripts/                      # Build/deploy scripts
```

---

## NEXT ACTIONS

1. **STOP** current Jules session (archived)
2. **CLEAN** project folder (keep designs/specs)
3. **INIT** fresh Next.js project
4. **SETUP** testing framework
5. **CONFIGURE** cron jobs
6. **START** Phase 1

Ready to execute Phase 1?