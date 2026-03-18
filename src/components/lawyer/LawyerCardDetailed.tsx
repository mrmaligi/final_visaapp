'use client';

import React from 'react';
import Link from 'next/link';
import { Lawyer } from '@/types';
import StarRating from './StarRating';

interface LawyerCardDetailedProps {
  lawyer: Lawyer;
  consultationPrice?: number;
  onBookConsultation?: () => void;
}

export default function LawyerCardDetailed({
  lawyer,
  consultationPrice,
  onBookConsultation,
}: LawyerCardDetailedProps): React.ReactElement {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Cover Photo Area */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800">
      </div>

      <div className="px-6 pb-6">
        {/* Profile Header */}
        <div className="relative flex flex-col sm:flex-row sm:items-end -mt-12 mb-6">
          {/* Profile Photo */}
          <div className="relative">
            {lawyer.profile_photo_url ? (
              <img
                src={lawyer.profile_photo_url}
                alt={lawyer.full_name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-3xl font-bold text-blue-700">
                  {lawyer.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {lawyer.verification_status === 'approved' && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{lawyer.full_name}</h1>
            {lawyer.firm_name && (
              <p className="text-slate-600">{lawyer.firm_name}</p>
            )}
          </div>

          <div className="mt-4 sm:mt-0">
            <div className="flex items-center gap-2">
              <StarRating rating={lawyer.average_rating} />
              <span className="text-slate-500">({lawyer.total_reviews})</span>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Experience</p>
            <p className="text-lg font-semibold text-slate-900">
              {lawyer.years_experience ? `${lawyer.years_experience} years` : 'N/A'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Consultations</p>
            <p className="text-lg font-semibold text-slate-900">{lawyer.total_consultations}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Status</p>
            <p className={`text-lg font-semibold ${lawyer.accepts_new_clients ? 'text-emerald-600' : 'text-red-600'}`}>
              {lawyer.accepts_new_clients ? 'Available' : 'Unavailable'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Registration</p>
            <p className="text-lg font-semibold text-slate-900 truncate">{lawyer.registration_number}</p>
          </div>
        </div>

        {/* Bio */}
        {lawyer.bio && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">About</h2>
            <p className="text-slate-600 leading-relaxed">{lawyer.bio}</p>
          </div>
        )}

        {/* Languages */}
        {lawyer.languages && lawyer.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {lawyer.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {lawyer.accepts_new_clients && onBookConsultation && (
            <button
              onClick={onBookConsultation}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Book Consultation
              {consultationPrice && (
                <span className="ml-2 text-blue-200">${consultationPrice}</span>
              )}
            </button>
          )}
          <Link
            href={`/lawyers/${lawyer.id}/reviews`}
            className="flex-1 sm:flex-none border border-gray-200 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-center"
          >
            Read Reviews
          </Link>
        </div>
      </div>
    </div>
  );
}
