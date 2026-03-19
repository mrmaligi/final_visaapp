'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { Skeleton, CardSkeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton';
import { getDashboardStats, getRecentActivity } from '@/lib/actions/admin-actions';
import {
  Users,
  Scale,
  TrendingUp,
  MessageSquare,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalLawyers: number;
  pendingLawyers: number;
  totalPurchases: number;
  totalConsultations: number;
  totalRevenue: number;
  activeIssues: number;
}

interface Activity {
  type: string;
  description: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [statsResult, activityResult] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(10)
      ]);

      if (statsResult.error) {
        addToast(statsResult.error, 'error');
      } else if (statsResult.data) {
        setStats(statsResult.data);
      }

      if (activityResult.error) {
        console.error('Error loading activity:', activityResult.error);
      } else if (activityResult.data) {
        setActivities(activityResult.data);
      }
    } catch (error) {
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: '+45 this week', icon: Users, color: 'bg-blue-500' },
    { label: 'Total Lawyers', value: stats.totalLawyers.toLocaleString(), change: `${stats.pendingLawyers} pending`, icon: Scale, color: 'bg-purple-500' },
    { label: 'Visa Purchases', value: stats.totalPurchases.toLocaleString(), change: '+12% this month', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Consultations', value: stats.totalConsultations.toLocaleString(), change: '124 this month', icon: MessageSquare, color: 'bg-amber-500' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+8% this month', icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Active Issues', value: stats.activeIssues.toString(), change: 'Needs attention', icon: AlertCircle, color: 'bg-red-500' },
  ] : [];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <PageHeaderSkeleton />
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>

          {/* Content Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Action Required */}
        {stats && stats.pendingLawyers > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800">⚠️ Action Required</h3>
                <ul className="list-disc list-inside text-amber-700 mt-1">
                  <li>{stats.pendingLawyers} Lawyer application{stats.pendingLawyers !== 1 ? 's' : ''} awaiting verification</li>
                </ul>
                <Link 
                  href="/admin/lawyers"
                  className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-amber-800 hover:underline"
                >
                  Review now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <button 
                  onClick={loadDashboardData}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>
            <div className="p-6">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Quick Links</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Manage Lawyers', href: '/admin/lawyers', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
                  { label: 'Manage Users', href: '/admin/users', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
                  { label: 'Manage Visas', href: '/admin/visas', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
                  { label: 'Platform Settings', href: '/admin/settings', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
                ].map((link) => (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    className={`${link.color} p-4 rounded-lg transition-colors font-medium`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
