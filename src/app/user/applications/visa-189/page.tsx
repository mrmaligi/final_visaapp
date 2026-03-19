'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import DynamicForm from '@/components/forms/DynamicForm';
import DocumentChecklist, { generateSampleChecklist } from '@/components/forms/DocumentChecklist';
import { sampleVisaFormSchema, type FormSubmission, type FormProgress } from '@/components/forms/form-schema';
import { toast } from 'sonner';

type TabType = 'form' | 'documents';

export default function VisaApplicationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [savedData, setSavedData] = useState<Record<string, unknown>>({});
  const [savedProgress, setSavedProgress] = useState<FormProgress | undefined>();
  const [checklistItems, setChecklistItems] = useState(generateSampleChecklist());
  const [formProgress, setFormProgress] = useState(0);

  // Calculate document checklist progress
  const documentProgress = Math.round(
    (checklistItems.filter(i => i.status === 'completed').length / checklistItems.length) * 100
  );

  // Handle form submission
  const handleSubmit = useCallback(async (submission: FormSubmission) => {
    console.log('Form submitted:', submission);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Application submitted successfully!');
  }, []);

  // Handle form save
  const handleSave = useCallback(async (data: Record<string, unknown>, progress: FormProgress) => {
    console.log('Form saved:', { data, progress });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSavedData(data);
    setSavedProgress(progress);
    
    // Update form progress
    setFormProgress(progress.percentage);
  }, []);

  // Handle form change
  const handleFormChange = useCallback((data: Record<string, unknown>, progress: FormProgress) => {
    setFormProgress(progress.percentage);
  }, []);

  // Handle document upload from checklist
  const handleDocumentUpload = useCallback((requirementId: string) => {
    // Simulate upload
    toast.success('Document uploaded successfully');
    
    setChecklistItems(prev => prev.map(item => 
      item.requirement.id === requirementId
        ? { 
            ...item, 
            status: 'completed',
            uploadedAt: new Date().toISOString(),
            uploadedDocumentId: `doc-${Date.now()}`
          }
        : item
    ));
  }, []);

  // Handle document view
  const handleViewDocument = useCallback((documentId: string) => {
    toast.info('Opening document viewer...');
  }, []);

  // Handle template download
  const handleDownloadTemplate = useCallback((templateUrl: string) => {
    toast.success('Template downloaded');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/user/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/user/applications" className="hover:text-blue-600">Applications</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Skilled Independent Visa (189)</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Visa Application</h1>
              <p className="text-slate-600 mt-1">Skilled Independent Visa (Subclass 189)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Application ID</p>
                <p className="font-medium text-slate-900">#APP-2026-001234</p>
              </div>
              <span className="px-4 py-2 bg-amber-100 text-amber-700 font-medium rounded-full text-sm">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Application Form</p>
                <p className="text-2xl font-bold text-slate-900">{formProgress}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Documents</p>
                <p className="text-2xl font-bold text-slate-900">{documentProgress}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Est. Processing</p>
                <p className="text-2xl font-bold text-slate-900">8-12 months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'form'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Application Form
                {formProgress > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    formProgress === 100 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {formProgress}%
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'documents'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Document Checklist
                {documentProgress > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    documentProgress === 100 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {documentProgress}%
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'form' ? (
              <DynamicForm
                schema={sampleVisaFormSchema}
                initialData={savedData}
                initialProgress={savedProgress}
                onSubmit={handleSubmit}
                onSave={handleSave}
                onChange={handleFormChange}
              />
            ) : (
              <DocumentChecklist
                visaTypeName="Skilled Independent Visa"
                visaTypeCode="189"
                items={checklistItems}
                onUpload={handleDocumentUpload}
                onViewDocument={handleViewDocument}
                onDownloadTemplate={handleDownloadTemplate}
                overallProgress={documentProgress}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
