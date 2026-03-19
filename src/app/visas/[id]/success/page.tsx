'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  FileText, 
  Download, 
  BookOpen,
  Home,
  ChevronRight,
  Clock,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

export default function VisaPremiumSuccessPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate processing
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast.success('Premium access unlocked successfully!');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Activating your premium access...</p>
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
            <h1 className="text-2xl font-bold text-white mb-2">Premium Access Unlocked!</h1>
            <p className="text-green-100">You now have lifetime access to premium content.</p>
          </div>

          <div className="p-8">
            {/* What You Get */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Premium Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: FileText, label: 'Complete Document Checklist', desc: 'Step-by-step requirements' },
                  { icon: BookOpen, label: 'Full Application Guide', desc: 'Detailed walkthrough' },
                  { icon: Download, label: 'Document Templates', desc: 'Ready-to-use forms' },
                  { icon: Shield, label: 'Expert Tips', desc: 'Avoid common mistakes' },
                  { icon: Clock, label: 'Processing Tracker', desc: 'Real-time updates' },
                  { icon: ChevronRight, label: 'Priority Support', desc: 'Fast email responses' },
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{benefit.label}</p>
                      <p className="text-sm text-slate-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={`/visas/${id}/premium`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Access Premium Content
              </Link>

              <Link
                href={`/visas/${id}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-slate-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Back to Visa Details
              </Link>

              <Link
                href="/user/dashboard"
                className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </Link>
            </div>

            {/* Receipt */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-slate-600 text-center">
                A receipt has been sent to your email.{' '}
                <Link href="/user/payments" className="text-blue-600 hover:underline">
                  View payment history
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
