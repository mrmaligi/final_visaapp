import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: 'Article | VisaHelper News',
    description: 'Read the latest immigration news and updates on VisaHelper.',
  };
}

// Mock article data
const articleData = {
  title: 'Major Changes to Australia\'s Skilled Migration Program Announced',
  excerpt: 'The Australian government has announced significant reforms to the skilled migration program.',
  content: `
    <p>The Australian government has announced sweeping changes to the skilled migration program, set to take effect from July 1, 2026. These reforms represent the most significant overhaul of the skilled migration system in over a decade.</p>
    
    <h2>Key Changes</h2>
    
    <p>The reforms include several major updates to the points test, occupation lists, and visa processing priorities. Here's what applicants need to know:</p>
    
    <h3>1. Updated Points Test</h3>
    
    <p>The points test will now place greater emphasis on factors that contribute to long-term economic success. Key changes include:</p>
    
    <ul>
      <li>Increased points for applicants with skilled partners (10 points)</li>
      <li>Additional points for STEM qualifications (10 points)</li>
      <li>Revised age points distribution to favor younger applicants</li>
      <li>Removal of points for professional year and regional study</li>
    </ul>
    
    <h3>2. New Occupation Lists</h3>
    
    <p>The government has released a consolidated occupation list that better reflects Australia's current labor market needs. Over 200 new occupations have been added, including emerging roles in artificial intelligence, cybersecurity, and renewable energy.</p>
    
    <h3>3. Priority Processing</h3>
    
    <p>Applications for occupations in critical sectors such as healthcare, education, and infrastructure will receive priority processing. This aims to address immediate skills shortages in these key areas.</p>
    
    <h2>Timeline</h2>
    
    <p>The changes will be implemented in phases:</p>
    
    <ul>
      <li><strong>July 1, 2026:</strong> New points test and occupation lists take effect</li>
      <li><strong>October 1, 2026:</strong> Priority processing categories updated</li>
      <li><strong>January 1, 2027:</strong> Full implementation of all reforms</li>
    </ul>
    
    <h2>Impact on Current Applicants</h2>
    
    <p>Applicants who have already submitted their Expression of Interest (EOI) will not be affected by the new points test until they submit a new EOI. However, those who haven't yet received an invitation may want to review their points under the new system.</p>
    
    <p>The government has assured that all applications lodged before July 1, 2026, will be processed under the current rules.</p>
    
    <h2>What Should You Do?</h2>
    
    <p>If you're considering applying for a skilled visa, we recommend:</p>
    
    <ol>
      <li>Review the new occupation list to confirm your occupation is still eligible</li>
      <li>Calculate your points under the new test</li>
      <li>Consider consulting with a registered migration agent</li>
      <li>Submit your EOI before July 1 if you're ready</li>
    </ol>
    
    <p>Stay tuned for more detailed guides on how these changes affect specific visa subclasses.</p>
  `,
  date: 'March 15, 2026',
  readTime: '5 min read',
  author: {
    name: 'Sarah Chen',
    title: 'Senior Immigration Consultant',
    bio: 'Sarah has over 15 years of experience in Australian immigration law and regularly contributes to policy discussions.',
  },
  category: 'Policy Update',
};

// Mock lawyer comments
const lawyerComments = [
  {
    id: 1,
    lawyer: {
      name: 'James Morrison',
      firm: 'Morrison Migration Law',
      avatar: 'JM',
    },
    date: 'March 15, 2026',
    content: 'These changes will significantly impact many of our clients. The removal of points for professional year is particularly concerning for accounting and IT graduates who have invested heavily in this pathway.',
    likes: 24,
  },
  {
    id: 2,
    lawyer: {
      name: 'Priya Patel',
      firm: 'Patel & Associates',
      avatar: 'PP',
    },
    date: 'March 16, 2026',
    content: 'The increased emphasis on STEM qualifications is a welcome change. However, I\'m concerned about how the revised age points will affect experienced professionals over 35.',
    likes: 18,
  },
];

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;

  // In production, fetch article data from Supabase based on slug
  // For now, use mock data
  const article = articleData;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link 
              href="/news" 
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#0052cc] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
              >
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                  style={{ backgroundColor: '#0052cc' }}
                >
                  {article.author.name.charAt(0)}
                </div>
                <span className="font-medium text-slate-900">{article.author.name}</span>
              </div>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </span>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Article Actions */}
                <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-600">
                    <ThumbsUp className="w-5 h-5" />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-600">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </article>

              {/* Lawyer Comments */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5" style={{ color: '#0052cc' }} />
                  <h2 className="text-xl font-bold text-slate-900">Expert Comments</h2>
                </div>

                <div className="space-y-6">
                  {lawyerComments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl" style={{ backgroundColor: '#F9FAFB' }}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                          style={{ backgroundColor: '#0052cc' }}
                        >
                          {comment.lawyer.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-semibold text-slate-900">{comment.lawyer.name}</p>
                              <p className="text-sm text-slate-500">{comment.lawyer.firm}</p>
                            </div>
                            <span className="text-sm text-slate-400">{comment.date}</span>
                          </div>
                          
                          <p className="text-slate-700 mb-3">{comment.content}</p>
                          
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0052cc] transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{comment.likes}</span>
                            </button>
                            <button className="text-sm text-slate-500 hover:text-[#0052cc] transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: '#0052cc' }}
                  >
                    {article.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{article.author.name}</p>
                    <p className="text-sm text-slate-500">{article.author.title}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4">{article.author.bio}</p>
                
                <button className="w-full py-2 rounded-lg border-2 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#0052cc', color: '#0052cc' }}
                >
                  View Profile
                </button>
              </div>

              {/* Related Articles */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
                
                <div className="space-y-4">
                  {[
                    { title: 'New Priority Processing Categories', date: 'March 14, 2026' },
                    { title: 'Updated Points Test Calculator', date: 'March 13, 2026' },
                    { title: 'Occupation List Changes Explained', date: 'March 12, 2026' },
                  ].map((related, idx) => (
                    <Link key={idx} href="#" className="block group">
                      <p className="font-medium text-slate-900 group-hover:text-[#0052cc] transition-colors text-sm">
                        {related.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{related.date}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="p-6 rounded-2xl text-white" style={{ backgroundColor: '#0052cc' }}>
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Connect with verified immigration lawyers for personalized advice.
                </p>
                <Link
                  href="/lawyers"
                  className="block w-full py-2 text-center rounded-lg bg-white font-semibold text-sm hover:bg-blue-50 transition-colors"
                  style={{ color: '#0052cc' }}
                >
                  Find a Lawyer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
