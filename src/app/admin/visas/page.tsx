'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Plus,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Layout
} from 'lucide-react';

// Types
type VisaCategory = 'family' | 'work' | 'student' | 'business' | 'visitor' | 'protection';
type VisaStatus = 'all' | 'active' | 'inactive';

interface Visa {
  id: string;
  subclass: string;
  name: string;
  category: VisaCategory;
  short_description: string;
  premium_price: number;
  is_active: boolean;
  total_purchases: number;
  total_reviews: number;
  average_rating: number;
  created_at: string;
}

// Mock data
const mockVisas: Visa[] = [
  {
    id: '1',
    subclass: '820/801',
    name: 'Partner Visa',
    category: 'family',
    short_description: 'For partners and spouses of Australian citizens or permanent residents',
    premium_price: 149,
    is_active: true,
    total_purchases: 450,
    total_reviews: 120,
    average_rating: 4.8,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: '2',
    subclass: '189',
    name: 'Skilled Independent Visa',
    category: 'work',
    short_description: 'For skilled workers who are not sponsored by an employer or family member',
    premium_price: 129,
    is_active: true,
    total_purchases: 380,
    total_reviews: 95,
    average_rating: 4.7,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: '3',
    subclass: '500',
    name: 'Student Visa',
    category: 'student',
    short_description: 'For international students to study in Australia',
    premium_price: 99,
    is_active: true,
    total_purchases: 320,
    total_reviews: 80,
    average_rating: 4.5,
    created_at: '2023-10-01T00:00:00Z',
  },
  {
    id: '4',
    subclass: '186',
    name: 'Employer Nomination Scheme',
    category: 'work',
    short_description: 'For skilled workers nominated by an Australian employer',
    premium_price: 139,
    is_active: true,
    total_purchases: 280,
    total_reviews: 65,
    average_rating: 4.6,
    created_at: '2023-10-15T00:00:00Z',
  },
  {
    id: '5',
    subclass: '417',
    name: 'Working Holiday Visa',
    category: 'visitor',
    short_description: 'For young adults who want to holiday and work in Australia',
    premium_price: 79,
    is_active: true,
    total_purchases: 240,
    total_reviews: 55,
    average_rating: 4.4,
    created_at: '2023-11-01T00:00:00Z',
  },
  {
    id: '6',
    subclass: '600',
    name: 'Visitor Visa',
    category: 'visitor',
    short_description: 'For people visiting Australia for tourism or business',
    premium_price: 69,
    is_active: false,
    total_purchases: 180,
    total_reviews: 40,
    average_rating: 4.3,
    created_at: '2023-11-15T00:00:00Z',
  },
  {
    id: '7',
    subclass: '188',
    name: 'Business Innovation Visa',
    category: 'business',
    short_description: 'For business owners and investors to establish business in Australia',
    premium_price: 199,
    is_active: true,
    total_purchases: 150,
    total_reviews: 35,
    average_rating: 4.7,
    created_at: '2023-12-01T00:00:00Z',
  },
];

const categoryLabels: Record<VisaCategory, string> = {
  family: 'Family',
  work: 'Work',
  student: 'Student',
  business: 'Business',
  visitor: 'Visitor',
  protection: 'Protection',
};

const categoryColors: Record<VisaCategory, string> = {
  family: 'bg-pink-100 text-pink-700',
  work: 'bg-blue-100 text-blue-700',
  student: 'bg-green-100 text-green-700',
  business: 'bg-purple-100 text-purple-700',
  visitor: 'bg-orange-100 text-orange-700',
  protection: 'bg-red-100 text-red-700',
};

const statusTabs = [
  { id: 'all' as const, label: 'All Visas', count: mockVisas.length },
  { id: 'active' as const, label: 'Active', count: mockVisas.filter(v => v.is_active).length },
  { id: 'inactive' as const, label: 'Inactive', count: mockVisas.filter(v => !v.is_active).length },
];

function CategoryBadge({ category }: { category: VisaCategory }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
      categoryColors[category]
    )}>
      {categoryLabels[category]}
    </span>
  );
}

export default function AdminVisasPage() {
  const [activeTab, setActiveTab] = useState<VisaStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');

  const filteredVisas = mockVisas.filter((visa) => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && visa.is_active) || 
      (activeTab === 'inactive' && !visa.is_active);
    const matchesSearch = 
      visa.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visa.subclass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visa.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handlePriceEdit = (visa: Visa) => {
    setEditingPrice(visa.id);
    setPriceInput(visa.premium_price.toString());
  };

  const handlePriceSave = () => {
    setEditingPrice(null);
  };

  const toggleStatus = (visaId: string) => {
    // Toggle logic would go here
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Visa Management</h1>
          <p className="text-gray-500">Manage visa guides, pricing, and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Visas', value: mockVisas.length, icon: FileText, color: 'bg-blue-500' },
            { label: 'Active', value: mockVisas.filter(v => v.is_active).length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Total Purchases', value: mockVisas.reduce((sum, v) => sum + v.total_purchases, 0), icon: TrendingUp, color: 'bg-purple-500' },
            { label: 'Revenue', value: `$${mockVisas.reduce((sum, v) => sum + (v.total_purchases * v.premium_price), 0).toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
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
                    placeholder="Search visas by name, subclass, or description..."
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

              <Link
                href="/admin/visas/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add New Visa
              </Link>
            </div>
          </div>

          {/* Visas Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visa</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVisas.map((visa) => (
                  <tr key={visa.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <Link href={`/admin/visas/${visa.id}/edit`} className="font-medium text-gray-900 hover:text-blue-600">
                            {visa.name}
                          </Link>
                          <p className="text-sm text-gray-500">Subclass {visa.subclass}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{visa.short_description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <CategoryBadge category={visa.category} />
                    </td>
                    <td className="px-4 py-4">
                      {editingPrice === visa.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">$</span>
                          <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-200 rounded text-sm"
                            autoFocus
                            onBlur={handlePriceSave}
                            onKeyDown={(e) => e.key === 'Enter' && handlePriceSave()}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePriceEdit(visa)}
                          className="flex items-center gap-2 font-medium text-gray-900 hover:text-blue-600"
                        >
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          {visa.premium_price}
                          <Edit3 className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(visa.id)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                          visa.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        {visa.is_active ? (
                          <>
                            <ToggleRight className="w-4 h-4" />
                            Active
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{visa.total_purchases}</span>
                          <span className="text-sm text-gray-500">sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400">★</span>
                          <span className="font-medium">{visa.average_rating}</span>
                          <span className="text-sm text-gray-500">({visa.total_reviews} reviews)</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/visas/${visa.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Details"
                        >
                          <Edit3 className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/admin/visas/${visa.id}/content`}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="Edit Content"
                        >
                          <Layout className="w-5 h-5" />
                        </Link>
                        <Link
                          href={`/visas/${visa.id}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          title="View Live"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredVisas.length}</span> of{' '}
                <span className="font-medium">{filteredVisas.length}</span> results
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
