'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Clock,
  Calendar,
  CreditCard,
  User,
  FileText,
  Shield,
  Star,
  MessageSquare
} from 'lucide-react';

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingData {
  visaType: string;
  duration: number;
  date: string;
  time: string;
  notes: string;
}

export default function LawyerBookingPage() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    visaType: '',
    duration: 30,
    date: '',
    time: '',
    notes: ''
  });

  // Mock lawyer data
  const lawyer = {
    id: id as string,
    name: 'Sarah Mitchell',
    title: 'Senior Immigration Lawyer',
    rating: 4.9,
    reviews: 127,
    image: null,
    prices: {
      30: 150,
      60: 250,
      90: 350
    }
  };

  const visaTypes = [
    { value: 'skilled', label: 'Skilled Migration (189/190/491)' },
    { value: 'partner', label: 'Partner Visa (820/801)' },
    { value: 'student', label: 'Student Visa (500)' },
    { value: 'business', label: 'Business Visa' },
    { value: 'visitor', label: 'Visitor Visa (600)' },
    { value: 'other', label: 'Other' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as BookingStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as BookingStep);
    }
  };

  const updateBookingData = (field: keyof BookingData, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!bookingData.visaType;
      case 2: return !!bookingData.duration;
      case 3: return !!bookingData.date && !!bookingData.time;
      case 4: return true;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/lawyers/${id}`}
            className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Lawyer Profile
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">Book Consultation</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div className={`w-16 md:w-24 h-1 mx-2 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-600">Visa</span>
            <span className="text-xs text-slate-600">Duration</span>
            <span className="text-xs text-slate-600">Date/Time</span>
            <span className="text-xs text-slate-600">Details</span>
            <span className="text-xs text-slate-600">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* Step 1: Select Visa */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Select Your Visa Type</h2>
                  <p className="text-slate-600">What type of visa do you need help with?</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visaTypes.map((visa) => (
                      <button
                        key={visa.value}
                        onClick={() => updateBookingData('visaType', visa.value)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          bookingData.visaType === visa.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            bookingData.visaType === visa.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {bookingData.visaType === visa.value && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className="font-medium text-slate-900">{visa.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Duration */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Select Consultation Duration</h2>
                  <p className="text-slate-600">How long do you need for your consultation?</p>

                  <div className="space-y-4">
                    {[
                      { duration: 30, label: '30 Minutes', description: 'Quick questions and guidance' },
                      { duration: 60, label: '60 Minutes', description: 'Detailed consultation and advice' },
                      { duration: 90, label: '90 Minutes', description: 'Comprehensive case review' }
                    ].map((option) => (
                      <button
                        key={option.duration}
                        onClick={() => updateBookingData('duration', option.duration)}
                        className={`w-full p-4 border-2 rounded-xl text-left transition-all ${
                          bookingData.duration === option.duration
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              bookingData.duration === option.duration
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {bookingData.duration === option.duration && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{option.label}</p>
                              <p className="text-sm text-slate-600">{option.description}</p>
                            </div>
                          </div>
                          <span className="text-xl font-bold text-slate-900">${lawyer.prices[option.duration as keyof typeof lawyer.prices]}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Select Date & Time</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => updateBookingData('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Time</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => updateBookingData('time', time)}
                          className={`p-3 border-2 rounded-lg text-center transition-all ${
                            bookingData.time === time
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Details */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Consultation Details</h2>
                  
                  <p className="text-slate-600">Tell us more about your situation so the lawyer can prepare.</p>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => updateBookingData('notes', e.target.value)}
                      placeholder="Describe your situation, questions, or concerns..."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-sm text-slate-500 mt-2">This information will be shared with {lawyer.name} before your consultation.</p>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900">Payment</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Secure Payment</span>
                    </div>
                    <p className="text-sm text-blue-700">Your payment is protected and secure.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name on Card</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                {currentStep === 5 ? (
                  <Link
                    href={`/user/consultations/123/success`}
                    className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay & Book
                  </Link>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h3 className="font-semibold text-slate-900 mb-4">Booking Summary</h3>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{lawyer.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-slate-600">{lawyer.rating} ({lawyer.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {bookingData.visaType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Visa Type</span>
                    <span className="text-slate-900">{visaTypes.find(v => v.value === bookingData.visaType)?.label}</span>
                  </div>
                )}
                {bookingData.duration && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Duration</span>
                    <span className="text-slate-900">{bookingData.duration} minutes</span>
                  </div>
                )}
                {bookingData.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Date</span>
                    <span className="text-slate-900">{new Date(bookingData.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                  </div>
                )}
                {bookingData.time && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Time</span>
                    <span className="text-slate-900">{bookingData.time}</span>
                  </div>
                )}
              </div>

              {bookingData.duration > 0 && (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-slate-900">Total</span>
                      <span className="text-slate-900">${lawyer.prices[bookingData.duration as keyof typeof lawyer.prices]}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
