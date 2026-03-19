'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton, TableRowSkeleton, CardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getNewsArticles,
  publishNewsArticle,
  deleteNewsArticle,
  type NewsArticle
} from '@/lib/actions/admin-actions';
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

type ArticleStatus = 'all' | 'published' | 'draft';

function StatusBadge({ status, publishedAt }: { status: boolean; publishedAt?: string }) {
  if (status) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
        <CheckCircle className="w-3.5 h-3.5" />
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
      <XCircle className="w-3.5 h-3.5" />
      Draft
    </span>
  );
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ArticleStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  const loadArticles = async () => {
    try {
      setLoading(true);
      let status: 'published' | 'draft' | undefined;
      if (activeTab === 'published') status = 'published';
      else if (activeTab === 'draft') status = 'draft';

      const result = await getNewsArticles(status);
      
      if (result.error) {
        addToast(result.error, 'error');
      } else {
        setArticles(result.data || []);
      }
    } catch (error) {
      addToast('Failed to load articles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [activeTab]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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

  const handlePublish = async (id: string, title: string) => {
    confirm({
      title: 'Publish Article',
      message: `Are you sure you want to publish "${title}"? It will be visible to all users.`,
      confirmText: 'Publish',
      type: 'success',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await publishNewsArticle(id, true);
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Article published successfully', 'success');
          loadArticles();
        }
      }
    });
  };

  const handleUnpublish = async (id: string, title: string) => {
    confirm({
      title: 'Unpublish Article',
      message: `Are you sure you want to unpublish "${title}"? It will no longer be visible to users.`,
      confirmText: 'Unpublish',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await publishNewsArticle(id, false);
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Article unpublished successfully', 'success');
          loadArticles();
        }
      }
    });
  };

  const handleDelete = async (id: string, title: string) => {
    confirm({
      title: 'Delete Article',
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(prev => new Set(prev).add(id));
        const result = await deleteNewsArticle(id);
        setProcessing(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Article deleted successfully', 'success');
          loadArticles();
        }
      }
    });
  };

  const handleBulkPublish = async () => {
    const ids = Array.from(selectedArticles);
    confirm({
      title: 'Bulk Publish Articles',
      message: `Are you sure you want to publish ${ids.length} article${ids.length !== 1 ? 's' : ''}?`,
      confirmText: 'Publish All',
      type: 'success',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        let successCount = 0;
        
        for (const id of ids) {
          const result = await publishNewsArticle(id, true);
          if (!result.error) successCount++;
        }
        
        setProcessing(new Set());
        addToast(`${successCount} articles published successfully`, 'success');
        setSelectedArticles(new Set());
        loadArticles();
      }
    });
  };

  const handleBulkUnpublish = async () => {
    const ids = Array.from(selectedArticles);
    confirm({
      title: 'Bulk Unpublish Articles',
      message: `Are you sure you want to unpublish ${ids.length} article${ids.length !== 1 ? 's' : ''}?`,
      confirmText: 'Unpublish All',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(new Set(ids));
        let successCount = 0;
        
        for (const id of ids) {
          const result = await publishNewsArticle(id, false);
          if (!result.error) successCount++;
        }
        
        setProcessing(new Set());
        addToast(`${successCount} articles unpublished successfully`, 'success');
        setSelectedArticles(new Set());
        loadArticles();
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
    { id: 'all' as const, label: 'All Articles', count: articles.length },
    { id: 'published' as const, label: 'Published', count: articles.filter(a => a.is_published).length },
    { id: 'draft' as const, label: 'Drafts', count: articles.filter(a => !a.is_published).length },
  ];

  const totalViews = 0; // Views tracking not implemented yet

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
          <h1 className="text-2xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-500">Manage blog posts, news articles, and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Articles', value: articles.length, icon: Newspaper, color: 'bg-blue-500' },
            { label: 'Published', value: articles.filter(a => a.is_published).length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'bg-purple-500' },
            { label: 'Drafts', value: articles.filter(a => !a.is_published).length, icon: Clock, color: 'bg-amber-500' },
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
                    <button 
                      onClick={handleBulkPublish}
                      disabled={processing.size > 0}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Publish
                    </button>
                    <button 
                      onClick={handleBulkUnpublish}
                      disabled={processing.size > 0}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                    >
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <Newspaper className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No articles found</p>
                        <p className="text-sm">{searchQuery ? 'Try adjusting your search' : 'Get started by creating a new article'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
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
                        <StatusBadge status={article.is_published} publishedAt={article.published_at} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-600">
                          {article.is_published ? (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Published {formatDate(article.published_at)}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Created {formatDate(article.created_at)}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">0</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {article.is_published ? (
                            <button 
                              onClick={() => handleUnpublish(article.id, article.title)}
                              disabled={processing.has(article.id)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-50"
                              title="Unpublish"
                            >
                              <EyeOff className="w-5 h-5" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handlePublish(article.id, article.title)}
                              disabled={processing.has(article.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Publish"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          
                          <Link
                            href={`/admin/news/${article.id}/edit`}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit3 className="w-5 h-5" />
                          </Link>
                          
                          {article.is_published && (
                            <Link
                              href={`/news/${article.slug}`}
                              target="_blank"
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <ExternalLink className="w-5 h-5" />
                            </Link>
                          )}
                          
                          <button 
                            onClick={() => handleDelete(article.id, article.title)}
                            disabled={processing.has(article.id)}
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
                Showing <span className="font-medium">{filteredArticles.length > 0 ? 1 : 0}</span> to{' '}
                <span className="font-medium">{filteredArticles.length}</span> of{' '}
                <span className="font-medium">{filteredArticles.length}</span> results
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
