'use client';

import React from 'react';
import Link from 'next/link';

interface DocumentListItemProps {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status?: 'pending' | 'verified' | 'rejected';
  onDownload?: () => void;
  onDelete?: () => void;
}

const statusConfig = {
  pending: { label: 'Pending Review', className: 'bg-amber-100 text-amber-700' },
  verified: { label: 'Verified', className: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

const fileIcons: Record<string, React.ReactNode> = {
  pdf: (
    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7l-5-5H7zm5 1.5L17.5 9H12V3.5z" />
    </svg>
  ),
  doc: (
    <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7 2a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7l-5-5H7zm5 1.5L17.5 9H12V3.5z" />
    </svg>
  ),
  image: (
    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export default function DocumentListItem({
  id,
  name,
  type,
  size,
  uploadedAt,
  status,
  onDownload,
  onDelete,
}: DocumentListItemProps): React.ReactElement {
  const fileExtension = name.split('.').pop()?.toLowerCase() || '';
  const icon = fileIcons[fileExtension] || fileIcons.doc;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex-shrink-0">{icon}</div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/user/documents/${id}`}
          className="font-medium text-slate-900 hover:text-blue-600 transition-colors truncate block"
        >
          {name}
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500 uppercase">{type}</span>
          <span className="text-slate-300">•</span>
          <span className="text-sm text-slate-500">{size}</span>
          <span className="text-slate-300">•</span>
          <span className="text-sm text-slate-500">{uploadedAt}</span>
        </div>
      </div>

      {status && (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[status].className}`}>
          {statusConfig[status].label}
        </span>
      )}

      <div className="flex items-center gap-1">
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
