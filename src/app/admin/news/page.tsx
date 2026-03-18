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
  Eye,
  EyeOff,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  ExternalLink,
  Newspaper
} from 'lucide-react';

// Types
type ArticleStatus = 'all' | 'published' | 'draft' | 'scheduled';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  published_at: string | null;
  created_at: string;
  views: number;
  featured_image?: string;
  category: string;
}

// Mock data
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Changes to Partner Visa Requirements in 2024',
    slug: 'partner-visa-changes-2024',
    excerpt: 'The Australian government has announced significant changes to partner visa requirements effective from July 2024.',
    status: 'published',
    author: 'Admin User',
    published_at: '2024-03-15T10:00:00Z',
    created_at: '2024-03-14T14:30:00Z',
    views: 1245,
    category: 'Policy Updates',
  },
  {
    id: '2',
    title: 'New Skilled Occupation List Released',
    slug: 'new-skilled-occupation-list-2024',
    excerpt: 'The updated skilled occupation list includes 15 new occupations eligible for skilled migration visas.',
    status: 'published',
    author: 'Admin User',
    published_at: '2024-03-12T09:00:00Z',
    created_at: '2024-03-11T16:00:00Z',
    views: 892,
    category: 'News',
  },
  {
    id: '3',
    title: 'Student Visa Work Rights: What You Need to Know',
    slug: 'student-visa-work-rights',
    excerpt: 'Understanding your work rights as an international student in Australia.',
    status: 'draft',
    author: 'Admin User',
    published_at: null,
    created_at: '2024-03-18T11:00:00Z',
    views: 0,
    category: 'Guides',
  },
  {
    id: '4',
    title: 'Visa Processing Times Update - March 2024',
    slug: 'visa-processing-times-march-2024',
    excerpt: 'Latest updates on visa processing times across all major visa categories.',
    status: 'scheduled',
    author: 'Admin User',
    published_at: '2024-03-25T08:00:00Z',
    created_at: '2024-03-18T13:00:00Z',
    views: 0,
    category: 'Updates',
  },
  {
    id: '5',
    title: 'How to Prepare for Your Visa Interview',
    slug: 'visa-interview-preparation',
    excerpt: 'Essential tips and strategies for successfully navigating your visa interview.',
    status: 'published',
    author: 'Admin User',
    published_at: '2024-03-08T10:30:00Z',
    created_at: '2024-03-07T15:00:00Z',
    views: 2134,
    category: 'Guides',
  },
];

const statusTabs = [
  { id: 'all' as const, label: 'All Articles', count: mockArticles.length },
  { id: 'published' as const, label: 'Published', count: mockArticles.filter(a => a.status === 'published').length },
  { id: 'draft' as const, label: 'Drafts', count: mockArticles.filter(a => a.status === 'draft').length },
  { id: 'scheduled' as const, label: 'Scheduled', count: mockArticles.filter(a => a.status === 'scheduled').length },
];

function StatusBadge({ status }: { status: Article['status'] }) {
  const styles = {
    published: 'bg-green-100 text-green-700 border-green-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const icons = {
    published: CheckCircle,
    draft: XCircle,
    scheduled: Clock,
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

export default function AdminNewsPage() {
  const [activeTab, setActiveTab] = useState<ArticleStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

  const filteredArticles = mockArticles.filter((article) => {
    const matchesTab = activeTab === 'all' || article.status === activeTab;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleSelectAll = () => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map(a => a.id)));
    }
  };

  const toggleSelectArticle = (id: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArticles(newSelected);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-500">Manage blog posts, news articles, and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Articles', value: mockArticles.length, icon: Newspaper, color: 'bg-blue-500' },
            { label: 'Published', value: mockArticles.filter(a => a.status === 'published').length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Total Views', value: mockArticles.reduce((sum, a) => sum + a.views, 0).toLocaleString(), icon: Eye, color: 'bg-purple-500' },
            { label: 'Drafts', value: mockArticles.filter(a => a.status === 'draft').length, icon: Clock, color: 'bg-amber-500' },
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
                    placeholder="Search articles..."
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
                {selectedArticles.size > 0 && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <CheckCircle className="w-4 h-4" />
                      Publish
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
                      <EyeOff className="w-4 h-4" />
                      Unpublish
                    </button>
                  </>
                )}
                
                <Link
                  href="/admin/news/new"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  New Article
                </Link>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 w-12">
                    <input
                      type="checkbox"
                      checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Article</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedArticles.has(article.id)}
                        onChange={() => toggleSelectArticle(article.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <Newspaper className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <Link href={`/admin/news/${article.id}/edit`} className="font-medium text-gray-900 hover:text-blue-600">
                            {article.title}
                          </Link>
                          <p className="text-sm text-gray-500 line-clamp-2 max-w-md">{article.excerpt}</p>
                          <span className="text-xs text-gray-400">{article.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {article.author}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-600">
                        {article.status === 'scheduled' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>Scheduled</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(article.published_at)}</p>
                          </>
                        ) : article.status === 'published' ? (
                          <>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(article.published_at)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Created {formatDate(article.created_at)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{article.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'published' ? (
                          <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg">
                            <EyeOff className="w-5 h-5" />
                          </button>
                        ) : (
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        
                        <Link
                          href={`/admin/news/${article.id}/edit`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit3 className="w-5 h-5" />
                        </Link>
                        
                        {article.status === 'published' && (
                          <Link
                            href={`/news/${article.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </Link>
                        )}
                        
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredArticles.length}</span> of{' '}
                <span className="font-medium">{filteredArticles.length}</span> results
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
