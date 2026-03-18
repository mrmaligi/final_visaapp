'use client';

import React from 'react';
import Link from 'next/link';
import { Lawyer } from '@/types';
import StarRating from './StarRating';

interface LawyerCardProps {
  lawyer: Lawyer;
  showVerification?: boolean;
}

export default function LawyerCard({ 
  lawyer, 
  showVerification = true 
}: LawyerCardProps): React.ReactElement {
  return (
    <Link
      href={`/lawyers/${lawyer.id}`}
      className="group block bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        {/* Profile Photo */}
        <div className="relative">
          {lawyer.profile_photo_url ? (
            <img
              src={lawyer.profile_photo_url}
              alt={lawyer.full_name}
              className="w-20 h-20 rounded-xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">
                {lawyer.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {showVerification && lawyer.verification_status === 'approved' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
            {lawyer.full_name}
          </h3>

          {lawyer.firm_name && (
            <p className="text-sm text-slate-500 mb-2">{lawyer.firm_name}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={lawyer.average_rating} size="sm" />
            <span className="text-sm text-slate-500">
              ({lawyer.total_reviews} reviews)
            </span>
          </div>

          {lawyer.years_experience && (
            <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {lawyer.years_experience} years experience
            </div>
          )}

          {lawyer.languages && lawyer.languages.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {lawyer.languages.slice(0, 3).join(', ')}
              {lawyer.languages.length > 3 && ` +${lawyer.languages.length - 3} more`}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            lawyer.accepts_new_clients 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {lawyer.accepts_new_clients ? 'Accepting clients' : 'Not accepting'}
          </span>
          <span className="text-xs text-slate-500">
            {lawyer.total_consultations} consultations
          </span>
        </div>

        <div className="flex items-center text-blue-600 text-sm font-medium">
          View Profile
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
