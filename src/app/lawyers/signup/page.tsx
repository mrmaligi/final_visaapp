'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  Plane
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Basic Info', icon: User },
  { id: 2, title: 'Professional', icon: Briefcase },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Review', icon: CheckCircle },
];

export default function LawyerSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Professional
    firmName: '',
    registrationNumber: '',
    yearsExperience: '',
    specializations: [] as string[],
    languages: [] as string[],
    bio: '',
    
    // Documents
    idDocument: null as File | null,
    certificate: null as File | null,
    insurance: null as File | null,
  });

  const specializationOptions = [
    'Skilled Migration',
    'Family Visas',
    'Student Visas',
    'Business Visas',
    'Visitor Visas',
    'Work Visas',
    'Appeals',
    'Citizenship',
  ];

  const languageOptions = [
    'English',
    'Mandarin',
    'Hindi',
    'Arabic',
    'Vietnamese',
    'Italian',
    'Greek',
    'Korean',
    'Punjabi',
    'Spanish',
  ];

  const updateFormData = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push('/lawyers/pending-verification');
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.fullName &&
          formData.email &&
          formData.phone &&
          formData.password &&
          formData.password.length >= 8 &&
          formData.password === formData.confirmPassword
        );
      case 2:
        return (
          formData.registrationNumber &&
          formData.yearsExperience &&
          formData.specializations.length > 0 &&
          formData.languages.length > 0
        );
      case 3:
        return formData.idDocument && formData.certificate;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0052cc' }}>
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">VisaHelper</span>
          </Link>
          <div className="text-sm text-slate-600">
            Already registered?{' '}
            <Link href="/auth/signin" className="font-semibold" style={{ color: '#0052cc' }}>Sign In</Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'text-white'
                          : isCompleted
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      style={{ backgroundColor: isActive ? '#0052cc' : undefined }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isActive ? 'text-slate-900' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-24 h-1 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h2>
                <p className="text-slate-600">Let's start with your contact details.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    placeholder="jane@lawfirm.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    placeholder="+61 2 9000 0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    placeholder="Min 8 characters"
                    minLength={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Professional Details</h2>
                <p className="text-slate-600">Tell us about your professional background.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Firm Name</label>
                  <input
                    type="text"
                    value={formData.firmName}
                    onChange={(e) => updateFormData('firmName', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                    placeholder="Smith & Associates"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">MARA Registration Number *</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                      placeholder="MARA123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience *</label>
                    <input
                      type="number"
                      value={formData.yearsExperience}
                      onChange={(e) => updateFormData('yearsExperience', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none"
                      placeholder="10"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Specializations * (Select at least one)</label>
                  <div className="flex flex-wrap gap-2">
                    {specializationOptions.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.specializations.includes(spec)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: formData.specializations.includes(spec) ? '#0052cc' : undefined,
                        }}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Languages Spoken * (Select at least one)</label>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          formData.languages.includes(lang)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: formData.languages.includes(lang) ? '#0052cc' : undefined,
                        }}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Professional Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 outline-none resize-none"
                    placeholder="Tell potential clients about your experience and expertise..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Document Upload</h2>
                <p className="text-slate-600">Please upload your verification documents. These are required for our verification process.</p>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0052cc] transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold text-slate-900 mb-1">ID Document *</h3>
                  <p className="text-sm text-slate-600 mb-4">Upload your passport or driver's license (PDF, JPG, PNG)</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updateFormData('idDocument', e.target.files?.[0] || null)}
                    className="hidden"
                    id="id-doc"
                  />
                  <label
                    htmlFor="id-doc"
                    className="inline-block px-6 py-2 rounded-lg border border-gray-200 text-slate-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {formData.idDocument ? formData.idDocument.name : 'Choose File'}
                  </label>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0052cc] transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold text-slate-900 mb-1">Practicing Certificate *</h3>
                  <p className="text-sm text-slate-600 mb-4">Upload your current MARA certificate or legal practicing certificate</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updateFormData('certificate', e.target.files?.[0] || null)}
                    className="hidden"
                    id="cert-doc"
                  />
                  <label
                    htmlFor="cert-doc"
                    className="inline-block px-6 py-2 rounded-lg border border-gray-200 text-slate-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {formData.certificate ? formData.certificate.name : 'Choose File'}
                  </label>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0052cc] transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold text-slate-900 mb-1">Professional Indemnity Insurance</h3>
                  <p className="text-sm text-slate-600 mb-4">Upload your insurance certificate (optional but recommended)</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => updateFormData('insurance', e.target.files?.[0] || null)}
                    className="hidden"
                    id="insurance-doc"
                  />
                  <label
                    htmlFor="insurance-doc"
                    className="inline-block px-6 py-2 rounded-lg border border-gray-200 text-slate-700 font-medium cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    {formData.insurance ? formData.insurance.name : 'Choose File'}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Application</h2>
                <p className="text-slate-600">Please review your information before submitting.</p>
              </div>

              <div className="space-y-4">
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Name:</span>{' '}
                      <span className="font-medium">{formData.fullName || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>{' '}
                      <span className="font-medium">{formData.email || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Phone:</span>{' '}
                      <span className="font-medium">{formData.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Professional Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Firm:</span>{' '}
                      <span className="font-medium">{formData.firmName || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Registration:</span>{' '}
                      <span className="font-medium">{formData.registrationNumber || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Experience:</span>{' '}
                      <span className="font-medium">{formData.yearsExperience || '0'} years</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500">Specializations:</span>{' '}
                      <span className="font-medium">{formData.specializations.join(', ') || 'None selected'}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-slate-500">Languages:</span>{' '}
                      <span className="font-medium">{formData.languages.join(', ') || 'None selected'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Documents
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${formData.idDocument ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>ID Document</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${formData.certificate ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>Practicing Certificate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${formData.insurance ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>Insurance (Optional)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: '#DBEAFE' }}>
                  <p className="text-sm" style={{ color: '#0052cc' }}>
                    By submitting this application, you confirm that all information provided is accurate 
                    and complete. You agree to our{' '}
                    <Link href="/legal/terms" className="underline">Terms of Service</Link> and{' '}
                    <Link href="/legal/privacy" className="underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 text-slate-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#0052cc' }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all disabled:opacity-70"
                style={{ backgroundColor: '#0052cc' }}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
