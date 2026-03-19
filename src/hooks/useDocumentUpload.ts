import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseDocumentUploadReturn {
  uploadDocument: (file: File, category: string, documentType: string, visaPurchaseId?: string) => Promise<any>;
  deleteDocument: (documentId: string) => Promise<void>;
  fetchDocuments: () => Promise<any[]>;
  isUploading: boolean;
  uploadProgress: UploadProgress | null;
  error: string | null;
}

export function useDocumentUpload(): UseDocumentUploadReturn {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (
    file: File,
    category: string,
    documentType: string,
    visaPurchaseId?: string
  ) => {
    if (!user) {
      throw new Error('User must be logged in to upload documents');
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.id);
      formData.append('category', category);
      formData.append('type', documentType);
      if (visaPurchaseId) {
        formData.append('visaPurchaseId', visaPurchaseId);
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress({ loaded: file.size, total: file.size, percentage: 100 });
      return data.document;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const deleteDocument = useCallback(async (documentId: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const response = await fetch(`/api/documents?id=${documentId}&userId=${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  const fetchDocuments = useCallback(async () => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const response = await fetch(`/api/documents?userId=${user.id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch documents');
      }

      const data = await response.json();
      return data.documents;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  return {
    uploadDocument,
    deleteDocument,
    fetchDocuments,
    isUploading,
    uploadProgress,
    error,
  };
}
