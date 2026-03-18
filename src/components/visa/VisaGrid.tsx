import React from 'react';
import { Visa } from '@/types';
import VisaCard from './VisaCard';

interface VisaGridProps {
  visas: Visa[];
  columns?: 1 | 2 | 3 | 4;
  showPremiumBadge?: boolean;
  emptyMessage?: string;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export default function VisaGrid({
  visas,
  columns = 3,
  showPremiumBadge = true,
  emptyMessage = 'No visas found.',
}: VisaGridProps): JSX.Element {
  if (visas.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-6`}>
      {visas.map((visa) => (
        <VisaCard key={visa.id} visa={visa} showPremiumBadge={showPremiumBadge} />
      ))}
    </div>
  );
}
