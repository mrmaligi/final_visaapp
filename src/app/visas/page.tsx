import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Filter, Clock, DollarSign, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Categories | VisaHelper - Australian Visa Information',
  description: 'Explore all Australian visa categories. Find the right visa for your situation with detailed guides and requirements.',
};

const visaCategories = [
  {
    id: 'skilled',
    title: 'Skilled Migration',
    description: 'For skilled workers and professionals seeking to live and work in Australia permanently.',
    visas: [
      { name: 'Skilled Independent', subclass: '189', processingTime: '8-12 months', fee: '$4,640' },
      { name: 'Skilled Nominated', subclass: '190', processingTime: '8-11 months', fee: '$4,640' },
      { name: 'Skilled Work Regional', subclass: '491', processingTime: '8-11 months', fee: '$4,640' },
    ],
    color: 'bg-blue-500',
  },
  {
    id: 'family',
    title: 'Family Visas',
    description: 'Reunite with your loved ones in Australia through partner, parent, or child visas.',
    visas: [
      { name: 'Partner Visa', subclass: '820/801', processingTime: '18-24 months', fee: '$8,850' },
      { name: 'Prospective Marriage', subclass: '300', processingTime: '12-18 months', fee: '$8,850' },
      { name: 'Parent Visa', subclass: '103', processingTime: '30+ years', fee: '$6,415' },
    ],
    color: 'bg-rose-500',
  },
  {
    id: 'student',
    title: 'Student Visas',
    description: 'Study at world-class Australian institutions and gain valuable international experience.',
    visas: [
      { name: 'Student Visa', subclass: '500', processingTime: '1-3 months', fee: '$710' },
      { name: 'Student Guardian', subclass: '590', processingTime: '1-3 months', fee: '$710' },
      { name: 'Training Visa', subclass: '407', processingTime: '2-4 months', fee: '$405' },
    ],
    color: 'bg-emerald-500',
  },
  {
    id: 'business',
    title: 'Business Visas',
    description: 'For entrepreneurs, investors, and business owners looking to establish themselves in Australia.',
    visas: [
      { name: 'Business Innovation', subclass: '188', processingTime: '12-18 months', fee: '$6,270' },
      { name: 'Business Talent', subclass: '132', processingTime: '18-24 months', fee: '$9,945' },
      { name: 'Investor Stream', subclass: '188B', processingTime: '18-24 months', fee: '$6,270' },
    ],
    color: 'bg-amber-500',
  },
  {
    id: 'visitor',
    title: 'Visitor Visas',
    description: 'Visit Australia for tourism, business meetings, or to see family and friends.',
    visas: [
      { name: 'Visitor Visa', subclass: '600', processingTime: '20-30 days', fee: '$190' },
      { name: 'eVisitor', subclass: '651', processingTime: '1-3 days', fee: 'Free' },
      { name: 'Working Holiday', subclass: '417', processingTime: '1-3 weeks', fee: '$635' },
    ],
    color: 'bg-purple-500',
  },
  {
    id: 'work',
    title: 'Work Visas',
    description: 'Temporary and permanent work visas sponsored by Australian employers.',
    visas: [
      { name: 'Temporary Skill Shortage', subclass: '482', processingTime: '1-3 months', fee: '$3,115' },
      { name: 'Employer Nomination', subclass: '186', processingTime: '6-11 months', fee: '$4,640' },
      { name: 'Regional Sponsor', subclass: '187', processingTime: '6-11 months', fee: '$4,640' },
    ],
    color: 'bg-cyan-500',
  },
];

export default function VisasPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Australian Visa Categories
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Find the right visa for your situation. Browse our comprehensive guides 
                and unlock premium content for just $49.
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search visas, subclass numbers, or keywords..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gray-200 text-slate-700 font-medium hover:bg-gray-50 transition-colors">
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {visaCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 md:p-8 border-b border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{category.title}</h2>
                        <p className="text-slate-600">{category.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {category.visas.map((visa) => (
                      <Link
                        key={visa.subclass}
                        href={`/visas/${category.id}-${visa.subclass}`}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg"
                            style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                          >
                            {visa.subclass.replace(/\/.*/, '')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                              {visa.name}
                            </h3>
                            <p className="text-sm text-slate-500">Subclass {visa.subclass}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 md:gap-8">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="w-4 h-4" />
                            <span>{visa.processingTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <DollarSign className="w-4 h-4" />
                            <span>{visa.fee}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-[#0052cc] transition-colors"
                            style={{ backgroundColor: '#F3F4F6' }}>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Not sure which visa is right for you?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Our visa wizard can help you find the best option based on your circumstances.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0052cc' }}
            >
              Get Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
