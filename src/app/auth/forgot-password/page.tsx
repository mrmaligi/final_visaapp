'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle, Plane } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success state
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Left Side: Visual Illustration */}
        <div className="relative hidden w-full md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-700 items-center justify-center p-12">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="relative z-10 flex flex-col gap-6 max-w-lg text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">VisaFlow</h2>
            </div>
            <h1 className="text-5xl font-black leading-tight">Check Your Email</h1>
            <p className="text-lg text-white/80 leading-relaxed">
              We've sent you instructions to reset your password.
            </p>
          </div>
        </div>

        {/* Right Side: Success Message */}
        <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:w-2/5 bg-white">
          <div className="w-full max-w-[440px] flex flex-col gap-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold text-slate-900">Email Sent!</h2>
              <p className="text-slate-500">
                We've sent password reset instructions to{' '}
                <span className="font-medium text-slate-900">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full py-3.5 text-[#0052cc] font-semibold border-2 border-[#0052cc] rounded-xl hover:bg-[#0052cc]/5 transition-all"
              >
                Try Again
              </button>

              <Link
                href="/auth/signin"
                className="flex items-center justify-center gap-2 text-slate-600 hover:text-[#0052cc] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side: Visual Illustration */}
      <div className="relative hidden w-full md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-700 items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 flex flex-col gap-6 max-w-lg text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">VisaFlow</h2>
          </div>
          <h1 className="text-5xl font-black leading-tight">Reset Your Password</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Don't worry, we'll help you get back into your account.
          </p>
        </div>
      </div>

      {/* Right Side: Forgot Password Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:w-2/5 bg-white">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          {/* Logo for Mobile */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <Plane className="w-8 h-8 text-[#ec5b13]" />
            <span className="text-2xl font-bold text-slate-900">VisaFlow</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Forgot password?</h2>
            <p className="text-slate-500">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0052cc] py-3.5 text-white font-bold text-lg shadow-lg shadow-[#0052cc]/25 hover:bg-[#0052cc]/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <Link
            href="/auth/signin"
            className="flex items-center justify-center gap-2 text-slate-600 hover:text-[#0052cc] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          {/* Footer Links */}
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
            <Link href="/help" className="hover:text-slate-600">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
