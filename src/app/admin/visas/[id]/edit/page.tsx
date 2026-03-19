'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  getVisaById,
  createVisa,
  updateVisa,
} from '@/lib/actions/admin-actions';
import {
  ArrowLeft,
  Save,
  FileText,
  DollarSign,
  CheckCircle,
  List,
  AlertCircle
} from 'lucide-react';

const visaCategories = [
  { value: 'family', label: 'Family' },
  { value: 'work', label: 'Work' },
  { value: 'student', label: 'Student' },
  { value: 'business', label: 'Business' },
  { value: 'visitor', label: 'Visitor' },
  { value: 'protection', label: 'Protection' },
];

interface VisaFormData {
  name: string;
  subclass: string;
  category: string;
  short_description: string;
  full_description: string;
  application_fee?: number;
  premium_price: number;
  official_link?: string;
  processing_time?: string;
  is_active: boolean;
  document_checklist?: string[];
  eligibility_criteria?: string[];
}

export default function VisaEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const isNew = id === 'new';
  const { addToast } = useToast();
  const { confirm, ConfirmDialogComponent } = useConfirmDialog();
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  const [visa, setVisa] = useState<VisaFormData>({
    name: '',
    subclass: '',
    category: 'work',
    short_description: '',
    full_description: '',
    application_fee: undefined,
    premium_price: 99,
    official_link: '',
    processing_time: '',
    is_active: true,
    document_checklist: [],
    eligibility_criteria: [],
  });

  const [newDocument, setNewDocument] = useState('');
  const [newCriteria, setNewCriteria] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      loadVisa();
    }
  }, [id, isNew]);

  const loadVisa = async () => {
    try {
      setLoading(true);
      const result = await getVisaById(id as string);
      
      if (result.error) {
        addToast(result.error, 'error');
        router.push('/admin/visas');
      } else if (result.data) {
        setVisa({
          name: result.data.name || '',
          subclass: result.data.subclass || '',
          category: result.data.category || 'work',
          short_description: result.data.short_description || '',
          full_description: result.data.full_description || '',
          application_fee: result.data.application_fee,
          premium_price: result.data.premium_price || 99,
          official_link: result.data.official_link || '',
          processing_time: result.data.processing_time || '',
          is_active: result.data.is_active ?? true,
          document_checklist: result.data.document_checklist || [],
          eligibility_criteria: result.data.eligibility_criteria || [],
        });
      }
    } catch (error) {
      addToast('Failed to load visa', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!visa.name || !visa.subclass) {
      addToast('Name and subclass are required', 'error');
      return;
    }

    try {
      setSaving(true);

      let result;
      if (isNew) {
        result = await createVisa(visa);
      } else {
        result = await updateVisa(id as string, visa);
      }

      if ('error' in result && result.error) {
        addToast(result.error, 'error');
      } else {
        addToast(isNew ? 'Visa created!' : 'Visa saved!', 'success');
        if (isNew && 'data' in result && result.data) {
          router.push(`/admin/visas/${result.data.id}/edit`);
        }
      }
    } catch (error) {
      addToast('Failed to save visa', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addDocument = () => {
    if (newDocument.trim()) {
      setVisa({
        ...visa,
        document_checklist: [...(visa.document_checklist || []), newDocument.trim()]
      });
      setNewDocument('');
    }
  };

  const removeDocument = (index: number) => {
    setVisa({
      ...visa,
      document_checklist: visa.document_checklist?.filter((_, i) => i !== index)
    });
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      setVisa({
        ...visa,
        eligibility_criteria: [...(visa.eligibility_criteria || []), newCriteria.trim()]
      });
      setNewCriteria('');
    }
  };

  const removeCriteria = (index: number) => {
    setVisa({
      ...visa,
      eligibility_criteria: visa.eligibility_criteria?.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ConfirmDialogComponent />
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/admin/visas"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Visas
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Visa'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visa Name *</label>
                  <input
                    type="text"
                    value={visa.name}
                    onChange={(e) => setVisa({ ...visa, name: e.target.value })}
                    placeholder="e.g., Skilled Independent Visa"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subclass *</label>
                  <input
                    type="text"
                    value={visa.subclass}
                    onChange={(e) => setVisa({ ...visa, subclass: e.target.value })}
                    placeholder="e.g., 189"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={visa.category}
                    onChange={(e) => setVisa({ ...visa, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {visaCategories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                  <input
                    type="text"
                    value={visa.short_description}
                    onChange={(e) => setVisa({ ...visa, short_description: e.target.value })}
                    placeholder="Brief description shown in visa listings..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                  <textarea
                    value={visa.full_description}
                    onChange={(e) => setVisa({ ...visa, full_description: e.target.value })}
                    placeholder="Detailed description of the visa..."
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Pricing and Details
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Premium Price ($)</label>
                  <input
                    type="number"
                    value={visa.premium_price}
                    onChange={(e) => setVisa({ ...visa, premium_price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Fee ($)</label>
                  <input
                    type="number"
                    value={visa.application_fee || ''}
                    onChange={(e) => setVisa({ ...visa, application_fee: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Government fee"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time</label>
                  <input
                    type="text"
                    value={visa.processing_time}
                    onChange={(e) => setVisa({ ...visa, processing_time: e.target.value })}
                    placeholder="e.g., 6-9 months"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Official Link</label>
                  <input
                    type="url"
                    value={visa.official_link}
                    onChange={(e) => setVisa({ ...visa, official_link: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-purple-600" />
                Document Checklist
              </h2>
              
              <div className="space-y-3">
                {(visa.document_checklist || []).map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{doc}</span>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDocument}
                    onChange={(e) => setNewDocument(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                    placeholder="Add a required document..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addDocument}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-amber-600" />
                Eligibility Criteria
              </h2>
              
              <div className="space-y-3">
                {(visa.eligibility_criteria || []).map((criteria, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>{criteria}</span>
                    <button
                      onClick={() => removeCriteria(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCriteria}
                    onChange={(e) => setNewCriteria(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCriteria())}
                    placeholder="Add an eligibility requirement..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addCriteria}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-sm text-gray-500">Status: </span>
                  <button
                    onClick={() => setVisa({ ...visa, is_active: !visa.is_active })}
                    className={visa.is_active ? 'text-green-600 font-medium' : 'text-gray-600 font-medium'}
                  >
                    {visa.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="w-4 h-4" />
                All changes are saved immediately when you click Save
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
