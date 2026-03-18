'use client';

import React from 'react';
import Link from 'next/link';
import { Visa } from '@/types';

interface VisaCardDetailedProps {
  visa: Visa;
  processingTime?: string;
  isPremium?: boolean;
}

const categoryIcons: Record<string, React.ReactNode> = {
  work: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  family: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  student: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  business: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  visitor: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  protection: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

const categoryColors: Record<string, string> = {
  work: 'bg-blue-100 text-blue-700',
  family: 'bg-pink-100 text-pink-700',
  student: 'bg-green-100 text-green-700',
  business: 'bg-purple-100 text-purple-700',
  visitor: 'bg-orange-100 text-orange-700',
  protection: 'bg-red-100 text-red-700',
};

export default function VisaCardDetailed({ 
  visa, 
  processingTime = 'TBD',
  isPremium = false 
}: VisaCardDetailedProps): React.ReactElement {
  const icon = categoryIcons[visa.category] || categoryIcons.work;
  const colorClass = categoryColors[visa.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-slate-500">Subclass {visa.subclass}</span>
              {visa.premium_price > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Premium
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{visa.name}</h3>
          </div>
        </div>

        <p className="text-slate-600 mb-6">
          {visa.short_description || 'Explore this visa option for your Australian immigration needs.'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Processing Time</p>
            <p className="text-sm font-semibold text-slate-900">{processingTime}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Application Fee</p>
            <p className="text-sm font-semibold text-slate-900">
              {visa.application_fee ? `$${visa.application_fee.toLocaleString()}` : 'Variable'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/visas/${visa.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isPremium ? 'Access Guide' : 'View Details'}
          </Link>
          {!isPremium && visa.premium_price > 0 && (
            <Link
              href={`/visas/${visa.id}?premium=true`}
              className="flex-1 bg-amber-100 text-amber-700 text-center py-2.5 rounded-lg font-medium hover:bg-amber-200 transition-colors"
            >
              Get Guide
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
