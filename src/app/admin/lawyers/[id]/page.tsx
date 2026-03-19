'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getLawyerById,
  updateLawyerStatus,
  type LawyerApplication
} from '@/lib/actions/admin-actions';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Star,
  FileText,
  ExternalLink,
  Clock,
  Award,
  Languages,
  Download
} from 'lucide-react';

export default function LawyerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  
  const [lawyer, setLawyer] = useState<LawyerApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadLawyer();
    }
  }, [id]);

  const loadLawyer = async () => {
    try {
      setLoading(true);
      const result = await getLawyerById(id as string);
      
      if (result.error) {
        addToast(result.error, 'error');
        router.push('/admin/lawyers');
      } else {
        setLawyer(result.data);
      }
    } catch (error) {
      addToast('Failed to load lawyer details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!lawyer) return;
    
    confirm({
      title: 'Approve Lawyer Application',
      message: `Are you sure you want to approve ${lawyer.full_name}'s application? They will be able to accept consultations.`,
      confirmText: 'Approve',
      type: 'success',
      onConfirm: async () => {
        setProcessing(true);
        const result = await updateLawyerStatus(lawyer.id, 'approved');
        setProcessing(false);
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Lawyer approved successfully', 'success');
          loadLawyer();
        }
      }
    });
  };

  const handleReject = async () => {
    if (!lawyer) return;
    
    confirm({
      title: 'Reject Lawyer Application',
      message: `Are you sure you want to reject ${lawyer.full_name}'s application? This action cannot be undone.`,
      confirmText: 'Reject',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(true);
        const result = await updateLawyerStatus(lawyer.id, 'rejected');
        setProcessing(false);
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('Lawyer application rejected', 'success');
          router.push('/admin/lawyers');
        }
      }
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!lawyer) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 text-center">
          <p className="text-gray-500">Lawyer not found</p>
          <Link href="/admin/lawyers" className="text-blue-600 hover:underline">
            Back to Lawyers
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmDialogComponent />
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/admin/lawyers"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Lawyers
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {lawyer.profile_photo_url ? (
                  <img
                    src={lawyer.profile_photo_url}
                    alt={lawyer.full_name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {lawyer.full_name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{lawyer.full_name}</h1>
                    <p className="text-gray-500">{lawyer.firm_name || 'Independent Practitioner'}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {lawyer.verification_status === 'pending' && (
                      <>
                        <button
                          onClick={handleApprove}
                          disabled={processing}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={processing}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {lawyer.verification_status === 'approved' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        ✓ Approved
                      </span>
                    )}
                    
                    {lawyer.verification_status === 'rejected' && (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        ✗ Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <p className="text-xl font-bold">{lawyer.average_rating || 0}/5</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">Reviews</span>
                    </div>
                    <p className="text-xl font-bold">{lawyer.total_reviews || 0}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Consultations</span>
                    </div>
                    <p className="text-xl font-bold">{lawyer.total_consultations || 0}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Experience</span>
                    </div>
                    <p className="text-xl font-bold">{lawyer.years_experience || 0} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {lawyer.bio || 'No bio provided.'}
              </p>
            </div>

            {/* Verification Documents */}
            {lawyer.verification_documents && lawyer.verification_documents.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Verification Documents</h2>
                
                <div className="space-y-3">
                  {lawyer.verification_documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{doc.document_type}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-AU')}
                          </p>
                        </div>
                      </div>
                      
                      <a
                        href={doc.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${lawyer.email}`} className="text-blue-600 hover:underline">
                      {lawyer.email}
                    </a>
                  </div>
                </div>
                
                {lawyer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href={`tel:${lawyer.phone}`} className="text-blue-600 hover:underline">
                        {lawyer.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {lawyer.firm_name && (
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Firm</p>
                      <p className="text-gray-900">{lawyer.firm_name}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Registration</p>
                    <p className="text-gray-900">{lawyer.registration_number}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Languages</h2>
              
              <div className="flex flex-wrap gap-2">
                {(lawyer.languages || []).map((lang) => (
                  <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Application Info</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Submitted</span>
                  <span>{new Date(lawyer.created_at).toLocaleDateString('en-AU')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={cn(
                    'font-medium',
                    lawyer.verification_status === 'approved' && 'text-green-600',
                    lawyer.verification_status === 'rejected' && 'text-red-600',
                    lawyer.verification_status === 'pending' && 'text-amber-600'
                  )}>
                    {lawyer.verification_status.charAt(0).toUpperCase() + lawyer.verification_status.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Accepting Clients</span>
                  <span>{lawyer.accepts_new_clients ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
