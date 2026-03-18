'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  Ban,
  Shield,
  ShoppingCart,
  Users,
  RotateCcw,
  Trash2,
  MessageSquare,
  CreditCard,
  FileText,
  ExternalLink,
  Send,
  AlertTriangle,
  Star,
  CheckSquare,
  XCircle
} from 'lucide-react';

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Smith',
  email: 'john.smith@email.com',
  role: 'user' as const,
  status: 'active' as const,
  email_verified: true,
  joined_at: '2024-03-15T10:30:00Z',
  last_active: '2024-03-18T09:15:00Z',
  total_purchases: 3,
  total_consultations: 2,
  total_reviews: 1,
  phone: '+61 412 345 678',
  country: 'Australia',
  timezone: 'Australia/Sydney',
  avatar: null,
};

const activityTimeline = [
  { id: '1', type: 'purchase', description: 'Purchased Partner Visa 820/801 Guide', timestamp: '2024-03-18T09:15:00Z', metadata: { amount: '$149' } },
  { id: '2', type: 'consultation', description: 'Consultation with Michael Chen', timestamp: '2024-03-17T14:30:00Z', metadata: { duration: '45 min', status: 'completed' } },
  { id: '3', type: 'review', description: 'Left a review for Michael Chen', timestamp: '2024-03-17T15:00:00Z', metadata: { rating: 5 } },
  { id: '4', type: 'login', description: 'Logged in from Melbourne, AU', timestamp: '2024-03-16T08:00:00Z', metadata: { device: 'Chrome / macOS' } },
  { id: '5', type: 'purchase', description: 'Purchased Student Visa 500 Guide', timestamp: '2024-03-10T11:20:00Z', metadata: { amount: '$99' } },
];

const purchasedVisas = [
  { id: '1', name: 'Partner Visa 820/801', purchase_date: '2024-03-18T09:15:00Z', price: 149, status: 'active' },
  { id: '2', name: 'Student Visa 500', purchase_date: '2024-03-10T11:20:00Z', price: 99, status: 'active' },
  { id: '3', name: 'Skilled Independent 189', purchase_date: '2024-02-28T16:45:00Z', price: 129, status: 'active' },
];

const consultations = [
  { id: '1', lawyer: 'Michael Chen', date: '2024-03-17T14:30:00Z', duration: '45 min', status: 'completed', amount: 120 },
  { id: '2', lawyer: 'Sarah Johnson', date: '2024-03-05T10:00:00Z', duration: '30 min', status: 'completed', amount: 85 },
];

function ActivityIcon({ type }: { type: string }) {
  const icons = {
    purchase: ShoppingCart,
    consultation: Users,
    review: Star,
    login: Clock,
  };
  const colors = {
    purchase: 'bg-green-100 text-green-600',
    consultation: 'bg-blue-100 text-blue-600',
    review: 'bg-yellow-100 text-yellow-600',
    login: 'bg-gray-100 text-gray-600',
  };
  const Icon = icons[type as keyof typeof icons] || Clock;
  return (
    <div className={cn('p-2 rounded-full', colors[type as keyof typeof colors] || colors.login)}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

export default function UserDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'consultations', label: 'Consultations' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/admin/users" className="hover:text-gray-700">Users</Link>
          <span>/</span>
          <span className="text-gray-900">{mockUser.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/users"
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-medium">
                {mockUser.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockUser.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-500">{mockUser.email}</span>
                  {mockUser.email_verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
            {mockUser.status === 'active' ? (
              <button
                onClick={() => setShowSuspendModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium"
              >
                <Ban className="w-4 h-4" />
                Suspend
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reactivate
              </button>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Total Purchases', value: mockUser.total_purchases, icon: ShoppingCart },
                        { label: 'Consultations', value: mockUser.total_consultations, icon: Users },
                        { label: 'Reviews', value: mockUser.total_reviews, icon: Star },
                        { label: 'Member Since', value: '3 days', icon: Calendar },
                      ].map((stat) => (
                        <div key={stat.label} className="p-4 bg-gray-50 rounded-lg text-center">
                          <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        {activityTimeline.slice(0, 4).map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4">
                            <ActivityIcon type={activity.type} />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{activity.description}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                                {activity.metadata?.amount && (
                                  <span className="text-sm font-medium text-green-600">{activity.metadata.amount}</span>
                                )}
                                {activity.metadata?.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm">{activity.metadata.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-4">
                    {activityTimeline.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg">
                        <ActivityIcon type={activity.type} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                          {activity.metadata && Object.entries(activity.metadata).map(([key, value]) => (
                            <p key={key} className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">{key}:</span> {value}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'purchases' && (
                  <div className="space-y-4">
                    {purchasedVisas.map((visa) => (
                      <div key={visa.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{visa.name}</p>
                            <p className="text-sm text-gray-500">Purchased on {formatDate(visa.purchase_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">${visa.price}</span>
                          <span className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            visa.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          )}>
                            {visa.status.charAt(0).toUpperCase() + visa.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'consultations' && (
                  <div className="space-y-4">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{consultation.lawyer}</p>
                            <p className="text-sm text-gray-500">{formatDate(consultation.date)} • {consultation.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">${consultation.amount}</span>
                          <span className={cn(
                            'px-2 py-1 text-xs font-medium rounded-full',
                            consultation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          )}>
                            {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    mockUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  )}>
                    {mockUser.status.charAt(0).toUpperCase() + mockUser.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Role</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  {mockUser.email_verified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="font-medium">{mockUser.phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">{mockUser.country}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timezone</p>
                  <p className="font-medium">{mockUser.timezone}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Send Email</p>
                    <p className="text-sm text-gray-500">Contact this user</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Issue Refund</p>
                    <p className="text-sm text-gray-500">Refund last purchase</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">View Public Profile</p>
                    <p className="text-sm text-gray-500">See user view</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Send Email to {mockUser.name}</h3>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={5}
                  placeholder="Enter your message..."
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <Ban className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold">Suspend User</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to suspend {mockUser.name}? They will not be able to log in or use any platform features.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete User</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete {mockUser.name}? This action cannot be undone.
            </p>
            <div className="p-4 bg-red-50 rounded-lg mb-6">
              <p className="text-sm text-red-700">This will delete:</p>
              <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
                <li>All user data and profile information</li>
                <li>Purchase history and consultations</li>
                <li>Reviews and ratings</li>
                <li>Account cannot be recovered</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
