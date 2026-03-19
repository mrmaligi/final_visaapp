'use client';

import React, { useState, useCallback } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Upload, 
  X, 
  Check, 
  Plus, 
  Trash2,
  AlertCircle,
  Eye,
  FileText,
  FileImage,
  File,
  Loader2
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { FormField, FormError, FieldOption } from './form-schema';
import { evaluateConditional, validateField } from './form-schema';

// File size formatter
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Get file icon based on type
const getFileIcon = (type: string) => {
  if (type?.startsWith('image/')) return <FileImage className="w-5 h-5 text-purple-500" />;
  if (type?.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
  return <File className="w-5 h-5 text-blue-500" />;
};

interface DynamicFormFieldProps {
  field: FormField;
  value: unknown;
  error?: FormError;
  formData: Record<string, unknown>;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

export default function DynamicFormField({
  field,
  value,
  error,
  formData,
  onChange,
  onBlur,
  disabled = false,
}: DynamicFormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);

  // Check if field should be shown based on conditional rules
  const shouldShow = !field.conditional || evaluateConditional(field.conditional, formData);
  if (!shouldShow) return null;

  const handleChange = useCallback((newValue: unknown) => {
    onChange(newValue);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlur?.();
  }, [onBlur]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  // Render different field types
  const renderField = () => {
    switch (field.type) {
      case 'heading':
        return (
          <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">
            {field.label}
          </h3>
        );

      case 'paragraph':
        return (
          <p className="text-slate-600 mb-4">
            {field.label}
          </p>
        );

      case 'divider':
        return <hr className="my-6 border-gray-200" />;

      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            id={field.id}
            value={(value as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            maxLength={field.maxLength}
            pattern={field.pattern}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-blue-500'
            } ${disabled || field.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={(value as string) || ''}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            rows={field.rows || 4}
            maxLength={field.maxLength}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-blue-500'
            } ${disabled || field.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={field.id}
            value={(value as number) ?? ''}
            onChange={(e) => handleChange(e.target.value ? Number(e.target.value) : undefined)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={field.placeholder}
            disabled={disabled || field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-200 focus:border-blue-500'
            } ${disabled || field.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          />
        );

      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              id={field.id}
              value={(value as string) || ''}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled || field.disabled}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500'
              } ${disabled || field.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            />
          </div>
        );

      case 'select':
        return (
          <div className="relative">
            <select
              id={field.id}
              value={(value as string) || ''}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled || field.disabled}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500'
              } ${disabled || field.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            >
              <option value="">{field.placeholder || 'Select...'}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        );

      case 'multiselect':
        const selectedValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedValues.map((selectedValue) => {
                const option = field.options?.find(o => o.value === selectedValue);
                return (
                  <span 
                    key={selectedValue}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {option?.label || selectedValue}
                    <button
                      type="button"
                      onClick={() => handleChange(selectedValues.filter(v => v !== selectedValue))}
                      className="p-0.5 hover:bg-blue-200 rounded-full"
                      disabled={disabled || field.disabled}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleChange([...selectedValues, e.target.value]);
                  e.target.value = '';
                }
              }}
              disabled={disabled || field.disabled}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500'
              }`}
            >
              <option value="">{field.placeholder || 'Add an option...'}</option>
              {field.options
                ?.filter(option => !selectedValues.includes(option.value))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label 
                key={option.value}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  value === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${disabled || field.disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleChange(option.value)}
                  disabled={disabled || field.disabled || option.disabled}
                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-900">{option.label}</span>
                  {option.description && (
                    <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkboxValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label 
                key={option.value}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  checkboxValues.includes(option.value)
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${disabled || field.disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkboxValues.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleChange([...checkboxValues, option.value]);
                    } else {
                      handleChange(checkboxValues.filter(v => v !== option.value));
                    }
                  }}
                  disabled={disabled || field.disabled || option.disabled}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-slate-900">{option.label}</span>
                  {option.description && (
                    <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
                  )}
                </div>
              </label>
            ))}
          </div>
        );

      case 'switch':
        return (
          <label className="flex items-center gap-4 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleChange(e.target.checked)}
                disabled={disabled || field.disabled}
                className="sr-only peer"
              />
              <div className={`w-14 h-7 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-blue-300 ${
                value 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200'
              } ${disabled || field.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  value ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </div>
            </div>
            <span className="font-medium text-slate-900">{field.label}</span>
          </label>
        );

      case 'file':
        const singleFile = value as { name: string; size: number; type: string; url?: string } | undefined;
        return (
          <div className="space-y-3">
            {singleFile ? (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                {getFileIcon(singleFile.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{singleFile.name}</p>
                  <p className="text-sm text-slate-500">{formatFileSize(singleFile.size)}</p>
                </div>
                {singleFile.url && (
                  <a
                    href={singleFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => handleChange(undefined)}
                  disabled={disabled || field.disabled}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                disabled || field.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400">{field.accept || 'PDF, JPG, PNG'} up to {formatFileSize(field.maxFileSize || 10 * 1024 * 1024)}</p>
                </div>
                <input
                  type="file"
                  accept={field.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Simulate upload
                      setIsUploading(true);
                      setTimeout(() => {
                        handleChange({
                          name: file.name,
                          size: file.size,
                          type: file.type,
                          url: URL.createObjectURL(file),
                        });
                        setIsUploading(false);
                      }, 1000);
                    }
                  }}
                  disabled={disabled || field.disabled}
                  className="hidden"
                />
              </label>
            )}
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        );

      case 'files':
        const files = (value as Array<{ name: string; size: number; type: string; url?: string }>) || [];
        const canAddMore = !field.maxFiles || files.length < field.maxFiles;
        
        return (
          <div className="space-y-3">
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                    </div>
                    {file.url && (
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleChange(files.filter((_, i) => i !== index))}
                      disabled={disabled || field.disabled}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {canAddMore && (
              <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${
                disabled || field.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-slate-400" />
                  <span className="text-sm text-slate-600">Add file {field.maxFiles && `(${files.length}/${field.maxFiles})`}</span>
                </div>
                <input
                  type="file"
                  accept={field.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const newFile = {
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        url: URL.createObjectURL(file),
                      };
                      handleChange([...files, newFile]);
                    }
                  }}
                  disabled={disabled || field.disabled}
                  className="hidden"
                />
              </label>
            )}
          </div>
        );

      case 'address':
        const addressValue = (value as {
          street?: string;
          city?: string;
          state?: string;
          postcode?: string;
          country?: string;
        }) || {};
        
        return (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={addressValue.street || ''}
                onChange={(e) => handleChange({ ...addressValue, street: e.target.value })}
                placeholder="Enter street address"
                disabled={disabled || field.disabled}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City/Suburb</label>
                <input
                  type="text"
                  value={addressValue.city || ''}
                  onChange={(e) => handleChange({ ...addressValue, city: e.target.value })}
                  placeholder="Enter city"
                  disabled={disabled || field.disabled}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State/Province</label>
                <input
                  type="text"
                  value={addressValue.state || ''}
                  onChange={(e) => handleChange({ ...addressValue, state: e.target.value })}
                  placeholder="Enter state"
                  disabled={disabled || field.disabled}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Postcode/ZIP</label>
                <input
                  type="text"
                  value={addressValue.postcode || ''}
                  onChange={(e) => handleChange({ ...addressValue, postcode: e.target.value })}
                  placeholder="Enter postcode"
                  disabled={disabled || field.disabled}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <select
                  value={addressValue.country || ''}
                  onChange={(e) => handleChange({ ...addressValue, country: e.target.value })}
                  disabled={disabled || field.disabled}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select country...</option>
                  <option value="AU">Australia</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="NZ">New Zealand</option>
                  <option value="IN">India</option>
                  <option value="CN">China</option>
                  <option value="PH">Philippines</option>
                  <option value="SG">Singapore</option>
                  <option value="MY">Malaysia</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'country':
        return (
          <div className="relative">
            <select
              id={field.id}
              value={(value as string) || ''}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              disabled={disabled || field.disabled}
              className={`w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white ${
                error 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-200 focus:border-blue-500'
              } ${disabled || field.disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            >
              <option value="">{field.placeholder || 'Select country...'}</option>
              <option value="AU">🇦🇺 Australia</option>
              <option value="US">🇺🇸 United States</option>
              <option value="GB">🇬🇧 United Kingdom</option>
              <option value="CA">🇨🇦 Canada</option>
              <option value="NZ">🇳🇿 New Zealand</option>
              <option value="IN">🇮🇳 India</option>
              <option value="CN">🇨🇳 China</option>
              <option value="PH">🇵🇭 Philippines</option>
              <option value="SG">🇸🇬 Singapore</option>
              <option value="MY">🇲🇾 Malaysia</option>
              <option value="ZA">🇿🇦 South Africa</option>
              <option value="IE">🇮🇪 Ireland</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        );

      case 'repeatable':
        const items = (value as unknown[]) || [];
        return (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="relative p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">#{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleChange(items.filter((_, i) => i !== index))}
                    disabled={disabled || field.disabled}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="pt-4 space-y-4">
                  {field.fields?.map((nestedField) => (
                    <div key={nestedField.id}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {nestedField.label}
                        {nestedField.validation?.some(v => v.type === 'required') && <span className="text-red-500">*</span>}
                      </label>
                      <DynamicFormField
                        field={nestedField}
                        value={(item as Record<string, unknown>)?.[nestedField.id]}
                        formData={item as Record<string, unknown>}
                        onChange={(newValue) => {
                          const newItems = [...items];
                          newItems[index] = { ...newItems[index] as object, [nestedField.id]: newValue };
                          handleChange(newItems);
                        }}
                        disabled={disabled}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => handleChange([...items, {}])}
              disabled={disabled || field.disabled}
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add {field.label}
            </button>
          </div>
        );

      case 'section':
        return (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
            {field.fields?.map((nestedField) => (
              <div key={nestedField.id}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {nestedField.label}
                  {nestedField.validation?.some(v => v.type === 'required') && <span className="text-red-500">*</span>}
                </label>
                <DynamicFormField
                  field={nestedField}
                  value={(value as Record<string, unknown>)?.[nestedField.id]}
                  formData={value as Record<string, unknown> || {}}
                  onChange={(newValue) => {
                    handleChange({ ...(value as object || {}), [nestedField.id]: newValue });
                  }}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Get width classes
  const getWidthClasses = () => {
    switch (field.width) {
      case 'half':
        return 'md:col-span-1';
      case 'third':
        return 'md:col-span-1';
      case 'quarter':
        return 'md:col-span-1';
      case 'full':
      default:
        return 'md:col-span-2';
    }
  };

  // Don't wrap layout elements in label containers
  if (['heading', 'paragraph', 'divider'].includes(field.type)) {
    return <div className={getWidthClasses()}>{renderField()}</div>;
  }

  return (
    <div className={`${getWidthClasses()} ${field.className || ''}`}>
      {/* Label */}
      {field.type !== 'switch' && (
        <label 
          htmlFor={field.id} 
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {field.label}
          {field.validation?.some(v => v.type === 'required') && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Field */}
      {renderField()}

      {/* Help text */}
      {field.helpText && !error && (
        <p className="mt-1 text-sm text-slate-500">{field.helpText}</p>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-1 flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}
