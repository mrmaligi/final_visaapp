'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import {
  getUserById,
  updateUserStatus,
  deleteUser,
  type User
} from '@/lib/actions/admin-actions';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  CheckCircle,
  Ban,
  RotateCcw,
  Trash2,
  UserX,
  ShoppingCart,
  MessageSquare,
  FileText,
  Clock,
  MapPin
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const result = await getUserById(id as string);
      
      if (result.error) {
        addToast(result.error, 'error');
        router.push('/admin/users');
      } else {
        setUser(result.data);
      }
    } catch (error) {
      addToast('Failed to load user details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!user) return;
    
    confirm({
      title: 'Suspend User Account',
      message: `Are you sure you want to suspend ${user.display_name || user.email}'s account?`,
      confirmText: 'Suspend',
      type: 'warning',
      onConfirm: async () => {
        setProcessing(true);
        const result = await updateUserStatus(user.id, 'suspended');
        setProcessing(false);
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('User suspended successfully', 'success');
          loadUser();
        }
      }
    });
  };

  const handleReactivate = async () => {
    if (!user) return;
    
    confirm({
      title: 'Reactivate User Account',
      message: `Are you sure you want to reactivate ${user.display_name || user.email}'s account?`,
      confirmText: 'Reactivate',
      type: 'success',
      onConfirm: async () => {
        setProcessing(true);
        const result = await updateUserStatus(user.id, 'active');
        setProcessing(false);
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('User reactivated successfully', 'success');
          loadUser();
        }
      }
    });
  };

  const handleDelete = async () => {
    if (!user) return;
    
    confirm({
      title: 'Delete User Account',
      message: `Are you sure you want to permanently delete ${user.display_name || user.email}'s account? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        setProcessing(true);
        const result = await deleteUser(user.id);
        setProcessing(false);
        
        if (result.error) {
          addToast(result.error, 'error');
        } else {
          addToast('User deleted successfully', 'success');
          router.push('/admin/users');
        }
      }
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 text-center">
          <p className="text-gray-500">User not found</p>
          <Link href="/admin/users" className="text-blue-600 hover:underline">
            Back to Users
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmDialogComponent />
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Back Link */}
        <Link 
          href="/admin/users"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Users
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {user.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={user.display_name || user.email}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {(user.display_name || user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.display_name || 'Unnamed User'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                      {user.email}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    )}>
                      {user.role === 'admin' && <Shield className="w-3.5 h-3.5 inline mr-1" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    
                    <span className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium',
                      user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    )}>
                      {user.status === 'active' ? <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> : <Ban className="w-3.5 h-3.5 inline mr-1" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                    
                    {!user.email_verified && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                        Email Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {user.status === 'active' ? (
                  <button
                    onClick={handleSuspend}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50"
                  >
                    <UserX className="w-4 h-4" />
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={handleReactivate}
                    disabled={processing}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reactivate
                  </button>
                )}
                
                <button
                  onClick={handleDelete}
                  disabled={processing}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Activity */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Purchases</span>
                </div>
                <p className="text-2xl font-bold">0</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm">Consultations</span>
                </div>
                <p className="text-2xl font-bold">0</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">Documents</span>
                </div>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Account Details</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID</span>
                  <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Joined</span>
                  <span>{new Date(user.created_at).toLocaleDateString('en-AU')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Active</span>
                  <span>
                    {user.last_sign_in_at 
                      ? new Date(user.last_sign_in_at).toLocaleDateString('en-AU')
                      : 'Never'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Email Verified</span>
                  <span>{user.email_verified ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Admin Status</span>
                  <span>{user.is_admin ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
