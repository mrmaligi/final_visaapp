'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
  FileCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  History,
  Calendar,
  Share2,
  Shield,
  FolderOpen,
  ChevronDown,
  Filter,
  Zap,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

// Document types and interfaces
type ViewMode = 'grid' | 'list';
type DocumentStatus = 'pending' | 'verified' | 'rejected';
type DocumentCategory = 'all' | 'identity' | 'financial' | 'employment' | 'education' | 'other';

interface DocumentVersion {
  id: string;
  version_number: number;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}

interface Document {
  id: string;
  name: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  category: DocumentCategory;
  visa_application_id?: string;
  url: string;
  status: DocumentStatus;
  shared_with_lawyer: boolean;
  version: number;
  expires_at?: string;
  review_notes?: string;
  is_deleted?: boolean;
  versions?: DocumentVersion[];
}

interface DocumentStats {
  total: number;
  byStatus: {
    pending: number;
    verified: number;
    rejected: number;
  };
  byCategory: {
    identity: number;
    financial: number;
    employment: number;
    education: number;
    other: number;
  };
}

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (type: string, size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10'
  };
  const className = sizeClasses[size];
  
  if (type?.startsWith('image/')) return <FileImage className={`${className} text-purple-600`} />;
  if (type?.includes('pdf')) return <FileText className={`${className} text-red-600`} />;
  if (type?.includes('sheet') || type?.includes('excel') || type?.includes('csv')) return <FileSpreadsheet className={`${className} text-green-600`} />;
  if (type?.includes('json') || type?.includes('xml') || type?.includes('code')) return <FileCode className={`${className} text-yellow-600`} />;
  return <File className={`${className} text-blue-600`} />;
};

const getStatusConfig = (status: DocumentStatus) => {
  const configs = {
    pending: { 
      label: 'Pending Review', 
      icon: Clock,
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      badgeClass: 'bg-amber-100 text-amber-700'
    },
    verified: { 
      label: 'Verified', 
      icon: CheckCircle2,
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badgeClass: 'bg-emerald-100 text-emerald-700'
    },
    rejected: { 
      label: 'Rejected', 
      icon: AlertCircle,
      className: 'bg-red-100 text-red-700 border-red-200',
      badgeClass: 'bg-red-100 text-red-700'
    },
  };
  return configs[status];
};

const getCategoryLabel = (category: DocumentCategory) => {
  const labels: Record<DocumentCategory, string> = {
    all: 'All Documents',
    identity: 'Identity',
    financial: 'Financial',
    employment: 'Employment',
    education: 'Education',
    other: 'Other'
  };
  return labels[category];
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    identity: 'bg-blue-100 text-blue-700 border-blue-200',
    financial: 'bg-green-100 text-green-700 border-green-200',
    employment: 'bg-purple-100 text-purple-700 border-purple-200',
    education: 'bg-orange-100 text-orange-700 border-orange-200',
    other: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[category] || colors.other;
};

