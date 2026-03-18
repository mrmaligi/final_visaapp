# Visa Application Platform

A complete visa application platform built with Next.js 14 (App Router) and Supabase.

## Features

- **Authentication**: Secure login/signup via Supabase Auth.
- **Dashboard**: Track visa application statuses and history.
- **Application Forms**: Submit new visa applications with intended travel dates and purposes.
- **Document Upload**: Securely attach supporting documents (passports, IDs) to applications.
- **Visa Catalogue**: Browse available visa types and destinations.
- **Notifications**: Stay updated on application progress.
- **Profile Management**: Maintain personal profile details.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Lucide Icons.
- **Backend & Database**: Supabase (PostgreSQL, Storage, Auth), Next.js Route Handlers.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the `.env.local.example` file to `.env.local`:
     ```bash
     cp .env.local.example .env.local
     ```
   - Update the variables with your Supabase project URL and anon key.

4. **Database Setup:**
   Ensure your Supabase project contains the necessary tables:
   - `profiles`
   - `visa_types`
   - `visa_applications`
   - `documents`
   - `notifications`

   *Note: Ensure Row Level Security (RLS) is properly configured on these tables.*

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `app/`: Next.js 14 App Router pages, layouts, and API routes.
- `components/`: Reusable React components.
- `utils/supabase/`: Supabase client utilities for browser, server components, and middleware.
- `types/`: TypeScript definitions, including generated Supabase database types.
