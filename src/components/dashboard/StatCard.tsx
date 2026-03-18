import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    change: {
      positive: 'text-emerald-600',
      negative: 'text-red-600',
    },
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    change: {
      positive: 'text-emerald-600',
      negative: 'text-red-600',
    },
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    change: {
      positive: 'text-emerald-600',
      negative: 'text-red-600',
    },
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    change: {
      positive: 'text-emerald-600',
      negative: 'text-red-600',
    },
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    change: {
      positive: 'text-emerald-600',
      negative: 'text-red-600',
    },
  },
};

export default function StatCard({
  title,
  value,
  change,
  icon,
  color = 'blue',
}: StatCardProps): React.ReactElement {
  const colors = colorVariants[color];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>

          {change && (
            <div className="flex items-center gap-1 mt-2">
              <svg
                className={`w-4 h-4 ${change.isPositive ? 'text-emerald-500' : 'text-red-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={change.isPositive ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'}
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {change.value}
              </span>
              <span className="text-sm text-slate-500">vs last month</span>
            </div>
          )}
        </div>

        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
