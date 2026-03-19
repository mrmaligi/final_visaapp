'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ArrowLeft, 
  Download, 
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface Earning {
  id: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  status: 'pending' | 'paid' | 'failed';
  paid_at: string | null;
  created_at: string;
  consultation: {
    scheduled_at: string;
    visa_type: string;
    duration_minutes: number;
    client: {
      full_name: string;
    };
  };
}

interface EarningsSummary {
  totalEarned: number;
  pendingAmount: number;
  totalConsultations: number;
  thisMonth: number;
}

export default function LawyerEarningsPage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    try {
      // Get lawyer ID from user profile
      const profileRes = await fetch(`/api/lawyers/profile?userId=${user?.id}`);
      if (!profileRes.ok) {
        setIsLoading(false);
        return;
      }
      const profileData = await profileRes.json();
      
      const response = await fetch(`/api/lawyers/earnings?lawyerId=${profileData.lawyer.id}`);
      if (response.ok) {
        const data = await response.json();
        setEarnings(data.earnings);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/lawyer/dashboard"
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Earnings</h1>
          <p className="text-slate-600 mt-2">Track your consultation income and payment history.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-slate-600">Total Earned</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.totalEarned || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.pendingAmount || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-slate-600">This Month</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(summary?.thisMonth || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-slate-600">Consultations</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {summary?.totalConsultations || 0}
            </p>
          </div>
        </div>

        {/* Earnings List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-slate-900">Recent Earnings</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading earnings...</p>
            </div>
          ) : earnings.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Earnings Yet</h3>
              <p className="text-slate-600 mb-4">Complete consultations to start earning.</p>
              <Link
                href="/lawyers"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Your Profile
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {earnings.map((earning) => (
                <div key={earning.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Consultation with {earning.consultation?.client?.full_name || 'Client'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {earning.consultation?.visa_type} • {earning.consultation?.duration_minutes} min
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                          {new Date(earning.consultation?.scheduled_at).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                            {earning.status === 'paid' ? 'Paid' : earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {formatCurrency(earning.net_amount)}
                      </p>
                      <p className="text-sm text-slate-500">
                        Gross: {formatCurrency(earning.gross_amount)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Fee: {formatCurrency(earning.platform_fee)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How Payments Work</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Platform fee: 15% of consultation fee</p>
            <p>• Payments are processed within 7 days of completed consultation</p>
            <p>• All payments are made via bank transfer to your registered account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
