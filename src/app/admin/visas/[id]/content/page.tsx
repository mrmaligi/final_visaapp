'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Save,
  Layout,
  FileText,
  Image as ImageIcon,
  List,
  CheckCircle,
  Type,
  Heading,
  Quote,
  Link as LinkIcon
} from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'list' | 'quote' | 'checklist';
  content: string;
  items?: string[];
}

export default function VisaContentPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToast } = useToast();
  
  const [saving, setSaving] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      id: '1',
      type: 'heading',
      content: 'Overview'
    },
    {
      id: '2',
      type: 'paragraph',
      content: 'This visa allows skilled workers to live and work in Australia permanently.'
    },
    {
      id: '3',
      type: 'heading',
      content: 'Requirements'
    },
    {
      id: '4',
      type: 'checklist',
      content: '',
      items: [
        'Be under 45 years of age',
        'Have competent English',
        'Score at least 65 points',
        'Have an occupation on the skilled list'
      ]
    }
  ]);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: type === 'list' || type === 'checklist' ? '' : '',
      items: type === 'list' || type === 'checklist' ? [''] : undefined
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const addListItem = (blockId: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.items) {
        return { ...b, items: [...b.items, ''] };
      }
      return b;
    }));
  };

  const updateListItem = (blockId: string, index: number, value: string) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.items) {
        const newItems = [...b.items];
        newItems[index] = value;
        return { ...b, items: newItems };
      }
      return b;
    }));
  };

  const removeListItem = (blockId: string, index: number) => {
    setBlocks(blocks.map(b => {
      if (b.id === blockId && b.items) {
        return { ...b, items: b.items.filter((_, i) => i !== index) };
      }
      return b;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // In a real implementation, save to database
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    addToast('Content saved successfully', 'success');
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/admin/visas"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Visas
          </Link>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Toolbar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Add Blocks
              </h3>
              
              <div className="space-y-2">
                {[
                  { type: 'heading', label: 'Heading', icon: Heading },
                  { type: 'paragraph', label: 'Paragraph', icon: Type },
                  { type: 'image', label: 'Image', icon: ImageIcon },
                  { type: 'list', label: 'Bullet List', icon: List },
                  { type: 'checklist', label: 'Checklist', icon: CheckCircle },
                  { type: 'quote', label: 'Quote', icon: Quote },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => addBlock(item.type as ContentBlock['type'])}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-gray-400" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h1 className="text-2xl font-bold mb-6">Edit Visa Content</h1>
              
              <div className="space-y-6">
                {blocks.map((block, index) => (
                  <div key={block.id} className="relative group">
                    <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                    
                    {block.type === 'heading' && (
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Heading..."
                        className="w-full text-xl font-bold border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none py-2"
                      />
                    )}
                    
                    {block.type === 'paragraph' && (
                      <textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Enter text..."
                        rows={3}
                        className="w-full px-0 py-2 border-0 focus:ring-0 resize-y"
                      />
                    )}
                    
                    {block.type === 'image' && (
                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <input
                          type="text"
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Image URL..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    )}
                    
                    {block.type === 'quote' && (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2">
                        <textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Enter quote..."
                          rows={2}
                          className="w-full px-0 py-0 border-0 focus:ring-0 italic resize-y"
                        />
                      </blockquote>
                    )}
                    
                    {(block.type === 'list' || block.type === 'checklist') && (
                      <div className="space-y-2">
                        <div className="space-y-2">
                          {block.items?.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                              <span className="text-gray-400">
                                {block.type === 'checklist' ? '☐' : '•'}
                              </span>
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => updateListItem(block.id, itemIndex, e.target.value)}
                                placeholder="List item..."
                                className="flex-1 px-2 py-1 border-b border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                onClick={() => removeListItem(block.id, itemIndex)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => addListItem(block.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add item
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                
                {blocks.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Layout className="w-12 h-12 mx-auto mb-3" />
                    <p>Start building your content by adding blocks from the sidebar</p>
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
