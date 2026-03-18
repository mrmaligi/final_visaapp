import Link from 'next/link';
import { Metadata } from 'next';
import { Clock, CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Verification Pending | VisaHelper',
  description: 'Your lawyer application is under review. We will notify you once verification is complete.',
};

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" 
              style={{ backgroundColor: '#0052cc' }}
            >
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">VisaHelper</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DBEAFE' }}>
            <Clock className="w-10 h-10" style={{ color: '#0052cc' }} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3">Verification in Progress</h2>
          
          <p className="text-slate-600 mb-6">
            Thank you for submitting your application. Our team is reviewing your documents 
            to verify your credentials.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">Application submitted successfully</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: '#F3F4F6' }}>
              <Clock className="w-5 h-5 flex-shrink-0" style={{ color: '#0052cc' }} />
              <span className="text-sm text-slate-700">Under review (1-3 business days)</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-100">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              <span className="text-sm text-slate-500">Verification complete</span>
            </div>
          </div>

          <div className="p-4 rounded-xl mb-6 text-left" style={{ backgroundColor: '#DBEAFE' }}>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0052cc' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#0052cc' }}>
                  We&apos;ll notify you via email
                </p>
                <p className="text-sm mt-1" style={{ color: '#0052cc', opacity: 0.8 }}>
                  Once your verification is complete, you&apos;ll receive an email with instructions 
                  to access your lawyer dashboard.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0052cc] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Have questions?{' '}
          <Link href="/contact" className="font-medium hover:underline" style={{ color: '#0052cc' }}>
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
