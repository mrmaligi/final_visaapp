'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  CheckCircle,
  Shield,
  Loader2,
  CreditCard,
  FileText,
  Clock,
  Star,
  Lock
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

export default function VisaCheckoutPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock visa data - in production this would come from API
  const visa = {
    id: id as string,
    name: 'Skilled Independent',
    subclass: '189',
    description: 'For skilled workers who are not sponsored by an employer or family member',
    price: 49.00,
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to purchase');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visaId: id,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/visas/${id}`}
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Visa Details
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>

              <div className="border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{visa.name} - Premium Access</h3>
                    <p className="text-sm text-slate-600">Subclass {visa.subclass}</p>
                    <p className="text-sm text-slate-500 mt-2">{visa.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-slate-900">What&apos;s Included:</h3>
                <ul className="space-y-3">
                  {[
                    'Complete step-by-step application guide',
                    'Document checklist & templates',
                    'Application form assistance',
                    'Expert tips & common mistakes',
                    'Priority email support',
                    'Lifetime access to updates',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">30-Day Money-Back Guarantee</span>
                </div>
                <p className="text-sm text-blue-700">
                  Not satisfied? Contact us within 30 days for a full refund, no questions asked.
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Secure Payment</p>
                  <p className="text-xs text-slate-500">256-bit SSL</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">4.9 Rating</p>
                  <p className="text-xs text-slate-500">2,000+ Reviews</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">Instant Access</p>
                  <p className="text-xs text-slate-500">After Purchase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Payment</h2>

              {!user ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 mb-4">Please sign in to complete your purchase</p>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Sign In to Continue
                  </Link>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-600">Premium Access</span>
                      <span className="font-semibold text-slate-900">${visa.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-600">GST (10%)</span>
                      <span className="font-semibold text-slate-900">${(visa.price * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-slate-900">
                        ${(visa.price * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Secure Stripe Checkout</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      You will be redirected to Stripe&apos;s secure checkout page to complete your payment.
                      We never store your credit card details.
                    </p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Payment
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </>
                    )}
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-4">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
                      alt="Visa" 
                      className="h-8 opacity-50"
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                      alt="Mastercard" 
                      className="h-8 opacity-50"
                    />
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
                      alt="PayPal" 
                      className="h-6 opacity-50"
                    />
                  </div>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    By completing this purchase, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </p>
                </>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <p className="text-slate-600">
                  <strong>Questions about this visa?</strong>{' '}
                  <Link href="/lawyers" className="text-blue-600 hover:underline">
                    Book a consultation with a lawyer
                  </Link>
                </p>
                <p className="text-slate-600">
                  <strong>Payment issues?</strong>{' '}
                  Contact us at support@visahelper.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
