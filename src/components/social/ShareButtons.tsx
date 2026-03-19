'use client';

import { useState } from 'react';
import { Share2, Link2, Twitter, Facebook, Linkedin, CheckCircle2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url}`
    : url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareData = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
  };

  const handleShare = (platform: keyof typeof shareData) => {
    window.open(shareData[platform], '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-slate-600"
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-2">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Link2 className="w-5 h-5 text-slate-500" />
              )}
              <span className={copied ? 'text-green-600' : 'text-slate-700'}>
                {copied ? 'Copied!' : 'Copy link'}
              </span>
            </button>
            
            <div className="border-t border-gray-100 my-1" />
            
            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Twitter className="w-5 h-5 text-sky-500" />
              <span className="text-slate-700">Share on X</span>
            </button>
            
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-slate-700">Share on Facebook</span>
            </button>
            
            <button
              onClick={() => handleShare('linkedin')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <Linkedin className="w-5 h-5 text-blue-700" />
              <span className="text-slate-700">Share on LinkedIn</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
