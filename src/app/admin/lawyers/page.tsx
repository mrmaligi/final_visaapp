'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton, TableRowSkeleton, CardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getLawyers,
  updateLawyerStatus,
  bulkUpdateLawyerStatus,
  type LawyerApplication
} from '@/lib/actions/admin-actions';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  UserCheck,
  UserX,
  Mail,
  Scale,
  Star,
  Calendar,
  Building2,
  AlertTriangle,
  FileText
} from 'lucide-react';

type LawyerStatus = 'all' | 'pending' | 'approved' | 'rejected';

function StatusBadge({ status }: { status: LawyerApplication['verification_status'] }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  const icons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const Icon = icons[status];

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      styles[status]
    )}>
      <Icon className="w-3.5 h-3.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState<LawyerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<LawyerStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLawyers, setSelectedLawyers] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const loadLawyers = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'all' ? undefined : activeTab;
      const result = await getLawyers(status);
      
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setLawyers(result.data || []);
      }
    } catch (error) {
      addToast('Failed to load lawyers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLawyers();
  }, [activeTab]);

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearch = 
      lawyer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.firm_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.registration_number?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedLawyers.size === filteredLawyers.length) {
      setSelectedLawyers(new Set());
    } else {
      setSelectedLawyers(new Set(filteredLawyers.map(l => l.id)));
    }
  };

  const toggleSelectLawyer = (id: string) => {
    const newSelected = new Set(selectedLawyers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLawyers(newSelected);
  };

  const handleApprove = async (id: string, name: string) => {
    confirm({
      title: 'Approve Lawyer Application',
      message: `Are you sure you want to approve ${name}'s application? They will be able to accept consultations.`,
      confirmText: 'Approve',
      type: 'success',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await updateLawyerStatus(id, 'approved');
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Lawyer approved successfully', 'success');
          loadLawyers();
        }
      }
    });
  };

  const handleReject = async (id: string, name: string) => {
    confirm({
      title: 'Reject Lawyer Application',
      message: `Are you sure you want to reject ${name}'s application? This action cannot be undone.`,
      confirmText: 'Reject',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await updateLawyerStatus(id, 'rejected');
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Lawyer application rejected', 'success');
          loadLawyers();
        }
      }
    });
  };

  const handleBulkApprove = async () => {
    const ids = Array.from(selectedLawyers);
    confirm({
      title: 'Bulk Approve Applications',
      message: `Are you sure you want to approve ${ids.length} lawyer application${ids.length !== 1 ? 's' : ''}?`,
      confirmText: 'Approve All',
      type: 'success',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        const result = await bulkUpdateLawyerStatus(ids, 'approved');
        setProcessing(new Set());
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast(`${result.updatedCount} lawyers approved successfully`, 'success');
          setSelectedLawyers(new Set());
          loadLawyers();
        }
      }
    });
  };

  const handleBulkReject = async () => {
    const ids = Array.from(selectedLawyers);
    confirm({
      title: 'Bulk Reject Applications',
      message: `Are you sure you want to reject ${ids.length} lawyer application${ids.length !== 1 ? 's' : ''}? This action cannot be undone.`,
      confirmText: 'Reject All',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        const result = await bulkUpdateLawyerStatus(ids, 'rejected');
        setProcessing(new Set());
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast(`${result.updatedCount} applications rejected`, 'success');
          setSelectedLawyers(new Set());
          loadLawyers();
        }
      }
    });
  };

  const statusTabs = [
    { id: 'all' as const, label: 'All Lawyers', count: lawyers.length },
    { id: 'pending' as const, label: 'Pending', count: lawyers.filter(l => l.verification_status === 'pending').length },
    { id: 'approved' as const, label: 'Approved', count: lawyers.filter(l => l.verification_status === 'approved').length },
    { id: 'rejected' as const, label: 'Rejected', count: lawyers.filter(l => l.verification_status === 'rejected').length },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">Lawyer Management</h1>
          <p className="text-gray-500">Manage lawyer applications and verifications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Lawyers', value: lawyers.length, icon: Scale, color: 'bg-blue-500' },
            { label: 'Pending Approval', value: lawyers.filter(l => l.verification_status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
            { label: 'Approved', value: lawyers.filter(l => l.verification_status === 'approved').length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Avg Rating', value: '4.8', icon: Star, color: 'bg-purple-500' },
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
                    placeholder="Search by name, email, firm, or MARN..."
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
                {selectedLawyers.size > 0 && (
                  <>
                    <button 
                      onClick={handleBulkApprove}
                      disabled={processing.size > 0}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <UserCheck className="w-4 h-4" />
                      Approve ({selectedLawyers.size})
                    </button>
                    <button 
                      onClick={handleBulkReject}
                      disabled={processing.size > 0}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                      <UserX className="w-4 h-4" />
                      Reject
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

          {/* Lawyers Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedLawyers.size === filteredLawyers.length && filteredLawyers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lawyer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Firm & MARN</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLawyers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <Scale className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No lawyers found</p>
                        <p className="text-sm">{searchQuery ? 'Try adjusting your search' : 'No lawyers in this category'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLawyers.map((lawyer) => (
                    <tr key={lawyer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedLawyers.has(lawyer.id)}
                          onChange={() => toggleSelectLawyer(lawyer.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                            {lawyer.full_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <Link href={`/admin/lawyers/${lawyer.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                              {lawyer.full_name}
                            </Link>
                            <p className="text-sm text-gray-500">{lawyer.email}</p>
                            <p className="text-xs text-gray-400">{lawyer.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          {lawyer.firm_name || 'N/A'}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{lawyer.registration_number}</p>
                        <p className="text-xs text-gray-400 mt-1">{lawyer.years_experience || 0} years experience</p>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={lawyer.verification_status} />
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(lawyer.languages || []).map((lang) => (
                            <span key={lang} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {lawyer.verification_status === 'approved' ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium">{lawyer.average_rating || 0}</span>
                              <span className="text-sm text-gray-500">({lawyer.total_reviews || 0} reviews)</span>
                            </div>
                            <p className="text-sm text-gray-600">{lawyer.total_consultations || 0} consultations</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(lawyer.created_at).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/lawyers/${lawyer.id}`}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            View
                          </Link>
                          
                          {lawyer.verification_status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(lawyer.id, lawyer.full_name)}
                                disabled={processing.has(lawyer.id)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(lawyer.id, lawyer.full_name)}
                                disabled={processing.has(lawyer.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="w-5 h-5" />
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
                Showing <span className="font-medium">{filteredLawyers.length > 0 ? 1 : 0}</span> to{' '}
                <span className="font-medium">{filteredLawyers.length}</span> of{' '}
                <span className="font-medium">{filteredLawyers.length}</span> results
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
