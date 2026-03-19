# Document Management Setup Script
# This script helps set up Supabase Storage and test document uploads

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    print("❌ Error: Supabase credentials not found in environment variables")
    print("Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set")
    sys.exit(1)

try:
    from supabase import create_client
    
    # Create Supabase client
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY)
    print("✅ Connected to Supabase")
    
except ImportError:
    print("❌ Error: supabase package not installed")
    print("Run: pip install supabase")
    sys.exit(1)


def setup_storage_bucket():
    """Set up the documents storage bucket"""
    print("\n📦 Setting up storage bucket...")
    
    try:
        # Check if bucket exists
        buckets = supabase.storage.list_buckets()
        bucket_names = [b.name for b in buckets]
        
        if 'documents' in bucket_names:
            print("✅ Documents bucket already exists")
        else:
            # Create bucket
            supabase.storage.create_bucket(
                'documents',
                options={
                    'public': True,
                    'file_size_limit': 10485760,  # 10MB
                    'allowed_mime_types': [
                        'application/pdf',
                        'image/jpeg',
                        'image/png',
                        'image/jpg'
                    ]
                }
            )
            print("✅ Created 'documents' bucket")
        
        return True
        
    except Exception as e:
        print(f"❌ Error setting up storage bucket: {e}")
        return False


def test_document_upload():
    """Test uploading a document"""
    print("\n📝 Testing document upload...")
    
    try:
        # Create a sample text file
        sample_content = b"This is a test document for visa application."
        file_path = "/tmp/test_document.txt"
        
        with open(file_path, 'wb') as f:
            f.write(sample_content)
        
        # Upload to Supabase Storage
        timestamp = int(datetime.now().timestamp())
        storage_path = f"test-user/test-category/{timestamp}_test_document.txt"
        
        with open(file_path, 'rb') as f:
            result = supabase.storage.from_('documents').upload(
                storage_path,
                f,
                {'content-type': 'text/plain'}
            )
        
        print(f"✅ Uploaded test document to: {storage_path}")
        
        # Get public URL
        public_url = supabase.storage.from_('documents').get_public_url(storage_path)
        print(f"✅ Public URL: {public_url}")
        
        # Clean up
        os.remove(file_path)
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing document upload: {e}")
        return False


def test_database_tables():
    """Test database tables"""
    print("\n🗄️ Testing database tables...")
    
    tables = [
        'documents',
        'document_versions',
        'document_checklists',
        'document_checklist_progress',
        'form_submissions'
    ]
    
    for table in tables:
        try:
            result = supabase.table(table).select('*').limit(1).execute()
            print(f"✅ Table '{table}' exists and is accessible")
        except Exception as e:
            print(f"⚠️ Table '{table}': {e}")


def create_sample_checklist():
    """Create sample document checklist for a visa type"""
    print("\n📋 Creating sample document checklist...")
    
    try:
        # First, get a visa type ID
        visa_types = supabase.table('visa_types').select('id').limit(1).execute()
        
        if not visa_types.data:
            print("⚠️ No visa types found. Please create a visa type first.")
            return
        
        visa_type_id = visa_types.data[0]['id']
        
        # Check if checklist already exists
        existing = supabase.table('document_checklists').select('*').eq('visa_type_id', visa_type_id).execute()
        
        if existing.data:
            print(f"✅ Checklist already exists for visa type {visa_type_id}")
            return
        
        # Create checklist items
        checklist_items = [
            {
                'visa_type_id': visa_type_id,
                'name': 'Passport',
                'description': 'Current passport bio-data page',
                'required': True,
                'category': 'identity',
                'guidelines': [
                    'Must be valid for at least 6 months',
                    'All pages must be clearly visible',
                    'Scan must be in color'
                ],
                'max_file_size': 10485760,
                'max_files': 1,
                'sort_order': 1
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Birth Certificate',
                'description': 'Full birth certificate or family book',
                'required': True,
                'category': 'identity',
                'guidelines': ['Certified copy preferred'],
                'max_file_size': 10485760,
                'max_files': 1,
                'sort_order': 2
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Bank Statements',
                'description': 'Last 3 months of bank statements',
                'required': True,
                'category': 'financial',
                'guidelines': [
                    'Must show account holder name',
                    'Must show regular transactions',
                    'Official bank documents only'
                ],
                'max_file_size': 10485760,
                'max_files': 3,
                'sort_order': 3
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Employment Contract',
                'description': 'Current employment contract or letter',
                'required': True,
                'category': 'employment',
                'guidelines': [
                    'Must be on company letterhead',
                    'Must include salary details'
                ],
                'max_file_size': 10485760,
                'max_files': 1,
                'sort_order': 4
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Payslips',
                'description': 'Last 3 months of payslips',
                'required': True,
                'category': 'employment',
                'guidelines': ['PDF preferred'],
                'max_file_size': 10485760,
                'max_files': 3,
                'sort_order': 5
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Degree Certificate',
                'description': 'Highest qualification certificate',
                'required': True,
                'category': 'education',
                'guidelines': [
                    'Must show institution name',
                    'Must show completion date',
                    'Certified copies preferred'
                ],
                'max_file_size': 10485760,
                'max_files': 1,
                'sort_order': 6
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Academic Transcripts',
                'description': 'Academic records showing subjects and grades',
                'required': True,
                'category': 'education',
                'guidelines': ['Official transcripts only'],
                'max_file_size': 10485760,
                'max_files': 5,
                'sort_order': 7
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'English Test Results',
                'description': 'IELTS, PTE, or equivalent test results',
                'required': False,
                'category': 'other',
                'guidelines': ['Must be valid (typically 2-3 years)'],
                'max_file_size': 10485760,
                'max_files': 1,
                'expires_after_days': 1095,  # 3 years
                'sort_order': 8
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Police Clearance',
                'description': 'National police check from all countries lived in',
                'required': True,
                'category': 'character',
                'guidelines': ['Must be less than 12 months old'],
                'max_file_size': 10485760,
                'max_files': 5,
                'expires_after_days': 365,
                'sort_order': 9
            },
            {
                'visa_type_id': visa_type_id,
                'name': 'Medical Examination',
                'description': 'Health examination by approved panel physician',
                'required': True,
                'category': 'health',
                'guidelines': ['Must be completed by approved panel physician'],
                'max_file_size': 10485760,
                'max_files': 1,
                'expires_after_days': 365,
                'sort_order': 10
            }
        ]
        
        for item in checklist_items:
            supabase.table('document_checklists').insert(item).execute()
        
        print(f"✅ Created {len(checklist_items)} checklist items")
        
    except Exception as e:
        print(f"❌ Error creating checklist: {e}")


def main():
    """Main setup function"""
    print("=" * 60)
    print("🚀 Document Management Setup")
    print("=" * 60)
    
    # Setup storage
    if setup_storage_bucket():
        test_document_upload()
    
    # Test database
    test_database_tables()
    
    # Create sample data
    create_sample_checklist()
    
    print("\n" + "=" * 60)
    print("✅ Setup complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
