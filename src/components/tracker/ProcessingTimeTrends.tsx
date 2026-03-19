'use client';

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface TrendDataPoint {
  month: string;
  median: number;
  p25: number;
  p75: number;
  entries: number;
}

interface ProcessingTimeTrendsProps {
  data: TrendDataPoint[];
}

export default function ProcessingTimeTrends({ data }: ProcessingTimeTrendsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'median' | 'p25' | 'p75'>('median');

  const formatDays = (days: number) => {
    if (days < 30) return `${days}d`;
    return `${Math.round(days / 30)}mo`;
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'p25':
        return '#22c55e';
      case 'p75':
        return '#f59e0b';
      default:
        return '#0052cc';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-slate-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-slate-500">Median: </span>
              <span className="font-medium" style={{ color: '#0052cc' }}>{formatDays(data.median)}</span>
            </p>
            <p>
              <span className="text-slate-500">25th percentile: </span>
              <span className="font-medium text-green-600">{formatDays(data.p25)}</span>
            </p>
            <p>
              <span className="text-slate-500">75th percentile: </span>
              <span className="font-medium text-amber-600">{formatDays(data.p75)}</span>
            </p>
            <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-gray-100">
              {data.entries} new entries
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-900">Processing Time Trends</h3>
          <p className="text-sm text-slate-500">12-month historical view</p>
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'median', label: 'Median', color: '#0052cc' },
            { key: 'p25', label: '25th %', color: '#22c55e' },
            { key: 'p75', label: '75th %', color: '#f59e0b' },
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'text-white'
                  : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
              }`}
              style={selectedMetric === metric.key ? { backgroundColor: metric.color } : undefined}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getMetricColor()} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getMetricColor()} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatDays}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={data.reduce((acc, d) => acc + d.median, 0) / data.length} 
              stroke="#94a3b8" 
              strokeDasharray="3 3"
              label={{ value: 'Avg', position: 'right', fill: '#94a3b8', fontSize: 12 }}
            />
            
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={getMetricColor()}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMetric)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#0052cc' }} />
          <span className="text-slate-600">Median processing time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-gray-400" />
          <span className="text-slate-600">12-month average</span>
        </div>
      </div>
    </div>
  );
}
