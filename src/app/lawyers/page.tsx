import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Filter, Star, MapPin, Clock, Briefcase, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Find Immigration Lawyers | VisaHelper - Verified Professionals',
  description: 'Connect with verified Australian immigration lawyers. Compare ratings, reviews, and pricing to find the right lawyer for your needs.',
};

const lawyers = [
  {
    id: 1,
    name: 'Dr. James Morrison',
    firm: 'Morrison Migration Law',
    rating: 4.9,
    reviews: 127,
    hourlyRate: 350,
    location: 'Sydney, NSW',
    experience: 18,
    specializations: ['Skilled Migration', 'Business Visas', 'Appeals'],
    languages: ['English', 'Mandarin'],
    image: 'JM',
    available: true,
  },
  {
    id: 2,
    name: 'Priya Patel',
    firm: 'Patel & Associates',
    rating: 4.8,
    reviews: 89,
    hourlyRate: 280,
    location: 'Melbourne, VIC',
    experience: 12,
    specializations: ['Family Visas', 'Partner Visas', 'Citizenship'],
    languages: ['English', 'Hindi', 'Gujarati'],
    image: 'PP',
    available: true,
  },
  {
    id: 3,
    name: 'Michael Chen',
    firm: 'Chen Immigration Lawyers',
    rating: 4.9,
    reviews: 203,
    hourlyRate: 400,
    location: 'Sydney, NSW',
    experience: 22,
    specializations: ['Business Visas', 'Investor Visas', 'Global Talent'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    image: 'MC',
    available: false,
  },
  {
    id: 4,
    name: 'Sarah Williams',
    firm: 'Williams Migration Services',
    rating: 4.7,
    reviews: 64,
    hourlyRate: 250,
    location: 'Brisbane, QLD',
    experience: 8,
    specializations: ['Student Visas', 'Graduate Visas', 'Work Visas'],
    languages: ['English'],
    image: 'SW',
    available: true,
  },
  {
    id: 5,
    name: 'Ahmed Hassan',
    firm: 'Hassan Legal Group',
    rating: 4.8,
    reviews: 156,
    hourlyRate: 320,
    location: 'Perth, WA',
    experience: 15,
    specializations: ['Protection Visas', 'Humanitarian', 'Complex Cases'],
    languages: ['English', 'Arabic'],
    image: 'AH',
    available: true,
  },
  {
    id: 6,
    name: 'Emma Thompson',
    firm: 'Thompson & Co',
    rating: 4.9,
    reviews: 92,
    hourlyRate: 380,
    location: 'Adelaide, SA',
    experience: 16,
    specializations: ['Employer Sponsored', 'Regional Visas', 'Labour Agreements'],
    languages: ['English'],
    image: 'ET',
    available: true,
  },
];

const filters = {
  location: ['All Locations', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  specialization: ['All Specializations', 'Skilled Migration', 'Family Visas', 'Business Visas', 'Student Visas', 'Employer Sponsored'],
  price: ['Any Price', 'Under $300/hr', '$300-$400/hr', 'Over $400/hr'],
  language: ['Any Language', 'English', 'Mandarin', 'Hindi', 'Arabic', 'Vietnamese'],
};

export default function LawyersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Find Immigration Lawyers
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Connect with verified Australian immigration lawyers. Browse profiles, 
                compare ratings, and book consultations online.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, firm, or specialization..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(filters).map(([category, options]) => (
                <div key={category} className="relative">
                  <select className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 text-slate-700 text-sm focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none bg-white cursor-pointer">
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lawyers Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">Showing <span className="font-semibold text-slate-900">{lawyers.length}</span> lawyers</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Sort by:</span>
                <select className="text-sm font-medium text-slate-900 focus:outline-none cursor-pointer">
                  <option>Recommended</option>
                  <option>Highest Rated</option>
                  <option>Lowest Price</option>
                  <option>Most Experienced</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers.map((lawyer) => (
                <Link
                  key={lawyer.id}
                  href={`/lawyers/${lawyer.id}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: '#0052cc' }}
                        >
                          {lawyer.image}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-[#0052cc] transition-colors">
                            {lawyer.name}
                          </h3>
                          <p className="text-sm text-slate-500">{lawyer.firm}</p>
                        </div>
                      </div>
                      
                      {lawyer.available && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-slate-900">{lawyer.rating}</span>
                        <span className="text-sm text-slate-500">({lawyer.reviews})</span>
                      </div>
                      <span className="text-gray-300">|</span>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Briefcase className="w-4 h-4" />
                        {lawyer.experience} years
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-slate-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      {lawyer.location}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {lawyer.specializations.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-slate-600"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-slate-500">Languages:</span>
                      <span className="text-sm text-slate-700">{lawyer.languages.join(', ')}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm text-slate-500">From</span>
                        <p className="text-xl font-bold text-slate-900">${lawyer.hourlyRate}<span className="text-sm font-normal text-slate-500">/hr</span></p>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#F3F4F6' }}
                      >
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0052cc] transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-4 py-2 rounded-lg text-white font-medium" style={{ backgroundColor: '#0052cc' }}>
                1
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors">
                3
              </button>
              <span className="px-2">...</span>
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-slate-600 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Lawyer CTA */}
        <section className="py-16 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Are you an immigration lawyer?</h2>
            <p className="text-lg text-slate-600 mb-8">
              Join our network of verified lawyers and connect with potential clients looking for your expertise.
            </p>
            <Link
              href="/lawyers/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
              style={{ backgroundColor: '#0052cc' }}
            >
              Join as a Lawyer
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
