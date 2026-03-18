import React from 'react';

interface ActivityItemProps {
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  iconColor?: 'blue' | 'green' | 'amber' | 'red' | 'gray';
  onClick?: () => void;
}

const iconColorVariants = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
  red: 'bg-red-100 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
};

export default function ActivityItem({
  title,
  description,
  timestamp,
  icon,
  iconColor = 'blue',
  onClick,
}: ActivityItemProps): React.ReactElement {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
        onClick ? 'hover:bg-gray-50 cursor-pointer' : ''
      }`}
    >
      {icon && (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColorVariants[iconColor]}`}>
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        )}
        <p className="text-xs text-slate-400 mt-1">{timestamp}</p>
      </div>
    </Component>
  );
}
