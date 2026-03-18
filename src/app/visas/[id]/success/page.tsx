'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle, 
  FileText, 
  ArrowRight,
  Download,
  Mail,
  Calendar
} from 'lucide-react';

export default function VisaSuccessPage() {
  const { id } = useParams();

  // Mock order data - replace with actual data from API
  const order = {
    id: 'ORD-2026-001234',
    date: new Date().toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    visa: {
      name: 'Skilled Independent',
      subclass: '189',
      description: 'For skilled workers who are not sponsored by an employer or family member'
    },
    amount: 548.90,
    paymentMethod: 'Visa ending in 4242'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your order has been confirmed and processed</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-slate-600">Order ID</span>
                <span className="font-mono font-medium text-slate-900">{order.id}</span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-slate-600">Date</span>
                <span className="text-slate-900">{order.date}</span>
              </div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-slate-600">Payment Method</span>
                <span className="text-slate-900">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-xl font-bold text-slate-900">${order.amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Visa Details */}
            <div className="border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {order.visa.name} ({order.visa.subclass})
                  </h2>
                  <p className="text-slate-600 mt-1">{order.visa.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Premium Access
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      12 Months Validity
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Start Your Application</p>
                    <p className="text-sm text-slate-600">Access the premium application wizard to begin your visa journey</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Gather Documents</p>
                    <p className="text-sm text-slate-600">Check your document checklist and start uploading required files</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Book a Consultation</p>
                    <p className="text-sm text-slate-600">Get expert help from verified immigration lawyers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link
                href={`/visas/${id}/premium`}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start Application
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/user/visas"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  View My Visas
                </Link>
                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Receipt
                </button>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 mb-4">Need help with your application?</p>
          <Link
            href="/lawyers"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Calendar className="w-5 h-5" />
            Book a consultation with an immigration lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}
