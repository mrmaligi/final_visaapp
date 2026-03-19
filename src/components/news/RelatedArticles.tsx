'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  currentArticleId: string;
}

export default function RelatedArticles({ articles, currentArticleId }: RelatedArticlesProps) {
  const filteredArticles = articles.filter(a => a.id !== currentArticleId).slice(0, 4);

  if (filteredArticles.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-slate-900 mb-4">Related Articles</h3>
      
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Link 
            key={article.id} 
            href={`/news/${article.slug}`}
            className="block group"
          >
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#DBEAFE' }}
              >
                <span className="text-xs font-medium text-center px-1" style={{ color: '#0052cc' }}>
                  {article.category}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-slate-900 group-hover:text-[#0052cc] transition-colors text-sm line-clamp-2">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
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
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/news"
        className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100 text-sm font-medium hover:underline"
        style={{ color: '#0052cc' }}
      >
        View all news
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
