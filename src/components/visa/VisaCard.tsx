'use client';

import React from 'react';
import Link from 'next/link';
import { Visa } from '@/types';

interface VisaCardProps {
  visa: Visa;
  showPremiumBadge?: boolean;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  work: { bg: 'bg-blue-100', text: 'text-blue-700' },
  family: { bg: 'bg-pink-100', text: 'text-pink-700' },
  student: { bg: 'bg-green-100', text: 'text-green-700' },
  business: { bg: 'bg-purple-100', text: 'text-purple-700' },
  visitor: { bg: 'bg-orange-100', text: 'text-orange-700' },
  protection: { bg: 'bg-red-100', text: 'text-red-700' },
};

export default function VisaCard({ visa, showPremiumBadge = true }: VisaCardProps): JSX.Element {
  const colors = categoryColors[visa.category] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <Link
      href={`/visas/${visa.id}`}
      className="group block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
          {visa.category.charAt(0).toUpperCase() + visa.category.slice(1)}
        </span>
        {showPremiumBadge && visa.premium_price > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Premium
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
        {visa.name}
      </h3>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {visa.short_description || 'Explore visa options and requirements for your Australian immigration journey.'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Subclass</span>
          <span className="text-sm font-medium text-slate-700">{visa.subclass}</span>
        </div>
        <div className="flex items-center text-blue-600 text-sm font-medium">
          Learn more
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