// PDF Viewer Component
const PDFViewer = ({ url, name }: { url: string; name: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-full min-h-[500px] bg-gray-50 rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-600">Loading PDF...</p>
          </div>
        </div>
      )}
      <iframe
        src={`${url}#toolbar=1&navpanes=1`}
        className="w-full h-full min-h-[500px] border-0"
        title={name}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError('Failed to load PDF');
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-slate-600">{error}</p>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Download to View
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// Image Viewer Component
const ImageViewer = ({ url, name }: { url: string; name: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="w-full h-full min-h-[500px] bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {error ? (
        <div className="text-center">
          <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-slate-600">Failed to load image</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      ) : (
        <img
          src={url}
          alt={name}
          className="max-w-full max-h-[500px] object-contain"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
};

// Version History Modal
const VersionHistoryModal = ({ 
  document, 
  isOpen, 
  onClose, 
  onRestore 
}: { 
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (version: DocumentVersion) => void;
}) => {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <History className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-900">Version History</h3>
              <p className="text-sm text-slate-500">{document.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            {/* Current version */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                v{document.version}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">Current Version</p>
                <p className="text-sm text-slate-500">
                  {format(parseISO(document.uploaded_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                Current
              </span>
            </div>
            
            {/* Previous versions */}
            {document.versions?.map((version) => (
              <div key={version.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center text-white font-semibold">
                  v{version.version_number}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">Version {version.version_number}</p>
                  <p className="text-sm text-slate-500">
                    {format(parseISO(version.uploaded_at), 'MMM d, yyyy h:mm a')} • {formatFileSize(version.file_size)}
                  </p>
                </div>
                <button
                  onClick={() => onRestore(version)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Restore
                </button>
              </div>
            ))}
            
            {(!document.versions || document.versions.length === 0) && (
              <p className="text-center text-slate-500 py-8">No previous versions available</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Bulk Upload Progress Modal
const BulkUploadModal = ({
  isOpen,
  onClose,
  files,
  uploads,
  onUpload
}: {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  uploads: Record<string, { progress: number; status: 'pending' | 'uploading' | 'completed' | 'error'; error?: string }>;
  onUpload: (category: DocumentCategory, sharedWithLawyer: boolean) => void;
}) => {
  const [category, setCategory] = useState<DocumentCategory>('identity');
  const [sharedWithLawyer, setSharedWithLawyer] = useState(false);

  if (!isOpen) return null;

  const completedCount = Object.values(uploads).filter(u => u.status === 'completed').length;
  const errorCount = Object.values(uploads).filter(u => u.status === 'error').length;
  const totalProgress = files.length > 0 
    ? Object.values(uploads).reduce((acc, u) => acc + u.progress, 0) / files.length 
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-slate-900">Upload {files.length} Documents</h3>
            <p className="text-sm text-slate-500">
              {completedCount} of {files.length} completed
              {errorCount > 0 && ` • ${errorCount} failed`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Category selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={completedCount > 0}
            >
              <option value="identity">Identity</option>
              <option value="financial">Financial</option>
              <option value="employment">Employment</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Shared with lawyer toggle */}
          <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={sharedWithLawyer}
              onChange={(e) => setSharedWithLawyer(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              disabled={completedCount > 0}
            />
            <div className="flex-1">
              <p className="font-medium text-slate-900">Share with my lawyer</p>
              <p className="text-sm text-slate-500">Allow assigned lawyer to access these documents</p>
            </div>
            <Users className="w-5 h-5 text-slate-400" />
          </label>

          {/* Overall progress */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className="text-sm text-slate-500">{Math.round(totalProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>

          {/* File list */}
          <div className="max-h-60 overflow-auto space-y-2">
            {files.map((file) => {
              const upload = uploads[file.name] || { progress: 0, status: 'pending' };
              return (
                <div key={file.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {getFileIcon(file.type, 'sm')}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                  {upload.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{upload.progress}%</span>
                    </div>
                  )}
                  {upload.status === 'completed' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  )}
                  {upload.status === 'error' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs">Failed</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50"
          >
            {completedCount === files.length ? 'Done' : 'Cancel'}
          </button>
          {completedCount === 0 && (
            <button
              onClick={() => onUpload(category, sharedWithLawyer)}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Start Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Document Page Component
export default function UserDocumentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeFilter, setActiveFilter] = useState<DocumentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [showStats, setShowStats] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Bulk upload state
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploads, setBulkUploads] = useState<Record<string, { progress: number; status: 'pending' | 'uploading' | 'completed' | 'error'; error?: string }>>({});
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  // Version history state
  const [versionHistoryDoc, setVersionHistoryDoc] = useState<Document | null>(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  // Documents state (mock data for now)
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Passport_Scan.pdf',
      file_type: 'application/pdf',
      file_size: 2400000,
      uploaded_at: '2026-03-15T10:30:00Z',
      category: 'identity',
      visa_application_id: 'visa-1',
      url: 'https://example.com/docs/passport.pdf',
      status: 'verified',
      shared_with_lawyer: true,
      version: 2,
      expires_at: '2031-03-15T00:00:00Z',
      versions: [
        { id: 'v1', version_number: 1, file_size: 2100000, uploaded_at: '2026-03-10T10:30:00Z', uploaded_by: 'user-1' }
      ]
    },
    {
      id: '2',
      name: 'Bank_Statements_2025.pdf',
      file_type: 'application/pdf',
      file_size: 5100000,
      uploaded_at: '2026-03-16T14:20:00Z',
      category: 'financial',
      visa_application_id: 'visa-1',
      url: 'https://example.com/docs/bank.pdf',
      status: 'pending',
      shared_with_lawyer: false,
      version: 1,
    },
    {
      id: '3',
      name: 'Degree_Certificate.jpg',
      file_type: 'image/jpeg',
      file_size: 1800000,
      uploaded_at: '2026-03-17T09:15:00Z',
      category: 'education',
      visa_application_id: 'visa-1',
      url: 'https://example.com/docs/degree.jpg',
      status: 'verified',
      shared_with_lawyer: true,
      version: 1,
    },
    {
      id: '4',
      name: 'Employment_Contract.pdf',
      file_type: 'application/pdf',
      file_size: 890000,
      uploaded_at: '2026-03-18T16:45:00Z',
      category: 'employment',
      visa_application_id: 'visa-2',
      url: 'https://example.com/docs/contract.pdf',
      status: 'rejected',
      shared_with_lawyer: true,
      version: 3,
      review_notes: 'Document is blurry. Please upload a clearer scan.',
      versions: [
        { id: 'v2', version_number: 2, file_size: 850000, uploaded_at: '2026-03-17T16:45:00Z', uploaded_by: 'user-1' },
        { id: 'v3', version_number: 1, file_size: 820000, uploaded_at: '2026-03-16T16:45:00Z', uploaded_by: 'user-1' }
      ]
    },
    {
      id: '5',
      name: 'IELTS_Results.pdf',
      file_type: 'application/pdf',
      file_size: 450000,
      uploaded_at: '2026-03-18T11:00:00Z',
      category: 'other',
      visa_application_id: 'visa-1',
      url: 'https://example.com/docs/ielts.pdf',
      status: 'verified',
      shared_with_lawyer: true,
      version: 1,
      expires_at: '2028-03-18T00:00:00Z',
    }
  ]);

  const stats: DocumentStats = {
    total: documents.length,
    byStatus: {
      pending: documents.filter(d => d.status === 'pending').length,
      verified: documents.filter(d => d.status === 'verified').length,
      rejected: documents.filter(d => d.status === 'rejected').length,
    },
    byCategory: {
      identity: documents.filter(d => d.category === 'identity').length,
      financial: documents.filter(d => d.category === 'financial').length,
      employment: documents.filter(d => d.category === 'employment').length,
      education: documents.filter(d => d.category === 'education').length,
      other: documents.filter(d => d.category === 'other').length,
    }
  };

  // Filter and sort documents
  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = activeFilter === 'all' || doc.category === activeFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime();
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.file_size - b.file_size;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Handle file drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-500', 'bg-blue-50');
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-500', 'bg-blue-50');
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleBulkUpload(files);
    }
  }, []);

  // Handle bulk upload
  const handleBulkUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setBulkFiles(validFiles);
    const initialUploads: Record<string, { progress: number; status: 'pending' | 'uploading' | 'completed' | 'error' }> = {};
    validFiles.forEach(file => {
      initialUploads[file.name] = { progress: 0, status: 'pending' };
    });
    setBulkUploads(initialUploads);
    setIsBulkUploadOpen(true);
  };

  // Simulate upload process
  const startBulkUpload = async (category: DocumentCategory, sharedWithLawyer: boolean) => {
    for (const file of bulkFiles) {
      setBulkUploads(prev => ({
        ...prev,
        [file.name]: { ...prev[file.name], status: 'uploading' }
      }));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setBulkUploads(prev => ({
          ...prev,
          [file.name]: { ...prev[file.name], progress }
        }));
      }

      // Add new document to list
      const newDoc: Document = {
        id: `new-${Date.now()}-${file.name}`,
        name: file.name,
        file_type: file.type,
        file_size: file.size,
        uploaded_at: new Date().toISOString(),
        category: category as DocumentCategory,
        url: URL.createObjectURL(file),
        status: 'pending',
        shared_with_lawyer: sharedWithLawyer,
        version: 1,
      };

      setDocuments(prev => [newDoc, ...prev]);
      
      setBulkUploads(prev => ({
        ...prev,
        [file.name]: { ...prev[file.name], status: 'completed', progress: 100 }
      }));
    }

    toast.success(`Successfully uploaded ${bulkFiles.length} documents`);
  };

  // Toggle document selection
  const toggleSelection = (docId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(docId)) {
      newSelection.delete(docId);
    } else {
      newSelection.add(docId);
    }
    setSelectedDocuments(newSelection);
  };

  // Toggle shared with lawyer
  const toggleSharedWithLawyer = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, shared_with_lawyer: !doc.shared_with_lawyer }
        : doc
    ));
    
    const doc = documents.find(d => d.id === docId);
    const newStatus = !doc?.shared_with_lawyer;
    toast.success(newStatus ? 'Document shared with lawyer' : 'Document unshared');
  };

  // Delete document
  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    setPreviewDocument(null);
    toast.success('Document deleted');
  };

  // Bulk delete
  const bulkDelete = () => {
    setDocuments(prev => prev.filter(doc => !selectedDocuments.has(doc.id)));
    setSelectedDocuments(new Set());
    toast.success(`Deleted ${selectedDocuments.size} documents`);
  };

  // Check if document is expiring soon
  const isExpiringSoon = (expiresAt?: string) => {
    if (!expiresAt) return false;
    const expiry = parseISO(expiresAt);
    const thirtyDaysFromNow = addDays(new Date(), 30);
    return isBefore(expiry, thirtyDaysFromNow) && isAfter(expiry, new Date());
  };

  // Get preview component based on file type
  const getPreviewComponent = (doc: Document) => {
    if (doc.file_type?.includes('pdf')) {
      return <PDFViewer url={doc.url} name={doc.name} />;
    }
    if (doc.file_type?.startsWith('image/')) {
      return <ImageViewer url={doc.url} name={doc.name} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {getFileIcon(doc.file_type, 'lg')}
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Preview not available</h3>
        <p className="text-slate-500 mb-6">This file type cannot be previewed in the browser</p>
        <a
          href={doc.url}
          download={doc.name}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700"
        >
          <Download className="w-5 h-5" />
          Download to View
        </a>
      </div>
    );
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
              <p className="text-slate-600 mt-1">
                {stats.byStatus.verified} verified • {stats.byStatus.pending} pending • {stats.byStatus.rejected} rejected
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center px-4 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-white transition-colors"
              >
                <FolderOpen className="w-5 h-5 mr-2" />
                Select Files
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-slate-500 mb-1">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-slate-500 mb-1">Verified</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.byStatus.verified}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-slate-500 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.byStatus.pending}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-slate-500 mb-1">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.byStatus.rejected}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-slate-500 mb-1">Shared</p>
              <p className="text-2xl font-bold text-blue-600">
                {documents.filter(d => d.shared_with_lawyer).length}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <p className="text-sm text-slate-500 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-600">
                {documents.filter(d => isExpiringSoon(d.expires_at)).length}
              </p>
            </div>
          </div>
        )}

        {/* Bulk Actions Bar */}
        {selectedDocuments.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-blue-900">
                {selectedDocuments.size} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDocuments(new Set())}
                className="px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-lg"
              >
                Clear
              </button>
              <button
                onClick={bulkDelete}
                className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(['all', 'identity', 'financial', 'employment', 'education', 'other'] as DocumentCategory[]).map((filter) => (
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

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="appearance-none px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="size-desc">Largest First</option>
                  <option value="size-asc">Smallest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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

        {/* Drag & Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 text-center transition-colors cursor-pointer hover:border-blue-400 hover:bg-blue-50/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-slate-600 font-medium">Drag and drop files here, or click to select</p>
          <p className="text-sm text-slate-500 mt-1">PDF, JPG, PNG up to 10MB each</p>
        </div>

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={`bg-white rounded-xl shadow-sm border transition-all group relative ${
                  selectedDocuments.has(doc.id) 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                {/* Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(doc.id)}
                    onChange={() => toggleSelection(doc.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Shared indicator */}
                {doc.shared_with_lawyer && (
                  <div className="absolute top-3 right-3 z-10" title="Shared with lawyer">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                )}

                <div className="p-5 pt-12">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                      {getFileIcon(doc.file_type)}
                    </div>
                    {isExpiringSoon(doc.expires_at) && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        Expires soon
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-slate-900 truncate mb-1" title={doc.name}>{doc.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">
                    {formatFileSize(doc.file_size)} • {format(parseISO(doc.uploaded_at), 'MMM d, yyyy')}
                  </p>
                  
                  {/* Status badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusConfig(doc.status).badgeClass}`}>
                      {getStatusConfig(doc.status).label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(doc.category)}`}>
                      {doc.category}
                    </span>
                  </div>

                  {/* Version info */}
                  {doc.version > 1 && (
                    <button
                      onClick={() => {
                        setVersionHistoryDoc(doc);
                        setIsVersionHistoryOpen(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 mb-3 flex items-center gap-1"
                    >
                      <History className="w-3 h-3" />
                      v{doc.version}
                    </button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setPreviewDocument(doc)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button 
                      onClick={() => toggleSharedWithLawyer(doc.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        doc.shared_with_lawyer 
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                          : 'bg-gray-100 text-slate-400 hover:bg-gray-200'
                      }`}
                      title={doc.shared_with_lawyer ? 'Unshare with lawyer' : 'Share with lawyer'}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
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
                    <th className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDocuments(new Set(filteredDocuments.map(d => d.id)));
                          } else {
                            setSelectedDocuments(new Set());
                          }
                        }}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Document</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Size</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Uploaded</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-slate-700">Shared</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className={`hover:bg-gray-50 ${selectedDocuments.has(doc.id) ? 'bg-blue-50/50' : ''}`}>
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.has(doc.id)}
                          onChange={() => toggleSelection(doc.id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.file_type)}
                          <div>
                            <span className="font-medium text-slate-900 block">{doc.name}</span>
                            {isExpiringSoon(doc.expires_at) && (
                              <span className="text-xs text-orange-600">Expires soon</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusConfig(doc.status).badgeClass}`}>
                          {doc.status === 'pending' && <Clock className="w-3 h-3" />}
                          {doc.status === 'verified' && <CheckCircle2 className="w-3 h-3" />}
                          {doc.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                          {getStatusConfig(doc.status).label}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{formatFileSize(doc.file_size)}</td>
                      <td className="py-4 px-4 text-sm text-slate-600">
                        {format(parseISO(doc.uploaded_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleSharedWithLawyer(doc.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            doc.shared_with_lawyer 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {doc.shared_with_lawyer ? <Users className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => setPreviewDocument(doc)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                          {doc.version > 1 && (
                            <button 
                              onClick={() => {
                                setVersionHistoryDoc(doc);
                                setIsVersionHistoryOpen(true);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Version history"
                            >
                              <History className="w-4 h-4 text-slate-600" />
                            </button>
                          )}
                          <button 
                            onClick={() => toggleSharedWithLawyer(doc.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              doc.shared_with_lawyer 
                                ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                                : 'hover:bg-gray-100 text-slate-600'
                            }`}
                            title={doc.shared_with_lawyer ? 'Unshare' : 'Share with lawyer'}
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-slate-600" />
                          </button>
                          <button 
                            onClick={() => deleteDocument(doc.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
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
            <p className="text-slate-600 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Upload your first document to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Document
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            handleBulkUpload(Array.from(e.target.files));
          }
        }}
      />

      {/* Upload Modal (Legacy single file) */}
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

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Document Category</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="identity">Identity</option>
                <option value="financial">Financial</option>
                <option value="employment">Employment</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                <div>
                  <p className="font-medium text-slate-900">Share with my lawyer</p>
                  <p className="text-sm text-slate-500">Allow assigned lawyer to access this document</p>
                </div>
              </label>
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
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {getFileIcon(previewDocument.file_type)}
                <div>
                  <h3 className="font-semibold text-slate-900">{previewDocument.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{formatFileSize(previewDocument.file_size)}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusConfig(previewDocument.status).badgeClass}`}>
                      {getStatusConfig(previewDocument.status).label}
                    </span>
                    {previewDocument.shared_with_lawyer && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <Users className="w-3 h-3" />
                          Shared
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSharedWithLawyer(previewDocument.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    previewDocument.shared_with_lawyer 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'hover:bg-gray-100 text-slate-600'
                  }`}
                  title={previewDocument.shared_with_lawyer ? 'Unshare' : 'Share with lawyer'}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {previewDocument.version > 1 && (
                  <button
                    onClick={() => {
                      setVersionHistoryDoc(previewDocument);
                      setIsVersionHistoryOpen(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Version history"
                  >
                    <History className="w-5 h-5 text-slate-600" />
                  </button>
                )}
                <button 
                  onClick={() => setPreviewDocument(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 bg-gray-50 overflow-auto">
              {getPreviewComponent(previewDocument)}
            </div>

            <div className="flex items-center justify-between p-6 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>Version {previewDocument.version}</span>
                <span>•</span>
                <span>Uploaded {format(parseISO(previewDocument.uploaded_at), 'MMM d, yyyy')}</span>
                {previewDocument.expires_at && (
                  <>
                    <span>•</span>
                    <span className={isExpiringSoon(previewDocument.expires_at) ? 'text-orange-600 font-medium' : ''}>
                      Expires {format(parseISO(previewDocument.expires_at), 'MMM d, yyyy')}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPreviewDocument(null)}
                  className="px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <a
                  href={previewDocument.url}
                  download={previewDocument.name}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => {
          setIsBulkUploadOpen(false);
          setBulkFiles([]);
          setBulkUploads({});
        }}
        files={bulkFiles}
        uploads={bulkUploads}
        onUpload={startBulkUpload}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        document={versionHistoryDoc}
        isOpen={isVersionHistoryOpen}
        onClose={() => {
          setIsVersionHistoryOpen(false);
          setVersionHistoryDoc(null);
        }}
        onRestore={(version) => {
          toast.success(`Restored version ${version.version_number}`);
          setIsVersionHistoryOpen(false);
        }}
      />
    </div>
  );
}
