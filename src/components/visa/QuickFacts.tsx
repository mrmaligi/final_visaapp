import React from 'react';

interface QuickFact {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface QuickFactsProps {
  facts: QuickFact[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

const layoutClasses = {
  horizontal: 'flex flex-wrap gap-4',
  vertical: 'flex flex-col gap-3',
  grid: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
};

export default function QuickFacts({
  facts,
  layout = 'horizontal',
  className = '',
}: QuickFactsProps): JSX.Element {
  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {facts.map((fact, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 bg-gray-50 rounded-lg p-3 ${layout === 'grid' ? 'flex-col items-start' : ''}`}
        >
          {fact.icon && (
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-blue-600 shadow-sm">
              {fact.icon}
            </div>
          )}
          <div className={layout === 'grid' ? 'text-left' : ''}>
            <p className="text-xs text-slate-500 uppercase tracking-wide">{fact.label}</p>
            <p className="text-sm font-semibold text-slate-900">{fact.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
