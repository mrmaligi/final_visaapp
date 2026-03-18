'use client';

import React from 'react';
import Link from 'next/link';
import StarRating from '../lawyer/StarRating';

interface ConsultationListItemProps {
  id: string;
  lawyerName: string;
  lawyerPhoto?: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  type?: 'video' | 'phone' | 'in-person';
  rating?: number;
  reviewCount?: number;
}

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

export default function ConsultationListItem({
  id,
  lawyerName,
  lawyerPhoto,
  date,
  status,
  type = 'video',
  rating,
  reviewCount,
}: ConsultationListItemProps): React.ReactElement {
  const statusStyle = statusConfig[status];

  return (
    <Link
      href={`/user/consultations/${id}`}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
    >
      {/* Lawyer Photo */}
      {lawyerPhoto ? (
        <img
          src={lawyerPhoto}
          alt={lawyerName}
          className="w-12 h-12 rounded-xl object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
          <span className="text-lg font-bold text-blue-700">{lawyerName.charAt(0).toUpperCase()}</span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-slate-900 truncate">{lawyerName}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-slate-500">{date}</span>
          <span className="text-slate-300">•</span>
          <span className="text-sm text-slate-500 capitalize">{type.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Rating or Status */}
      <div className="text-right">
        {rating !== undefined ? (
          <div className="flex items-center gap-1">
            <StarRating rating={rating} size="sm" />
            {reviewCount !== undefined && (
              <span className="text-sm text-slate-500">({reviewCount})</span>
            )}
          </div>
        ) : (
          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.className}`}>
            {statusStyle.label}
          </span>
        )}
      </div>
    </Link>
  );
}
