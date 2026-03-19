# Document Management & Application Forms Enhancement

This document describes the comprehensive document management and application form improvements implemented for the VisaAssist application.

## Table of Contents

1. [Document Upload Enhancements](#1-document-upload-enhancements)
2. [Application Form Builder](#2-application-form-builder)
3. [Document Checklist](#3-document-checklist)
4. [File Management](#4-file-management)
5. [Setup Instructions](#5-setup-instructions)

---

## 1. Document Upload Enhancements

### Features Implemented

#### Document Preview
- **PDF Viewer**: Embedded iframe viewer for PDF documents with toolbar controls
- **Image Viewer**: Direct image preview with loading states
- **Fallback**: Download option for unsupported file types

#### Document Categorization
Categories supported:
- `identity` - Passport, birth certificates, IDs
- `financial` - Bank statements, tax returns
- `employment` - Contracts, reference letters
- `education` - Degrees, transcripts, certificates
- `health` - Medical examinations
- `character` - Police clearances
- `other` - Miscellaneous documents

#### Shared with Lawyer Toggle
- Toggle switch to share documents with assigned lawyers
- Visual indicator (user icon) on shared documents
- Quick share/unshare from preview modal

#### Document Status Tracking
Statuses:
- `pending` - Awaiting review (amber badge)
- `verified` - Approved (green badge)
- `rejected` - Needs attention (red badge with notes)

### Files Created
- `/src/app/user/documents/page.tsx` - Enhanced documents page
- `/src/lib/actions/document-actions.ts` - Server actions for document operations

---

## 2. Application Form Builder

### Features Implemented

#### Dynamic Form Rendering from JSON Schema
Forms are defined using a flexible JSON schema that supports:
- Multi-step forms with progress tracking
- Conditional field visibility
- Field validation rules
- Responsive layout (full, half, third, quarter width)

#### All Form Field Types
- **Text Fields**: `text`, `textarea`, `email`, `tel`, `number`
- **Date Fields**: `date` with date picker
- **Selection Fields**: `select`, `multiselect`, `radio`, `checkbox`, `switch`
- **File Fields**: `file` (single), `files` (multiple)
- **Composite Fields**: `address` (structured address), `country` (country selector)
- **Layout Fields**: `section`, `repeatable`, `divider`, `heading`, `paragraph`

#### Auto-Save Functionality
- Configurable auto-save interval (default: 30 seconds)
- Visual save status indicator
- Warning on page unload if unsaved changes exist
- Last saved timestamp display

#### Form Validation
Validation types supported:
- `required` - Field must have a value
- `email` - Valid email format
- `min`/`max` - Numeric range validation
- `minLength`/`maxLength` - String length validation
- `pattern` - Regular expression validation

#### Progress Tracking
- Overall progress percentage
- Per-section progress
- Section completion indicators
- Visual progress bar with step indicators

### Files Created
- `/src/components/forms/form-schema.ts` - Schema types and utilities
- `/src/components/forms/DynamicFormField.tsx` - Individual field component
- `/src/components/forms/DynamicForm.tsx` - Main form component
- `/src/app/user/applications/visa-189/page.tsx` - Example application page

---

## 3. Document Checklist

### Features Implemented

#### Document Requirement Checklists per Visa
- Predefined checklist templates per visa type
- Categorized requirements (identity, financial, etc.)
- Required vs optional document indicators

#### Upload Progress Tracking
- Visual progress indicators per category
- Overall completion percentage
- Missing documents summary

#### Document Guidelines
- Upload guidelines per document type
- Accepted file formats
- Maximum file size limits
- Maximum number of files

#### Document Templates/Examples
- Template downloads for standardized documents
- Example documents for reference
- Expiration tracking (documents valid for X days)

### Files Created
- `/src/components/forms/DocumentChecklist.tsx` - Checklist component

---

## 4. File Management

### Features Implemented

#### Better File Organization
- Automatic folder structure: `userId/category/timestamp_filename`
- Category-based filtering and grouping
- Search functionality
- Sort by date, name, or size

#### Bulk Upload Capability
- Drag and drop multiple files
- Progress tracking per file
- Category selection for batch uploads
- Shared with lawyer toggle for batches
- Individual file progress indicators

#### File Version Control
- Version history tracking
- Automatic versioning on re-upload
- Version restore functionality
- Version comparison view

#### Document Expiration Reminders
- Expiration date tracking
- "Expires soon" warnings (within 30 days)
- Expiration badges on documents
- Filter for expiring documents

### Database Schema

#### Tables Created
1. **documents** - Main document records
2. **document_versions** - Version history
3. **document_checklists** - Requirement definitions
4. **document_checklist_progress** - User progress tracking
5. **form_submissions** - Form submission data

#### Migration File
- `/supabase/migrations/20260319_document_management.sql`

---

## 5. Setup Instructions

### Step 1: Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `/supabase/migrations/20260319_document_management.sql`
3. Run the SQL script

### Step 2: Set Up Storage Bucket

Option A: Using Python Script
```bash
cd final_visaapp
pip install supabase python-dotenv
python scripts/setup-document-management.py
```

Option B: Manual Setup in Supabase Dashboard
1. Go to Storage → New Bucket
2. Name: `documents`
3. Check "Public bucket"
4. Set file size limit: 10MB
5. Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`

### Step 3: Update Environment Variables

Ensure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For setup script only
```

### Step 4: Install Dependencies

```bash
cd final_visaapp
npm install date-fns
```

### Step 5: Test Upload

1. Navigate to `/user/documents`
2. Try uploading a test PDF or image
3. Verify it appears in the Supabase Storage bucket
4. Check the database for the document record

---

## Usage Examples

### Using the Dynamic Form

```tsx
import DynamicForm from '@/components/forms/DynamicForm';
import { sampleVisaFormSchema } from '@/components/forms/form-schema';

function ApplicationPage() {
  return (
    <DynamicForm
      schema={sampleVisaFormSchema}
      onSubmit={async (submission) => {
        console.log(submission);
        // Handle submission
      }}
      onSave={async (data, progress) => {
        // Auto-save handler
      }}
    />
  );
}
```

### Using Document Checklist

```tsx
import DocumentChecklist, { generateSampleChecklist } from '@/components/forms/DocumentChecklist';

function ChecklistPage() {
  const items = generateSampleChecklist();
  
  return (
    <DocumentChecklist
      visaTypeName="Skilled Independent Visa"
      visaTypeCode="189"
      items={items}
      onUpload={(requirementId) => {
        // Handle upload
      }}
      onViewDocument={(docId) => {
        // View document
      }}
      overallProgress={65}
    />
  );
}
```

---

## API Reference

### Document Actions

All document operations are available in `/src/lib/actions/document-actions.ts`:

- `uploadDocument()` - Upload single document
- `uploadMultipleDocuments()` - Bulk upload
- `getUserDocuments()` - Get all user documents
- `getDocumentVersions()` - Get version history
- `uploadDocumentVersion()` - Upload new version
- `toggleSharedWithLawyer()` - Share/unshare with lawyer
- `updateDocumentStatus()` - Update document status
- `deleteDocument()` - Soft delete
- `permanentlyDeleteDocument()` - Hard delete
- `getDocumentStats()` - Get document statistics

---

## Security Considerations

1. **Row Level Security (RLS)** - All tables have RLS policies
2. **User Isolation** - Users can only access their own documents
3. **File Size Limits** - 10MB limit configured in storage bucket
4. **File Type Validation** - Only PDF and image files allowed
5. **Soft Deletes** - Documents are soft deleted by default

---

## Future Enhancements

- [ ] Document OCR for text extraction
- [ ] Automated document validation
- [ ] Integration with Docusign for e-signatures
- [ ] Document expiration email notifications
- [ ] Bulk download as ZIP
- [ ] Document tags and custom categories
