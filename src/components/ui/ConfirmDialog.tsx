'use client';

import { useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogState extends ConfirmOptions {
  isOpen: boolean;
}

export function useConfirmDialog() {
  const [dialog, setDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'info',
    onConfirm: () => {},
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    setDialog({
      ...options,
      isOpen: true,
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      type: options.type || 'info',
    });
  }, []);

  const close = useCallback(() => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
    if (dialog.onCancel) {
      dialog.onCancel();
    }
  }, [dialog]);

  const handleConfirm = useCallback(async () => {
    await dialog.onConfirm();
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, [dialog]);

  const ConfirmDialogComponent = useCallback(() => {
    if (!dialog.isOpen) return null;

    const typeStyles = {
      danger: {
        icon: Trash2,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        buttonBg: 'bg-red-600 hover:bg-red-700',
      },
      warning: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-600 hover:bg-amber-700',
      },
      info: {
        icon: CheckCircle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
      },
      success: {
        icon: CheckCircle,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        buttonBg: 'bg-green-600 hover:bg-green-700',
      },
    };

    const Icon = typeStyles[dialog.type || 'info'].icon;

    // Only render on client side
    if (typeof document === 'undefined') return null;

    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={close}
        />
        
        {/* Dialog */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${typeStyles[dialog.type || 'info'].iconBg}`}>
                <Icon className={`w-6 h-6 ${typeStyles[dialog.type || 'info'].iconColor}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{dialog.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{dialog.message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={close}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                {dialog.cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeStyles[dialog.type || 'info'].buttonBg}`}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }, [dialog, close, handleConfirm]);

  return { confirm, ConfirmDialogComponent };
}
