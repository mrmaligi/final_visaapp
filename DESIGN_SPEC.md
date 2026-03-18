# VISA HELPER PLATFORM - DESIGN SPECIFICATION
## Complete UI/UX Reference (55+ Pages)

---

## DESIGN SYSTEM

### Color Palette
- **Primary:** #0052cc (Blue)
- **Primary Hover:** #0747a6
- **Background:** #ffffff (White)
- **Surface:** #f5f7f8 (Light gray)
- **Text Primary:** #172b4d (Dark)
- **Text Secondary:** #5e6c84 (Gray)
- **Border:** #dfe1e6
- **Success:** #36b37e (Green)
- **Warning:** #ffab00 (Yellow)
- **Error:** #de350b (Red)
- **Info:** #0052cc

### Typography
- **Font Family:** Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **Headlines:** 600-700 weight
- **Body:** 400 weight
- **Labels:** 500 weight
- **Base Size:** 16px

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Border Radius
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

### Shadows
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)

---

## PAGE INVENTORY

### Public Pages (8)
1. Landing Page `/`
2. Visa Categories `/visas`
3. Visa Category `/visas/category/[slug]`
4. Visa Detail `/visas/[id]`
5. Tracker `/tracker`
6. News `/news`
7. News Article `/news/[id]`
8. Lawyer Directory `/lawyers`

### Auth Pages (6)
1. Sign In `/auth/signin`
2. Sign Up `/auth/signup`
3. Lawyer Sign Up `/lawyers/signup`
4. Verification Pending `/lawyers/pending-verification`
5. Forgot Password `/auth/forgot-password`
6. Reset Password `/auth/reset-password`

### User Pages (15)
1. Dashboard `/user/dashboard`
2. My Visas `/user/visas`
3. Visa Checkout `/visas/[id]/checkout`
4. Checkout Success `/visas/[id]/success`
5. Premium Form `/visas/[id]/premium`
6. Documents `/user/documents`
7. Consultations `/user/consultations`
8. Book Consultation `/lawyers/[id]/book`
9. Booking Success `/user/consultations/[id]/success`
10. Profile Settings `/user/settings`
11. Security `/user/settings/security`
12. Notifications `/user/settings/notifications`
13. Billing `/user/settings/billing`
14. Privacy `/user/settings/privacy`
15. Lawyer Profile (Public) `/lawyers/[id]`

### Lawyer Pages (12)
1. Dashboard `/lawyer/dashboard`
2. Clients `/lawyer/clients`
3. Client Detail `/lawyer/clients/[id]`
4. Consultations `/lawyer/consultations`
5. Pricing `/lawyer/pricing`
6. Reviews `/lawyer/reviews`
7. Profile Settings `/lawyer/settings`
8. Credentials `/lawyer/settings/credentials`
9. Availability `/lawyer/settings/availability`
10. Tracker Contribution `/lawyer/tracker/contribute`

### Admin Pages (14)
1. Dashboard `/admin/dashboard`
2. Lawyers `/admin/lawyers`
3. Lawyer Verification `/admin/lawyers/[id]`
4. Users `/admin/users`
5. User Detail `/admin/users/[id]`
6. Visas `/admin/visas`
7. Visa Edit `/admin/visas/[id]/edit`
8. Premium Content `/admin/visas/[id]/content`
9. News `/admin/news`
10. Article Editor `/admin/news/[id]/edit`
11. Tracker `/admin/tracker`
12. Settings `/admin/settings`

### Utility Pages (5)
1. About `/about`
2. Contact `/contact`
3. FAQ `/faq`
4. Privacy `/legal/privacy`
5. Terms `/legal/terms`

---

## COMPONENT LIBRARY

### Buttons

**Primary Button**
- Background: #0052cc
- Text: white
- Padding: 12px 24px
- Border radius: 8px
- Font weight: 500
- Hover: #0747a6

**Secondary Button**
- Background: white
- Border: 1px solid #dfe1e6
- Text: #172b4d
- Padding: 12px 24px
- Border radius: 8px
- Hover: #f5f7f8

