'use client';

import React from 'react';
import Link from 'next/link';

interface PremiumTeaserProps {
  title?: string;
  description?: string;
  price: number;
  features?: string[];
  isUnlocked?: boolean;
  onUnlock?: () => void;
  href?: string;
}

const defaultFeatures = [
  'Step-by-step application guide',
  'Document checklist with templates',
  'Processing time estimates',
  'Common rejection reasons',
  'Expert tips and tricks',
  'Priority support access',
];

export default function PremiumTeaser({
  title = 'Premium Visa Guide',
  description = 'Get comprehensive guidance for your visa application with our premium guide.',
  price,
  features = defaultFeatures,
  isUnlocked = false,
  onUnlock,
  href,
}: PremiumTeaserProps): React.ReactElement {
  if (isUnlocked) {
    return (
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-emerald-100 text-sm">Unlocked ✓</p>
          </div>
        </div>

        <p className="text-emerald-100 mb-4">
          You have full access to all premium content for this visa.
        </p>

        {href && (
          <Link
            href={href}
            className="block w-full bg-white text-emerald-600 text-center py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
          >
            View Premium Content
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2">
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2">
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-amber-100 text-sm">Premium Content</p>
          </div>
        </div>

        <p className="text-amber-100 mb-4">{description}</p>

        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-amber-200 text-sm"> one-time</span>
          </div>
          <button
            onClick={onUnlock}
            className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg"
          >
            Unlock Now
          </button>
        </div>
      </div>
    </div>
  );
}
