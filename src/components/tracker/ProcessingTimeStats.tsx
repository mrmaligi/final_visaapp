'use client';

import { TrendingDown, TrendingUp, Minus, Clock } from 'lucide-react';

interface ProcessingStats {
  median: number;
  average: number;
  p25: number;
  p75: number;
  p90: number;
  trend: 'improving' | 'worsening' | 'stable';
  trendPercentage: number;
  totalEntries: number;
  lastUpdated: string;
}

interface ProcessingTimeStatsProps {
  stats: ProcessingStats;
  visaName: string;
  subclass: string;
}

export default function ProcessingTimeStats({ stats, visaName, subclass }: ProcessingTimeStatsProps) {
  const formatDays = (days: number) => {
    if (days < 30) return `${days} days`;
    const months = Math.round(days / 30 * 10) / 10;
    return `${months} months`;
  };

  const getTrendIcon = () => {
    switch (stats.trend) {
      case 'improving':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'worsening':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (stats.trend) {
      case 'improving':
        return 'text-green-600';
      case 'worsening':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendLabel = () => {
    switch (stats.trend) {
      case 'improving':
        return 'Getting Faster';
      case 'worsening':
        return 'Getting Slower';
      default:
        return 'Stable';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: '#DBEAFE', color: '#0052cc' }}
              >
                {subclass}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{visaName}</h3>
                <p className="text-sm text-slate-500">Subclass {subclass}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              {getTrendIcon()}
              <span className={`font-semibold ${getTrendColor()}`}>
                {stats.trendPercentage > 0 ? `+${stats.trendPercentage}%` : `${stats.trendPercentage}%`}
              </span>
            </div>
            <p className="text-sm text-slate-500">{getTrendLabel()} (30 days)</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-200">
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-1">Median</p>
          <p className="text-2xl font-bold text-slate-900">{formatDays(stats.median)}</p>
          <p className="text-xs text-slate-400 mt-1">50% of cases</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-1">Average</p>
          <p className="text-2xl font-bold text-slate-900">{formatDays(stats.average)}</p>
          <p className="text-xs text-slate-400 mt-1">Mean processing</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-1">Fastest (25%)</p>
          <p className="text-2xl font-bold text-green-600">{formatDays(stats.p25)}</p>
          <p className="text-xs text-slate-400 mt-1">25th percentile</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-1">Slowest (75%)</p>
          <p className="text-2xl font-bold text-amber-600">{formatDays(stats.p75)}</p>
          <p className="text-xs text-slate-400 mt-1">75th percentile</p>
        </div>
      </div>

      {/* Distribution Bar */}
      <div className="p-6">
        <p className="text-sm font-medium text-slate-700 mb-3">Processing Time Distribution</p>
        
        <div className="relative">
          {/* Percentile markers */}
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>0%</span>
            <span>25th percentile</span>
            <span>50th (Median)</span>
            <span>75th percentile</span>
            <span>90th percentile</span>
          </div>
          
          {/* Distribution bar */}
          <div className="h-8 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-400" 
              style={{ width: '25%' }}
              title={`Fastest 25%: ${formatDays(stats.p25)}`}
            />
            <div 
              className="bg-green-500" 
              style={{ width: '25%' }}
              title={`25th-50th percentile: ${formatDays((stats.p25 + stats.median) / 2)}`}
            />
            <div 
              className="bg-blue-500" 
              style={{ width: '25%' }}
              title={`Median: ${formatDays(stats.median)}`}
            />
            <div 
              className="bg-amber-400" 
              style={{ width: '15%' }}
              title={`75th-90th percentile: ${formatDays((stats.p75 + stats.p90) / 2)}`}
            />
            <div 
              className="bg-amber-500" 
              style={{ width: '10%' }}
              title={`90th+ percentile: ${formatDays(stats.p90)}+`}
            />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>{formatDays(stats.p25)}</span>
            <span className="font-semibold" style={{ color: '#0052cc' }}>{formatDays(stats.median)}</span>
            <span>{formatDays(stats.p90)}+</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Clock className="w-4 h-4" />
          <span>Based on {stats.totalEntries.toLocaleString()} verified entries</span>
          <span className="text-slate-300">•</span>
          <span>Updated {stats.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
