"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Plane, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      toast.error("Full name is required");
      setLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      toast.error("Email is required");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      toast.error("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError("You must agree to the Terms and Privacy Policy");
      toast.error("You must agree to the Terms and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, {
        full_name: fullName,
      });
      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        toast.success("Account created! Please check your email to verify.");
        router.push("/auth/verify-email");
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error.message);
        toast.error(error.message);
        setLoading(false);
      }
      // Redirect happens via OAuth callback
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Side: Visual Illustration */}
      <div className="relative hidden w-full md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-blue-500 to-indigo-700 items-center justify-center p-12">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 flex flex-col gap-6 max-w-lg text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">VisaHelper</h2>
          </div>
          <h1 className="text-5xl font-black leading-tight">
            Start Your Journey Today.
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Create your free account and join thousands of travelers who have simplified their Australian visa applications.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="flex -space-x-3">
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-amber-400 to-orange-500" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-cyan-500" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-green-500" />
            </div>
            <div className="text-sm font-medium self-center text-white/90">
              Join 50k+ travelers
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="flex w-full flex-col items-center justify-center p-6 md:w-1/2 lg:w-2/5 bg-white">
        <div className="w-full max-w-[440px] flex flex-col gap-6">
          {/* Logo for Mobile */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <Plane className="w-8 h-8 text-[#0052cc]" />
            <span className="text-2xl font-bold text-slate-900">VisaHelper</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-extrabold text-slate-900">Create your account</h2>
            <p className="text-slate-500">
              Get started with your free VisaHelper account.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
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

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 py-3 text-slate-900 placeholder:text-slate-400 focus:border-[#0052cc] focus:ring-2 focus:ring-[#0052cc]/20 transition-all outline-none"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Must be at least 8 characters
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
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

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#0052cc] focus:ring-[#0052cc]/20 mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to the{' '}
                <Link href="/terms" className="text-[#0052cc] hover:underline font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#0052cc] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0052cc] py-3.5 text-white font-bold text-lg shadow-lg shadow-[#0052cc]/25 hover:bg-[#0052cc]/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500">or sign up with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-70"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </button>

          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="font-bold text-[#0052cc] hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Footer Links */}
          <div className="mt-6 flex justify-center gap-6 text-xs text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
            <Link href="/help" className="hover:text-slate-600">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
