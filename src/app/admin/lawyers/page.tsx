'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  UserCheck,
  UserX,
  Mail,
  Scale,
  Star,
  Calendar,
  Building2
} from 'lucide-react';

// Types
type LawyerStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface Lawyer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  firm_name: string;
  registration_number: string;
  years_experience: number;
  verification_status: 'pending' | 'approved' | 'rejected';
  average_rating: number;
  total_consultations: number;
  total_reviews: number;
  languages: string[];
  submitted_at: string;
  avatar?: string;
}

// Mock data
const mockLawyers: Lawyer[] = [
  {
    id: '1',
    full_name: 'Dr. Emily Parker',
    email: 'emily.parker@lawfirm.com',
    phone: '+61 412 345 678',
    firm_name: 'Parker Immigration Law',
    registration_number: 'MARN 1801234',
    years_experience: 12,
    verification_status: 'pending',
    average_rating: 0,
    total_consultations: 0,
    total_reviews: 0,
    languages: ['English', 'Mandarin'],
    submitted_at: '2024-03-18T10:30:00Z',
  },
  {
    id: '2',
    full_name: 'James Wilson',
    email: 'j.wilson@migration.com.au',
    phone: '+61 423 456 789',
    firm_name: 'Wilson Migration Services',
    registration_number: 'MARN 1805678',
    years_experience: 8,
    verification_status: 'pending',
    average_rating: 0,
    total_consultations: 0,
    total_reviews: 0,
    languages: ['English'],
    submitted_at: '2024-03-17T14:15:00Z',
  },
  {
    id: '3',
    full_name: 'Sarah Johnson',
    email: 'sarah.j@visalaw.com.au',
    phone: '+61 434 567 890',
    firm_name: 'Johnson & Associates',
    registration_number: 'MARN 1709012',
    years_experience: 15,
    verification_status: 'approved',
    average_rating: 4.8,
    total_consultations: 132,
    total_reviews: 89,
    languages: ['English', 'Hindi', 'Punjabi'],
    submitted_at: '2023-11-05T09:00:00Z',
  },
  {
    id: '4',
    full_name: 'Michael Chen',
    email: 'm.chen@chenlegal.com.au',
    phone: '+61 445 678 901',
    firm_name: 'Chen Legal Group',
    registration_number: 'MARN 1712345',
    years_experience: 10,
    verification_status: 'approved',
    average_rating: 4.9,
    total_consultations: 145,
    total_reviews: 112,
    languages: ['English', 'Cantonese', 'Mandarin'],
    submitted_at: '2023-10-20T16:30:00Z',
  },
  {
    id: '5',
    full_name: 'Lisa Anderson',
    email: 'lisa@andersonvisa.com',
    phone: '+61 456 789 012',
    firm_name: 'Anderson Visa Consulting',
    registration_number: 'MARN 1903456',
    years_experience: 5,
    verification_status: 'pending',
    average_rating: 0,
    total_consultations: 0,
    total_reviews: 0,
    languages: ['English', 'French'],
    submitted_at: '2024-03-15T11:45:00Z',
  },
  {
    id: '6',
    full_name: 'David Kim',
    email: 'david.kim@kimlegal.com.au',
    phone: '+61 467 890 123',
    firm_name: 'Kim Legal Solutions',
    registration_number: 'MARN 1707890',
    years_experience: 14,
    verification_status: 'approved',
    average_rating: 4.7,
    total_consultations: 128,
    total_reviews: 95,
    languages: ['English', 'Korean'],
    submitted_at: '2023-12-01T08:00:00Z',
  },
  {
    id: '7',
    full_name: 'Robert Martinez',
    email: 'r.martinez@visalex.com.au',
    phone: '+61 478 901 234',
    firm_name: 'Martinez Visa Experts',
    registration_number: 'MARN 1901234',
    years_experience: 3,
    verification_status: 'rejected',
    average_rating: 0,
    total_consultations: 0,
    total_reviews: 0,
    languages: ['English', 'Spanish'],
    submitted_at: '2024-02-28T13:20:00Z',
  },
];

const statusTabs = [
  { id: 'all' as const, label: 'All Lawyers', count: mockLawyers.length },
  { id: 'pending' as const, label: 'Pending', count: mockLawyers.filter(l => l.verification_status === 'pending').length },
  { id: 'approved' as const, label: 'Approved', count: mockLawyers.filter(l => l.verification_status === 'approved').length },
  { id: 'rejected' as const, label: 'Rejected', count: mockLawyers.filter(l => l.verification_status === 'rejected').length },
];

function StatusBadge({ status }: { status: Lawyer['verification_status'] }) {
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
  const [activeTab, setActiveTab] = useState<LawyerStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLawyers, setSelectedLawyers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState('submitted_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredLawyers = mockLawyers.filter((lawyer) => {
    const matchesTab = activeTab === 'all' || lawyer.verification_status === activeTab;
    const matchesSearch = 
      lawyer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.firm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.registration_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Lawyer Management</h1>
          <p className="text-gray-500">Manage lawyer applications and verifications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Lawyers', value: mockLawyers.length, icon: Scale, color: 'bg-blue-500' },
            { label: 'Pending Approval', value: mockLawyers.filter(l => l.verification_status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
            { label: 'Approved', value: mockLawyers.filter(l => l.verification_status === 'approved').length, icon: CheckCircle, color: 'bg-green-500' },
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <UserCheck className="w-4 h-4" />
                      Approve ({selectedLawyers.size})
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
                {filteredLawyers.map((lawyer) => (
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
                          {lawyer.full_name.charAt(0)}
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
                        {lawyer.firm_name}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{lawyer.registration_number}</p>
                      <p className="text-xs text-gray-400 mt-1">{lawyer.years_experience} years experience</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={lawyer.verification_status} />
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lawyer.languages.map((lang) => (
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
                            <span className="font-medium">{lawyer.average_rating}</span>
                            <span className="text-sm text-gray-500">({lawyer.total_reviews} reviews)</span>
                          </div>
                          <p className="text-sm text-gray-600">{lawyer.total_consultations} consultations</p>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(lawyer.submitted_at).toLocaleDateString('en-AU', {
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
                            <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLawyers.length}</span> of{' '}
                <span className="font-medium">{filteredLawyers.length}</span> results
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
