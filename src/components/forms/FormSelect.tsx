'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function FormSelect({
  label,
  options,
  error,
  helpText,
  placeholder = 'Select an option',
  onChange,
  className = '',
  id,
  ...props
}: FormSelectProps): React.ReactElement {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={selectId}
          className={`w-full rounded-lg border bg-white px-4 py-2.5 text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-blue-500'
          } ${className}`}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
