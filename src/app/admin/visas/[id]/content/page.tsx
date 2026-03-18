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
  FormInput,
  FileCheck,
  BookOpen,
  Plus,
  Trash2,
  GripVertical,
  Type,
  Calendar,
  FileText,
  List,
  Upload,
  ChevronDown,
  ChevronUp,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Link as LinkIcon,
  Image,
  Heading1,
  Heading2
} from 'lucide-react';

// Mock visa data
const mockVisa = {
  id: '1',
  subclass: '820/801',
  name: 'Partner Visa',
};

// Mock form fields
const mockFormFields = [
  { id: '1', type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true, order: 1 },
  { id: '2', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true, order: 2 },
  { id: '3', type: 'date', label: 'Date of Birth', placeholder: '', required: true, order: 3 },
  { id: '4', type: 'select', label: 'Relationship Status', placeholder: 'Select status', required: true, order: 4, options: ['Married', 'De facto', 'Engaged'] },
  { id: '5', type: 'textarea', label: 'Relationship History', placeholder: 'Describe how you met and your relationship history', required: true, order: 5 },
  { id: '6', type: 'file', label: 'Passport Copy', placeholder: 'Upload passport copy', required: true, order: 6 },
];

// Mock document requirements
const mockDocuments = [
  { id: '1', name: 'Passport Copy', description: 'Clear copy of your current passport bio page', required: true, category: 'Identity' },
  { id: '2', name: 'Birth Certificate', description: 'Certified copy of your birth certificate', required: true, category: 'Identity' },
  { id: '3', name: 'Marriage Certificate', description: 'If married, provide certified marriage certificate', required: false, category: 'Relationship' },
  { id: '4', name: 'Relationship Evidence', description: 'Photos, joint accounts, lease agreements, etc.', required: true, category: 'Relationship' },
  { id: '5', name: 'Health Examination', description: 'Completed health examination by panel physician', required: true, category: 'Health' },
  { id: '6', name: 'Police Clearance', description: 'Police clearance from all countries lived in for 12+ months', required: true, category: 'Character' },
];

// Mock guide content
const mockGuideContent = {
  introduction: `# Partner Visa 820/801 - Complete Guide

Welcome to the comprehensive guide for the Australian Partner Visa (Subclass 820/801). This guide will walk you through every step of the application process.`,
  
  eligibility: `## Eligibility Requirements

To be eligible for this visa, you must:

1. Be married to or in a de facto relationship with an Australian citizen, permanent resident, or eligible New Zealand citizen
2. Have your partner sponsor you
3. Meet health and character requirements
4. Be in Australia when you apply and when the temporary visa is granted

### De Facto Relationship Requirements

If you are in a de facto relationship, you must show that you:
- Have been in the relationship for at least 12 months (unless registered)
- Live together or don't live separately on a permanent basis
- Are mutually committed to a shared life`,

  process: `## Application Process

### Step 1: Gather Documents
Collect all required documents before starting your application. This includes identity documents, relationship evidence, and health checks.

### Step 2: Create ImmiAccount
Create an account on the Department of Home Affairs website and start your application.

### Step 3: Complete Application
Fill out all sections of the online form carefully. Any mistakes can cause delays.

### Step 4: Pay Fee
The current application fee is AUD $8,085. This covers both the temporary and permanent visas.

### Step 5: Submit and Wait
After submission, you'll receive a bridging visa that allows you to stay in Australia while waiting for a decision.`,
};

const fieldTypes = [
  { id: 'text', label: 'Text Input', icon: Type },
  { id: 'email', label: 'Email', icon: Type },
  { id: 'textarea', label: 'Text Area', icon: AlignLeft },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'select', label: 'Dropdown', icon: List },
  { id: 'file', label: 'File Upload', icon: Upload },
];

