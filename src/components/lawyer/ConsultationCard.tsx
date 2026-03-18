'use client';

import React from 'react';
import Link from 'next/link';

interface ConsultationCardProps {
  id: string;
  lawyerName: string;
  lawyerPhoto?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type?: 'video' | 'phone' | 'in-person';
  onCancel?: () => void;
  onJoin?: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  confirmed: {
    label: 'Confirmed',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  completed: {
    label: 'Completed',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  cancelled: {
    label: 'Cancelled',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

const typeIcons = {
  video: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  'in-person': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export default function ConsultationCard({
  id,
  lawyerName,
  lawyerPhoto,
  date,
  time,
  status,
  type = 'video',
  onCancel,
  onJoin,
}: ConsultationCardProps): React.ReactElement {
  const config = statusConfig[status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {lawyerPhoto ? (
          <img
            src={lawyerPhoto}
            alt={lawyerName}
            className="w-14 h-14 rounded-xl object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <span className="text-lg font-bold text-blue-700">{lawyerName.charAt(0).toUpperCase()}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-slate-900 truncate">{lawyerName}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {date}
                </span>
                <span className="flex items-center gap-1 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {time}
                </span>
              </div>
            </div>

            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
              {config.icon}
              {config.label}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="flex items-center gap-1 text-sm text-slate-500">
              {typeIcons[type]}
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        <Link
          href={`/user/consultations/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View Details
        </Link>

        {status === 'confirmed' && onJoin && (
          <button
            onClick={onJoin}
            className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Call
          </button>
        )}

        {status === 'pending' && onCancel && (
          <button
            onClick={onCancel}
            className="ml-auto text-sm font-medium text-red-600 hover:text-red-700"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
