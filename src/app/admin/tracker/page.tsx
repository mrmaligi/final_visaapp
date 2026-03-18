'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flag,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  User,
  FileText,
  MoreHorizontal,
  Activity,
  PieChart,
  AlertCircle,
  RefreshCw,
  Clock
} from 'lucide-react';

// Types
type TrackerStatus = 'all' | 'verified' | 'pending' | 'flagged';
type VerificationStatus = 'verified' | 'pending' | 'flagged';

interface TrackerEntry {
  id: string;
  visa_type: string;
  submitted_date: string;
  decision_date: string | null;
  location: string;
  stream: string;
  processing_days: number;
  verification_status: VerificationStatus;
  is_outlier: boolean;
  notes: string | null;
  submitted_by: string;
}

// Mock data
const mockEntries: TrackerEntry[] = [
  {
    id: '1',
    visa_type: 'Partner Visa 820/801',
    submitted_date: '2023-06-15',
    decision_date: '2024-02-20',
    location: 'Melbourne',
    stream: 'Onshore',
    processing_days: 250,
    verification_status: 'verified',
    is_outlier: false,
    notes: null,
    submitted_by: 'user123@email.com',
  },
  {
    id: '2',
    visa_type: 'Skilled Independent 189',
    submitted_date: '2023-08-10',
    decision_date: '2024-01-15',
    location: 'Sydney',
    stream: 'Offshore',
    processing_days: 158,
    verification_status: 'verified',
    is_outlier: false,
    notes: null,
    submitted_by: 'user456@email.com',
  },
  {
    id: '3',
    visa_type: 'Student Visa 500',
    submitted_date: '2024-01-05',
    decision_date: null,
    location: 'Brisbane',
    stream: 'Onshore',
    processing_days: 72,
    verification_status: 'pending',
    is_outlier: false,
    notes: 'Still waiting for decision',
    submitted_by: 'user789@email.com',
  },
  {
    id: '4',
    visa_type: 'Partner Visa 820/801',
    submitted_date: '2023-01-10',
    decision_date: '2023-03-15',
    location: 'Perth',
    stream: 'Onshore',
    processing_days: 64,
    verification_status: 'flagged',
    is_outlier: true,
    notes: 'Processing time too short - possible incorrect dates',
    submitted_by: 'user321@email.com',
  },
  {
    id: '5',
    visa_type: 'Employer Nominated 186',
    submitted_date: '2023-09-20',
    decision_date: '2024-03-10',
    location: 'Adelaide',
    stream: 'Direct Entry',
    processing_days: 172,
    verification_status: 'verified',
    is_outlier: false,
    notes: null,
    submitted_by: 'user654@email.com',
  },
  {
    id: '6',
    visa_type: 'Working Holiday 417',
    submitted_date: '2024-02-01',
    decision_date: '2024-02-28',
    location: 'Melbourne',
    stream: 'First',
    processing_days: 27,
    verification_status: 'verified',
    is_outlier: false,
    notes: null,
    submitted_by: 'user987@email.com',
  },
  {
    id: '7',
    visa_type: 'Partner Visa 820/801',
    submitted_date: '2022-12-01',
    decision_date: '2023-05-20',
    location: 'Sydney',
    stream: 'Onshore',
    processing_days: 170,
    verification_status: 'flagged',
    is_outlier: false,
    notes: 'Duplicate entry - user resubmitted',
    submitted_by: 'user147@email.com',
  },
];

const statusTabs = [
  { id: 'all' as const, label: 'All Entries', count: mockEntries.length },
  { id: 'verified' as const, label: 'Verified', count: mockEntries.filter(e => e.verification_status === 'verified').length },
  { id: 'pending' as const, label: 'Pending', count: mockEntries.filter(e => e.verification_status === 'pending').length },
  { id: 'flagged' as const, label: 'Flagged', count: mockEntries.filter(e => e.verification_status === 'flagged').length },
];

