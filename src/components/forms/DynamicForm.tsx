'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Clock,
  X,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import DynamicFormField from './DynamicFormField';
import type { 
  FormSchema, 
  FormSection, 
  FormField, 
  FormError, 
  FormProgress,
  AutoSaveState,
  FormSubmission 
} from './form-schema';
import { validateForm, calculateProgress, evaluateConditional } from './form-schema';

interface DynamicFormProps {
  schema: FormSchema;
  initialData?: Record<string, unknown>;
  initialProgress?: FormProgress;
  onSubmit: (data: FormSubmission) => void | Promise<void>;
  onSave?: (data: Record<string, unknown>, progress: FormProgress) => void | Promise<void>;
  onChange?: (data: Record<string, unknown>, progress: FormProgress) => void;
  disabled?: boolean;
}

export default function DynamicForm({
  schema,
  initialData = {},
  initialProgress,
  onSubmit,
  onSave,
  onChange,
  disabled = false,
}: DynamicFormProps) {
  // Form state
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  // Multi-step navigation
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    initialProgress?.currentSection || 0
  );
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  
  // Auto-save state
  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: initialProgress?.lastSaved || null,
    hasUnsavedChanges: false,
    error: null,
  });
  
  // Track last saved data to detect changes
  const lastSavedDataRef = useRef(JSON.stringify(initialData));
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChangesRef = useRef(false);

  // Calculate progress
  const progress = calculateProgress(schema, formData, currentSectionIndex);
  const currentSection = schema.sections[currentSectionIndex];
  
  // Get visible sections (accounting for conditional logic)
  const visibleSections = schema.sections.filter(
    section => !section.conditional || evaluateConditional(section.conditional, formData)
  );
  
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === schema.sections.length - 1;

  // Handle field change
  const handleFieldChange = useCallback((fieldId: string, value: unknown) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldId]: value };
      hasUnsavedChangesRef.current = JSON.stringify(newData) !== lastSavedDataRef.current;
      
      // Update auto-save state
      setAutoSaveState(prevState => ({
        ...prevState,
        hasUnsavedChanges: hasUnsavedChangesRef.current,
      }));
      
      // Notify parent of change
      const newProgress = calculateProgress(schema, newData, currentSectionIndex);
      onChange?.(newData, newProgress);
      
      return newData;
    });
    
    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(e => e.field !== fieldId));
  }, [schema, currentSectionIndex, onChange]);

  // Handle field blur
  const handleFieldBlur = useCallback((fieldId: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldId));
  }, []);

  // Validate current section
  const validateCurrentSection = useCallback((): boolean => {
    const section = schema.sections[currentSectionIndex];
    const sectionErrors: FormError[] = [];
    
    for (const field of section.fields) {
      // Skip layout and conditional fields
      if (
        ['heading', 'paragraph', 'divider'].includes(field.type) ||
        (field.conditional && !evaluateConditional(field.conditional, formData))
      ) {
        continue;
      }
      
      // Validate nested fields
      if (field.fields) {
        for (const nestedField of field.fields) {
          const error = validateField(nestedField, formData[nestedField.id]);
          if (error) sectionErrors.push(error);
        }
      }
      
      // Validate the field itself
      const error = validateField(field, formData[field.id]);
      if (error) sectionErrors.push(error);
    }
    
    setErrors(sectionErrors);
    
    // Mark all section fields as touched
    const sectionFieldIds = section.fields
      .filter(f => !['heading', 'paragraph', 'divider'].includes(f.type))
      .map(f => f.id);
    setTouchedFields(prev => new Set([...prev, ...sectionFieldIds]));
    
    return sectionErrors.length === 0;
  }, [schema, currentSectionIndex, formData]);

  // Navigate to next section
  const handleNext = useCallback(() => {
    if (!validateCurrentSection()) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    
    if (currentSectionIndex < schema.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex, schema.sections.length, validateCurrentSection]);

  // Navigate to previous section
  const handleBack = useCallback(() => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  // Navigate to specific section
  const handleGoToSection = useCallback((index: number) => {
    // Only allow navigating to visited sections or the next unvisited one
    if (index <= currentSectionIndex || index === currentSectionIndex + 1) {
      setCurrentSectionIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSectionIndex]);

  // Save form progress
  const handleSave = useCallback(async () => {
    if (!onSave || !hasUnsavedChangesRef.current) return;
    
    setIsSaving(true);
    setAutoSaveState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      const currentProgress = calculateProgress(schema, formData, currentSectionIndex);
      await onSave(formData, { ...currentProgress, lastSaved: new Date().toISOString() });
      
      lastSavedDataRef.current = JSON.stringify(formData);
      hasUnsavedChangesRef.current = false;
      
      setAutoSaveState({
        isSaving: false,
        lastSaved: new Date().toISOString(),
        hasUnsavedChanges: false,
        error: null,
      });
      
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      setAutoSaveState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Failed to save',
      }));
    } finally {
      setIsSaving(false);
    }
  }, [formData, schema, currentSectionIndex, onSave]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = schema.config?.autoSaveInterval;
    
    if (autoSaveInterval && autoSaveInterval > 0 && onSave) {
      autoSaveIntervalRef.current = setInterval(() => {
        if (hasUnsavedChangesRef.current) {
          handleSave();
        }
      }, autoSaveInterval * 1000);
    }
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [schema.config?.autoSaveInterval, handleSave, onSave]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Validate entire form
    const allErrors = validateForm(schema, formData);
    
    if (allErrors.length > 0) {
      setErrors(allErrors);
      
      // Find first section with errors
      const firstErrorSection = schema.sections.findIndex(section =>
        section.fields.some(field =>
          allErrors.some(error => error.field === field.id || 
            field.fields?.some(f => f.id === error.field)
        ))
      );
      
      if (firstErrorSection !== -1) {
        setCurrentSectionIndex(firstErrorSection);
      }
      
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submission: FormSubmission = {
        formId: schema.id,
        formVersion: schema.version,
        data: formData,
        progress: {
          ...progress,
          currentSection: currentSectionIndex,
          lastSaved: new Date().toISOString(),
        },
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      
      await onSubmit(submission);
      
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, schema, progress, currentSectionIndex, onSubmit]);

  // Warn about unsaved changes on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Helper to validate a single field
  const validateField = (field: FormField, value: unknown): FormError | null => {
    if (!field.validation) return null;
    
    for (const rule of field.validation) {
      let isValid = true;
      
      switch (rule.type) {
        case 'required':
          isValid = value !== undefined && value !== null && value !== '' &&
                    (!Array.isArray(value) || value.length > 0);
          break;
        case 'email':
          if (value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(String(value));
          }
          break;
        case 'min':
          if (value !== undefined && value !== null) {
            isValid = Number(value) >= Number(rule.value);
          }
          break;
        case 'max':
          if (value !== undefined && value !== null) {
            isValid = Number(value) <= Number(rule.value);
          }
          break;
        case 'minLength':
          if (value) {
            isValid = String(value).length >= Number(rule.value);
          }
          break;
        case 'maxLength':
          if (value) {
            isValid = String(value).length <= Number(rule.value);
          }
          break;
        case 'pattern':
          if (value) {
            const regex = new RegExp(String(rule.value));
            isValid = regex.test(String(value));
          }
          break;
      }
      
      if (!isValid) {
        return { field: field.id, message: rule.message, type: rule.type };
      }
    }
    
    return null;
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (!schema.config?.showProgressBar) return null;
    
    return (
      <div className="mb-8">
        {/* Progress percentage */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
          <span className="text-sm font-medium text-blue-600">{progress.percentage}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        
        {/* Section indicators */}
        <div className="flex items-center justify-between mt-4">
          {schema.sections.map((section, index) => {
            const isActive = index === currentSectionIndex;
            const isCompleted = index < currentSectionIndex;
            const isClickable = index <= currentSectionIndex;
            
            return (
              <button
                key={section.id}
                onClick={() => isClickable && handleGoToSection(index)}
                disabled={!isClickable}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted 
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs ${
                  isActive ? 'text-blue-600 font-medium' : 'text-slate-500'
                }`}>
                  {section.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render auto-save status
  const renderAutoSaveStatus = () => {
    if (!schema.config?.autoSaveInterval) return null;
    
    const { isSaving, lastSaved, hasUnsavedChanges, error } = autoSaveState;
    
    return (
      <div className="flex items-center gap-2 text-sm">
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-slate-500">Saving...</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-600">Save failed</span>
          </>
        ) : hasUnsavedChanges ? (
          <>
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-amber-600">Unsaved changes</span>
          </>
        ) : lastSaved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-slate-500">
              Saved {formatDistanceToNow(new Date(lastSaved), { addSuffix: true })}
            </span>
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{schema.title}</h1>
        {schema.description && (
          <p className="mt-2 text-slate-600">{schema.description}</p>
        )}
      </div>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Current Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Section Header */}
        <div className="bg-gray-50 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Step {currentSectionIndex + 1} of {schema.sections.length}
              </p>
              <h2 className="text-lg font-semibold text-slate-900">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-sm text-slate-600 mt-1">{currentSection.description}</p>
              )}
            </div>
            {renderAutoSaveStatus()}
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {currentSection.fields.map((field) => {
              // Check if field has error
              const fieldError = errors.find(e => 
                e.field === field.id || field.fields?.some(f => f.id === e.field)
              );
              
              // Only show error if field has been touched
              const showError = touchedFields.has(field.id) ? fieldError : undefined;
              
              return (
                <DynamicFormField
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  error={showError}
                  formData={formData}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  onBlur={() => handleFieldBlur(field.id)}
                  disabled={disabled}
                />
              );
            })}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {schema.config?.allowSaveAndExit && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !autoSaveState.hasUnsavedChanges}
                  className="flex items-center gap-2 px-4 py-2 text-slate-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {schema.config?.saveLabel || 'Save Progress'}
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isFirstSection && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={disabled}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-white transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {schema.config?.backLabel || 'Back'}
                </button>
              )}
              
              {!isLastSection ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={disabled}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {schema.config?.nextLabel || 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || disabled}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      {schema.config?.submitLabel || 'Submit Application'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-xl shadow-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Saved successfully!</span>
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="ml-2 p-1 hover:bg-emerald-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-xl shadow-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Please fix the errors above</span>
            <button 
              onClick={() => setShowErrorToast(false)}
              className="ml-2 p-1 hover:bg-red-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
