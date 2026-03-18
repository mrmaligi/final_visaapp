# BRIEF FOR JULES - Visa Helper Platform
## Complete Application Context

---

## WHAT IS THIS?

Visa Helper Platform is an Australian visa application platform similar to a SaaS marketplace:

**For Applicants (Users):**
- Browse 6+ visa types (Work, Student, Family, Business, Visitor, Protection)
- View basic info for free
- Pay $49 to unlock premium features:
  - Step-by-step application forms with tooltips
  - Document upload and management
  - Sample applications and guides
- Book consultations with immigration lawyers ($75-300)
- Track visa processing times

**For Lawyers:**
- Register and get verified by admin
- Set hourly rates ($100-300/hour typical)
- Manage consultations and clients
- Add private client notes
- Reply to reviews

**For Admins:**
- Verify lawyer credentials
- Manage visa content
- View platform analytics
- Moderate reviews

---

## TECH STACK

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API routes + Supabase
- **Database:** PostgreSQL (Supabase) with 25+ tables
- **Auth:** Supabase Auth (Google OAuth + Email/Password)
- **Payments:** Stripe Checkout
- **File Storage:** Supabase Storage
- **Icons:** Lucide React
- **Testing:** Playwright (E2E) + Jest (Unit)

---

## KEY FEATURES TO BUILD

### Phase 1: Foundation (NOW)
- Layout: Header, Footer (sticky, responsive)
- UI: Button, Card, Input, Badge components
- Pages: Landing, About, Contact, FAQ
- Auth: Sign In, Sign Up (Google OAuth + email)

### Phase 2: User Features
- Visa browsing with search/filters
- Stripe payment ($49 unlock)
- Multi-step application forms
- Document upload (PDF, JPG, PNG)
- User dashboard

### Phase 3: Lawyer Features
- Lawyer registration with verification
- Public lawyer profiles with reviews
- Booking flow (30/60 min consultations)
- Payment for consultations
- Lawyer dashboard

### Phase 4: Admin
- Admin dashboard with metrics
- Lawyer verification queue
- Content management
- Production deployment

---

## DESIGN SYSTEM

```
Primary: #0052cc (Blue)
Background: white / #f5f7f8 (gray-50)
Text: #172b4d (dark) / #5e6c84 (gray)
Font: Inter
Border Radius: 8px (buttons), 12px (cards)
Container: max-w-7xl (1280px)
```

Reference designs in: `/designs/` folder (Stitch generated HTML)

---

## DATABASE HIGHLIGHTS

**Key Tables:**
- `users` - Extended auth profiles
- `visas` - 6 visa types with categories
- `visa_purchases` - Payment records
- `user_documents` - Uploaded files
- `lawyers` - Lawyer profiles with verification
- `consultations` - Booking records
- `reviews` - Lawyer ratings

**Security:**
- Row Level Security (RLS) on all tables
- Users only see own data
- Lawyers see only their clients
- Admins see everything

---

## PAGES TO BUILD (55+ total)

**Public:**
- Landing (/)
- Visas (/visas)
- Visa Detail (/visas/[id])
- Tracker (/tracker)
- News (/news)
- Lawyers (/lawyers)
- About, Contact, FAQ

**Auth:**
- Sign In (/auth/signin)
- Sign Up (/auth/signup)

**User:**
- Dashboard (/user/dashboard)
- My Visas (/user/visas)
- Documents (/user/documents)
- Settings (/user/settings)

**Lawyer:**
- Dashboard (/lawyer/dashboard)
- Clients (/lawyer/clients)
- Consultations (/lawyer/consultations)

**Admin:**
- Dashboard (/admin/dashboard)
- Lawyers (/admin/lawyers)
- Users (/admin/users)

---

## REVENUE MODEL

| Transaction | Amount | Split |
|-------------|--------|-------|
| Visa Premium Unlock | $49 USD | 100% Platform |
| Consultation (30 min) | $75-150 | 100% Lawyer (MVP) |
| Consultation (60 min) | $150-300 | 100% Lawyer (MVP) |

---

## CURRENT STATUS

**Phase 1 In Progress:**
- ✅ Header component created
- ✅ Design tokens extracted
- ⏳ Footer component
- ⏳ UI components
- ⏳ Public pages
- ⏳ Auth integration

**Files Created:**
- src/components/layouts/Header.tsx
- src/styles/design-tokens.ts
- src/lib/supabase/client.ts
- src/types/index.ts

---

## WHEN BUILDING

1. Match the Stitch designs in `/designs/` folder
2. Use the design tokens (colors, spacing)
3. Make components reusable
4. Add TypeScript types
5. Make it responsive (mobile-first)
6. Test with npm run dev

---

## QUESTIONS?

Ask the user or reference:
- MASTER_PLAN.md (full task list)
- SPECIFICATION.md (55+ page specs)
- DESIGN_SPEC.md (component specs)