const visaStats = [
  { visa_type: 'Partner Visa 820/801', avg_days: 195, count: 234, trend: 'stable' },
  { visa_type: 'Skilled Independent 189', avg_days: 165, count: 189, trend: 'down' },
  { visa_type: 'Student Visa 500', avg_days: 45, count: 456, trend: 'up' },
  { visa_type: 'Employer Nominated 186', avg_days: 178, count: 123, trend: 'stable' },
];

function StatusBadge({ status, isOutlier }: { status: VerificationStatus; isOutlier: boolean }) {
  const styles = {
    verified: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    flagged: 'bg-red-100 text-red-700 border-red-200',
  };

  const icons = {
    verified: CheckCircle,
    pending: Activity,
    flagged: Flag,
  };

  const Icon = icons[status];

  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        styles[status]
      )}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {isOutlier && (
        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
          Outlier
        </span>
      )}
    </div>
  );
}

export default function AdminTrackerPage() {
  const [activeTab, setActiveTab] = useState<TrackerStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());

  const filteredEntries = mockEntries.filter((entry) => {
    const matchesTab = activeTab === 'all' || entry.verification_status === activeTab;
    const matchesSearch = 
      entry.visa_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.submitted_by.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedEntries.size === filteredEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(filteredEntries.map(e => e.id)));
    }
  };

  const toggleSelectEntry = (id: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEntries(newSelected);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Visa Tracker Management</h1>
          <p className="text-gray-500">Monitor and verify community-submitted visa processing times</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Entries', value: mockEntries.length, icon: BarChart3, color: 'bg-blue-500' },
            { label: 'Verified', value: mockEntries.filter(e => e.verification_status === 'verified').length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Flagged', value: mockEntries.filter(e => e.verification_status === 'flagged').length, icon: Flag, color: 'bg-red-500' },
            { label: 'Outliers', value: mockEntries.filter(e => e.is_outlier).length, icon: AlertTriangle, color: 'bg-orange-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
                <div className={cn('p-3 rounded-lg', stat.color)}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
003e
        </div>

        {/* Processing Time Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Average Processing Times
            </h2>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {visaStats.map((stat) => (
              <div key={stat.visa_type} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 truncate">{stat.visa_type}</p>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-2xl font-bold">{stat.avg_days} days</p>
                    <p className="text-sm text-gray-500">{stat.count} entries</p>
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    stat.trend === 'down' ? 'bg-green-100 text-green-700' :
                    stat.trend === 'up' ? 'bg-red-100 text-red-700' :
                    'bg-gray-200 text-gray-700'
                  )}>
                    {stat.trend === 'down' ? '↓ Faster' : stat.trend === 'up' ? '↑ Slower' : '→ Stable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs',
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by visa type, location, or user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              <div className="flex items-center gap-3">
                {selectedEntries.size > 0 && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Verify ({selectedEntries.size})
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <Flag className="w-4 h-4" />
                      Flag
                    </button>
                  </>
                )}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Entries Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedEntries.size === filteredEntries.length && filteredEntries.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visa Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location/Stream</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processing Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntries.map((entry) => (
                  <tr key={entry.id} className={cn('hover:bg-gray-50', entry.is_outlier && 'bg-orange-50/50')}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEntries.has(entry.id)}
                        onChange={() => toggleSelectEntry(entry.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{entry.visa_type}</p>
                          <p className="text-sm text-gray-500">{entry.submitted_by}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Submitted: {entry.submitted_date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-gray-400" />
                          <span>
                            {entry.decision_date ? `Decision: ${entry.decision_date}` : 'Pending decision'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{entry.location}</p>
                        <p className="text-sm text-gray-500">{entry.stream}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className={cn(
                          'font-medium',
                          entry.processing_days > 300 ? 'text-red-600' :
                          entry.processing_days < 30 ? 'text-green-600' :
                          'text-gray-900'
                        )}>
                          {entry.processing_days} days
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={entry.verification_status} isOutlier={entry.is_outlier} />
                      {entry.notes && (
                        <p className="text-xs text-gray-500 mt-2">{entry.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {entry.verification_status !== 'verified' && (
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {entry.verification_status !== 'flagged' && (
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Flag className="w-5 h-5" />
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEntries.length}</span> of{' '}
                <span className="font-medium">{filteredEntries.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
