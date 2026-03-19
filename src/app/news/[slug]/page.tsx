import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ThumbsUp, Bookmark } from 'lucide-react';
import LawyerComments from '@/components/news/LawyerComments';
import UserQuestions from '@/components/news/UserQuestions';
import RelatedArticles from '@/components/news/RelatedArticles';
import ShareButtons from '@/components/social/ShareButtons';
import BookmarkButton from '@/components/social/BookmarkButton';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Mock article data with realistic Australian immigration content
const articleData = {
  id: '1',
  slug: 'major-changes-skilled-migration-2026',
  title: 'Major Changes to Australia\'s Skilled Migration Program Announced',
  excerpt: 'The Australian government has announced significant reforms to the skilled migration program, including changes to the points test and new occupation lists effective July 2026.',
  content: `
    <p>The Australian government has announced sweeping changes to the skilled migration program, set to take effect from July 1, 2026. These reforms represent the most significant overhaul of the skilled migration system in over a decade.</p>
    
    <h2>Key Changes</h2>
    
    <p>The reforms include several major updates to the points test, occupation lists, and visa processing priorities. Here\'s what applicants need to know:</p>
    
    <h3>1. Updated Points Test</h3>
    
    <p>The points test will now place greater emphasis on factors that contribute to long-term economic success. Key changes include:</p>
    
    <ul>
      <li>Increased points for applicants with skilled partners (10 points)</li>
      <li>Additional points for STEM qualifications (10 points)</li>
      <li>Revised age points distribution to favor younger applicants</li>
      <li>Removal of points for professional year and regional study</li>
    </ul>
    
    <h3>2. New Occupation Lists</h3>
    
    <p>The government has released a consolidated occupation list that better reflects Australia\'s current labor market needs. Over 200 new occupations have been added, including emerging roles in artificial intelligence, cybersecurity, and renewable energy.</p>
    
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
    
    <p>Applicants who have already submitted their Expression of Interest (EOI) will not be affected by the new points test until they submit a new EOI. However, those who haven\'t yet received an invitation may want to review their points under the new system.</p>
    
    <p>The government has assured that all applications lodged before July 1, 2026, will be processed under the current rules.</p>
    
    <h2>What Should You Do?</h2>
    
    <p>If you\'re considering applying for a skilled visa, we recommend:</p>
    
    <ol>
      <li>Review the new occupation list to confirm your occupation is still eligible</li>
      <li>Calculate your points under the new test</li>
      <li>Consider consulting with a registered migration agent</li>
      <li>Submit your EOI before July 1 if you\'re ready</li>
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
  image: '/images/news/skilled-migration-changes.jpg',
};

// Enhanced lawyer comments with more realistic data
const lawyerCommentsData = [
  {
    id: '1',
    lawyer: {
      id: 'lawyer-1',
      name: 'Dr. James Morrison',
      firm: 'Morrison Migration Law',
      avatar: 'JM',
      isVerified: true,
      specialization: 'Skilled Migration',
      yearsExperience: 18,
    },
    date: 'March 15, 2026',
    content: 'These changes will significantly impact many of our clients. The removal of points for professional year is particularly concerning for accounting and IT graduates who have invested heavily in this pathway. However, the increased points for skilled partners will benefit many family units. I recommend anyone currently on the professional year pathway to seek immediate advice about their options before July 2026.',
    likes: 47,
    isHelpful: true,
    replyCount: 8,
    isPinned: true,
  },
  {
    id: '2',
    lawyer: {
      id: 'lawyer-2',
      name: 'Priya Patel',
      firm: 'Patel & Associates',
      avatar: 'PP',
      isVerified: true,
      specialization: 'Business Visas',
      yearsExperience: 12,
    },
    date: 'March 16, 2026',
    content: 'The increased emphasis on STEM qualifications is a welcome change that aligns Australia with other competitive migration destinations. However, I\'m concerned about how the revised age points will affect experienced professionals over 35. Many of these individuals bring valuable industry experience that the current system adequately recognizes.',
    likes: 32,
    isHelpful: true,
    replyCount: 5,
    isPinned: false,
  },
  {
    id: '3',
    lawyer: {
      id: 'lawyer-5',
      name: 'Ahmed Hassan',
      firm: 'Hassan Legal Group',
      avatar: 'AH',
      isVerified: true,
      specialization: 'Complex Cases',
      yearsExperience: 15,
    },
    date: 'March 16, 2026',
    content: 'From a policy perspective, these changes aim to address Australia\'s evolving economic needs. The focus on younger, STEM-educated applicants reflects the government\'s priority on innovation and long-term economic contribution. However, the transitional arrangements will be critical - we need clarity on how existing EOIs will be treated.',
    likes: 28,
    isHelpful: true,
    replyCount: 3,
    isPinned: false,
  },
];

// User questions data
const userQuestionsData = [
  {
    id: 'q1',
    user: {
      name: 'Rahul K.',
      isVerifiedApplicant: true,
    },
    date: 'March 16, 2026',
    question: 'I completed my professional year in 2025 but haven\'t submitted my EOI yet. Will I still get points for it if I apply before July 2026?',
    votes: 23,
    answers: [
      {
        id: 'a1',
        user: {
          name: 'Dr. James Morrison',
          isLawyer: true,
          firm: 'Morrison Migration Law',
          avatar: 'JM',
        },
        date: 'March 16, 2026',
        content: 'Based on the announcement, applications lodged before July 1, 2026 will be processed under current rules. This means if you submit your EOI before that date, you should still receive points for your professional year. However, I strongly recommend submitting as soon as possible to avoid any last-minute system issues.',
        isAccepted: true,
        votes: 15,
      },
    ],
    isAnswered: true,
  },
  {
    id: 'q2',
    user: {
      name: 'Emily S.',
      isVerifiedApplicant: false,
    },
    date: 'March 17, 2026',
    question: 'My occupation is on the new priority list (registered nurse). Does this guarantee faster processing?',
    votes: 18,
    answers: [
      {
        id: 'a2',
        user: {
          name: 'Priya Patel',
          isLawyer: true,
          firm: 'Patel & Associates',
          avatar: 'PP',
        },
        date: 'March 17, 2026',
        content: 'Being on the priority list means your application will be given priority in processing queues, but it doesn\'t guarantee a specific timeframe. Healthcare occupations like nursing are currently seeing processing times of 3-6 months under priority processing, compared to 8-12 months for non-priority occupations.',
        isAccepted: true,
        votes: 12,
      },
    ],
    isAnswered: true,
  },
  {
    id: 'q3',
    user: {
      name: 'Michael T.',
      isVerifiedApplicant: true,
    },
    date: 'March 17, 2026',
    question: 'I\'m 37 years old with a PhD in Engineering. How will the new age points affect me?',
    votes: 14,
    answers: [],
    isAnswered: false,
  },
];

// Related articles
const relatedArticlesData = [
  {
    id: '2',
    title: 'New Priority Processing Categories Explained',
    excerpt: 'Healthcare, education, and infrastructure occupations now receive priority processing.',
    slug: 'priority-processing-categories-explained',
    date: 'March 14, 2026',
    readTime: '4 min read',
    category: 'Visa Updates',
  },
  {
    id: '3',
    title: 'Updated Points Test Calculator: 2026 Edition',
    excerpt: 'Calculate your points under the new skilled migration points test.',
    slug: 'points-test-calculator-2026',
    date: 'March 13, 2026',
    readTime: '3 min read',
    category: 'Tools',
  },
  {
    id: '4',
    title: 'Occupation List Changes: What\'s In and What\'s Out',
    excerpt: 'Comprehensive breakdown of the 200+ new occupations added to the skilled migration list.',
    slug: 'occupation-list-changes-2026',
    date: 'March 12, 2026',
    readTime: '6 min read',
    category: 'Policy Update',
  },
  {
    id: '5',
    title: 'Regional Visa Options After the 2026 Changes',
    excerpt: 'How regional visa pathways have been affected by the recent policy updates.',
    slug: 'regional-visa-options-2026',
    date: 'March 10, 2026',
    readTime: '4 min read',
    category: 'Regional',
  },
];

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  return {
    title: `${articleData.title} | VisaHelper News`,
    description: articleData.excerpt,
    keywords: ['Australian immigration', 'skilled migration', 'points test', 'visa changes', '2026'],
    openGraph: {
      type: 'article',
      title: articleData.title,
      description: articleData.excerpt,
      publishedTime: new Date(articleData.date).toISOString(),
      authors: [articleData.author.name],
      images: [{
        url: articleData.image,
        width: 1200,
        height: 630,
        alt: articleData.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: articleData.title,
      description: articleData.excerpt,
      images: [articleData.image],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;

  // In production, fetch article data from Supabase based on slug
  const article = articleData;

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title: article.title,
    description: article.excerpt,
    url: `/news/${slug}`,
    image: article.image,
    publishedTime: new Date(article.date).toISOString(),
    author: { name: article.author.name },
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'News', url: '/news' },
    { name: article.title, url: `/news/${slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
            <div className="lg:col-span-2 space-y-8">
              {/* Article Content */}
              <article className="bg-white rounded-2xl border border-gray-200 p-8">
                <div 
                  className="prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Article Actions */}
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-600">
                      <ThumbsUp className="w-5 h-5" />
                      <span>Like</span>
                    </button>
                    <ShareButtons 
                      title={article.title} 
                      url={`/news/${slug}`} 
                      description={article.excerpt}
                    />
                  </div>
                  <BookmarkButton 
                    itemId={article.id} 
                    itemType="article" 
                    variant="button"
                  />
                </div>
              </article>

              {/* Lawyer Comments */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <LawyerComments 
                  comments={lawyerCommentsData}
                  articleId={article.id}
                />
              </div>

              {/* User Questions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <UserQuestions 
                  questions={userQuestionsData}
                  articleId={article.id}
                />
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
              <RelatedArticles 
                articles={relatedArticlesData}
                currentArticleId={article.id}
              />

              {/* CTA */}
              <div className="p-6 rounded-2xl text-white" style={{ backgroundColor: '#0052cc' }}>
                <h3 className="font-semibold mb-2">Need Personalized Advice?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Connect with verified immigration lawyers for expert guidance on these changes.
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
