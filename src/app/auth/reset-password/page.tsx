'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, Plane } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!password) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
        {/* Left Side */}
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
            <h1 className="text-5xl font-black leading-tight">Success!</h1>
            <p className="text-lg text-white/80 leading-relaxed">Your password has been reset successfully.</p>
          </div>
        </div>

        {/* Right Side: Success Message */}
        <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:w-2/5 bg-white">
          <div className="w-full max-w-[440px] flex flex-col gap-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-extrabold text-slate-900">Password Reset!</h2>
              <p className="text-slate-500">Your password has been successfully reset. You can now sign in with your new password.</p>
            </div>

            <Link
              href="/auth/signin"
              className="w-full py-3.5 text-center rounded-xl bg-[#0052cc] text-white font-bold shadow-lg shadow-[#0052cc]/25 hover:bg-[#0052cc]/90 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!token) {
    return (
      <div className="flex min-h-screen flex-col md:flex-row">
        <div className="relative hidden w-full md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-700 items-center justify-center p-12">
          <div className="relative z-10 text-white">
            <h1 className="text-5xl font-black">Invalid Link</h1>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:w-2/5 bg-white">
          <div className="w-full max-w-[440px] text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Invalid or Expired Link</h2>
            <p className="text-slate-600 mb-6">This password reset link is invalid or has expired.</p>
            <Link
              href="/auth/forgot-password"
              className="inline-block px-6 py-3 bg-[#0052cc] text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              Request New Link
            </Link>
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
          <h1 className="text-5xl font-black leading-tight">Create New Password</h1>
          <p className="text-lg text-white/80 leading-relaxed">Choose a strong password to keep your account secure.</p>
        </div>
      </div>

      {/* Right Side: Reset Password Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:w-2/5 bg-white">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Reset Password</h2>
            <p className="text-slate-500">Enter your new password below.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all outline-none"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">Must be at least 8 characters</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0052cc] py-3.5 text-white font-bold text-lg shadow-lg shadow-[#0052cc]/25 hover:bg-[#0052cc]/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052cc]"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
