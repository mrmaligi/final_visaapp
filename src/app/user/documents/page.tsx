'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  Grid3X3, 
  List,
  Search,
  ChevronRight,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  X,
  File,
  FileImage,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

type ViewMode = 'grid' | 'list';
type DocumentType = 'all' | 'identity' | 'financial' | 'employment' | 'education' | 'other';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  category: DocumentType;
  visaApplication?: string;
  url: string;
}

export default function UserDocumentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<DocumentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data
  const documents: Document[] = [
    {
      id: '1',
      name: 'Passport_Scan.pdf',
      type: 'application/pdf',
      size: '2.4 MB',
      uploadedAt: '2026-03-15',
      category: 'identity',
      visaApplication: 'Skilled Independent (189)',
      url: '#'
    },
    {
      id: '2',
      name: 'Bank_Statements_2025.pdf',
      type: 'application/pdf',
      size: '5.1 MB',
      uploadedAt: '2026-03-16',
      category: 'financial',
      visaApplication: 'Skilled Independent (189)',
      url: '#'
    },
    {
      id: '3',
      name: 'Degree_Certificate.jpg',
      type: 'image/jpeg',
      size: '1.8 MB',
      uploadedAt: '2026-03-17',
      category: 'education',
      visaApplication: 'Skilled Independent (189)',
      url: '#'
    },
    {
      id: '4',
      name: 'Employment_Contract.pdf',
      type: 'application/pdf',
      size: '890 KB',
      uploadedAt: '2026-03-18',
      category: 'employment',
      visaApplication: 'Partner Visa (820)',
      url: '#'
    },
    {
      id: '5',
      name: 'IELTS_Results.pdf',
      type: 'application/pdf',
      size: '450 KB',
      uploadedAt: '2026-03-18',
      category: 'other',
      visaApplication: 'Skilled Independent (189)',
      url: '#'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = activeFilter === 'all' || doc.category === activeFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-6 h-6 text-purple-600" />;
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-600" />;
    if (type.includes('sheet') || type.includes('excel')) return <FileSpreadsheet className="w-6 h-6 text-green-600" />;
    if (type.includes('json') || type.includes('xml')) return <FileCode className="w-6 h-6 text-yellow-600" />;
    return <File className="w-6 h-6 text-blue-600" />;
  };

  const getCategoryLabel = (category: DocumentType) => {
    const labels: Record<DocumentType, string> = {
      all: 'All Documents',
      identity: 'Identity',
      financial: 'Financial',
      employment: 'Employment',
      education: 'Education',
      other: 'Other'
    };
    return labels[category];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Handle file upload logic here
      console.log('Uploading files:', files);
      setIsUploadModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/user/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Documents</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Documents</h1>
              <p className="text-slate-600 mt-1">Manage and organize your visa application documents</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(['all', 'identity', 'financial', 'employment', 'education', 'other'] as DocumentType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeFilter === filter
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:bg-gray-100'
                  }`}
                >
                  {getCategoryLabel(filter)}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeFilter === filter ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {filter === 'all' 
                      ? documents.length 
                      : documents.filter(d => d.category === filter).length
                    }
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1 flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="relative">
                    <button className="p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-medium text-slate-900 truncate mb-1" title={doc.name}>{doc.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString('en-AU')}</p>
                
                {doc.visaApplication && (
                  <p className="text-xs text-blue-600 mb-3 truncate">{doc.visaApplication}</p>
                )}
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPreviewDocument(doc)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="p-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Document</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Category</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Visa Application</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Size</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-slate-700">Uploaded</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <span className="font-medium text-slate-900">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-600">{doc.visaApplication || '-'}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{doc.size}</td>
                      <td className="py-4 px-6 text-sm text-slate-600">{new Date(doc.uploadedAt).toLocaleDateString('en-AU')}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setPreviewDocument(doc)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-slate-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents found</h3>
            <p className="text-slate-600 mb-6">Upload your first document to get started</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Upload Document</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-slate-900 font-medium mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-slate-500">PDF, JPG, PNG up to 10MB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Document Category</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Select category...</option>
                <option value="identity">Identity</option>
                <option value="financial">Financial</option>
                <option value="employment">Employment</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {getFileIcon(previewDocument.type)}
                <div>
                  <h3 className="font-semibold text-slate-900">{previewDocument.name}</h3>
                  <p className="text-sm text-slate-500">{previewDocument.size}</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDocument(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 p-6 bg-gray-50 overflow-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  {getFileIcon(previewDocument.type)}
                  <p className="mt-4 text-slate-600">Preview not available</p>
                  <p className="text-sm text-slate-500">Download the file to view</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
