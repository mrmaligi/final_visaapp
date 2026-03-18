'use client';

import React from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  visaCount?: number;
  color?: 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'red';
}

const colorVariants = {
  blue: 'bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-600',
  green: 'bg-green-50 border-green-200 hover:border-green-300 text-green-600',
  purple: 'bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-600',
  pink: 'bg-pink-50 border-pink-200 hover:border-pink-300 text-pink-600',
  orange: 'bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-600',
  red: 'bg-red-50 border-red-200 hover:border-red-300 text-red-600',
};

export default function CategoryCard({
  title,
  description,
  href,
  icon,
  visaCount,
  color = 'blue',
}: CategoryCardProps): React.ReactElement {
  return (
    <Link
      href={href}
      className={`group block p-6 rounded-2xl border-2 transition-all duration-200 hover:shadow-lg ${colorVariants[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center">
          {icon}
        </div>
        {visaCount !== undefined && (
          <span className="text-sm font-medium">
            {visaCount} {visaCount === 1 ? 'visa' : 'visas'}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-800">
        {title}
      </h3>

      <p className="text-slate-600 text-sm mb-4">
        {description}
      </p>

      <div className="flex items-center text-sm font-semibold">
        Explore
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
