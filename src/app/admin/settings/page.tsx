'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { cn } from '@/lib/utils';
import {
  Save,
  CheckCircle,
  Globe,
  CreditCard,
  Mail,
  Bell,
  Shield,
  Database,
  Users,
  Key,
  FileText,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Lock,
  RefreshCw,
  Download,
  Trash2,
  Plus,
  MoreHorizontal,
  LogOut,
  UserPlus
} from 'lucide-react';

// Types
interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  last_login: string;
  is_active: boolean;
}

// Mock data
const mockAdminAccounts: AdminAccount[] = [
  { id: '1', name: 'Super Admin', email: 'admin@visaflow.com', role: 'super_admin', last_login: '2024-03-18T20:00:00Z', is_active: true },
  { id: '2', name: 'John Doe', email: 'john@visaflow.com', role: 'admin', last_login: '2024-03-17T14:30:00Z', is_active: true },
  { id: '3', name: 'Jane Smith', email: 'jane@visaflow.com', role: 'admin', last_login: '2024-03-10T09:15:00Z', is_active: false },
];

const backupHistory = [
  { id: '1', date: '2024-03-18T00:00:00Z', size: '245 MB', type: 'Automatic', status: 'completed' },
  { id: '2', date: '2024-03-17T00:00:00Z', size: '242 MB', type: 'Automatic', status: 'completed' },
  { id: '3', date: '2024-03-16T12:00:00Z', size: '240 MB', type: 'Manual', status: 'completed' },
  { id: '4', date: '2024-03-15T00:00:00Z', size: '238 MB', type: 'Automatic', status: 'completed' },
];

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'backups', label: 'Backups', icon: Database },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    platform_name: 'VisaFlow',
    support_email: 'support@visaflow.com',
    timezone: 'Australia/Sydney',
    date_format: 'DD/MM/YYYY',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripe_public_key: 'pk_test_...',
    stripe_secret_key: 'sk_...',
    currency: 'AUD',
    payout_schedule: 'weekly',
  });

  const [emailSettings, setEmailSettings] = useState({
    provider: 'sendgrid',
    api_key: 'SG.****',
    from_email: 'noreply@visaflow.com',
    from_name: 'VisaFlow',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    new_user_alert: true,
    new_lawyer_alert: true,
    low_balance_alert: true,
    daily_summary: true,
    weekly_report: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">Configure platform settings and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {showSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Settings saved
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="flex flex-col">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors',
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-lg font-semibold">General Settings</h2>
                      <p className="text-sm text-gray-500">Basic platform configuration</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                      <input
                        type="text"
                        value={generalSettings.platform_name}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, platform_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={generalSettings.support_email}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, support_email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Timezone</label>
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Australia/Sydney">Australia/Sydney</option>
                        <option value="Australia/Melbourne">Australia/Melbourne</option>
                        <option value="Australia/Perth">Australia/Perth</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                      <select
                        value={generalSettings.date_format}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, date_format: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
                      </div>
                      <button
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          maintenanceMode ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-gray-600'
                        )}
                      >
                        {maintenanceMode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-lg font-semibold">Payment Settings</h2>
                      <p className="text-sm text-gray-500">Stripe integration and payment configuration</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900">Stripe Integration</p>
                          <p className="text-sm text-blue-700">Connect your Stripe account to process payments for visa guides and consultations.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Public Key</label>
                        <input
                          type="text"
                          value={paymentSettings.stripe_public_key}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, stripe_public_key: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                        <input
                          type="password"
                          value={paymentSettings.stripe_secret_key}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, stripe_secret_key: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                        <select
                          value={paymentSettings.currency}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="AUD">AUD - Australian Dollar</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                        <select
                          value={paymentSettings.payout_schedule}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, payout_schedule: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-lg font-semibold">Email Settings</h2>
                      <p className="text-sm text-gray-500">Email provider configuration and templates</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Provider</label>
                        <select
                          value={emailSettings.provider}
                          onChange={(e) => setEmailSettings({ ...emailSettings, provider: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="sendgrid">SendGrid</option>
                          <option value="mailgun">Mailgun</option>
                          <option value="ses">Amazon SES</option>
                          <option value="smtp">Custom SMTP</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                        <input
                          type="password"
                          value={emailSettings.api_key}
                          onChange={(e) => setEmailSettings({ ...emailSettings, api_key: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                        <input
                          type="email"
                          value={emailSettings.from_email}
                          onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                        <input
                          type="text"
                          value={emailSettings.from_name}
                          onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-lg font-semibold">Notifications</h2>
                      <p className="text-sm text-gray-500">Configure admin alert preferences</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: 'new_user_alert', label: 'New User Registration', description: 'Get notified when a new user signs up' },
                      { id: 'new_lawyer_alert', label: 'New Lawyer Application', description: 'Get notified when a lawyer submits an application' },
                      { id: 'low_balance_alert', label: 'Low Platform Balance', description: 'Alert when platform funds are running low' },
                      { id: 'daily_summary', label: 'Daily Summary', description: 'Receive a daily summary of platform activity' },
                      { id: 'weekly_report', label: 'Weekly Report', description: 'Receive a detailed weekly analytics report' },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <button
                          onClick={() => setNotificationSettings(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id as keyof typeof notificationSettings]
                          }))}
                          className={cn(
                            'p-2 rounded-lg transition-colors',
                            notificationSettings[item.id as keyof typeof notificationSettings]
                              ? 'text-blue-600 bg-blue-100'
                              : 'text-gray-400 hover:text-gray-600'
                          )}
                        >
                          {notificationSettings[item.id as keyof typeof notificationSettings] ? (
                            <ToggleRight className="w-8 h-8" />
                          ) : (
                            <ToggleLeft className="w-8 h-8" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-lg font-semibold">Security</h2>
                      <p className="text-sm text-gray-500">Admin accounts and security logs</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <UserPlus className="w-4 h-4" />
                      Add Admin
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Admin Accounts</h3>
                    
                    {mockAdminAccounts.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={cn(
                                'text-xs px-2 py-0.5 rounded-full',
                                admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                              )}>
                                {admin.role.replace('_', ' ')}
                              </span>
                              {admin.is_active ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Active</span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Inactive</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">Last login: {formatDate(admin.last_login)}</p>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Backups Settings */}
              {activeTab === 'backups' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div>
                      <h2 className="text-lg font-semibold">Backup & Restore</h2>
                      <p className="text-sm text-gray-500">Manage database backups and restoration</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <RefreshCw className="w-4 h-4" />
                      Create Backup
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Backup History</h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {backupHistory.map((backup) => (
                            <tr key={backup.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Database className="w-4 h-4 text-gray-400" />
                                  {formatDate(backup.date)}
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className={cn(
                                  'text-xs px-2 py-1 rounded-full',
                                  backup.type === 'Manual' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                )}>
                                  {backup.type}
                                </span>
                              </td>
                              <td className="px-4 py-4">{backup.size}</td>
                              <td className="px-4 py-4">
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="w-4 h-4" />
                                  Completed
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
