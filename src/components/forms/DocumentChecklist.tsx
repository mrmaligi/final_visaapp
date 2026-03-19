'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  Upload,
  Eye,
  FileCheck,
  Info,
  Download,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Types
export type DocumentStatus = 'not_started' | 'in_progress' | 'completed' | 'not_required';

export interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'identity' | 'financial' | 'employment' | 'education' | 'health' | 'character' | 'other';
  documentType?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  templateUrl?: string;
  exampleUrl?: string;
  guidelines?: string[];
  expiresAfter?: number; // Days until expiry
}

export interface ChecklistItem {
  requirement: DocumentRequirement;
  status: DocumentStatus;
  uploadedDocumentId?: string;
  uploadedAt?: string;
  expiresAt?: string;
  notes?: string;
}

export interface DocumentChecklistProps {
  visaTypeName: string;
  visaTypeCode: string;
  items: ChecklistItem[];
  onUpload: (requirementId: string) => void;
  onViewDocument: (documentId: string) => void;
  onDownloadTemplate?: (templateUrl: string) => void;
  overallProgress: number;
}

// Category configurations
const categoryConfig = {
  identity: {
    label: 'Identity Documents',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: '👤',
  },
  financial: {
    label: 'Financial Documents',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: '💰',
  },
  employment: {
    label: 'Employment Documents',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: '💼',
  },
  education: {
    label: 'Education Documents',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: '🎓',
  },
  health: {
    label: 'Health Documents',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: '🏥',
  },
  character: {
    label: 'Character Documents',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: '⚖️',
  },
  other: {
    label: 'Other Documents',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: '📄',
  },
};

// Status configurations
const statusConfig = {
  not_started: {
    label: 'Not Started',
    icon: Circle,
    className: 'text-slate-400',
    bgClass: 'bg-slate-50 border-slate-200',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    className: 'text-amber-500',
    bgClass: 'bg-amber-50 border-amber-200',
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    className: 'text-emerald-500',
    bgClass: 'bg-emerald-50 border-emerald-200',
  },
  not_required: {
    label: 'Not Required',
    icon: CheckCircle2,
    className: 'text-slate-400',
    bgClass: 'bg-gray-50 border-gray-200',
  },
};

