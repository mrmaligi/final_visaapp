# Remaining Screens to Generate (When API Quota Resets)

## Priority Screens (19 remaining of 55 total)

### High Priority - User Flows
- [ ] **Processing Time Tracker** - Data table with community processing times
- [ ] **My Visas List** - User's purchased visas with progress cards
- [ ] **Documents Management** - File upload and management interface
- [ ] **Consultations History** - Past/upcoming consultations list
- [ ] **Book Consultation** - 5-step booking wizard
- [ ] **Checkout Success** - Payment confirmation page
- [ ] **Booking Success** - Consultation booking confirmation

### Medium Priority - Lawyer Features
- [ ] **Client Detail View** - Individual client profile with documents
- [ ] **Tracker Contribution Form** - Lawyer data submission form
- [ ] **News Comment Section** - Lawyer commenting interface

### Lower Priority - Admin & Components
- [ ] **News Article Editor** - Rich text editor for news
- [ ] **Privacy Policy** - Legal page
- [ ] **Terms of Service** - Legal page
- [ ] **Mobile Navigation Drawer** - Mobile menu component
- [ ] **Toast Notifications** - Notification system
- [ ] **Forgot Password** - Password reset request
- [ ] **Reset Password** - New password form
- [ ] **Email Verification** - Verification success page

---

## Generation Commands (Ready to Run)

```bash
export STITCH_API_KEY="AQ.Ab8RN6LAvXucyYnlCXN8EtPNTtKoHOqhCNa92BdSH2YVDuXhdw"

# Generate Processing Time Tracker
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Visa processing time tracker page with community data table showing submitted processing times. Search bar filter dropdowns statistics cards showing total entries 5432 and average processing time 8.5 months. Data table with columns for visa name subclass lodgement date decision date processing time outcome. Pagination controls. Contribute CTA section. Professional blue white design." \
  --device desktop

# Generate My Visas List
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "User's visa applications page with filter tabs All In Progress Completed, visa cards showing visa name subclass progress percentage bar documents count status badges action buttons, empty state illustration. Dashboard layout with blue accents." \
  --device desktop

# Generate Documents Management
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Document management page with upload button filter bar by visa and category, document list with file icons category badges shared status, view download delete actions, grid toggle. File management interface blue white design." \
  --device desktop

# Generate Consultations History
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Consultations page with filter tabs Upcoming Past Cancelled, consultation cards with lawyer photos date time countdown meeting links reschedule cancel buttons, review form for past consultations. Appointment management blue white design." \
  --device desktop

# Generate Book Consultation
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "5-step booking wizard with lawyer info sidebar, visa selection cards, duration selection 30min 1hour, calendar date picker with time slots, questions textarea, review payment summary. Booking flow interface blue white design." \
  --device desktop

# Generate Checkout Success
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Checkout success page centered card with animated checkmark, order details visa name amount paid, next steps list, return to dashboard link. Success state design blue white." \
  --device desktop

# Generate Client Detail View (Lawyer)
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Client detail page with header info, tabs for Overview Documents Consultations Notes, active applications section, consultation history table, shared documents grid, private notes editor. Detail view layout blue white design." \
  --device desktop

# Generate News Article Editor (Admin)
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "News article editor full-width layout, large title input, summary textarea, rich text content editor toolbar, sidebar with category dropdown, related visas multi-select with search, featured image upload with preview, source URL input, publication settings draft publish schedule, SEO fields, auto-save indicator. Editorial layout." \
  --device desktop

# Generate Privacy Policy
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Privacy policy legal page with table of contents sidebar, sections for data collection, usage, sharing, cookies, rights. Clean typography-focused layout blue accents." \
  --device desktop

# Generate Forgot Password
python3 ~/.openclaw/workspace/skills/stitch/scripts/stitch.py screen generate \
  15348568488048061051 \
  "Forgot password page simple centered card with email input, send reset link button, back to sign in link. Minimal clean design blue accents." \
  --device desktop
```

---

## Wiring Instructions

When screens are generated, add them to:

1. **Copy files** to `final_visaapp/reference-designs/`
2. **Update page components** in `src/app/[route]/page.tsx`
3. **Add design reference banner** linking to HTML file
4. **Commit and push** to GitHub

---

## Current Status

- **Generated:** 36 screens (65%)
- **Remaining:** 19 screens (35%)
- **API Status:** Quota exhausted - retry later
- **Last Updated:** 2026-03-18
