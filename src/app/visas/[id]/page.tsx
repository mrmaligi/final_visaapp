import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  Clock, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Users,
  BookOpen,
  BarChart3,
  ChevronRight,
  Lock,
  Star,
  Calendar
} from 'lucide-react';

interface VisaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mock visa data - in production this would come from Supabase
const visaData: Record<string, {
  name: string;
  subclass: string;
  category: string;
  description: string;
  processingTime: string;
  fee: string;
  requirements: string[];
  documents: string[];
}> = {
  'skilled-189': {
    name: 'Skilled Independent Visa',
    subclass: '189',
    category: 'Skilled Migration',
    description: 'This visa allows invited workers with skills Australia needs to live and work permanently anywhere in Australia.',
    processingTime: '8-12 months',
    fee: '$4,640',
    requirements: [
      'Be under 45 years of age',
      'Have an occupation on the relevant skilled occupation list',
      'Have a suitable skills assessment for that occupation',
      'Be able to score 65 points or more on the points test',
      'Have Competent English',
      'Be invited to apply',
    ],
    documents: [
      'Passport or travel document',
      'Skills assessment result',
      'English test results',
      'Birth certificate',
      'Character documents (police checks)',
      'Educational qualifications',
      'Employment references',
    ],
  },
};

export async function generateMetadata({ params }: VisaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const visa = visaData[id] || { name: 'Visa Details', subclass: '' };
  
  return {
    title: `${visa.name} (Subclass ${visa.subclass}) | VisaHelper`,
    description: visa.description || 'Learn about this Australian visa type, requirements, and application process.',
  };
}

export default async function VisaDetailPage({ params }: VisaDetailPageProps) {
  const { id } = await params;
  const visa = visaData[id] || {
    name: 'Skilled Independent Visa',
    subclass: '189',
    category: 'Skilled Migration',
    description: 'This visa allows invited workers with skills Australia needs to live and work permanently anywhere in Australia.',
    processingTime: '8-12 months',
    fee: '$4,640',
    requirements: [
      'Be under 45 years of age',
      'Have an occupation on the relevant skilled occupation list',
      'Have a suitable skills assessment for that occupation',
      'Be able to score 65 points or more on the points test',
      'Have Competent English',
      'Be invited to apply',
    ],
    documents: [
      'Passport or travel document',
      'Skills assessment result',
      'English test results',
      'Birth certificate',
      'Character documents (police checks)',
      'Educational qualifications',
      'Employment references',
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <Link href="/visas" className="hover:text-[#0052cc]">Visas</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{visa.category}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900">{visa.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                  >
                    Subclass {visa.subclass}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-slate-600">
                    {visa.category}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{visa.name}</h1>
                <p className="text-lg text-slate-600 max-w-3xl">{visa.description}</p>
              </div>

              <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Application Fee</p>
                  <p className="text-3xl font-bold text-slate-900">{visa.fee}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Processing Time</span>
                </div>
                <p className="font-semibold text-slate-900">{visa.processingTime}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Stay Duration</span>
                </div>
                <p className="font-semibold text-slate-900">Permanent</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Family Included</span>
                </div>
                <p className="font-semibold text-slate-900">Yes</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Success Rate</span>
                </div>
                <p className="font-semibold text-slate-900">92%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content with Tabs */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Overview */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                      <BookOpen className="w-5 h-5" style={{ color: '#0052cc' }} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Overview</h2>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600">
                      The {visa.name} (Subclass {visa.subclass}) is a permanent residence visa 
                      for points-tested skilled workers who are not sponsored by an employer 
                      or family member or nominated by a state or territory government.
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">With this visa, you can:</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Stay in Australia permanently</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Work and study in Australia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Enroll in Medicare, Australia&apos;s public healthcare scheme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Sponsor eligible relatives for permanent residence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Travel to and from Australia for 5 years</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Apply for Australian citizenship, if eligible</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Eligibility Requirements */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                      <CheckCircle className="w-5 h-5" style={{ color: '#0052cc' }} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Eligibility Requirements</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {visa.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                          style={{ backgroundColor: '#0052cc', color: 'white' }}
                        >
                          {idx + 1}
                        </div>
                        <p className="text-slate-700">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Required */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
                      <FileText className="w-5 h-5" style={{ color: '#0052cc' }} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Required Documents</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {visa.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3F4F6' }}>
                          <FileText className="w-5 h-5 text-slate-500" />
                        </div>
                        <span className="text-slate-700 font-medium">{doc}</span>
                      </div>
                    ))}
                  </div>

                  {/* Premium Lock */}
                  <div className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: '#F3F4F6' }}>
                    <Lock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-600 mb-4">
                      Unlock the complete document checklist and personalized guidance for just $49
                    </p>
                    <Link
                      href={`/visas/${id}/checkout`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#0052cc' }}
                    >
                      Unlock Premium
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Premium Card */}
                <div className="p-6 rounded-2xl text-white" style={{ backgroundColor: '#0052cc' }}>
                  <h3 className="text-xl font-bold mb-2">Unlock Full Guide</h3>
                  <p className="text-blue-100 mb-6">
                    Get complete access to our step-by-step application guide, document templates, and expert tips.
                  </p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-blue-200">/one-time</span>
                  </div>

                  <ul className="space-y-3 mb-6 text-sm">
                    {[
                      'Complete step-by-step guide',
                      'Document checklist & templates',
                      'Application form assistance',
                      'Expert tips & common mistakes',
                      'Priority email support',
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/visas/${id}/checkout`}
                    className="block w-full py-3 text-center rounded-lg font-semibold bg-white hover:bg-blue-50 transition-colors"
                    style={{ color: '#0052cc' }}
                  >
                    Get Premium Access
                  </Link>
                </div>

                {/* Processing Time Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5" style={{ color: '#0052cc' }} />
                    <h3 className="font-semibold text-slate-900">Processing Tracker</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">25th percentile</span>
                        <span className="font-medium">6 months</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '30%', backgroundColor: '#10B981' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">50th percentile (Median)</span>
                        <span className="font-medium">10 months</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '55%', backgroundColor: '#0052cc' }} />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">75th percentile</span>
                        <span className="font-medium">15 months</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '85%', backgroundColor: '#F59E0B' }} />
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/tracker"
                    className="flex items-center justify-center gap-2 mt-6 text-sm font-medium hover:underline"
                    style={{ color: '#0052cc' }}
                  >
                    View Full Tracker
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Lawyer Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5" style={{ color: '#0052cc' }} />
                    <h3 className="font-semibold text-slate-900">Need Expert Help?</h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-4">
                    Connect with verified immigration lawyers specializing in this visa type.
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: '#0052cc' }}
                      >
                        JD
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">John Davis</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-slate-500">4.9 (127 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/lawyers"
                    className="block w-full py-3 text-center rounded-lg border-2 font-semibold hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#0052cc', color: '#0052cc' }}
                  >
                    Find a Lawyer
                  </Link>
                </div>

                {/* News Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5" style={{ color: '#0052cc' }} />
                    <h3 className="font-semibold text-slate-900">Latest Updates</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: 'New points test changes announced', date: '2 days ago' },
                      { title: 'Processing times updated for Subclass 189', date: '1 week ago' },
                    ].map((news, idx) => (
                      <Link key={idx} href="/news" className="block p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <p className="font-medium text-slate-900 text-sm hover:text-[#0052cc] transition-colors">
                          {news.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{news.date}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
