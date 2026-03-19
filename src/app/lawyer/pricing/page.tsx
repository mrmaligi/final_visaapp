'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ArrowLeft, 
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

interface PricingEntry {
  id?: string;
  visa_type: string;
  duration_30_price: number;
  duration_60_price: number;
  duration_90_price: number;
}

const visaTypes = [
  { value: 'skilled', label: 'Skilled Migration (189/190/491)' },
  { value: 'partner', label: 'Partner Visa (820/801)' },
  { value: 'student', label: 'Student Visa (500)' },
  { value: 'business', label: 'Business Visa' },
  { value: 'visitor', label: 'Visitor Visa (600)' },
  { value: 'other', label: 'Other' }
];

const defaultPricing: PricingEntry = {
  visa_type: '',
  duration_30_price: 150,
  duration_60_price: 250,
  duration_90_price: 350,
};

export default function LawyerPricingPage() {
  const { user } = useAuth();
  const [pricing, setPricing] = useState<PricingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lawyerId, setLawyerId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLawyerProfile();
    }
  }, [user]);

  const fetchLawyerProfile = async () => {
    try {
      const response = await fetch(`/api/lawyers/profile?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setLawyerId(data.lawyer.id);
        fetchPricing(data.lawyer.id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setIsLoading(false);
    }
  };

  const fetchPricing = async (id: string) => {
    try {
      const response = await fetch(`/api/lawyers/pricing?lawyerId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setPricing(data.pricing || []);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing');
    } finally {
      setIsLoading(false);
    }
  };

  const addPricingEntry = () => {
    const availableVisaTypes = visaTypes.filter(
      visa => !pricing.some(p => p.visa_type === visa.value)
    );

    if (availableVisaTypes.length === 0) {
      toast.error('You have already set pricing for all visa types');
      return;
    }

    setPricing([...pricing, { ...defaultPricing, visa_type: availableVisaTypes[0].value }]);
  };

  const removePricingEntry = (index: number) => {
    setPricing(pricing.filter((_, i) => i !== index));
  };

  const updatePricingEntry = (index: number, field: keyof PricingEntry, value: string | number) => {
    const updated = [...pricing];
    updated[index] = { ...updated[index], [field]: value };
    setPricing(updated);
  };

  const handleSave = async () => {
    if (!lawyerId) {
      toast.error('Lawyer profile not found');
      return;
    }

    setIsSaving(true);

    try {
      // Save each pricing entry
      for (const entry of pricing) {
        const response = await fetch('/api/lawyers/pricing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lawyerId,
            visaType: entry.visa_type,
            duration30Price: entry.duration_30_price,
            duration60Price: entry.duration_60_price,
            duration90Price: entry.duration_90_price,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save pricing');
        }
      }

      toast.success('Pricing saved successfully');
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading pricing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/lawyer/dashboard"
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Manage Pricing</h1>
          <p className="text-slate-600 mt-2">Set your consultation fees for different visa types.</p>
        </div>

        {/* Pricing Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Consultation Fees</h2>
              <button
                onClick={addPricingEntry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Pricing
              </button>
            </div>
          </div>

          {pricing.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Pricing Set</h3>
              <p className="text-slate-600 mb-4">Add pricing for different visa types to start receiving bookings.</p>
              <button
                onClick={addPricingEntry}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Pricing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pricing.map((entry, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Visa Type
                        </label>
                        <select
                          value={entry.visa_type}
                          onChange={(e) => updatePricingEntry(index, 'visa_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {visaTypes.map((visa) => (
                            <option 
                              key={visa.value} 
                              value={visa.value}
                              disabled={pricing.some((p, i) => i !== index && p.visa_type === visa.value)}
                            >
                              {visa.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          30 min ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={entry.duration_30_price}
                          onChange={(e) => updatePricingEntry(index, 'duration_30_price', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          60 min ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={entry.duration_60_price}
                          onChange={(e) => updatePricingEntry(index, 'duration_60_price', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          90 min ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={entry.duration_90_price}
                          onChange={(e) => updatePricingEntry(index, 'duration_90_price', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removePricingEntry(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove pricing"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pricing.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <p>Platform fee: 15% deducted from each consultation</p>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Pricing
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Pricing Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Set competitive rates based on your experience</li>
              <li>• Consider visa complexity when pricing</li>
              <li>• Offer discounts for longer consultations</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-6 h-6 text-green-600" />
              <h3 className="font-semibold text-green-900">Availability</h3>
            </div>
            <p className="text-sm text-green-700">
              Make sure to keep your calendar updated. Clients can only book during your available time slots.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
