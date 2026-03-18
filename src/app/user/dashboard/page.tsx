'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  BarChart3, 
  Scale, 
  FileText, 
  Clock, 
  Calendar,
  ChevronRight,
  Bell,
  User
} from 'lucide-react';

interface VisaApplication {
  id: string;
  visaName: string;
  subclass: string;
  purchasedDate: string;
  progress: number;
  documentsUploaded: number;
  totalDocuments: number;
  status: 'in_progress' | 'submitted' | 'approved' | 'rejected';
}

interface Consultation {
  id: string;
  lawyerName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface ActivityItem {
  id: string;
  type: 'document_uploaded' | 'consultation_booked' | 'visa_purchased' | 'status_update';
  description: string;
  timestamp: string;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
}

export default function UserDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setApplications([
      {
        id: '1',
        visaName: 'Skilled Independent',
        subclass: '189',
        purchasedDate: '2026-03-15',
        progress: 60,
        documentsUploaded: 8,
        totalDocuments: 12,
        status: 'in_progress'
      },
      {
        id: '2',
        visaName: 'Partner Visa',
        subclass: '820',
        purchasedDate: '2026-02-20',
        progress: 35,
        documentsUploaded: 5,
        totalDocuments: 15,
        status: 'in_progress'
      }
    ]);

    setConsultations([
      {
        id: '1',
        lawyerName: 'Sarah Mitchell',
        date: '2026-03-25',
        time: '14:00',
        status: 'upcoming'
      }
    ]);

    setActivities([
      { id: '1', type: 'document_uploaded', description: 'Uploaded passport copy', timestamp: '2026-03-18T10:30:00' },
      { id: '2', type: 'consultation_booked', description: 'Booked consultation with Sarah Mitchell', timestamp: '2026-03-17T15:20:00' },
      { id: '3', type: 'visa_purchased', description: 'Purchased Skilled Independent (189) visa', timestamp: '2026-03-15T09:00:00' },
    ]);

    setNews([
      { id: '1', title: 'New Visa Processing Times Released', excerpt: 'Department of Home Affairs updates processing time estimates...', date: '2026-03-17' },
      { id: '2', title: 'Skill Shortage List Updated', excerpt: 'Critical skills for 2026-2027 have been announced...', date: '2026-03-15' },
    ]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'document_uploaded': return '📄';
      case 'consultation_booked': return '📅';
      case 'visa_purchased': return '🛂';
      case 'status_update': return '📊';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
          </h1>
          <p className="text-slate-600 mt-2">Here's what's happening with your visa applications</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/visas" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Compass className="w-6 h-6 text-blue-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-4">Browse Visas</h3>
            <p className="text-sm text-slate-600 mt-1">Explore visa options</p>
          </Link>

          <Link 
            href="/tracker" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-4">Track Processing</h3>
            <p className="text-sm text-slate-600 mt-1">Check processing times</p>
          </Link>

          <Link 
            href="/lawyers" 
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Scale className="w-6 h-6 text-purple-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-900 mt-4">Find Lawyer</h3>
            <p className="text-sm text-slate-600 mt-1">Get expert help</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Visa Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">My Visa Applications</h2>
                </div>
                <Link href="/user/visas" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</Link>
              </div>
              <div className="p-6">
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">{app.visaName} ({app.subclass})</h3>
                            <p className="text-sm text-slate-500">Purchased: {new Date(app.purchasedDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                            {app.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${app.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">Documents uploaded: {app.documentsUploaded}/{app.totalDocuments}</p>
                        <Link 
                          href={`/visas/${app.id}/premium`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Continue Application
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">No visa applications yet</p>
                    <Link href="/visas" className="text-blue-600 hover:underline font-medium">Browse visas →</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Consultations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Upcoming Consultations</h2>
                </div>
                <Link href="/user/consultations" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</Link>
              </div>
              <div className="p-6">
                {consultations.filter(c => c.status === 'upcoming').length > 0 ? (
                  <div className="space-y-4">
                    {consultations.filter(c => c.status === 'upcoming').map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{consultation.lawyerName}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(consultation.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} at {consultation.time}</span>
                            </div>
                          </div>
                        </div>
                        <Link 
                          href={`/user/consultations/${consultation.id}`}
                          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Join
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 mb-4">No consultations scheduled</p>
                    <Link href="/lawyers" className="text-blue-600 hover:underline font-medium">Find a lawyer →</Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                          {getActivityIcon(activity.type)}
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-px h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-slate-900">{activity.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} • {' '}
                          {new Date(activity.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent News */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent News</h2>
                <Link href="/news" className="text-sm text-blue-600 hover:text-blue-700">View All</Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {news.map((item) => (
                    <Link key={item.id} href={`/news/${item.id}`} className="block group">
                      <p className="text-xs text-slate-500 mb-1">{new Date(item.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <h3 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
