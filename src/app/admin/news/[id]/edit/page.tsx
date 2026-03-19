'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  getNewsArticleById,
  createNewsArticle,
  updateNewsArticle,
  type NewsArticle
} from '@/lib/actions/admin-actions';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Image as ImageIcon,
  Calendar
} from 'lucide-react';

export default function NewsEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  const [article, setArticle] = useState<Partial<NewsArticle>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'News',
    is_published: false,
    featured_image: '',
  });

  useEffect(() => {
    if (!isNew && id) {
      loadArticle();
    }
  }, [id, isNew]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const result = await getNewsArticleById(id as string);
      
      if (result.error) {
        addToast(result.error, 'error');
        router.push('/admin/news');
      } else if (result.data) {
        setArticle(result.data);
      }
    } catch (error) {
      addToast('Failed to load article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (title: string) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleSave = async (publish = false) => {
    if (!article.title) {
      addToast('Title is required', 'error');
      return;
    }

    try {
      if (publish) {
        setPublishing(true);
      } else {
        setSaving(true);
      }

      const articleData = {
        ...article,
        is_published: publish || article.is_published,
        published_at: publish && !article.is_published ? new Date().toISOString() : article.published_at,
      };

      let result;
      if (isNew) {
        result = await createNewsArticle(articleData);
      } else {
        result = await updateNewsArticle(id as string, articleData);
      }

      if ('error' in result && result.error) {
        addToast(result.error, 'error');
      } else {
        addToast(publish ? 'Article published!' : 'Article saved!', 'success');
        if (isNew && 'data' in result && result.data) {
          router.push(`/admin/news/${result.data.id}/edit`);
        }
      }
    } catch (error) {
      addToast('Failed to save article', 'error');
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  };

  const handlePublish = () => {
    confirm({
      title: article.is_published ? 'Update Article' : 'Publish Article',
      message: article.is_published 
        ? 'Update this article with your changes?'
        : 'Are you sure you want to publish this article? It will be visible to all users.',
      confirmText: article.is_published ? 'Update' : 'Publish',
      type: 'success',
      onConfirm: () => handleSave(true)
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmDialogComponent />
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/admin/news"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || publishing}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button
              onClick={handlePublish}
              disabled={saving || publishing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {publishing ? 'Publishing...' : article.is_published ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/news/</span>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => setArticle({ ...article, slug: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={article.category}
                  onChange={(e) => setArticle({ ...article, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="News">News</option>
                  <option value="Policy Updates">Policy Updates</option>
                  <option value="Guides">Guides</option>
                  <option value="Updates">Updates</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={article.featured_image || ''}
                    onChange={(e) => setArticle({ ...article, featured_image: e.target.value })}
                    placeholder="Image URL..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                value={article.excerpt}
                onChange={(e) => setArticle({ ...article, excerpt: e.target.value })}
                placeholder="Brief summary of the article..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              
              {/* Rich Text Toolbar */}
              <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
                {[
                  { label: 'B', title: 'Bold' },
                  { label: 'I', title: 'Italic' },
                  { label: 'U', title: 'Underline' },
                  { label: 'H1', title: 'Heading 1' },
                  { label: 'H2', title: 'Heading 2' },
                  { label: '"', title: 'Quote' },
                  { label: '•', title: 'Bullet List' },
                  { label: '1.', title: 'Numbered List' },
                ].map((tool) => (
                  <button
                    key={tool.title}
                    title={tool.title}
                    className="px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded"
                  >
                    {tool.label}
                  </button>
                ))}
                <div className="w-px h-6 bg-gray-300 mx-2" />
                
                <button title="Insert Image" className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button title="Insert Link" className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <span className="text-sm">Link</span>
                </button>
              </div>
              
              <textarea
                value={article.content}
                onChange={(e) => setArticle({ ...article, content: e.target.value })}
                placeholder="Write your article content here..."
                rows={20}
                className="w-full px-4 py-3 border-x border-b border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-gray-500">Status: {' '}</span>
                  <span className={article.is_published ? 'text-green-600 font-medium' : 'text-gray-600 font-medium'}>
                    {article.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                {article.published_at && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Published {new Date(article.published_at).toLocaleDateString('en-AU')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