// Individual checklist item component
function ChecklistItemCard({ 
  item, 
  onUpload, 
  onViewDocument,
  onDownloadTemplate 
}: { 
  item: ChecklistItem;
  onUpload: (requirementId: string) => void;
  onViewDocument: (documentId: string) => void;
  onDownloadTemplate?: (templateUrl: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { requirement, status } = item;
  const StatusIcon = statusConfig[status].icon;

  return (
    <div className={`rounded-xl border-2 transition-all ${
      status === 'completed' 
        ? 'border-emerald-200 bg-emerald-50/30' 
        : status === 'in_progress'
          ? 'border-amber-200 bg-amber-50/30'
          : 'border-gray-200 bg-white'
    }`}>
      <div 
        className="p-4 flex items-start gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Status indicator */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          status === 'completed' 
            ? 'bg-emerald-100' 
            : status === 'in_progress'
              ? 'bg-amber-100'
              : 'bg-gray-100'
        }`}>
          <StatusIcon className={`w-5 h-5 ${statusConfig[status].className}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                {requirement.name}
                {requirement.required && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                    Required
                  </span>
                )}
              </h4>
              <p className="text-sm text-slate-500 mt-0.5 truncate">{requirement.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {status === 'completed' && item.uploadedAt && (
                <span className="text-xs text-slate-500">
                  Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
                </span>
              )}
              <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex items-center gap-2 mt-3">
            {status === 'completed' && item.uploadedDocumentId ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDocument(item.uploadedDocumentId!);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Document
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpload(requirement.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            )}
            
            {requirement.templateUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadTemplate?.(requirement.templateUrl!);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Template
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4">
          <div className="space-y-4">
            {/* Guidelines */}
            {requirement.guidelines && requirement.guidelines.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-slate-900 flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Guidelines
                </h5>
                <ul className="space-y-1">
                  {requirement.guidelines.map((guideline, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Document requirements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Accepted Formats</p>
                <p className="text-sm font-medium text-slate-900">
                  {requirement.documentType?.join(', ') || 'PDF, JPG, PNG'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Max File Size</p>
                <p className="text-sm font-medium text-slate-900">
                  {requirement.maxFileSize 
                    ? `${(requirement.maxFileSize / 1024 / 1024).toFixed(0)} MB` 
                    : '10 MB'}
                </p>
              </div>
              {requirement.maxFiles && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Max Files</p>
                  <p className="text-sm font-medium text-slate-900">{requirement.maxFiles}</p>
                </div>
              )}
              {requirement.expiresAfter && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Valid For</p>
                  <p className="text-sm font-medium text-slate-900">{requirement.expiresAfter} days</p>
                </div>
              )}
            </div>

            {/* Example document */}
            {requirement.exampleUrl && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">Example Document Available</p>
                  <p className="text-xs text-slate-500">View a sample to understand the requirements</p>
                </div>
                <a
                  href={requirement.exampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Example
                </a>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{item.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Main checklist component
export default function DocumentChecklist({
  visaTypeName,
  visaTypeCode,
  items,
  onUpload,
  onViewDocument,
  onDownloadTemplate,
  overallProgress,
}: DocumentChecklistProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(categoryConfig))
  );

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.requirement.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // Calculate category progress
  const getCategoryProgress = (categoryItems: ChecklistItem[]) => {
    const completed = categoryItems.filter(item => item.status === 'completed').length;
    const required = categoryItems.filter(item => item.requirement.required).length;
    return { completed, required, total: categoryItems.length };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500">Document Checklist</p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{visaTypeName}</h2>
            <p className="text-sm text-slate-500 mt-1">Visa Subclass {visaTypeCode}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">{overallProgress}%</p>
            <p className="text-sm text-slate-500">Complete</p>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-6">
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-slate-500">
              {items.filter(i => i.status === 'completed').length} of {items.length} documents uploaded
            </span>
            <span className="text-slate-500">
              {items.filter(i => i.requirement.required && i.status !== 'completed').length} required remaining
            </span>
          </div>
        </div>
      </div>

      {/* Category sections */}
      <div className="space-y-4">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
          const config = categoryConfig[category as keyof typeof categoryConfig];
          const { completed, required, total } = getCategoryProgress(categoryItems);
          const isExpanded = expandedCategories.has(category);
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${config.color}`}>
                  {config.icon}
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-slate-900">{config.label}</h3>
                  <p className="text-sm text-slate-500">
                    {completed} of {total} completed
                    {required > 0 && ` • ${required} required`}
                  </p>
                </div>

                {/* Progress circle */}
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${progress * 1.26} 126`}
                      className={progress === 100 ? 'text-emerald-500' : 'text-blue-500'}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                    {progress}%
                  </span>
                </div>

                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Category items */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-3">
                  {categoryItems.map((item) => (
                    <ChecklistItemCard
                      key={item.requirement.id}
                      item={item}
                      onUpload={onUpload}
                      onViewDocument={onViewDocument}
                      onDownloadTemplate={onDownloadTemplate}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Missing documents summary */}
      {items.filter(i => i.requirement.required && i.status !== 'completed').length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Missing Required Documents</h3>
              <p className="text-sm text-amber-700 mt-1">
                You still need to upload {items.filter(i => i.requirement.required && i.status !== 'completed').length} required documents to complete your application.
              </p>
              <div className="mt-4 space-y-2">
                {items
                  .filter(i => i.requirement.required && i.status !== 'completed')
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.requirement.id} className="flex items-center gap-2 text-sm text-amber-800">
                      <Circle className="w-4 h-4" />
                      {item.requirement.name}
                    </div>
                  ))}
                {items.filter(i => i.requirement.required && i.status !== 'completed').length > 5 && (
                  <p className="text-sm text-amber-600">
                    and {items.filter(i => i.requirement.required && i.status !== 'completed').length - 5} more...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick upload link */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-slate-700">Need to upload documents?</span>
        </div>
        <Link
          href="/user/documents"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Go to Documents
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// Sample checklist data generator
export function generateSampleChecklist(): ChecklistItem[] {
  const requirements: DocumentRequirement[] = [
    {
      id: 'passport',
      name: 'Passport',
      description: 'Current passport bio-data page',
      required: true,
      category: 'identity',
      documentType: ['pdf', 'jpg', 'png'],
      maxFileSize: 10 * 1024 * 1024,
      guidelines: [
        'Must be valid for at least 6 months',
        'All pages must be clearly visible',
        'Scan must be in color',
      ],
      expiresAfter: 365,
    },
    {
      id: 'birth-certificate',
      name: 'Birth Certificate',
      description: 'Full birth certificate or family book',
      required: true,
      category: 'identity',
      documentType: ['pdf', 'jpg', 'png'],
      maxFileSize: 10 * 1024 * 1024,
    },
    {
      id: 'bank-statements',
      name: 'Bank Statements',
      description: 'Last 3 months of bank statements',
      required: true,
      category: 'financial',
      documentType: ['pdf'],
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 3,
      guidelines: [
        'Must show account holder name',
        'Must show regular transactions',
        'Official bank documents only',
      ],
    },
    {
      id: 'employment-contract',
      name: 'Employment Contract',
      description: 'Current employment contract or letter',
      required: true,
      category: 'employment',
      documentType: ['pdf'],
      maxFileSize: 10 * 1024 * 1024,
      templateUrl: '/templates/employment-letter-template.pdf',
    },
    {
      id: 'payslips',
      name: 'Payslips',
      description: 'Last 3 months of payslips',
      required: true,
      category: 'employment',
      documentType: ['pdf', 'jpg', 'png'],
      maxFileSize: 10 * 1024 * 1024,
      maxFiles: 3,
    },
    {
      id: 'degree-certificate',
      name: 'Degree Certificate',
      description: 'Highest qualification certificate',
      required: true,
      category: 'education',
      documentType: ['pdf', 'jpg', 'png'],
      maxFileSize: 10 * 1024 * 1024,
      guidelines: [
        'Must show institution name',
        'Must show completion date',
        'Certified copies preferred',
      ],
    },
    {
      id: 'transcripts',
      name: 'Academic Transcripts',
      description: 'Academic records showing subjects and grades',
      required: true,
      category: 'education',
      documentType: ['pdf'],
      maxFileSize: 10 * 1024 * 1024,
    },
    {
      id: 'medical-exam',
      name: 'Medical Examination',
      description: 'Health examination by approved panel physician',
      required: true,
      category: 'health',
      documentType: ['pdf'],
      maxFileSize: 10 * 1024 * 1024,
      expiresAfter: 365,
      exampleUrl: '/examples/medical-certificate-example.pdf',
    },
    {
      id: 'police-check',
      name: 'Police Clearance Certificate',
      description: 'National police check from all countries lived in',
      required: true,
      category: 'character',
      documentType: ['pdf'],
      maxFileSize: 10 * 1024 * 1024,
      expiresAfter: 365,
    },
    {
      id: 'ielts',
      name: 'English Test Results',
      description: 'IELTS, PTE, or equivalent test results',
      required: false,
      category: 'other',
      documentType: ['pdf', 'jpg', 'png'],
      maxFileSize: 10 * 1024 * 1024,
      expiresAfter: 1095, // 3 years
    },
  ];

  return requirements.map(req => ({
    requirement: req,
    status: 'not_started' as DocumentStatus,
  }));
}