export default function VisaContentPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('form');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form builder state
  const [formFields, setFormFields] = useState(mockFormFields);
  const [expandedField, setExpandedField] = useState<string | null>(null);
  
  // Document requirements state
  const [documents, setDocuments] = useState(mockDocuments);
  const [newDocCategory, setNewDocCategory] = useState('');
  
  // Guide editor state
  const [guideContent, setGuideContent] = useState(mockGuideContent);
  const [activeSection, setActiveSection] = useState('introduction');

  const tabs = [
    { id: 'form', label: 'Application Form', icon: FormInput },
    { id: 'documents', label: 'Document Requirements', icon: FileCheck },
    { id: 'guides', label: 'Guides', icon: BookOpen },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const addFormField = (type: string) => {
    const newField = {
      id: Date.now().toString(),
      type,
      label: 'New Field',
      placeholder: '',
      required: false,
      order: formFields.length + 1,
      options: type === 'select' ? ['Option 1'] : undefined,
    };
    setFormFields([...formFields, newField]);
  };

  const removeFormField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const addDocument = () => {
    const newDoc = {
      id: Date.now().toString(),
      name: 'New Document',
      description: 'Document description',
      required: true,
      category: newDocCategory || 'General',
    };
    setDocuments([...documents, newDoc]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/visas" className="hover:text-gray-700">Visas</Link>
          <span>/</span>
          <span className="text-gray-900">{mockVisa.name}</span>
          <span>/</span>
          <span className="text-gray-900">Content</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/visas"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
              <p className="text-gray-500">{mockVisa.name} (Subclass {mockVisa.subclass})</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Changes saved successfully
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'form' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Field Types */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Add Fields</h3>
                    <div className="space-y-2">
                      {fieldTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => addFormField(type.id)}
                            className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                          >
                            <Icon className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{type.label}</span>
                            <Plus className="w-4 h-4 text-gray-300 ml-auto" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Form Preview/Editor */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">Form Fields</h3>
                      <p className="text-sm text-gray-500">{formFields.length} fields</p>
                    </div>
                    
                    <div className="space-y-3">
                      {formFields.map((field, index) => (
                        <div
                          key={field.id}
                          className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                        >
                          <div
                            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                            onClick={() => setExpandedField(expandedField === field.id ? null : field.id)}
                          >
                            <GripVertical className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="font-medium">{field.label}</p>
                              <p className="text-sm text-gray-500">{field.type} • {field.required ? 'Required' : 'Optional'}</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFormField(field.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {expandedField === field.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                          
                          {expandedField === field.id && (
                            <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                  <input
                                    type="text"
                                    value={field.label}
                                    onChange={(e) => {
                                      const updated = formFields.map(f =>
                                        f.id === field.id ? { ...f, label: e.target.value } : f
                                      );
                                      setFormFields(updated);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
                                  <input
                                    type="text"
                                    value={field.placeholder}
                                    onChange={(e) => {
                                      const updated = formFields.map(f =>
                                        f.id === field.id ? { ...f, placeholder: e.target.value } : f
                                      );
                                      setFormFields(updated);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                  />
                                </div>
                              </div>
                              
                              <div className="mt-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(e) => {
                                      const updated = formFields.map(f =>
                                        f.id === field.id ? { ...f, required: e.target.checked } : f
                                      );
                                      setFormFields(updated);
                                    }}
                                    className="rounded border-gray-300"
                                  />
                                  <span className="text-sm">Required field</span>
                                </label>
                              </div>
                              
                              {field.type === 'select' && field.options && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                                  <div className="space-y-2">
                                    {field.options.map((opt, i) => (
                                      <div key={i} className="flex gap-2">
                                        <input
                                          type="text"
                                          value={opt}
                                          onChange={(e) => {
                                            const newOptions = [...field.options!];
                                            newOptions[i] = e.target.value;
                                            const updated = formFields.map(f =>
                                              f.id === field.id ? { ...f, options: newOptions } : f
                                            );
                                            setFormFields(updated);
                                          }}
                                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Required Documents</h3>
                  <button
                    onClick={addDocument}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <FileCheck className="w-5 h-5 text-blue-600" />
                          <div>
                            <input
                              type="text"
                              value={doc.name}
                              onChange={(e) => {
                                const updated = documents.map(d =>
                                  d.id === doc.id ? { ...d, name: e.target.value } : d
                                );
                                setDocuments(updated);
                              }}
                              className="font-medium bg-transparent border-none p-0 focus:ring-0"
                            />
                            <span className={cn(
                              'text-xs px-2 py-0.5 rounded-full',
                              doc.required ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                            )}>
                              {doc.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeDocument(doc.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="mt-3 space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Description</label>
                          <textarea
                            value={doc.description}
                            onChange={(e) => {
                              const updated = documents.map(d =>
                                d.id === doc.id ? { ...d, description: e.target.value } : d
                              );
                              setDocuments(updated);
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                            rows={2}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Category</label>
                            <input
                              type="text"
                              value={doc.category}
                              onChange={(e) => {
                                const updated = documents.map(d =>
                                  d.id === doc.id ? { ...d, category: e.target.value } : d
                                );
                                setDocuments(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Requirement</label>
                            <select
                              value={doc.required ? 'required' : 'optional'}
                              onChange={(e) => {
                                const updated = documents.map(d =>
                                  d.id === doc.id ? { ...d, required: e.target.value === 'required' } : d
                                );
                                setDocuments(updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            >
                              <option value="required">Required</option>
                              <option value="optional">Optional</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sections Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Guide Sections</h3>
                    <div className="space-y-2">
                      {Object.keys(guideContent).map((section) => (
                        <button
                          key={section}
                          onClick={() => setActiveSection(section)}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-lg transition-colors',
                            activeSection === section
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-white'
                          )}
                        >
                          <span className="capitalize">{section.replace('_', ' ')}</span>
                        </button>
                      ))}
                    </div>
                    
                    <button className="w-full mt-4 flex items-center gap-2 px-4 py-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50">
                      <Plus className="w-4 h-4" />
                      Add Section
                    </button>
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-xl border border-gray-200">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 p-3 border-b border-gray-200">
                      <button className="p-2 hover:bg-gray-100 rounded"><Bold className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded"><Italic className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded"><Underline className="w-4 h-4" /></button>
                      <div className="w-px h-6 bg-gray-200 mx-2" />
                      <button className="p-2 hover:bg-gray-100 rounded"><Heading1 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded"><Heading2 className="w-4 h-4" /></button>
                      <div className="w-px h-6 bg-gray-200 mx-2" />
                      <button className="p-2 hover:bg-gray-100 rounded"><AlignLeft className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded"><List className="w-4 h-4" /></button>
                      <div className="w-px h-6 bg-gray-200 mx-2" />
                      <button className="p-2 hover:bg-gray-100 rounded"><LinkIcon className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-gray-100 rounded"><Image className="w-4 h-4" /></button>
                    </div>
                    
                    {/* Editor */}
                    <textarea
                      value={guideContent[activeSection as keyof typeof guideContent]}
                      onChange={(e) => setGuideContent({
                        ...guideContent,
                        [activeSection]: e.target.value
                      })}
                      className="w-full p-6 min-h-[500px] resize-none focus:outline-none font-mono text-sm leading-relaxed"
                      placeholder="Enter guide content in Markdown format..."
                    />
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    Supports Markdown formatting: **bold**, *italic*, # headings, - lists
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
