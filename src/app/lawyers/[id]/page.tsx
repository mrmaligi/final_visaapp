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
  Shield,
  Quote,
  Heart
} from 'lucide-react';
import LawyerQASection from '@/components/lawyer/LawyerQASection';
import BookmarkButton from '@/components/social/BookmarkButton';
import ShareButtons from '@/components/social/ShareButtons';
import { generateLawyerSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface LawyerProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock lawyer data with enhanced content
const lawyerData = {
  id: '1',
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

// Enhanced reviews with testimonials
const reviews = [
  {
    id: 1,
    author: 'Sarah K.',
    rating: 5,
    date: 'March 10, 2026',
    content: 'James was incredibly helpful throughout my 189 visa application. His attention to detail and knowledge of the points system was invaluable. Highly recommend!',
    helpful: 12,
    visaType: 'Skilled Independent (189)',
    verified: true,
  },
  {
    id: 2,
    author: 'Michael T.',
    rating: 5,
    date: 'March 5, 2026',
    content: 'Professional, knowledgeable, and always responsive. James helped us navigate a complex business visa situation and achieved a successful outcome.',
    helpful: 8,
    visaType: 'Business Innovation (188)',
    verified: true,
  },
  {
    id: 3,
    author: 'Priya M.',
    rating: 4,
    date: 'February 28, 2026',
    content: 'Great experience overall. James explained everything clearly and kept us updated throughout the process. The only minor issue was some scheduling delays.',
    helpful: 5,
    visaType: 'Partner Visa (820/801)',
    verified: true,
  },
  {
    id: 4,
    author: 'David Chen',
    rating: 5,
    date: 'February 15, 2026',
    content: 'After my visa was cancelled due to a character issue, I thought I had no options. James took on my case and successfully appealed to the AAT. I cannot thank him enough for giving me a second chance.',
    helpful: 24,
    visaType: 'Character Appeal',
    verified: true,
  },
  {
    id: 5,
    author: 'Emma Williams',
    rating: 5,
    date: 'January 20, 2026',
    content: 'We used James for our company\'s 482 sponsorship applications. He processed all 12 employee visas efficiently and professionally. His understanding of employer-sponsored visas is exceptional.',
    helpful: 15,
    visaType: 'Temporary Skill Shortage (482)',
    verified: true,
  },
];

// Featured testimonials (longer, more detailed)
const testimonials = [
  {
    id: 1,
    author: 'Rajesh Patel',
    role: 'Software Engineer',
    location: 'Sydney, NSW',
    content: 'I came to Dr. Morrison after my 190 visa application was stuck in processing for over a year. He identified issues with my skills assessment that I was unaware of and helped me resubmit with the correct documentation. Within 4 months, my visa was granted. His expertise saved my Australian dream.',
    visaType: 'Skilled Nominated (190)',
    rating: 5,
  },
  {
    id: 2,
    author: 'Li Wei',
    role: 'Business Owner',
    location: 'Melbourne, VIC',
    content: 'The business visa process was incredibly complex with multiple stakeholders and jurisdictions. Dr. Morrison\'s team guided us through every step, from business valuation to state nomination. Their knowledge of the 188 visa pathway is unmatched.',
    visaType: 'Business Innovation (188)',
    rating: 5,
  },
];

// Q&A data
const qaData = [
  {
    id: 'qa1',
    question: {
      author: 'Amit S.',
      avatar: 'AS',
      date: 'March 12, 2026',
      content: 'I have a drink driving conviction from 3 years ago. Will this affect my skilled visa application?',
      votes: 18,
      tags: ['Character Test', 'Skilled Visa'],
    },
    answer: {
      lawyerId: '1',
      lawyerName: 'Dr. James Morrison',
      firm: 'Morrison Migration Law',
      avatar: 'JM',
      date: 'March 12, 2026',
      content: 'A single drink driving conviction from 3 years ago is unlikely to result in a visa refusal, but it must be disclosed. The Department will assess this under PIC 4001 (character requirements). Factors considered include the blood alcohol level, whether it was a first offense, and your overall character. I recommend obtaining a police clearance from all countries where you\'ve lived for 12+ months in the past 10 years and preparing a character submission. Would you like to book a consultation to discuss your specific situation?',
      isVerified: true,
      votes: 42,
    },
    views: 234,
    status: 'answered' as const,
  },
  {
    id: 'qa2',
    question: {
      author: 'Maria G.',
      avatar: 'MG',
      date: 'March 10, 2026',
      content: 'My 189 visa was refused due to incorrect ANZSCO code. Can I appeal or should I reapply?',
      votes: 12,
      tags: ['189 Visa', 'Refusal', 'ANZSCO'],
    },
    answer: {
      lawyerId: '1',
      lawyerName: 'Dr. James Morrison',
      firm: 'Morrison Migration Law',
      avatar: 'JM',
      date: 'March 11, 2026',
      content: 'This depends on several factors: when the refusal decision was made, whether you have merits review rights (AAT appeal), and whether the correct ANZSCO code would have resulted in a different outcome. If the refusal was recent (within 21 days), you may have appeal rights. However, if the skills assessment itself is for the wrong occupation, a fresh application with the correct ANZSCO code might be more efficient. I\'d need to review your refusal letter to give specific advice.',
      isVerified: true,
      votes: 28,
    },
    views: 156,
    status: 'answered' as const,
  },
  {
    id: 'qa3',
    question: {
      author: 'Tom H.',
      avatar: 'TH',
      date: 'March 8, 2026',
      content: 'How long does the AAT appeal process typically take for visa cancellations?',
      votes: 8,
      tags: ['AAT', 'Visa Cancellation', 'Timeframe'],
    },
    answer: null,
    views: 89,
    status: 'pending' as const,
  },
];

export async function generateMetadata({ params }: LawyerProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  
  return {
    title: `${lawyerData.name} - ${lawyerData.firm} | VisaHelper`,
    description: `${lawyerData.name} is a registered migration agent with ${lawyerData.experience} years of experience. Specializing in ${lawyerData.specializations.join(', ')}. Rated ${lawyerData.rating}/5 by ${lawyerData.reviews} clients.`,
    keywords: ['immigration lawyer', 'migration agent', 'Australian visa', ...lawyerData.specializations],
    openGraph: {
      type: 'profile',
      title: `${lawyerData.name} - Immigration Lawyer`,
      description: `${lawyerData.experience} years experience in Australian immigration law. ${lawyerData.reviews}+ satisfied clients.`,
    },
  };
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const { id } = await params;

  const lawyer = lawyerData;

  // Generate structured data
  const lawyerSchema = generateLawyerSchema({
    name: lawyer.name,
    firm: lawyer.firm,
    description: lawyer.about.slice(0, 200),
    url: `/lawyers/${id}`,
    image: '/images/lawyers/james-morrison.jpg',
    rating: lawyer.rating,
    reviewCount: lawyer.reviews,
    registrationNumber: lawyer.registrationNumber,
    address: lawyer.location,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Lawyers', url: '/lawyers' },
    { name: lawyer.name, url: `/lawyers/${id}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lawyerSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-2xl font-bold text-slate-900">{lawyer.rating}</span>
                      </div>
                      <span className="text-slate-500">({lawyer.reviews} reviews)</span>
                    </div>
                    <BookmarkButton itemId={lawyer.id} itemType="lawyer" />
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

              {/* Client Testimonials */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEF3C7' }}>
                    <Quote className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Client Testimonials</h2>
                    <p className="text-sm text-slate-500">Featured success stories</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                      <div className="flex items-start gap-4">
                        <Quote className="w-8 h-8 text-amber-300 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-slate-700 leading-relaxed mb-4 italic">"{testimonial.content}"</p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-900">{testimonial.author}</p>
                              <p className="text-sm text-slate-500">{testimonial.role} • {testimonial.location}</p>
                              <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                                {testimonial.visaType}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

              {/* Q&A Section */}
              <LawyerQASection questions={qaData} lawyerId={lawyer.id} />

              {/* Reviews */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                      <MessageCircle className="w-5 h-5" style={{ color: '#0052cc' }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
                      <p className="text-sm text-slate-500">{lawyer.reviews} client reviews</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Sort by:</span>
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:border-[#0052cc] outline-none">
                      <option>Most Recent</option>
                      <option>Highest Rated</option>
                      <option>Most Helpful</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{review.author}</p>
                            <p className="text-xs text-slate-500">{review.date}</p>
                          </div>
                          {review.verified && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Verified Client
                            </span>
                          )}
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
                      
                      <span className="inline-block mb-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                        {review.visaType}
                      </span>
                      
                      <p className="text-slate-600 mb-3">{review.content}</p>
                      
                      <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0052cc] transition-colors">
                        <Heart className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 py-3 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#0052cc', color: '#0052cc' }}
                >
                  View All {lawyer.reviews} Reviews
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

              {/* Share */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Share Profile</h3>
                <div className="flex justify-center">
                  <ShareButtons
                    title={`${lawyer.name} - Immigration Lawyer`}
                    url={`/lawyers/${id}`}
                    description={`${lawyer.experience} years experience in Australian immigration law`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
