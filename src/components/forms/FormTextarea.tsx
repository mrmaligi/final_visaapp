'use client';

import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  rows?: number;
}

export default function FormTextarea({
  label,
  error,
  helpText,
  rows = 4,
  className = '',
  id,
  ...props
}: FormTextareaProps): React.ReactElement {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y ${
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-gray-200 focus:border-blue-500'
        } ${className}`}
        {...props}
      />

      {helpText && !error && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
