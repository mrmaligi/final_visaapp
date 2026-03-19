'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton, TableRowSkeleton, CardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getTrackerEntries,
  updateTrackerEntryStatus,
  deleteTrackerEntry,
  type TrackerEntry
} from '@/lib/actions/admin-actions';
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
  Clock,
  Trash2
} from 'lucide-react';

type TrackerStatus = 'all' | 'verified' | 'pending' | 'flagged';

function StatusBadge({ status, isOutlier }: { status: TrackerEntry['verification_status']; isOutlier: boolean }) {
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
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TrackerStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const loadEntries = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'all' ? undefined : activeTab;
      const result = await getTrackerEntries(status);
      
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setEntries(result.data || []);
      }
    } catch (error) {
      addToast('Failed to load tracker entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [activeTab]);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch = 
      entry.visa?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.stream?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

  const handleVerify = async (id: string) => {
    confirm({
      title: 'Verify Entry',
      message: 'Are you sure you want to verify this entry? It will be included in processing time calculations.',
      confirmText: 'Verify',
      type: 'success',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await updateTrackerEntryStatus(id, 'verified');
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Entry verified successfully', 'success');
          loadEntries();
        }
      }
    });
  };

  const handleFlag = async (id: string) => {
    confirm({
      title: 'Flag Entry',
      message: 'Are you sure you want to flag this entry? It will be excluded from processing time calculations.',
      confirmText: 'Flag',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await updateTrackerEntryStatus(id, 'flagged');
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Entry flagged successfully', 'success');
          loadEntries();
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: 'Delete Entry',
      message: 'Are you sure you want to permanently delete this entry? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await deleteTrackerEntry(id);
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Entry deleted successfully', 'success');
          loadEntries();
        }
      }
    });
  };

  const handleBulkVerify = async () => {
    const ids = Array.from(selectedEntries);
    confirm({
      title: 'Bulk Verify Entries',
      message: `Are you sure you want to verify ${ids.length} entr${ids.length !== 1 ? 'ies' : 'y'}?`,
      confirmText: 'Verify All',
      type: 'success',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        let successCount = 0;
        
        for (const id of ids) {
          const result = await updateTrackerEntryStatus(id, 'verified');
          if (!result.error) successCount++;
        }
        
        setProcessing(new Set());
        addToast(`${successCount} entries verified successfully`, 'success');
        setSelectedEntries(new Set());
        loadEntries();
      }
    });
  };

  const handleBulkFlag = async () => {
    const ids = Array.from(selectedEntries);
    confirm({
      title: 'Bulk Flag Entries',
      message: `Are you sure you want to flag ${ids.length} entr${ids.length !== 1 ? 'ies' : 'y'}?`,
      confirmText: 'Flag All',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        let successCount = 0;
        
        for (const id of ids) {
          const result = await updateTrackerEntryStatus(id, 'flagged');
          if (!result.error) successCount++;
        }
        
        setProcessing(new Set());
        addToast(`${successCount} entries flagged successfully`, 'success');
        setSelectedEntries(new Set());
        loadEntries();
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusTabs = [
    { id: 'all' as const, label: 'All Entries', count: entries.length },
    { id: 'verified' as const, label: 'Verified', count: entries.filter(e => e.verification_status === 'verified').length },
    { id: 'pending' as const, label: 'Pending', count: entries.filter(e => e.verification_status === 'pending').length },
    { id: 'flagged' as const, label: 'Flagged', count: entries.filter(e => e.verification_status === 'flagged').length },
  ];

  // Calculate stats
  const verifiedCount = entries.filter(e => e.verification_status === 'verified').length;
  const flaggedCount = entries.filter(e => e.verification_status === 'flagged').length;
  const outlierCount = entries.filter(e => e.is_outlier).length;

  // Calculate average processing times by visa type
  const visaStats = entries
    .filter(e => e.verification_status === 'verified' && e.processing_days)
    .reduce((acc, entry) => {
      const visaName = entry.visa?.name || 'Unknown';
      if (!acc[visaName]) {
        acc[visaName] = { total: 0, count: 0 };
      }
      acc[visaName].total += entry.processing_days!;
      acc[visaName].count++;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

  const avgProcessingTimes = Object.entries(visaStats).map(([name, data]) => ({
    name,
    avg: Math.round(data.total / data.count),
    count: data.count
  })).slice(0, 4);

  if (loading) {
    return (
      <AdminLayout>
        <ConfirmDialogComponent />
        <div className="p-6 lg:p-8">
          <PageHeaderSkeleton />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <Skeleton className="h-14 w-full" />
            <div className="p-4 border-b border-gray-200">
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
            
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={7} />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmDialogComponent />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Visa Tracker Management</h1>
          <p className="text-gray-500">Monitor and verify community-submitted visa processing times</p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Entries', value: entries.length, icon: BarChart3, color: 'bg-blue-500' },
            { label: 'Verified', value: verifiedCount, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Flagged', value: flaggedCount, icon: Flag, color: 'bg-red-500' },
            { label: 'Outliers', value: outlierCount, icon: AlertTriangle, color: 'bg-orange-500' },
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
        </div>

        {/* Processing Time Stats */}
        {avgProcessingTimes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Average Processing Times
              </h2>
              <button 
                onClick={loadEntries}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Refresh Data
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {avgProcessingTimes.map((stat) => (
                <div key={stat.name} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 truncate">{stat.name}</p>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-2xl font-bold">{stat.avg} days</p>
                      <p className="text-sm text-gray-500">{stat.count} entries</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                    <button 
                      onClick={handleBulkVerify}
                      disabled={processing.size > 0}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify ({selectedEntries.size})
                    </button>
                    <button 
                      onClick={handleBulkFlag}
                      disabled={processing.size > 0}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processing</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No entries found</p>
                        <p className="text-sm">{searchQuery ? 'Try adjusting your search' : 'No entries in this category'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
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
                            <p className="font-medium text-gray-900">{entry.visa?.name || 'Unknown Visa'}</p>
                            <p className="text-sm text-gray-500">{entry.user?.email || 'Anonymous'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>Submitted: {formatDate(entry.lodged_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span>
                              {entry.decision_date ? `Decision: ${formatDate(entry.decision_date)}` : 'Pending decision'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="font-medium">{entry.location || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{entry.stream || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={cn(
                            'font-medium',
                            (entry.processing_days || 0) > 300 ? 'text-red-600' :
                            (entry.processing_days || 0) < 30 ? 'text-green-600' :
                            'text-gray-900'
                          )}>
                            {entry.processing_days || '—'} days
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
                            <button 
                              onClick={() => handleVerify(entry.id)}
                              disabled={processing.has(entry.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {entry.verification_status !== 'flagged' && (
                            <button 
                              onClick={() => handleFlag(entry.id)}
                              disabled={processing.has(entry.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <Flag className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(entry.id)}
                            disabled={processing.has(entry.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredEntries.length > 0 ? 1 : 0}</span> to{' '}
                <span className="font-medium">{filteredEntries.length}</span> of{' '}
                <span className="font-medium">{filteredEntries.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
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
