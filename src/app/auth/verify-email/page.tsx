'use client';

import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900">VisaHelper</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Check Your Email
          </h1>

          <p className="text-slate-600 mb-6">
            We&apos;ve sent a verification link to your email address. 
            Please check your inbox and click the link to verify your account.
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Didn&apos;t receive the email?</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
                <li>Check your spam folder</li>
                <li>Wait a few minutes</li>
                <li>Make sure you entered the correct email</li>
              </ul>
            </div>

            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#0052cc] py-3.5 text-white font-bold shadow-lg shadow-[#0052cc]/25 hover:bg-[#0052cc]/90 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-slate-500">
          Need help?{' '}
          <Link href="/contact" className="text-[#0052cc] hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
