'use client';

import { useState } from 'react';
import { Calendar, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface TrackerSubmissionFormProps {
  visaOptions: { id: string; subclass: string; name: string }[];
  onSubmit: (data: TrackerSubmissionData) => void;
  onClose: () => void;
}

export interface TrackerSubmissionData {
  visaId: string;
  lodgementDate: string;
  decisionDate?: string;
  outcome: 'pending' | 'approved' | 'refused' | 'withdrawn';
  countryOfOrigin: string;
  applicationType: 'onshore' | 'offshore';
  hasDependents: boolean;
  complexityFactors: string[];
  additionalNotes: string;
}

const complexityOptions = [
  { id: 'health', label: 'Health concerns required additional checks' },
  { id: 'character', label: 'Character check delays' },
  { id: 'documents', label: 'Additional documents requested' },
  { id: 'interview', label: 'Attended interview' },
  { id: 'medical', label: 'Medical examination delays' },
  { id: 'sponsor', label: 'Sponsor issues' },
  { id: 'none', label: 'No complications - straightforward case' },
];

export default function TrackerSubmissionForm({ visaOptions, onSubmit, onClose }: TrackerSubmissionFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TrackerSubmissionData>({
    visaId: '',
    lodgementDate: '',
    outcome: 'pending',
    countryOfOrigin: '',
    applicationType: 'offshore',
    hasDependents: false,
    complexityFactors: [],
    additionalNotes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.visaId) newErrors.visaId = 'Please select a visa type';
      if (!formData.lodgementDate) newErrors.lodgementDate = 'Please enter lodgement date';
    }
    
    if (currentStep === 2) {
      if (!formData.countryOfOrigin) newErrors.countryOfOrigin = 'Please enter your country';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: keyof TrackerSubmissionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleComplexityFactor = (factorId: string) => {
    setFormData(prev => {
      const current = prev.complexityFactors;
      if (current.includes(factorId)) {
        return { ...prev, complexityFactors: current.filter(f => f !== factorId) };
      } else {
        return { ...prev, complexityFactors: [...current, factorId] };
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Contribute Your Data</h2>
            <p className="text-sm text-slate-500 mt-1">Help the community by sharing your visa processing experience</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 px-6 py-4 bg-gray-50">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                s === step 
                  ? 'bg-[#0052cc] text-white' 
                  : s < step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-slate-600'
              }`}>
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm hidden sm:block ${
                s === step ? 'text-slate-900 font-medium' : 'text-slate-500'
              }`}>
                {s === 1 ? 'Visa Details' 
                  : s === 2 ? 'Application Info' 
                  : 'Timeline & Outcome'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visa Type *
                </label>
                <select
                  value={formData.visaId}
                  onChange={(e) => updateFormData('visaId', e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    errors.visaId ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-[#0052cc]'
                  } focus:ring-2 focus:ring-[#0052cc]/20 outline-none`}
                >
                  <option value="">Select your visa subclass</option>
                  {visaOptions.map((visa) => (
                    <option key={visa.id} value={visa.id}>
                      {visa.subclass} - {visa.name}
                    </option>
                  ))}
                </select>
                {errors.visaId && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />{errors.visaId}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lodgement Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.lodgementDate}
                      onChange={(e) => updateFormData('lodgementDate', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                        errors.lodgementDate ? 'border-red-300' : 'border-gray-200'
                      } focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none`}
                    />
                  </div>
                  {errors.lodgementDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />{errors.lodgementDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Decision Date (if known)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.decisionDate || ''}
                      onChange={(e) => updateFormData('decisionDate', e.target.value || undefined)}
                      max={new Date().toISOString().split('T')[0]}
                      min={formData.lodgementDate}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Current Status *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'pending', label: 'Still Waiting', color: 'amber' },
                    { value: 'approved', label: 'Approved', color: 'green' },
                    { value: 'refused', label: 'Refused', color: 'red' },
                    { value: 'withdrawn', label: 'Withdrawn', color: 'gray' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateFormData('outcome', option.value as any)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.outcome === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country of Origin *
                  </label>
                  <input
                    type="text"
                    value={formData.countryOfOrigin}
                    onChange={(e) => updateFormData('countryOfOrigin', e.target.value)}
                    placeholder="e.g., India, United Kingdom"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.countryOfOrigin ? 'border-red-300' : 'border-gray-200'
                    } focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none`}
                  />
                  {errors.countryOfOrigin && (
                    <p className="mt-1 text-sm text-red-600">{errors.countryOfOrigin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Application Type *
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: 'offshore', label: 'Offshore' },
                      { value: 'onshore', label: 'Onshore' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateFormData('applicationType', option.value)}
                        className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.applicationType === option.value
                            ? 'border-[#0052cc] bg-blue-50 text-[#0052cc]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Did you include dependents?
                </label>
                <div className="flex gap-3">
                  {[
                    { value: false, label: 'Just Me' },
                    { value: true, label: 'With Dependents' },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateFormData('hasDependents', option.value)}
                      className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.hasDependents === option.value
                          ? 'border-[#0052cc] bg-blue-50 text-[#0052cc]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Any complications with your application?
                </label>
                <div className="space-y-2">
                  {complexityOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.complexityFactors.includes(option.id)
                          ? 'border-[#0052cc] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.complexityFactors.includes(option.id)}
                        onChange={() => toggleComplexityFactor(option.id)}
                        className="w-4 h-4 text-[#0052cc] rounded focus:ring-[#0052cc]"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                  placeholder="Any other details that might help others understand your timeline..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none resize-none"
                />
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Privacy Note:</strong> Your submission will be anonymized before being added to our statistics. 
                  We never share personal identifiers.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-slate-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {step > 1 ? 'Back' : 'Cancel'}
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0052cc' }}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg text-white font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#0052cc' }}
              >
                Submit Data
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
