'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton, TableRowSkeleton, CardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getUsers,
  updateUserStatus,
  deleteUser,
  exportUsers,
  type User
} from '@/lib/actions/admin-actions';
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  UserX,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  Clock,
  ShoppingCart,
  Users,
  Ban,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

type UserStatus = 'all' | 'active' | 'suspended' | 'admin';

function StatusBadge({ status }: { status: User['status'] }) {
  const styles = {
    active: 'bg-green-100 text-green-700 border-green-200',
    suspended: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      styles[status]
    )}>
      {status === 'active' ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RoleBadge({ role }: { role: User['role'] }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
        <Shield className="w-3.5 h-3.5" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      <Users className="w-3.5 h-3.5" />
      User
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<UserStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const loadUsers = async () => {
    try {
      setLoading(true);
      let status: 'active' | 'suspended' | undefined;
      let role: 'admin' | undefined;

      if (activeTab === 'active') status = 'active';
      else if (activeTab === 'suspended') status = 'suspended';
      else if (activeTab === 'admin') role = 'admin';

      const result = await getUsers(status, role);
      
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setUsers(result.data || []);
      }
    } catch (error) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [activeTab]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const toggleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const handleSuspend = async (id: string, name: string) => {
    confirm({
      title: 'Suspend User Account',
      message: `Are you sure you want to suspend ${name || 'this user'}'s account? They will not be able to log in or make purchases.`,
      confirmText: 'Suspend',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await updateUserStatus(id, 'suspended');
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('User suspended successfully', 'success');
          loadUsers();
        }
      }
    });
  };

  const handleReactivate = async (id: string, name: string) => {
    confirm({
      title: 'Reactivate User Account',
      message: `Are you sure you want to reactivate ${name || 'this user'}'s account?`,
      confirmText: 'Reactivate',
      type: 'success',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await updateUserStatus(id, 'active');
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('User reactivated successfully', 'success');
          loadUsers();
        }
      }
    });
  };

  const handleDelete = async (id: string, name: string) => {
    confirm({
      title: 'Delete User Account',
      message: `Are you sure you want to permanently delete ${name || 'this user'}'s account? This action cannot be undone and all their data will be lost.`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await deleteUser(id);
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('User deleted successfully', 'success');
          loadUsers();
        }
      }
    });
  };

  const handleBulkSuspend = async () => {
    const ids = Array.from(selectedUsers);
    confirm({
      title: 'Bulk Suspend Users',
      message: `Are you sure you want to suspend ${ids.length} user account${ids.length !== 1 ? 's' : ''}?`,
      confirmText: 'Suspend All',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        let successCount = 0;
        
        for (const id of ids) {
          const result = await updateUserStatus(id, 'suspended');
          if (!result.error) successCount++;
        }
        
        setProcessing(new Set());
        addToast(`${successCount} users suspended successfully`, 'success');
        setSelectedUsers(new Set());
        loadUsers();
      }
    });
  };

  const handleExport = async (format: 'csv' | 'json') => {
    const result = await exportUsers(format);
    
    if (result.error) {
      addToast(result.error, 'error');
    } else if (result.data) {
      const blob = new Blob([result.data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast(`Users exported as ${format.toUpperCase()}`, 'success');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(dateString);
  };

  const statusTabs = [
    { id: 'all' as const, label: 'All Users', count: users.length },
    { id: 'active' as const, label: 'Active', count: users.filter(u => u.status === 'active').length },
    { id: 'suspended' as const, label: 'Suspended', count: users.filter(u => u.status === 'suspended').length },
    { id: 'admin' as const, label: 'Admins', count: users.filter(u => u.role === 'admin').length },
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage users, permissions, and account status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
            { label: 'Active Users', value: users.filter(u => u.status === 'active').length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Suspended', value: users.filter(u => u.status === 'suspended').length, icon: Ban, color: 'bg-red-500' },
            { label: 'New This Week', value: users.filter(u => {
              const created = new Date(u.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return created >= weekAgo;
            }).length, icon: Clock, color: 'bg-amber-500' },
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
                    placeholder="Search by name or email..."
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
                {selectedUsers.size > 0 && (
                  <button 
                    onClick={handleBulkSuspend}
                    disabled={processing.size > 0}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" />
                    Suspend ({selectedUsers.size})
                  </button>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
                    >
                      Export as CSV
                    </button>
                    <button
                      onClick={() => handleExport('json')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
                    >
                      Export as JSON
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role & Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">{searchQuery ? 'Try adjusting your search' : 'No users in this category'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                            {(user.display_name || user.email)?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/admin/users/${user.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                              {user.display_name || 'Unnamed User'}
                            </Link>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <p className="text-sm text-gray-500">{user.email}</p>
                              {!user.email_verified && (
                                <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Unverified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <RoleBadge role={user.role} />
                          <StatusBadge status={user.status} />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatRelativeTime(user.last_sign_in_at)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleSuspend(user.id, user.display_name || user.email)}
                              disabled={processing.has(user.id)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                              title="Suspend"
                            >
                              <UserX className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleReactivate(user.id, user.display_name || user.email)}
                              disabled={processing.has(user.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Reactivate"
                            >
                              <RotateCcw className="w-5 h-5" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(user.id, user.display_name || user.email)}
                            disabled={processing.has(user.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Delete"
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
                Showing <span className="font-medium">{filteredUsers.length > 0 ? 1 : 0}</span> to{' '}
                <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
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
