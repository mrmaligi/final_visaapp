import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Calendar, Clock, ArrowRight, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Immigration News | VisaHelper - Latest Updates',
  description: 'Stay updated with the latest Australian immigration news, policy changes, and visa updates.',
};

const featuredArticle = {
  title: 'Major Changes to Australia\'s Skilled Migration Program Announced',
  excerpt: 'The Australian government has announced significant reforms to the skilled migration program, including changes to the points test and new occupation lists.',
  date: 'March 15, 2026',
  readTime: '5 min read',
  author: 'Sarah Chen',
  category: 'Policy Update',
};

const articles = [
  {
    id: 1,
    title: 'New Priority Processing for Healthcare Workers',
    excerpt: 'Healthcare professionals applying for skilled visas will receive priority processing under new measures to address workforce shortages.',
    date: 'March 14, 2026',
    readTime: '3 min read',
    category: 'Visa Updates',
  },
  {
    id: 2,
    title: 'Student Visa Work Hours Expanded',
    excerpt: 'International students will be able to work additional hours during semester breaks under new regulations.',
    date: 'March 12, 2026',
    readTime: '4 min read',
    category: 'Student Visas',
  },
  {
    id: 3,
    title: 'Regional Visa Incentives Increased',
    excerpt: 'Additional points and faster processing times for applicants willing to settle in regional Australia.',
    date: 'March 10, 2026',
    readTime: '3 min read',
    category: 'Regional',
  },
  {
    id: 4,
    title: 'Partner Visa Processing Times Improve',
    excerpt: 'New resources allocated to partner visa processing have resulted in reduced wait times for applicants.',
    date: 'March 8, 2026',
    readTime: '2 min read',
    category: 'Family Visas',
  },
  {
    id: 5,
    title: 'Digital Passenger Declaration Now Mandatory',
    excerpt: 'All international arrivals must complete the Digital Passenger Declaration before boarding their flight.',
    date: 'March 6, 2026',
    readTime: '4 min read',
    category: 'Travel',
  },
  {
    id: 6,
    title: 'New Occupations Added to Priority List',
    excerpt: 'IT professionals, engineers, and tradespeople among new occupations added to the priority migration list.',
    date: 'March 4, 2026',
    readTime: '5 min read',
    category: 'Skilled Migration',
  },
];

const categories = [
  'All',
  'Policy Update',
  'Visa Updates',
  'Student Visas',
  'Skilled Migration',
  'Family Visas',
  'Regional',
  'Travel',
];

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Immigration News & Updates
              </h1>
              <p className="text-lg text-slate-600 mb-8">
                Stay informed with the latest Australian immigration news, policy changes, and visa updates.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((category, idx) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    idx === 0
                      ? 'text-white'
                      : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: idx === 0 ? '#0052cc' : undefined }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Article */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/news/major-changes-skilled-migration" className="block group">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="grid lg:grid-cols-2">
                  <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 mb-4">
                        {featuredArticle.category}
                      </span>
                      <svg className="h-20 w-20 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="px-3 py-1 rounded-full font-medium"
                        style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                      >
                        Featured
                      </span>
                      <span>{featuredArticle.date}</span>
                      <span>•</span>
                      <span>{featuredArticle.readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-[#0052cc] transition-colors">
                      {featuredArticle.title}
                    </h2>
                    
                    <p className="text-slate-600 text-lg mb-6">{featuredArticle.excerpt}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: '#0052cc' }}
                      >
                        {featuredArticle.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{featuredArticle.author}</p>
                        <p className="text-sm text-slate-500">Immigration Expert</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Article Grid */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Latest Articles</h2>
              <button className="text-sm font-medium hover:underline" style={{ color: '#0052cc' }}>
                View All
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                      >
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-[#0052cc] transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm line-clamp-2">{article.excerpt}</p>
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
      </main>

      <Footer />
    </div>
  );
}
