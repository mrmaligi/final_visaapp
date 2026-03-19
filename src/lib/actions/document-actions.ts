'use server';

import { createClient } from '@/lib/supabase/client';
import { revalidatePath } from 'next/cache';

// Document upload to Supabase Storage
export async function uploadDocument(
  file: File,
  userId: string,
  category: string,
  visaApplicationId?: string,
  sharedWithLawyer: boolean = false
) {
  const supabase = await createClient();
  
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${category}/${timestamp}_${safeFileName}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    // Insert document record in database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        category,
        visa_application_id: visaApplicationId || null,
        shared_with_lawyer: sharedWithLawyer,
        status: 'pending',
        url: publicUrl,
        version: 1,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (dbError) throw dbError;
    
    revalidatePath('/user/documents');
    
    return { success: true, document };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Upload multiple documents
export async function uploadMultipleDocuments(
  files: File[],
  userId: string,
  category: string,
  visaApplicationId?: string,
  sharedWithLawyer: boolean = false
) {
  const results = await Promise.all(
    files.map(file => uploadDocument(file, userId, category, visaApplicationId, sharedWithLawyer))
  );
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  return {
    success: failed.length === 0,
    uploaded: successful.length,
    failed: failed.length,
    results,
  };
}

// Get all documents for a user
export async function getUserDocuments(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      visa_application:visa_applications(id, visa_type)
    `)
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('uploaded_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Get documents by category
export async function getDocumentsByCategory(userId: string, category: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('is_deleted', false)
    .order('uploaded_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Get document versions
export async function getDocumentVersions(documentId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Upload new version of existing document
export async function uploadDocumentVersion(
  file: File,
  documentId: string,
  userId: string
) {
  const supabase = await createClient();
  
  try {
    // Get current document
    const { data: currentDoc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Create version record
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_id: documentId,
        version_number: currentDoc.version,
        file_path: currentDoc.file_path,
        file_size: currentDoc.file_size,
        uploaded_at: currentDoc.uploaded_at,
        uploaded_by: userId,
      });
    
    if (versionError) throw versionError;
    
    // Upload new file
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const newFilePath = `${userId}/${currentDoc.category}/${timestamp}_${safeFileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(newFilePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (uploadError) throw uploadError;
    
    // Get new public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(newFilePath);
    
    // Update document record
    const { data: updatedDoc, error: updateError } = await supabase
      .from('documents')
      .update({
        name: file.name,
        file_path: newFilePath,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl,
        version: currentDoc.version + 1,
        uploaded_at: new Date().toISOString(),
        status: 'pending',
      })
      .eq('id', documentId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    revalidatePath('/user/documents');
    
    return { success: true, document: updatedDoc };
  } catch (error) {
    console.error('Version upload error:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Toggle shared with lawyer
export async function toggleSharedWithLawyer(documentId: string, shared: boolean) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .update({ shared_with_lawyer: shared, updated_at: new Date().toISOString() })
    .eq('id', documentId)
    .select()
    .single();
  
  if (error) throw error;
  
  revalidatePath('/user/documents');
  return { success: true, document: data };
}

// Update document status
export async function updateDocumentStatus(
  documentId: string,
  status: 'pending' | 'verified' | 'rejected',
  notes?: string
) {
  const supabase = await createClient();
  
  const updateData: Record<string, string | boolean> = { 
    status,
    updated_at: new Date().toISOString(),
  };
  if (notes) updateData.review_notes = notes;
  
  const { data, error } = await supabase
    .from('documents')
    .update(updateData)
    .eq('id', documentId)
    .select()
    .single();
  
  if (error) throw error;
  
  revalidatePath('/user/documents');
  return { success: true, document: data };
}

// Soft delete document
export async function deleteDocument(documentId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .update({ 
      is_deleted: true,
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId)
    .select()
    .single();
  
  if (error) throw error;
  
  revalidatePath('/user/documents');
  return { success: true };
}

// Permanently delete document
export async function permanentlyDeleteDocument(documentId: string) {
  const supabase = await createClient();
  
  // Get file path
  const { data: doc, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', documentId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([doc.file_path]);
  
  if (storageError) console.error('Storage delete error:', storageError);
  
  // Delete from database
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
  
  if (deleteError) throw deleteError;
  
  revalidatePath('/user/documents');
  return { success: true };
}

// Get document checklist for visa type
export async function getDocumentChecklist(visaTypeId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('document_checklists')
    .select(`
      *,
      document_requirements(*)
    `)
    .eq('visa_type_id', visaTypeId)
    .single();
  
  if (error) throw error;
  return data;
}

// Get checklist progress for user
export async function getChecklistProgress(userId: string, visaApplicationId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('document_checklist_progress')
    .select(`
      *,
      requirement:document_requirements(*)
    `)
    .eq('user_id', userId)
    .eq('visa_application_id', visaApplicationId);
  
  if (error) throw error;
  return data || [];
}

// Update checklist progress
export async function updateChecklistProgress(
  userId: string,
  requirementId: string,
  visaApplicationId: string,
  status: 'not_started' | 'in_progress' | 'completed',
  documentId?: string
) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('document_checklist_progress')
    .upsert({
      user_id: userId,
      requirement_id: requirementId,
      visa_application_id: visaApplicationId,
      status,
      document_id: documentId || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return { success: true, progress: data };
}

// Get expiring documents
export async function getExpiringDocuments(userId: string, daysThreshold: number = 30) {
  const supabase = await createClient();
  
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .lte('expires_at', thresholdDate.toISOString())
    .gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Update document expiration date
export async function updateDocumentExpiration(documentId: string, expiresAt: string | null) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .update({ 
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', documentId)
    .select()
    .single();
  
  if (error) throw error;
  return { success: true, document: data };
}

// Get document statistics
export async function getDocumentStats(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('status, category')
    .eq('user_id', userId)
    .eq('is_deleted', false);
  
  if (error) throw error;
  
  const stats = {
    total: data?.length || 0,
    byStatus: {
      pending: data?.filter(d => d.status === 'pending').length || 0,
      verified: data?.filter(d => d.status === 'verified').length || 0,
      rejected: data?.filter(d => d.status === 'rejected').length || 0,
    },
    byCategory: {
      identity: data?.filter(d => d.category === 'identity').length || 0,
      financial: data?.filter(d => d.category === 'financial').length || 0,
      employment: data?.filter(d => d.category === 'employment').length || 0,
      education: data?.filter(d => d.category === 'education').length || 0,
      other: data?.filter(d => d.category === 'other').length || 0,
    },
  };
  
  return stats;
}
