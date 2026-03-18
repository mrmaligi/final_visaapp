'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Building2,
  Award,
  Calendar,
  Globe,
  FileText,
  MessageSquare,
  UserCheck,
  UserX,
  AlertCircle,
  Download,
  ExternalLink,
  MoreHorizontal,
  Shield,
  Star,
  CheckSquare,
  Edit3
} from 'lucide-react';

// Mock lawyer data
const mockLawyer = {
  id: '1',
  full_name: 'Dr. Emily Parker',
  email: 'emily.parker@lawfirm.com',
  phone: '+61 412 345 678',
  firm_name: 'Parker Immigration Law',
  firm_address: 'Level 12, 456 Collins Street, Melbourne VIC 3000',
  registration_number: 'MARN 1801234',
  years_experience: 12,
  bio: 'Dr. Emily Parker is a registered migration agent with over 12 years of experience in Australian immigration law. She specializes in partner visas, skilled migration, and employer-sponsored visas. Emily has helped over 2,000 clients successfully navigate the Australian visa system.',
  verification_status: 'pending' as const,
  average_rating: 0,
  total_consultations: 0,
  total_reviews: 0,
  languages: ['English', 'Mandarin'],
  website: 'www.parkerimmigration.com.au',
  submitted_at: '2024-03-18T10:30:00Z',
  avatar: null,
  specializations: ['Partner Visas', 'Skilled Migration', 'Employer Sponsorship', 'Student Visas'],
};

const documents = [
  { id: '1', name: 'MARN Registration Certificate', type: 'PDF', size: '2.4 MB', uploaded_at: '2024-03-18T10:30:00Z' },
  { id: '2', name: 'Professional Indemnity Insurance', type: 'PDF', size: '1.8 MB', uploaded_at: '2024-03-18T10:32:00Z' },
  { id: '3', name: 'Passport Copy', type: 'PDF', size: '3.2 MB', uploaded_at: '2024-03-18T10:35:00Z' },
  { id: '4', name: 'Academic Qualifications', type: 'PDF', size: '4.1 MB', uploaded_at: '2024-03-18T10:38:00Z' },
];

const verificationChecklist = [
  { id: '1', item: 'MARN Registration Valid', checked: true, notes: '' },
  { id: '2', item: 'Professional Indemnity Insurance Current', checked: true, notes: '' },
  { id: '3', item: 'Identity Documents Verified', checked: true, notes: '' },
  { id: '4', item: 'Qualifications Authenticated', checked: false, notes: 'Waiting for verification from issuing institution' },
  { id: '5', item: 'No Disciplinary Actions', checked: true, notes: 'Clean record checked on OMARA register' },
  { id: '6', item: 'Website & Contact Details Verified', checked: false, notes: '' },
];

const adminNotes = [
  { id: '1', author: 'Admin User', timestamp: '2024-03-18T14:30:00Z', note: 'Initial application review. All documents appear to be in order. MARN registration verified through official register.' },
  { id: '2', author: 'Admin User', timestamp: '2024-03-18T16:45:00Z', note: 'Attempted phone verification but no answer. Left voicemail requesting callback.' },
];

function StatusBanner({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const styles = {
    pending: 'bg-amber-50 border-amber-200 text-amber-800',
    approved: 'bg-green-50 border-green-200 text-green-800',
    rejected: 'bg-red-50 border-red-200 text-red-800',
  };

  const icons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const messages = {
    pending: 'This application is awaiting review and verification.',
    approved: 'This lawyer has been approved and is active on the platform.',
    rejected: 'This application was rejected. Reason: Insufficient documentation.',
  };

  const Icon = icons[status];

  return (
    <div className={cn('border rounded-lg p-4 mb-6', styles[status])}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5" />
        <div>
          <p className="font-medium">Application Status: {status.charAt(0).toUpperCase() + status.slice(1)}</p>
          <p className="text-sm mt-1 opacity-90">{messages[status]}</p>
        </div>
      </div>
    </div>
  );
}

export default function LawyerDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
  const [newNote, setNewNote] = useState('');

  const tabs = [
    { id: 'details', label: 'Details', icon: UserCheck },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'verification', label: 'Verification', icon: Shield },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/lawyers" className="hover:text-gray-700">Lawyers</Link>
          <span>/</span>
          <span className="text-gray-900">{mockLawyer.full_name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/lawyers"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockLawyer.full_name}</h1>
              <p className="text-gray-500">{mockLawyer.firm_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowRequestInfoModal(true)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
            >
              Request Info
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Reject
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Approve
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <StatusBanner status={mockLawyer.verification_status} />

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
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{mockLawyer.full_name}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{mockLawyer.email}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Phone</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{mockLawyer.phone}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Website</p>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={`https://${mockLawyer.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                              {mockLawyer.website}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Firm Name</p>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{mockLawyer.firm_name}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">MARN Registration</p>
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{mockLawyer.registration_number}</p>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Years of Experience</p>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <p className="font-medium">{mockLawyer.years_experience} years</p>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Languages</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {mockLawyer.languages.map((lang) => (
                              <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {mockLawyer.specializations.map((spec) => (
                          <span key={spec} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Biography</h3>
                      <p className="text-gray-600 leading-relaxed">{mockLawyer.bio}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-100 rounded-lg">
                            <FileText className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <ExternalLink className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'verification' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Checklist</h3>
                      <div className="space-y-3">
                        {verificationChecklist.map((item) => (
                          <div key={item.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className={cn(
                              'w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5',
                              item.checked ? 'bg-green-500' : 'bg-gray-300'
                            )}>
                              <CheckSquare className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className={cn('font-medium', item.checked ? 'text-gray-900' : 'text-gray-500')}>
                                {item.item}
                              </p>
                              {item.notes && (
                                <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                              )}
                            </div>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              {item.checked ? 'Undo' : 'Verify'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">Verification Progress</p>
                          <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '66%' }} />
                          </div>
                          <p className="text-sm text-blue-700 mt-2">4 of 6 items verified</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note</h3>
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this lawyer..."
                        className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={4}
                      />
                      <div className="mt-3 flex justify-end">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                          Add Note
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Notes</h3>
                      <div className="space-y-4">
                        {adminNotes.map((note) => (
                          <div key={note.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                  {note.author.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{note.author}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(note.timestamp).toLocaleString('en-AU')}
                              </span>
                            </div>
                            <p className="text-gray-600">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Decision Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Decision</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Application
                </button>
                
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Application
                </button>
                
                <button
                  onClick={() => setShowRequestInfoModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <Mail className="w-5 h-5" />
                  Request More Info
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Application Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Application Submitted</p>
                    <p className="text-xs text-gray-500">18 Mar 2024, 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Documents Uploaded</p>
                    <p className="text-xs text-gray-500">18 Mar 2024, 10:38 AM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-400">Awaiting Review</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">Approve Lawyer</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve {mockLawyer.full_name}? They will be able to start accepting consultations immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Reject Application</h3>
            </div>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this application:</p>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg mb-6 resize-none"
              rows={3}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Info Modal */}
      {showRequestInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Request Information</h3>
            </div>
            <p className="text-gray-600 mb-4">What additional information do you need from {mockLawyer.full_name}?</p>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg mb-6 resize-none"
              rows={3}
              placeholder="Describe what information is needed..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRequestInfoModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRequestInfoModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
