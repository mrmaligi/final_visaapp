'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save,
  CheckCircle,
  Upload,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Globe,
  AlertCircle,
  X,
  Eye
} from 'lucide-react';

type Section = 'personal' | 'employment' | 'education' | 'documents' | 'review';

interface FormData {
  personal: {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
  };
  employment: {
    currentEmployer: string;
    jobTitle: string;
    employmentType: string;
    startDate: string;
    annualIncome: string;
  };
  education: {
    highestQualification: string;
    institution: string;
    yearCompleted: string;
    fieldOfStudy: string;
  };
}

export default function VisaPremiumPage() {
  const { id } = useParams();
  const [currentSection, setCurrentSection] = useState<Section>('personal');
  const [savedSections, setSavedSections] = useState<Section[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    personal: {
      title: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: ''
    },
    employment: {
      currentEmployer: '',
      jobTitle: '',
      employmentType: '',
      startDate: '',
      annualIncome: ''
    },
    education: {
      highestQualification: '',
      institution: '',
      yearCompleted: '',
      fieldOfStudy: ''
    }
  });

  const sections: { id: Section; label: string; icon: typeof User }[] = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'review', label: 'Review & Submit', icon: CheckCircle }
  ];

  const getSectionProgress = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    return ((currentIndex + 1) / sections.length) * 100;
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavedSections([...savedSections, currentSection]);
    setIsSaving(false);
  };

  const handleNext = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const updateFormData = (section: keyof FormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/user/visas"
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to My Visas
          </Link>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Skilled Independent (189) Application</h1>
              <p className="text-slate-600 mt-1">Complete your visa application with our guided wizard</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-700">Application Progress</span>
            <span className="text-sm font-medium text-blue-600">{Math.round(getSectionProgress())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getSectionProgress()}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between mt-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = currentSection === section.id;
              const isCompleted = savedSections.includes(section.id);
              const isPast = sections.findIndex(s => s.id === currentSection) > index;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(section.id)}
                  className={`flex flex-col items-center gap-2 transition-colors ${
                    isActive ? 'text-blue-600' : isCompleted || isPast ? 'text-green-600' : 'text-slate-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-blue-100' : isCompleted || isPast ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {isCompleted || isPast ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden md:block">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Personal Details Section */}
              {currentSection === 'personal' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Personal Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                      <select
                        value={formData.personal.title}
                        onChange={(e) => updateFormData('personal', 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        value={formData.personal.firstName}
                        onChange={(e) => updateFormData('personal', 'firstName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        value={formData.personal.lastName}
                        onChange={(e) => updateFormData('personal', 'lastName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.personal.dateOfBirth}
                        onChange={(e) => updateFormData('personal', 'dateOfBirth', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Nationality *</label>
                      <select
                        value={formData.personal.nationality}
                        onChange={(e) => updateFormData('personal', 'nationality', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select country...</option>
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="New Zealand">New Zealand</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Passport Number *</label>
                      <input
                        type="text"
                        value={formData.personal.passportNumber}
                        onChange={(e) => updateFormData('personal', 'passportNumber', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Passport Expiry *</label>
                      <input
                        type="date"
                        value={formData.personal.passportExpiry}
                        onChange={(e) => updateFormData('personal', 'passportExpiry', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Employment Section */}
              {currentSection === 'employment' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Employment Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Employer *</label>
                      <input
                        type="text"
                        value={formData.employment.currentEmployer}
                        onChange={(e) => updateFormData('employment', 'currentEmployer', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={formData.employment.jobTitle}
                        onChange={(e) => updateFormData('employment', 'jobTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type *</label>
                      <select
                        value={formData.employment.employmentType}
                        onChange={(e) => updateFormData('employment', 'employmentType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={formData.employment.startDate}
                        onChange={(e) => updateFormData('employment', 'startDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Annual Income (AUD) *</label>
                      <input
                        type="number"
                        value={formData.employment.annualIncome}
                        onChange={(e) => updateFormData('employment', 'annualIncome', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="80000"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {currentSection === 'education' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Education Details</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Highest Qualification *</label>
                      <select
                        value={formData.education.highestQualification}
                        onChange={(e) => updateFormData('education', 'highestQualification', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        <option value="PhD">PhD</option>
                        <option value="Masters">Masters Degree</option>
                        <option value="Bachelor">Bachelor Degree</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Certificate">Certificate</option>
                        <option value="High School">High School</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Institution Name *</label>
                      <input
                        type="text"
                        value={formData.education.institution}
                        onChange={(e) => updateFormData('education', 'institution', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Year Completed *</label>
                      <input
                        type="number"
                        value={formData.education.yearCompleted}
                        onChange={(e) => updateFormData('education', 'yearCompleted', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Field of Study *</label>
                      <input
                        type="text"
                        value={formData.education.fieldOfStudy}
                        onChange={(e) => updateFormData('education', 'fieldOfStudy', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {currentSection === 'documents' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Required Documents</h2>
                  
                  <p className="text-slate-600">Please upload the following documents to support your application:</p>

                  <div className="space-y-4">
                    {[
                      { name: 'Passport Bio Page', required: true, uploaded: false },
                      { name: 'Birth Certificate', required: true, uploaded: false },
                      { name: 'Degree Certificate', required: true, uploaded: true },
                      { name: 'Employment Reference Letter', required: true, uploaded: false },
                      { name: 'Bank Statements (3 months)', required: true, uploaded: false },
                      { name: 'English Test Results', required: false, uploaded: false }
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            doc.uploaded ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {doc.uploaded ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <Upload className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{doc.name}</p>
                            {doc.required && <span className="text-xs text-red-600">Required</span>}
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          {doc.uploaded ? 'Replace' : 'Upload'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Section */}
              {currentSection === 'review' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Review Your Application</h2>
                  
                  <p className="text-slate-600">Please review all the information before submitting your application.</p>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">Personal Details</h3>
                        <button 
                          onClick={() => setCurrentSection('personal')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Name: </span>
                          <span className="text-slate-900">{formData.personal.firstName} {formData.personal.lastName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Nationality: </span>
                          <span className="text-slate-900">{formData.personal.nationality || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">Employment</h3>
                        <button 
                          onClick={() => setCurrentSection('employment')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-500">Employer: </span>
                          <span className="text-slate-900">{formData.employment.currentEmployer || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Position: </span>
                          <span className="text-slate-900">{formData.employment.jobTitle || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-slate-900">Documents</h3>
                        <button 
                          onClick={() => setCurrentSection('documents')}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-600">5 of 6 required documents uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="declaration" className="mt-1" />
                      <label htmlFor="declaration" className="text-sm text-slate-700">
                        I declare that all the information provided is true and correct to the best of my knowledge. 
                        I understand that providing false or misleading information may result in the refusal of my visa application.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentSection === 'personal'}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                {currentSection === 'review' ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Submit Application
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Save & Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="font-semibold text-slate-900 mb-4">Application Checklist</h3>
              
              <div className="space-y-3">
                {sections.map((section) => {
                  const isCompleted = savedSections.includes(section.id);
                  const isCurrent = currentSection === section.id;
                  
                  return (
                    <div 
                      key={section.id}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isCurrent ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-3 h-3 text-white" />
                        ) : (
                          <span className={`text-xs font-medium ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                            {sections.findIndex(s => s.id === section.id) + 1}
                          </span>
                        )}
                      </div>
                      <span className={`text-sm ${
                        isCompleted ? 'text-slate-900 line-through' : isCurrent ? 'text-blue-900 font-medium' : 'text-slate-600'
                      }`}>
                        {section.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    Your progress is automatically saved. You can return anytime to complete your application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Ready to Submit?</h2>
              <p className="text-slate-600 mt-2">Please confirm that all information is correct before submitting.</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600">Visa Type</span>
                <span className="font-medium text-slate-900">Skilled Independent (189)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Application Fee</span>
                <span className="font-medium text-slate-900">Included in Premium</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Review Again
              </button>
              <Link
                href="/user/visas"
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Submit Application
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
