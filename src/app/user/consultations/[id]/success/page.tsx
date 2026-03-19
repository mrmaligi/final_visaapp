'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  ChevronRight,
  Download,
  Home,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function ConsultationSuccessPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [consultation, setConsultation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify the payment was successful
    if (sessionId) {
      verifyPayment();
    } else {
      // Just load consultation details
      fetchConsultation();
    }
  }, [sessionId, id]);

  const verifyPayment = async () => {
    // In a real implementation, you might want to verify the session server-side
    fetchConsultation();
  };

  const fetchConsultation = async () => {
    try {
      // This would fetch the consultation details from your API
      // For now, we'll simulate a success state
      setIsLoading(false);
      toast.success('Your consultation has been booked successfully!');
    } catch (error) {
      console.error('Error fetching consultation:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-500 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-green-100">Your consultation has been successfully booked.</p>
          </div>

          <div className="p-8">
            {/* What Happens Next */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Confirmation Email</p>
                    <p className="text-sm text-slate-600">
                      You will receive a confirmation email with all the details shortly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Reminder</p>
                    <p className="text-sm text-slate-600">
                      You will receive a reminder 24 hours before your consultation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Meeting Link</p>
                    <p className="text-sm text-slate-600">
                      The video call link will be sent to you 1 hour before your consultation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={`/user/consultations/${id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                View Consultation Details
              </Link>

              <Link
                href="/user/consultations"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-slate-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                View All Consultations
              </Link>

              <Link
                href="/user/dashboard"
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </Link>
            </div>

            {/* Help */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-slate-600 text-center">
                Need to reschedule?{' '}
                <Link href={`/user/consultations/${id}`} className="text-blue-600 hover:underline">
                  Manage your booking
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
