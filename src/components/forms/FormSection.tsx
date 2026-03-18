'use client';

import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
}

export default function FormSection({
  title,
  description,
  children,
  defaultOpen = true,
  collapsible = true,
}: FormSectionProps): React.ReactElement {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => collapsible && setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 flex items-center justify-between bg-gray-50/50 ${
          collapsible ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
        }`}
        disabled={!collapsible}
      >
        <div className="text-left">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        {collapsible && (
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="px-6 py-4">
          {children}
        </div>
      )}
    </div>
  );
}