**Outline Button (Primary)**
- Background: transparent
- Border: 1px solid #0052cc
- Text: #0052cc
- Padding: 12px 24px
- Border radius: 8px
- Hover: rgba(0,82,204,0.1)

**Large Button**
- Padding: 16px 32px
- Font size: 18px

**Icon Button**
- Size: 40px × 40px
- Border radius: 8px
- Centered icon

### Cards

**Standard Card**
- Background: white
- Border: 1px solid #dfe1e6
- Border radius: 12px
- Padding: 24px
- Shadow: none or sm

**Elevated Card**
- Background: white
- Border radius: 12px
- Padding: 24px
- Shadow: md
- Hover: shadow-lg (if clickable)

**Feature Card**
- Icon: 48px, #0052cc
- Title: 20px, 600 weight
- Description: 16px, #5e6c84
- Padding: 32px

### Forms

**Text Input**
- Border: 1px solid #dfe1e6
- Border radius: 8px
- Padding: 12px 16px
- Font size: 16px
- Focus: border-color #0052cc, ring

**Label**
- Font size: 14px
- Font weight: 500
- Color: #172b4d
- Margin bottom: 8px

**Helper Text**
- Font size: 14px
- Color: #5e6c84

**Error Text**
- Font size: 14px
- Color: #de350b

**Select/Dropdown**
- Same as text input
- Chevron down icon

**Textarea**
- Same as text input
- Min height: 120px
- Resize: vertical

### Navigation

**Header**
- Height: 64px
- Background: white
- Border bottom: 1px solid #dfe1e6
- Logo left, nav center/right
- Sticky on scroll

**Footer**
- Background: #172b4d
- Text: white/light gray
- Padding: 64px 0
- Grid layout: 4 columns

**Sidebar**
- Width: 240px
- Background: white
- Border right: 1px solid #dfe1e6
- Sticky

**Breadcrumb**
- Font size: 14px
- Color: #5e6c84
- Separator: / or >
- Current page: #172b4d

### Badges

**Status Badge**
- Padding: 4px 12px
- Border radius: 9999px
- Font size: 12px
- Font weight: 500
- Success: bg-green-100 text-green-800
- Warning: bg-yellow-100 text-yellow-800
- Error: bg-red-100 text-red-800
- Info: bg-blue-100 text-blue-800

**Category Badge**
- Same as status badge
- Different color per category

### Tables

**Standard Table**
- Header: bg-gray-50, font-weight 600
- Row: hover bg-gray-50
- Border bottom: 1px solid #dfe1e6
- Cell padding: 16px

### Modals

**Standard Modal**
- Overlay: rgba(0,0,0,0.5)
- Background: white
- Border radius: 16px
- Max width: 560px
- Padding: 32px
- Close button top right

---

## PAGE SPECIFICATIONS

### 1. LANDING PAGE `/`

**Layout:** Full width sections, max-width 1280px content

**Hero Section**
- Full width, min-height: 600px
- Background: gradient or image
- Headline: 48-64px, 700 weight, center
- Subheadline: 20-24px, 400 weight, center, max-width 640px
- Two CTA buttons: primary + secondary
- Hero image/illustration

**Features Section**
- Background: white
- Padding: 96px 0
- Section title: center, 36px
- 3-column grid of feature cards
- Icon + Title + Description + Link

**How It Works**
- Background: #f5f7f8
- Padding: 96px 0
- 4 steps horizontal
- Step number circle + Title + Description
- Connecting line between steps

**Pricing Section**
- Background: white
- Padding: 96px 0
- 2 pricing cards side by side
- Card: large price, feature list, CTA

**Testimonials**
- Background: #f5f7f8
- 3-column grid
- Quote card with avatar

**CTA Section**
- Background: #0052cc
- Text: white
- Centered content
- Large CTA button

---

### 2. VISA CATEGORIES `/visas`

**Header:** Page title + breadcrumb

