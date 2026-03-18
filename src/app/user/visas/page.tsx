'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  Search
} from 'lucide-react';

type FilterTab = 'all' | 'in_progress' | 'completed';

interface VisaApplication {
  id: string;
  visaName: string;
  subclass: string;
  category: string;
  purchasedDate: string;
  progress: number;
  documentsUploaded: number;
  totalDocuments: number;
  status: 'in_progress' | 'submitted' | 'approved' | 'rejected';
  lastUpdated: string;
}

export default function UserVisasPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API call
  const applications: VisaApplication[] = [
    {
      id: '1',
      visaName: 'Skilled Independent',
      subclass: '189',
      category: 'Work',
      purchasedDate: '2026-03-15',
      progress: 60,
      documentsUploaded: 8,
      totalDocuments: 12,
      status: 'in_progress',
      lastUpdated: '2026-03-18'
    },
    {
      id: '2',
      visaName: 'Partner Visa',
      subclass: '820',
      category: 'Family',
      purchasedDate: '2026-02-20',
      progress: 35,
      documentsUploaded: 5,
      totalDocuments: 15,
      status: 'in_progress',
      lastUpdated: '2026-03-17'
    },
    {
      id: '3',
      visaName: 'Student Visa',
      subclass: '500',
      category: 'Student',
      purchasedDate: '2025-12-10',
      progress: 100,
      documentsUploaded: 10,
      totalDocuments: 10,
      status: 'approved',
      lastUpdated: '2026-01-15'
    }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'in_progress' ? app.status === 'in_progress' :
      ['submitted', 'approved', 'rejected'].includes(app.status);
    
    const matchesSearch = 
      app.visaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.subclass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/user/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">My Visas</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Visa Applications</h1>
              <p className="text-slate-600 mt-1">Track and manage all your visa applications</p>
            </div>
            <Link
              href="/visas"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Apply for New Visa
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400 mr-2" />
              {(['all', 'in_progress', 'completed'] as FilterTab[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-gray-100'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter === 'in_progress' ? 'In Progress' : 'Completed'}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {filter === 'all' 
                      ? applications.length 
                      : filter === 'in_progress' 
                        ? applications.filter(a => a.status === 'in_progress').length
                        : applications.filter(a => ['submitted', 'approved', 'rejected'].includes(a.status)).length
                    }
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 md:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by visa name, subclass..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div 
                key={app.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-slate-900">
                            {app.visaName} ({app.subclass})
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>{app.category}</span>
                          <span className="w-px h-4 bg-gray-300"></span>
                          <span>Purchased: {new Date(app.purchasedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span className="w-px h-4 bg-gray-300"></span>
                          <span>Updated: {new Date(app.lastUpdated).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{app.progress}%</p>
                      <p className="text-sm text-slate-600">{app.documentsUploaded}/{app.totalDocuments} docs</p>
                    </div>
                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(app.progress)}`}
                          style={{ width: `${app.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <Link
                      href={`/visas/${app.id}/premium`}
                      className={`inline-flex items-center px-5 py-2.5 rounded-lg font-medium transition-colors ${
                        app.status === 'approved'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {app.status === 'approved' ? 'View Details' : 'Continue'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery 
                  ? 'Try adjusting your search or filters'
                  : 'Start your visa journey by exploring available options'
                }
              </p>
              <Link
                href="/visas"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Browse Visas
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
