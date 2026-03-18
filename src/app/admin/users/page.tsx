'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
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
  RotateCcw
} from 'lucide-react';

// Types
type UserStatus = 'all' | 'active' | 'suspended' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  email_verified: boolean;
  joined_at: string;
  last_active: string;
  total_purchases: number;
  total_consultations: number;
  avatar?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'user',
    status: 'active',
    email_verified: true,
    joined_at: '2024-03-15T10:30:00Z',
    last_active: '2024-03-18T09:15:00Z',
    total_purchases: 3,
    total_consultations: 2,
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.w@email.com',
    role: 'user',
    status: 'active',
    email_verified: true,
    joined_at: '2024-03-10T14:20:00Z',
    last_active: '2024-03-17T16:45:00Z',
    total_purchases: 1,
    total_consultations: 0,
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    role: 'user',
    status: 'suspended',
    email_verified: true,
    joined_at: '2024-02-28T08:00:00Z',
    last_active: '2024-03-10T11:30:00Z',
    total_purchases: 5,
    total_consultations: 3,
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@visaflow.com',
    role: 'admin',
    status: 'active',
    email_verified: true,
    joined_at: '2023-12-01T00:00:00Z',
    last_active: '2024-03-18T20:00:00Z',
    total_purchases: 0,
    total_consultations: 0,
  },
  {
    id: '5',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    role: 'user',
    status: 'active',
    email_verified: false,
    joined_at: '2024-03-18T12:00:00Z',
    last_active: '2024-03-18T12:00:00Z',
    total_purchases: 0,
    total_consultations: 0,
  },
  {
    id: '6',
    name: 'David Wilson',
    email: 'd.wilson@email.com',
    role: 'user',
    status: 'active',
    email_verified: true,
    joined_at: '2024-03-05T09:30:00Z',
    last_active: '2024-03-16T14:20:00Z',
    total_purchases: 2,
    total_consultations: 1,
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    email: 'lisa.a@email.com',
    role: 'user',
    status: 'active',
    email_verified: true,
    joined_at: '2024-02-15T11:00:00Z',
    last_active: '2024-03-18T08:45:00Z',
    total_purchases: 4,
    total_consultations: 2,
  },
];

const statusTabs = [
  { id: 'all' as const, label: 'All Users', count: mockUsers.length },
  { id: 'active' as const, label: 'Active', count: mockUsers.filter(u => u.status === 'active').length },
  { id: 'suspended' as const, label: 'Suspended', count: mockUsers.filter(u => u.status === 'suspended').length },
  { id: 'admin' as const, label: 'Admins', count: mockUsers.filter(u => u.role === 'admin').length },
];

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
  const [activeTab, setActiveTab] = useState<UserStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  const filteredUsers = mockUsers.filter((user) => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'admin' ? user.role === 'admin' :
      user.status === activeTab;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return formatDate(dateString);
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage users, permissions, and account status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: mockUsers.length, icon: Users, color: 'bg-blue-500' },
            { label: 'Active Users', value: mockUsers.filter(u => u.status === 'active').length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Suspended', value: mockUsers.filter(u => u.status === 'suspended').length, icon: Ban, color: 'bg-red-500' },
            { label: 'New This Week', value: 12, icon: Clock, color: 'bg-amber-500' },
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
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      <UserX className="w-4 h-4" />
                      Suspend ({selectedUsers.size})
                    </button>
                  </>
                )}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchases</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
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
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <Link href={`/admin/users/${user.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                            {user.name}
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
                        {formatRelativeTime(user.last_active)}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{user.total_consultations} consultations</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{user.total_purchases}</span>
                        <span className="text-sm text-gray-500">guides</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.joined_at)}
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
                        <button
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                          title={user.status === 'active' ? 'Suspend' : 'Reactivate'}
                        >
                          {user.status === 'active' ? <UserX className="w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">3</button>
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
