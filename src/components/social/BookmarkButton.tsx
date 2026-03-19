'use client';

import { useState } from 'react';
import { Bookmark, BookmarkCheck, Heart } from 'lucide-react';

interface BookmarkButtonProps {
  itemId: string;
  itemType: 'visa' | 'lawyer' | 'article';
  initialBookmarked?: boolean;
  onBookmark?: (bookmarked: boolean) => void;
  variant?: 'icon' | 'button';
}

export default function BookmarkButton({ 
  itemId, 
  itemType, 
  initialBookmarked = false, 
  onBookmark,
  variant = 'icon'
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    
    // In production, this would call the Supabase API
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) {
    //   // Show login prompt
    //   return;
    // }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onBookmark?.(newState);
    
    setIsLoading(false);
  };

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isBookmarked
            ? 'bg-blue-50 text-[#0052cc] border-2 border-[#0052cc]'
            : 'bg-white text-slate-600 border-2 border-gray-200 hover:border-[#0052cc] hover:text-[#0052cc]'
        }`}
      >
        {isBookmarked ? (
          <>
            <BookmarkCheck className="w-4 h-4" />
            <span>Saved</span>
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            <span>Save</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-lg transition-colors ${
        isBookmarked
          ? 'text-[#0052cc] bg-blue-50'
          : 'text-slate-400 hover:text-[#0052cc] hover:bg-gray-50'
      }`}
      title={isBookmarked ? 'Remove from saved' : 'Save for later'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-5 h-5" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </button>
  );
}

interface SavedItemsListProps {
  savedVisas: { id: string; name: string; subclass: string; category: string }[];
  savedLawyers: { id: string; name: string; firm: string; rating: number }[];
  savedArticles: { id: string; title: string; date: string; category: string }[];
}

export function SavedItemsList({ savedVisas, savedLawyers, savedArticles }: SavedItemsListProps) {
  const [activeTab, setActiveTab] = useState<'visas' | 'lawyers' | 'articles'>('visas');

  const tabs = [
    { id: 'visas', label: 'Visas', count: savedVisas.length },
    { id: 'lawyers', label: 'Lawyers', count: savedLawyers.length },
    { id: 'articles', label: 'Articles', count: savedArticles.length },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#0052cc]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-blue-100 text-[#0052cc]'
                : 'bg-gray-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#0052cc' }} />
            )}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === 'visas' && (
          <div className="space-y-3">
            {savedVisas.map((visa) => (
              <a
                key={visa.id}
                href={`/visas/${visa.subclass}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
                >
                  {visa.subclass}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{visa.name}</p>
                  <p className="text-xs text-slate-500">{visa.category}</p>
                </div>
                <BookmarkCheck className="w-4 h-4 text-[#0052cc]" />
              </a>
            ))}
            {savedVisas.length === 0 && (
              <p className="text-center text-slate-500 py-8">No saved visas yet.</p>
            )}
          </div>
        )}

        {activeTab === 'lawyers' && (
          <div className="space-y-3">
            {savedLawyers.map((lawyer) => (
              <a
                key={lawyer.id}
                href={`/lawyers/${lawyer.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: '#0052cc' }}
                >
                  {lawyer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{lawyer.name}</p>
                  <p className="text-xs text-slate-500">{lawyer.firm}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-slate-600">{lawyer.rating}</span>
                </div>
              </a>
            ))}
            {savedLawyers.length === 0 && (
              <p className="text-center text-slate-500 py-8">No saved lawyers yet.</p>
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="space-y-3">
            {savedArticles.map((article) => (
              <a
                key={article.id}
                href={`/news/${article.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#DBEAFE' }}
                >
                  <span className="text-xs font-medium" style={{ color: '#0052cc' }}>
                    {article.category}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 line-clamp-1">{article.title}</p>
                  <p className="text-xs text-slate-500">{article.date}</p>
                </div>
              </a>
            ))}
            {savedArticles.length === 0 && (
              <p className="text-center text-slate-500 py-8">No saved articles yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
