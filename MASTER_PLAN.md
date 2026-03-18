# VISA HELPER PLATFORM - MASTER IMPLEMENTATION PLAN
## Complete Phased Development with Agent Assignments

**Project:** final_visaapp  
**Repository:** https://github.com/mrmaligi/final_visaapp  
**Database:** Supabase (https://ysfwurlzkihgezfegfog.supabase.co)  
**Started:** March 18, 2026

---

## APPLICATION OVERVIEW

### What is Visa Helper Platform?
An Australian visa application platform that simplifies immigration by connecting applicants with:
- **Guided visa applications** - Step-by-step forms with tooltips ($49 per visa)
- **Document management** - Upload and organize required documents
- **Immigration lawyers** - Book consultations (30/60 min, variable pricing)
- **Processing time tracker** - Community-contributed visa statistics
- **Immigration news** - Policy updates and expert insights

### Revenue Model
- **Visa Premium Unlock:** $49 USD (one-time per visa) → 100% to platform
- **Lawyer Consultations:** $75-300 USD (30-60 min) → 100% to lawyer (MVP)

### User Roles
1. **Anonymous** - Browse visas, tracker, news
2. **User** (Google OAuth) - Premium access, document upload, lawyer booking
3. **Lawyer** (Email + verification) - Client management, consultations
4. **Admin** - Full platform management

---

## PHASE BREAKDOWN

### PHASE 1: FOUNDATION (Week 1)
**Goal:** Core infrastructure, layouts, auth, public pages

**Agents:** Build, Design, DB

| # | Task | Agent | Status | Files |
|---|------|-------|--------|-------|
| 1.1 | Header component | Build | ✅ Done | Header.tsx |
| 1.2 | Design tokens | Design | ✅ Done | design-tokens.ts |
| 1.3 | Footer component | Build | ⏳ TODO | Footer.tsx |
| 1.4 | UI components (Button, Card, Input, Badge) | Build | ⏳ TODO | ui/*.tsx |
| 1.5 | Landing page | Build+Design | ⏳ TODO | page.tsx |
| 1.6 | About page | Build | ⏳ TODO | about/page.tsx |
| 1.7 | Contact page | Build | ⏳ TODO | contact/page.tsx |
| 1.8 | FAQ page | Build | ⏳ TODO | faq/page.tsx |
| 1.9 | Auth (Sign In/Sign Up) | Build | ⏳ TODO | auth/*.tsx |
| 1.10 | Supabase auth integration | Build+DB | ⏳ TODO | middleware.ts, providers |

**Deliverable:** Working auth, responsive public pages

---

### PHASE 2: USER FEATURES (Week 2-3)
**Goal:** Visa browsing, payments, application forms, dashboard

**Agents:** Build, Design, Test, DB

| # | Task | Agent | Status | Files |
|---|------|-------|--------|-------|
| 2.1 | Visa categories page | Build+Design | ⏳ TODO | visas/page.tsx |
| 2.2 | Visa detail page | Build+Design | ⏳ TODO | visas/[id]/page.tsx |
| 2.3 | Search & filters | Build | ⏳ TODO | components/search.tsx |
| 2.4 | Stripe integration | Build+DB | ⏳ TODO | api/stripe/* |
| 2.5 | Checkout page | Build+Design | ⏳ TODO | visas/[id]/checkout/page.tsx |
| 2.6 | Payment success/cancel | Build | ⏳ TODO | visas/[id]/success/page.tsx |
| 2.7 | Premium application form | Build+Design | ⏳ TODO | visas/[id]/premium/page.tsx |
| 2.8 | Document upload | Build+DB | ⏳ TODO | components/document-upload.tsx |
| 2.9 | User dashboard | Build+Design | ⏳ TODO | user/dashboard/page.tsx |
| 2.10 | My visas page | Build | ⏳ TODO | user/visas/page.tsx |
| 2.11 | Documents management | Build | ⏳ TODO | user/documents/page.tsx |
| 2.12 | Profile settings | Build | ⏳ TODO | user/settings/page.tsx |

**Deliverable:** Full user journey from browse → pay → apply → upload

---

### PHASE 3: LAWYER FEATURES (Week 4-5)
**Goal:** Lawyer marketplace, booking, consultations, reviews

**Agents:** Build, Test, DB

| # | Task | Agent | Status | Files |
|---|------|-------|--------|-------|
| 3.1 | Lawyer signup flow | Build | ⏳ TODO | lawyers/signup/page.tsx |
| 3.2 | Verification document upload | Build | ⏳ TODO | lawyers/verification/page.tsx |
| 3.3 | Lawyer directory | Build+Design | ⏳ TODO | lawyers/page.tsx |
| 3.4 | Lawyer public profile | Build+Design | ⏳ TODO | lawyers/[id]/page.tsx |
| 3.5 | Booking flow | Build | ⏳ TODO | lawyers/[id]/book/page.tsx |
| 3.6 | Consultation payment | Build | ⏳ TODO | payments/consultation.ts |
| 3.7 | Lawyer dashboard | Build | ⏳ TODO | lawyer/dashboard/page.tsx |
| 3.8 | Client management | Build | ⏳ TODO | lawyer/clients/page.tsx |
| 3.9 | Availability calendar | Build | ⏳ TODO | components/calendar.tsx |
| 3.10 | Review system | Build | ⏳ TODO | components/reviews.tsx |
| 3.11 | Lawyer notes | Build | ⏳ TODO | lawyer/notes/page.tsx |

**Deliverable:** Complete lawyer marketplace with booking and reviews

---

### PHASE 4: ADMIN & POLISH (Week 6)
**Goal:** Admin panel, testing, deployment

**Agents:** Build, Test, Deploy

| # | Task | Agent | Status | Files |
|---|------|-------|--------|-------|
| 4.1 | Admin dashboard | Build | ⏳ TODO | admin/dashboard/page.tsx |
| 4.2 | Lawyer verification queue | Build | ⏳ TODO | admin/lawyers/page.tsx |
| 4.3 | User management | Build | ⏳ TODO | admin/users/page.tsx |
| 4.4 | Visa management | Build | ⏳ TODO | admin/visas/page.tsx |
| 4.5 | Content editor | Build | ⏳ TODO | admin/content/page.tsx |
| 4.6 | E2E tests (Playwright) | Test | ⏳ TODO | tests/e2e/*.spec.ts |
| 4.7 | Unit tests (Jest) | Test | ⏳ TODO | tests/unit/*.test.ts |
| 4.8 | Performance optimization | Build | ⏳ TODO | - |
| 4.9 | SEO optimization | Build | ⏳ TODO | metadata, sitemap |
| 4.10 | Vercel deployment | Deploy | ⏳ TODO | vercel.json |

**Deliverable:** Production-ready application

---

## AGENT ASSIGNMENTS

### BUILD AGENT (Jules Integration)
**Primary:** Code generation, Next.js development  
**Tools:** Jules, Git, npm, file system  
**Reports to:** Progress Tracker

**Phase 1 Tasks:**
- Footer component
- UI components (Button, Card, Input, Badge)
- Public pages (About, Contact, FAQ)
- Auth pages (Sign In, Sign Up)
- Supabase integration

**Phase 2 Tasks:**
- Visa browsing pages
- Stripe integration
- Checkout flow
- Application forms
- User dashboard

**Phase 3 Tasks:**
- Lawyer flows
- Booking system
- Lawyer dashboard
- Review system

**Phase 4 Tasks:**
- Admin panel
- Performance optimization
- SEO

---

### DESIGN AGENT (Stitch Integration)
**Primary:** UI/UX design, design tokens, visual assets  
**Tools:** Stitch, image analysis, CSS  
**Reports to:** Progress Tracker

**Phase 1 Tasks:**
- ✅ Design tokens extraction
- Footer design reference
- Landing page design
- Auth pages design
- Component library design

**Phase 2 Tasks:**
- Visa pages design
- Dashboard design
- Form designs
- Document upload design

**Phase 3 Tasks:**
- Lawyer profile design
- Booking flow design
- Calendar design
- Review cards design

---

### TEST AGENT (Playwright/Jest)
**Primary:** Testing, QA, test automation  
**Tools:** Playwright, Jest, test reporting  
**Reports to:** Progress Tracker

**Phase 2 Tasks:**
- Setup test infrastructure
- Write auth tests
- Write payment tests

**Phase 3 Tasks:**
- Write lawyer flow tests
- Write booking tests

**Phase 4 Tasks:**
- Full E2E suite
- Unit tests
- Performance tests

---

### DB AGENT (Supabase)
**Primary:** Database management, RLS, migrations  
**Tools:** Supabase SQL, psql  
**Reports to:** Progress Tracker

**Current Status:** ✅ Schema complete

**Phase 1 Tasks:**
- Verify RLS policies
- Test auth integration

**Phase 2 Tasks:**
- Payment tables verification
- Migration for new features

---

### DEPLOY AGENT (Vercel)
**Primary:** Deployment, CI/CD, production  
**Tools:** Vercel CLI, GitHub Actions  
**Reports to:** Progress Tracker

**Phase 4 Tasks:**
- Staging deployment
- Production deployment
- Environment configuration
- Monitoring setup

---

### PROGRESS TRACKER AGENT (This Session)
**Primary:** Monitor all agents, update progress, report to user  
**Tools:** Orchestrator CLI, MEMORY.md, Git  
**Reports to:** User

**Responsibilities:**
- Track task completion
- Update this plan
- Run heartbeat checks
- Report blockers
- Coordinate between agents

---

## COMMUNICATION PROTOCOL

### Status Updates
Each agent reports every 30 minutes or on task completion:
```
AGENT: build-agent
TASK: Header component
STATUS: complete
FILES: src/components/layouts/Header.tsx
BLOCKERS: none
NEXT: Footer component
```

### Blocker Escalation
If blocked for >15 minutes:
1. Report to Progress Tracker
2. Progress Tracker evaluates
3. Either resolve or escalate to user

### Task Handoff
When one agent finishes a dependency:
```
FROM: design-agent
TO: build-agent
TASK: Design tokens ready
FILES: src/styles/design-tokens.ts
ACTION: Start Footer component
```

---

## PROGRESS TRACKING

### Current Status (March 18, 15:30)
- ✅ Project initialized
- ✅ Dependencies installed
- ✅ Header component created
- ✅ Design tokens extracted
- ⏳ 48 tasks remaining

### Next Actions
1. Create Footer component (Build Agent)
2. Create UI components (Build Agent)
3. Generate landing page design (Design Agent + Stitch)
4. Build landing page (Build Agent)

### Git Tracking
- Branch: main
- Uncommitted: src/components/, src/styles/
- Next commit: After Phase 1 complete

---

## SUCCESS CRITERIA

### Phase 1 Complete When:
- [x] Header component works
- [x] Design tokens defined
- [ ] Footer component works
- [ ] UI components library complete
- [ ] Landing page matches design
- [ ] Auth flow works (Google OAuth)
- [ ] Responsive on mobile

### Phase 2 Complete When:
- [ ] Visa browsing works
- [ ] Stripe payments process
- [ ] Application forms save data
- [ ] Document upload works
- [ ] User dashboard shows data

### Phase 3 Complete When:
- [ ] Lawyer can register
- [ ] Lawyer can set availability
- [ ] User can book consultation
- [ ] Consultation payment works
- [ ] Reviews can be submitted

### Phase 4 Complete When:
- [ ] Admin can verify lawyers
- [ ] E2E tests pass
- [ ] 70%+ unit test coverage
- [ ] Deployed to production
- [ ] Performance score >90

---

## RISK MITIGATION

| Risk | Mitigation |
|------|------------|
| Jules session timeout | Use multiple smaller tasks |
| Design not matching | Use Stitch for reference |
| Auth complexity | Use Supabase Auth helpers |
| Payment issues | Use Stripe Checkout (hosted) |
| Database errors | Test migrations first |

---

*This plan is the single source of truth. Progress Tracker will update it as agents complete tasks.*
