'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton, PageHeaderSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getPlatformSettings,
  updatePlatformSettings,
  type PlatformSettings
} from '@/lib/actions/admin-actions';
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
  UserPlus,
  DollarSign,
  Wrench
} from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  last_login: string;
  is_active: boolean;
}

const mockAdminAccounts: AdminAccount[] = [
  { id: '1', name: 'Super Admin', email: 'admin@visaflow.com', role: 'super_admin', last_login: '2024-03-18T20:00:00Z', is_active: true },
  { id: '2', name: 'John Doe', email: 'john@visaflow.com', role: 'admin', last_login: '2024-03-17T14:30:00Z', is_active: true },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();

  // Settings state
  const [settings, setSettings] = useState<Partial<PlatformSettings>>({
    default_visa_price: 99,
    platform_fee_percent: 10,
    maintenance_mode: false,
    support_email: 'support@visaflow.com',
    email_templates: {
      welcome: '',
      lawyer_approved: '',
      lawyer_rejected: '',
      purchase_confirmation: '',
    },
  });

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getPlatformSettings();
      
      if (result.error) {
        // Settings may not exist yet, that's ok
        console.log('No settings found, using defaults');
      } else if (result.data) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const result = await updatePlatformSettings(settings);
    
    setIsSaving(false);
    
    if (result.error) {
      addToast(result.error, 'error');
    } else {
      addToast('Settings saved successfully', 'success');
    }
  };

  const handleMaintenanceToggle = () => {
    const newMode = !settings.maintenance_mode;
    if (newMode) {
      confirm({
        title: 'Enable Maintenance Mode',
        message: 'Are you sure you want to enable maintenance mode? The site will be inaccessible to regular users.',
        confirmText: 'Enable',
        type: 'warning',
        onConfirm: async () => {
          setSettings(prev => ({ ...prev, maintenance_mode: true }));
          const result = await updatePlatformSettings({ ...settings, maintenance_mode: true });
          if (result.error) {
            addToast(result.error, 'error');
          } else {
            addToast('Maintenance mode enabled', 'warning');
          }
        }
      });
    } else {
      setSettings(prev => ({ ...prev, maintenance_mode: false }));
      updatePlatformSettings({ ...settings, maintenance_mode: false })
        .then(result => {
          if (result.error) {
            addToast(result.error, 'error');
          } else {
            addToast('Maintenance mode disabled', 'success');
          }
        });
    }
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

  if (loading) {
    return (
      <AdminLayout>
        <ConfirmDialogComponent />
        <div className="p-6 lg:p-8">
          <PageHeaderSkeleton />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-3">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmDialogComponent />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">Configure platform settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={settings.support_email}
                        onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Visa Price ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={settings.default_visa_price}
                          onChange={(e) => setSettings({ ...settings, default_visa_price: Number(e.target.value) })}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Platform Fee (%)</label>
                      <input
                        type="number"
                        value={settings.platform_fee_percent}
                        onChange={(e) => setSettings({ ...settings, platform_fee_percent: Number(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-500">Temporarily disable the site for maintenance</p>
                      </div>
                      <button
                        onClick={handleMaintenanceToggle}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          settings.maintenance_mode ? 'text-amber-600 bg-amber-50' : 'text-gray-400 hover:text-gray-600'
                        )}
                      >
                        {settings.maintenance_mode ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                      </button>
                    </div>
                    
                    {settings.maintenance_mode && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-amber-800">
                              <strong>Maintenance mode is enabled.</strong> Only administrators can access the site.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
                          placeholder="pk_test_..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                        <input
                          type="password"
                          placeholder="sk_..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="AUD">AUD - Australian Dollar</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payout Schedule</label>
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                        <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                          placeholder="SG.****"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
                        <input
                          type="email"
                          defaultValue="noreply@visaflow.com"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
                        <input
                          type="text"
                          defaultValue="VisaFlow"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="font-medium mb-4">Email Templates</h3>
                      
                      {[
                        { id: 'welcome', label: 'Welcome Email' },
                        { id: 'lawyer_approved', label: 'Lawyer Approved' },
                        { id: 'lawyer_rejected', label: 'Lawyer Rejected' },
                        { id: 'purchase_confirmation', label: 'Purchase Confirmation' },
                      ].map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">{template.label}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Edit Template
                          </button>
                        </div>
                      ))}
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
                        <button className="text-gray-400 hover:text-blue-600">
                          <ToggleLeft className="w-8 h-8" />
                        </button>
                      </div>
                    ))}
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
