import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const documentCategory = formData.get('category') as string;
    const documentType = formData.get('type') as string;
    const visaPurchaseId = formData.get('visaPurchaseId') as string | null;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, JPG, PNG, DOCX' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size: 10MB' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role for storage access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate unique file path
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `${userId}/${documentCategory}/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('user-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      );
    }

    // Save document record to database
    const { data: docData, error: dbError } = await supabase
      .from('user_documents')
      .insert({
        user_id: userId,
        visa_purchase_id: visaPurchaseId || null,
        document_category: documentCategory,
        document_type: documentType || file.name,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        shared_with_lawyer: false
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to delete the uploaded file if db insert failed
      await supabase.storage.from('user-documents').remove([filePath]);
      return NextResponse.json(
        { error: 'Failed to save document record', details: dbError.message },
        { status: 500 }
      );
    }

    // Get public URL for the file
    const { data: urlData } = supabase
      .storage
      .from('user-documents')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      document: {
        id: docData.id,
        fileName: file.name,
        filePath: filePath,
        publicUrl: urlData.publicUrl,
        fileSize: file.size,
        mimeType: file.type
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get documents for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: documents, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }

    // Get signed URLs for each document
    const documentsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const { data: urlData } = supabase
          .storage
          .from('user-documents')
          .getPublicUrl(doc.file_path);
        
        return {
          ...doc,
          publicUrl: urlData.publicUrl
        };
      })
    );

    return NextResponse.json({ documents: documentsWithUrls });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!documentId || !userId) {
      return NextResponse.json(
        { error: 'Document ID and User ID required' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get document record
    const { data: doc, error: fetchError } = await supabase
      .from('user_documents')
      .select('file_path, user_id')
      .eq('id', documentId)
      .single();

    if (fetchError || !doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (doc.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase
      .storage
      .from('user-documents')
      .remove([doc.file_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('user_documents')
      .delete()
      .eq('id', documentId);

    if (dbError) {
      return NextResponse.json(
        { error: 'Failed to delete document' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
