'use client';

import React from 'react';

interface FormDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  error?: string;
  helpText?: string;
  min?: string;
  max?: string;
  onChange?: (value: string) => void;
}

export default function FormDatePicker({
  label,
  error,
  helpText,
  onChange,
  className = '',
  id,
  ...props
}: FormDatePickerProps): React.ReactElement {
  const dateId = id || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={dateId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          id={dateId}
          type="date"
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-blue-500'
          } ${className}`}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

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
