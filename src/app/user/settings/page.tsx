'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  Lock,
  ChevronRight,
  Camera,
  Smartphone,
  Mail,
  Globe,
  Download,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  LogOut,
  Clock
} from 'lucide-react';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'billing' | 'privacy';

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface Purchase {
  id: string;
  item: string;
  type: 'visa' | 'consultation';
  amount: number;
  date: string;
  status: 'completed' | 'refunded';
}

export default function UserSettingsPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: '+61 412 345 678',
    email: user?.email || ''
  });

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    emailMarketing: false,
    smsAlerts: true,
    consultationReminders: true,
    documentUpdates: true,
    applicationStatus: true
  });

  // Mock data
  const activeSessions: ActiveSession[] = [
    { id: '1', device: 'Chrome on Windows', location: 'Sydney, Australia', lastActive: 'Now', isCurrent: true },
    { id: '2', device: 'Safari on iPhone', location: 'Melbourne, Australia', lastActive: '2 hours ago', isCurrent: false }
  ];

  const purchases: Purchase[] = [
    { id: '1', item: 'Skilled Independent Visa (189)', type: 'visa', amount: 499, date: '2026-03-15', status: 'completed' },
    { id: '2', item: 'Consultation with Sarah Mitchell', type: 'consultation', amount: 200, date: '2026-03-10', status: 'completed' },
    { id: '3', item: 'Partner Visa (820)', type: 'visa', amount: 699, date: '2026-02-20', status: 'completed' }
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    // Handle password change
    console.log('Changing password...');
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: CreditCard },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/user/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Profile Information</h2>
                  
                  {/* Photo Upload */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-blue-600" />
                      </div>
                      <button
                        onClick={handlePhotoUpload}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Profile Photo</h3>
                      <p className="text-sm text-slate-600">JPG, GIF or PNG. Max size 2MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => console.log('Uploading:', e.target.files)}
                    />
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-slate-500"
                      />
                      <p className="text-sm text-slate-500 mt-1">Email cannot be changed. Contact support for assistance.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Security Settings</h2>
                  
                  {/* Change Password */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        onClick={handleChangePassword}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Authenticator App</p>
                          <p className="text-sm text-slate-600">Secure your account with 2FA</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {session.device}
                                {session.isCurrent && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>}
                              </p>
                              <p className="text-sm text-slate-600">{session.location} • {session.lastActive}</p>
                            </div>
                          </div>
                          {!session.isCurrent && (
                            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                              Revoke
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Application Updates</p>
                          <p className="text-sm text-slate-600">Get notified about your visa application status</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, emailUpdates: !notifications.emailUpdates })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Consultation Reminders</p>
                          <p className="text-sm text-slate-600">Receive reminders before scheduled consultations</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, consultationReminders: !notifications.consultationReminders })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.consultationReminders ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.consultationReminders ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Document Updates</p>
                          <p className="text-sm text-slate-600">Notifications when documents are processed</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, documentUpdates: !notifications.documentUpdates })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.documentUpdates ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.documentUpdates ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Marketing Emails</p>
                          <p className="text-sm text-slate-600">Receive news, tips, and promotional offers</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, emailMarketing: !notifications.emailMarketing })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.emailMarketing ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.emailMarketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Purchase History</h2>
                  
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            purchase.type === 'visa' ? 'bg-blue-50' : 'bg-purple-50'
                          }`}>
                            {purchase.type === 'visa' ? (
                              <CheckCircle className="w-6 h-6 text-blue-600" />
                            ) : (
                              <Clock className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{purchase.item}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <span className="capitalize">{purchase.type}</span>
                              <span>•</span>
                              <span>{new Date(purchase.date).toLocaleDateString('en-AU')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">${purchase.amount}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            purchase.status === 'completed' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <Download className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 mb-1">Download Your Data</h3>
                          <p className="text-sm text-slate-600 mb-4">Get a copy of all your personal data and activity history.</p>
                          <button className="px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Request Data Export
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Lock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-slate-900 mb-1">Profile Visibility</h3>
                          <p className="text-sm text-slate-600 mb-4">Control who can see your profile information.</p>
                          <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Private - Only visible to you</option>
                            <option>Lawyers - Visible to your lawyers</option>
                            <option>Public - Visible to everyone</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-red-200 rounded-xl bg-red-50">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-red-900 mb-1">Delete Account</h3>
                          <p className="text-sm text-red-700 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                          <button className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
