'use client';

import React from 'react';
import Link from 'next/link';
import FormInput from '../forms/FormInput';
import PasswordInput from './PasswordInput';
import GoogleButton from './GoogleButton';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
  onGoogleSignIn?: () => void;
  loading?: boolean;
  error?: string;
}

export default function AuthForm({
  mode,
  onSubmit,
  onGoogleSignIn,
  loading = false,
  error,
}: AuthFormProps): React.ReactElement {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, name: mode === 'signup' ? name : undefined });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-slate-500 mt-2">
            {mode === 'signin'
              ? 'Sign in to access your visa applications'
              : 'Start your Australian visa journey today'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {onGoogleSignIn && (
          <React.Fragment>
            <GoogleButton onClick={onGoogleSignIn} loading={loading} />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>
          </React.Fragment>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <FormInput
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          )}

          <FormInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          {mode === 'signup' && (
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'signup' && !agreeTerms)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'signin' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {mode === 'signin' ? (
              <React.Fragment>
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-blue-600 font-medium hover:underline">
                  Sign up
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-blue-600 font-medium hover:underline">
                  Sign in
                </Link>
              </React.Fragment>
            )}
          </p>

          {mode === 'signin' && (
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              Forgot your password?
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
