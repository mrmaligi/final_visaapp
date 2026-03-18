# BRIEF FOR STITCH - Visa Helper Platform
## Design Requirements

---

## ABOUT THE PRODUCT

Visa Helper Platform helps people apply for Australian visas. It's a web application with:

1. **Visa Information** - Browse visa types, requirements, processing times
2. **Premium Forms** - Pay $49 to access guided application forms
3. **Document Upload** - Upload passport, certificates, evidence
4. **Lawyer Marketplace** - Book consultations with immigration lawyers

---

## DESIGN STYLE

**Aesthetic:** Professional, trustworthy, clean, modern
**Vibe:** Government service meets tech startup
**Colors:**
- Primary: Blue (#0052cc) - trust, professionalism
- Background: White - clean, spacious
- Accents: Soft grays, subtle shadows

**Typography:** Inter (clean, readable)

**Key Elements:**
- Trust badges (verified lawyers, secure payments)
- Progress indicators (form completion)
- Cards for content organization
- Clear CTAs (call-to-action buttons)

---

## PAGES TO DESIGN

### Already Done ✅
- Landing Page

### Need Designs ⏳

**1. Footer**
- Logo + tagline: "Simplify Your Australian Visa Journey"
- 3 link columns: Product, Company, Legal
- Social media icons (Twitter, LinkedIn, Facebook)
- Copyright text
- Background: Dark (navy) or light gray

**2. Sign In Page**
- Split screen: Left (branding/illustration), Right (form)
- Form: Email, Password, "Forgot password?" link
- "Sign In with Google" button (prominent)
- "Don't have an account? Sign up" link
- Clean, minimal, focused on conversion

**3. Sign Up Page**
- Similar to Sign In
- Fields: Full Name, Email, Password, Confirm Password
- "I agree to Terms and Privacy Policy" checkbox
- Google OAuth button
- "Already have an account? Sign in" link

**4. User Dashboard**
- Welcome header: "Welcome back, [Name]"
- Stats cards: Active applications, Documents uploaded, Upcoming consultations
- Recent applications list with progress bars
- Quick action buttons: "Browse Visas", "Find Lawyer"
- Upcoming consultations section

**5. Visa Detail Page**
- Hero: Visa name (e.g., "Skilled Independent Visa"), subclass (189)
- Quick facts: Processing time, application fee, success rate
- Tab navigation: Overview, Eligibility, Documents, News
- Premium unlock CTA: "$49 - Unlock Full Guide"
- "Need help?" section with lawyer cards

**6. Premium Application Form**
- Multi-step progress indicator at top
- Sidebar: Sections (Personal Info, Travel History, Documents, Review)
- Form fields with tooltips (? icons)
- Document upload areas (drag & drop)
- Save progress button
- Review & Submit section

**7. Lawyer Directory**
- Search bar + filters (Specialization, Price, Rating)
- Lawyer cards grid:
  - Photo
  - Name + "Verified Lawyer" badge
  - Star rating + review count
  - Specialization badges
  - Hourly rate
  - "Book Consultation" button

**8. Lawyer Profile Page**
- Large photo + name + verified badge
- Quick stats: Experience, Consultations, Rating
- About section (bio)
- Specializations
- Pricing card
- Reviews section (with star breakdown)
- Availability calendar
- "Book Now" CTA

**9. Checkout Page**
- Order summary: Visa name, Premium Access, price ($49)
- Payment form: Card number, Expiry, CVC
- Billing info: Name, Email
- "Pay $49" button (prominent)
- Security badges (SSL, Stripe)

**10. Booking Page**
- Lawyer info sidebar (photo, name, rate)
- Step 1: Select visa (dropdown)
- Step 2: Duration (30 min / 1 hour cards with prices)
- Step 3: Date/time picker (calendar + time slots)
- Step 4: Questions textarea
- Step 5: Review & Pay

---

## DESIGN TOKENS (from Landing Page)

```
Colors:
- Primary: #0056b3
- Primary Light: #3b82f6
- Background: #ffffff
- Surface: #f5f7f8, #f8fafc
- Text Primary: #0f172a, #1e293b
- Text Secondary: #64748b
- Border: #e2e8f0, #cbd5e1
- Success: #22c55e
- Warning: #f59e0b

Typography:
- Font: Inter
- Hero: 48-60px, bold
- H1: 36-40px, semibold
- H2: 24-30px, semibold
- Body: 16px, regular
- Small: 14px, regular

Spacing:
- Container max: 1280px
- Section padding: 64-96px vertical
- Card padding: 24-32px
- Component gaps: 16-24px

Border Radius:
- Buttons: 8px
- Cards: 12-16px
- Inputs: 8px
- Full: 9999px (pills)
```

---

## DEVICE TARGETS

Design for:
1. **Desktop** (1280px+) - Primary
2. **Tablet** (768px) - Adapt layout
3. **Mobile** (375px) - Stack everything

---

## REFERENCE MATERIALS

- Existing design: `/designs/1decee23a6b840d796a61b3c0a002b1b.html`
- Full specs: `/SPECIFICATION.md`
- Design system: `/DESIGN_SPEC.md`

---

## GENERATION PROMPTS

Use these prompts with Stitch:

**Footer:**
"A footer for a visa application website. Dark navy background. Logo 'VisaHelper' with paper plane icon on left. Three columns of links: Product (Visas, Tracker, News, For Lawyers), Company (About, Contact, FAQ, Careers), Legal (Privacy Policy, Terms of Service, Cookie Policy). Social media icons row. Copyright text at bottom. Professional, trustworthy design."

**Sign In:**
"A sign-in page for a visa platform. Split screen layout. Left side: soft blue gradient background with abstract visa/travel illustration and 'Welcome to VisaHelper' text. Right side: clean white card with email input, password input, 'Forgot password?' link, blue 'Sign In' button, divider line, white 'Sign in with Google' button with Google icon. 'Don't have an account? Sign up' link at bottom. Modern, professional, minimal."

**Dashboard:**
"A user dashboard for a visa application platform. Header with 'Welcome back, Sarah' and profile avatar. Four stat cards in a row: Active Applications (2), Documents Uploaded (12), Next Consultation (Tomorrow), Completed Visas (1). Section 'My Visa Applications' with cards showing visa name, progress bar (65% complete), document count, and 'Continue' button. Section 'Upcoming Consultations' with lawyer photo, name, date/time. Clean card-based layout."

---

## PRIORITY ORDER

1. Footer
2. Sign In / Sign Up
3. User Dashboard
4. Visa Detail Page
5. Application Form
6. Lawyer Directory
7. Lawyer Profile
8. Checkout
9. Booking Flow

Generate in this order for consistency.
