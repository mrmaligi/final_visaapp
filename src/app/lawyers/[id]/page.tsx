import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  Star, 
  MapPin, 
  Briefcase, 
  Globe, 
  Clock, 
  CheckCircle, 
  MessageCircle,
  Calendar,
  DollarSign,
  ChevronLeft,
  Award,
  BookOpen,
  Shield
} from 'lucide-react';

interface LawyerProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: LawyerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: 'Lawyer Profile | VisaHelper',
    description: 'View detailed profile, reviews, and book a consultation with this verified immigration lawyer.',
  };
}

// Mock lawyer data
const lawyerData = {
  id: 1,
  name: 'Dr. James Morrison',
  firm: 'Morrison Migration Law',
  title: 'Principal Migration Agent & Lawyer',
  rating: 4.9,
  reviews: 127,
  hourlyRate: 350,
  consultationFee: 150,
  location: 'Sydney, NSW',
  experience: 18,
  registrationNumber: 'MARA 1687452',
  specializations: ['Skilled Migration', 'Business Visas', 'Appeals', 'Complex Cases'],
  languages: ['English', 'Mandarin'],
  about: `Dr. James Morrison is a registered migration agent and lawyer with over 18 years of experience in Australian immigration law. He has helped thousands of clients achieve their migration goals through skilled visas, business visas, and complex appeal matters.

James holds a PhD in Immigration Law from the University of Sydney and is a member of the Migration Institute of Australia. He regularly presents at immigration law conferences and has contributed to several publications on migration policy.

His expertise in complex cases has earned him a reputation as one of Australia's leading immigration lawyers, particularly in matters involving character issues, visa cancellations, and appeals to the Administrative Appeals Tribunal.`,
  education: [
    'PhD in Immigration Law, University of Sydney',
    'Bachelor of Laws (LLB), UNSW',
    'Graduate Diploma in Migration Law, ANU',
  ],
  memberships: [
    'Migration Institute of Australia (MIA)',
    'Law Society of New South Wales',
    'Australian Institute of Administrative Law',
  ],
  achievements: [
    'Top 50 Migration Lawyers in Australia, 2025',
    'Excellence in Migration Law Award, 2024',
    'Published author in Migration Law Quarterly',
  ],
  availability: {
    nextAvailable: 'Tomorrow',
    slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
  },
};

// Mock reviews
const reviews = [
  {
    id: 1,
    author: 'Sarah K.',
    rating: 5,
    date: 'March 10, 2026',
    content: 'James was incredibly helpful throughout my 189 visa application. His attention to detail and knowledge of the points system was invaluable. Highly recommend!',
    helpful: 12,
  },
  {
    id: 2,
    author: 'Michael T.',
    rating: 5,
    date: 'March 5, 2026',
    content: 'Professional, knowledgeable, and always responsive. James helped us navigate a complex business visa situation and achieved a successful outcome.',
    helpful: 8,
  },
  {
    id: 3,
    author: 'Priya M.',
    rating: 4,
    date: 'February 28, 2026',
    content: 'Great experience overall. James explained everything clearly and kept us updated throughout the process. The only minor issue was some scheduling delays.',
    helpful: 5,
  },
];

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const { id } = await params;

  // In production, fetch lawyer data from Supabase
  const lawyer = lawyerData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Profile Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
              href="/lawyers" 
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#0052cc] transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Lawyers
            </Link>

            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold flex-shrink-0"
                style={{ backgroundColor: '#0052cc' }}
              >
                JM
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{lawyer.name}</h1>
                    <p className="text-slate-600">{lawyer.title}</p>
                    <p className="text-slate-500 text-sm">{lawyer.firm}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold text-slate-900">{lawyer.rating}</span>
                    </div>
                    <span className="text-slate-500">({lawyer.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {lawyer.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {lawyer.experience} years experience
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {lawyer.languages.join(', ')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {lawyer.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <BookOpen className="w-5 h-5" style={{ color: '#0052cc' }} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">About</h2>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  {lawyer.about.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-slate-600 leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Education & Credentials */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <Award className="w-5 h-5" style={{ color: '#0052cc' }} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Education & Credentials</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Education</h3>
                    <ul className="space-y-2">
                      {lawyer.education.map((edu, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {edu}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Professional Memberships</h3>
                    <ul className="space-y-2">
                      {lawyer.memberships.map((membership, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0052cc' }} />
                          {membership}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Achievements</h3>
                    <ul className="space-y-2">
                      {lawyer.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                    <MessageCircle className="w-5 h-5" style={{ color: '#0052cc' }} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                  <span className="ml-auto text-slate-500">{lawyer.reviews} reviews</span>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">{review.author}</p>
                          <p className="text-sm text-slate-500">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-slate-600 mb-3">{review.content}</p>
                      
                      <button className="text-sm text-slate-500 hover:text-[#0052cc] transition-colors">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#0052cc', color: '#0052cc' }}
                >
                  View All Reviews
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Pricing</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">Initial Consultation</p>
                        <p className="text-sm text-slate-500">30 minutes</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${lawyer.consultationFee}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900">Hourly Rate</p>
                        <p className="text-sm text-slate-500">Ongoing services</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${lawyer.hourlyRate}</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Availability</h3>
                
                <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#DBEAFE' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium" style={{ color: '#0052cc' }}>Next available: {lawyer.availability.nextAvailable}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {lawyer.availability.slots.map((slot) => (
                    <button
                      key={slot}
                      className="py-2 px-3 rounded-lg border text-sm font-medium hover:border-[#0052cc] hover:text-[#0052cc] transition-colors"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                <Link
                  href={`/lawyers/${id}/book`}
                  className="block w-full mt-4 py-3 text-center rounded-lg text-white font-semibold hover:opacity-90 transition-colors"
                  style={{ backgroundColor: '#0052cc' }}
                >
                  Book Consultation
                </Link>
              </div>

              {/* Verification Badge */}
              <div className="p-6 rounded-2xl text-white" style={{ backgroundColor: '#0052cc' }}>
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6" />
                  <h3 className="font-semibold">Verified Lawyer</h3>
                </div>
                
                <p className="text-sm text-blue-100 mb-3">
                  This lawyer has been verified by VisaHelper and holds a valid MARA registration.
                </p>
                
                <p className="text-sm font-medium">Reg: {lawyer.registrationNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
