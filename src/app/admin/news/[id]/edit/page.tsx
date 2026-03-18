'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  Calendar,
  Image,
  Tag,
  Eye,
  Clock,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  Link as LinkIcon,
  Upload,
  ExternalLink,
  Trash2
} from 'lucide-react';

// Mock article data
const mockArticle = {
  id: '1',
  title: 'Changes to Partner Visa Requirements in 2024',
  slug: 'partner-visa-changes-2024',
  excerpt: 'The Australian government has announced significant changes to partner visa requirements effective from July 2024.',
  content: `The Australian Department of Home Affairs has announced several important changes to the Partner Visa program that will take effect from July 1, 2024.

## Key Changes

### Processing Time Improvements
The government has committed to reducing processing times for Partner Visas, with a target of processing 80% of applications within 12 months.

### Updated Evidence Requirements
New guidelines have been introduced regarding the types of evidence that can be provided to prove a genuine relationship. This includes:
- Joint financial commitments
- Shared household responsibilities
- Social recognition of the relationship
- Nature of commitment to each other

### English Language Requirements
From late 2024, applicants and sponsors will need to demonstrate functional English or show that they have made reasonable efforts to learn English.

## What This Means for Applicants

If you are planning to apply for a Partner Visa, these changes may affect your application. We recommend:

1. Starting your application as soon as possible
2. Gathering all required evidence early
3. Considering English language preparation if needed
4. Consulting with a registered migration agent

Stay tuned for more updates as we receive further details from the Department of Home Affairs.`,
  category: 'Policy Updates',
  featured_image: '',
  meta_title: 'Partner Visa Changes 2024 | Australia Immigration Updates',
  meta_description: 'Learn about the significant changes to Australian Partner Visa requirements coming in 2024, including processing times and new evidence requirements.',
  status: 'published',
  published_at: '2024-03-15T10:00:00Z',
  author: 'Admin User',
  views: 1245,
};

const categories = [
  'Policy Updates',
  'News',
  'Guides',
  'Updates',
  'Tips',
  'Success Stories',
];

export default function EditArticlePage() {
  const params = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState(mockArticle);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (asStatus?: 'published') => {
    if (asStatus === 'published') {
      setIsPublishing(true);
    } else {
      setIsSaving(true);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (asStatus === 'published') {
      setIsPublishing(false);
    } else {
      setIsSaving(false);
    }
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/news" className="hover:text-gray-700">News</Link>
          <span>/</span>
          <span className="text-gray-900">Edit Article</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/news"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>By {mockArticle.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {mockArticle.views} views
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Changes saved
              </div>
            )}
            
            <Link
              href={`/news/${mockArticle.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Preview
            </Link>
            
            <button
              onClick={() => handleSave('published')}
              disabled={isSaving || isPublishing}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isPublishing ? 'Saving...' : 'Update'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 text-lg border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">/news/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    maxLength={300}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/300 characters</p>
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-1 p-3 border-b border-gray-200">
                <button className="p-2 hover:bg-gray-100 rounded"><Bold className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-gray-100 rounded"><Italic className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-gray-100 rounded"><Underline className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button className="p-2 hover:bg-gray-100 rounded"><Heading1 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-gray-100 rounded"><Heading2 className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button className="p-2 hover:bg-gray-100 rounded"><List className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-gray-200 mx-2" />
                <button className="p-2 hover:bg-gray-100 rounded"><LinkIcon className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-gray-100 rounded"><Image className="w-4 h-4" /></button>
              </div>
              
              <textarea
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full p-6 min-h-[400px] resize-none focus:outline-none font-mono text-sm leading-relaxed"
              />
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                SEO Settings
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => handleChange('meta_title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.meta_title.length}/60 characters</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => handleChange('meta_description', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.meta_description.length}/160 characters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Publish</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  )}>
                    {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Published: {formatDate(formData.published_at)}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => handleSave('published')}
                    disabled={isSaving || isPublishing}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isPublishing ? 'Saving...' : 'Update'}
                  </button>
                  
                  <button
                    onClick={() => handleSave()}
                    disabled={isSaving || isPublishing}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
              
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h2>
              
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                <Trash2 className="w-4 h-4" />
                Delete Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
