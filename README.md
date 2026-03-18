# VisaFlow - Visa Application Platform

AI-powered visa application platform built with Next.js, Supabase, and Google AI tools.

## 🎨 Creative Workflow

This project was built using an integrated AI workflow:

| Phase | Tool | Output |
|-------|------|--------|
| **Database** | Supabase SQL | PostgreSQL schema with RLS |
| **UI Design** | Google Stitch | 5 screen designs (Landing, Dashboard, Auth, Forms) |
| **Code** | Google Jules | Next.js 14 full-stack implementation |
| **Integration** | OpenClaw | Orchestrated workflow |

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage for documents

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group (login, signup)
│   ├── dashboard/         # User dashboard
│   ├── applications/      # Visa applications
│   ├── visa-types/        # Visa catalogue
│   ├── documents/         # Document management
│   ├── profile/           # User profile
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utilities, Supabase client
├── types/                 # TypeScript types
├── designs/               # Stitch UI designs (HTML + JPG)
└── supabase/              # Database schema
```

## 🎨 Design System

### Screens
1. **Landing Page** (`1decee23a6b840d796a61b3c0a002b1b.*`)
   - Hero section with CTA
   - Features grid
   - Trust badges

2. **User Dashboard** (`08273f23db0e46aa8f676c18f0856fad.*`)
   - Stats cards
   - Applications table
   - Quick actions

3. **Login Page** (`00db5bd7355d472e946b5c4ef66f8ee6.*`)
   - Split-screen layout
   - Social auth

4. **Signup Page** (`647dfe3f9c224e6ab17f2ac58bc868ae.*`)
   - Registration form
   - Account creation

5. **Application Form** (`c270c670ffe1482f9a194e95b81b1bfe.*`)
   - Multi-step wizard
   - Visa selection
   - Document upload

## 🗄️ Database Schema

### Tables
- `profiles` - User profiles (extends auth.users)
- `visa_applications` - Visa applications
- `documents` - Uploaded documents
- `visa_types` - Visa catalogue
- `notifications` - User notifications
- `messages` - Applicant-agent communication
- `application_status_history` - Status tracking

### Security
- Row Level Security (RLS) enabled
- Users can only access own data
- Admin/agent roles for support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mrmaligi/final_visaapp.git
cd final_visaapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://ysfwurlzkihgezfegfog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛠️ Development

### Database Migrations

Schema is in `supabase/schema.sql`. To apply changes:

```bash
psql $DATABASE_URL -f supabase/schema.sql
```

### Adding Features

1. Design UI in Stitch (optional)
2. Update database schema if needed
3. Implement frontend components
4. Add API routes
5. Test with Jules

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Supabase

Database is hosted on Supabase. Connection:
- Project URL: https://ysfwurlzkihgezfegfog.supabase.co
- Region: ap-northeast-2 (Seoul)

## 🤖 AI Tools Used

- **Stitch** - UI/UX design generation
- **Jules** - Code generation and implementation
- **Supabase** - Database and authentication
- **OpenClaw** - Workflow orchestration

## 📄 License

MIT License - feel free to use this as a template for your own projects.

## 🙏 Acknowledgments

Built with the help of Google's AI tools and the open-source community.