**Search/Filter Bar**
- Search input: full width, large
- Filter dropdowns: category, sort
- Mobile: stack vertically

**Category Grid**
- 3-column grid (2 on tablet, 1 on mobile)
- Category card: icon + name + count
- Hover: elevated shadow

**Popular Visas**
- Horizontal scroll or grid
- Visa card: name + subclass + badge + price

---

### 3. VISA DETAIL `/visas/[id]`

**Header:** Breadcrumb + Visa name + subclass badge

**Quick Facts Row**
- 3 cards horizontal
- Icon + Stat + Label
- Border or shadow

**Tab Navigation**
- Horizontal tabs
- Active: bottom border or background

**Tab Content**
- Rich text content
- Bullet lists
- External links

**Premium Teaser**
- Background: #f5f7f8
- Lock icon
- Feature checklist
- Price + CTA

**Lawyer Section**
- "Need Expert Help?" heading
- 3 lawyer cards horizontal
- Each: photo + name + rating + price + button

---

### 4. USER DASHBOARD `/user/dashboard`

**Layout:** Sidebar + Main content

**Sidebar**
- User avatar + name
- Navigation links
- Active state highlight

**Main Content**
- Welcome message
- Quick action cards (3)
- My Visas section
- Upcoming consultations
- Recent news

---

### 5. PREMIUM FORM `/visas/[id]/premium`

**Layout:** Sidebar navigation + Form

**Sidebar**
- Section links with progress
- Current section highlighted
- Save status indicator
- Action buttons

**Form Sections**
- Accordion style
- Section header: title + progress
- Fields: label + input + tooltip
- Save & Continue button

**Sticky Bottom Bar**
- Progress percentage
- Save draft button
- Continue button

---

### 6. LAWYER PROFILE `/lawyers/[id]`

**Header**
- Large photo (120px)
- Name + verified badge
- Rating stars
- Quick stats row

**Main Content**
- Tab navigation
- About tab: bio + credentials
- Pricing tab: rates + included
- Reviews tab: rating breakdown + review cards
- Availability tab: calendar

**CTA Section**
- Book consultation button
- Alternative contact methods

---

### 7. CHECKOUT `/visas/[id]/checkout`

**Layout:** 2 columns

**Left: Order Summary**
- Product details
- Feature list
- Price breakdown

**Right: Payment**
- Stripe elements
- Billing info
- Terms checkbox
- Pay button

---

### 8. ADMIN DASHBOARD `/admin/dashboard`

**Layout:** Sidebar + Main

**Sidebar**
- Admin badge
- Navigation links

**Main Content**
- Key metrics cards (6)
- Charts (revenue, users)
- Recent activity list
- Pending actions alerts

---

## RESPONSIVE BREAKPOINTS

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### Mobile Adaptations
- Stack columns
- Hide secondary nav
- Show hamburger menu
- Full-width cards
- Bottom sheet modals

---

## ANIMATIONS & INTERACTIONS

### Hover States
- Cards: shadow elevation
- Buttons: color darken
- Links: underline or color change

### Focus States
- Ring: 2px offset, primary color
- Input border: primary color

### Loading States
- Button: spinner icon
- Page: skeleton screens
- Cards: pulse animation

### Transitions
- Duration: 200-300ms
- Easing: ease-out
- Properties: transform, opacity, shadow

---

## ICONOGRAPHY

- **Library:** Lucide React or Heroicons
- **Size:** 20px (default), 24px (large), 16px (small)
- **Stroke width:** 1.5-2

### Common Icons
- Navigation: Home, FileText, Clock, Newspaper, Users
- Actions: Plus, Edit, Trash, Download, Upload
- Status: Check, X, AlertCircle, Info
- Social: Share, Bookmark, Heart

---

## ACCESSIBILITY

- WCAG 2.1 AA compliance
- Focus indicators
- Alt text for images
- ARIA labels
- Keyboard navigation
- Color contrast ratio 4.5:1

---

*This document defines the complete visual design system and page specifications for the Visa Helper Platform.*
