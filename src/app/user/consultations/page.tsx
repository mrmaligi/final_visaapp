'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar,
  Clock,
  Video,
  Star,
  ChevronRight,
  X,
  MessageSquare,
  RefreshCw,
  MoreVertical,
  User,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

type FilterTab = 'upcoming' | 'past' | 'cancelled';

interface Consultation {
  id: string;
  lawyerName: string;
  lawyerImage?: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetingLink?: string;
  price: number;
  review?: {
    rating: number;
    comment: string;
  };
}

export default function UserConsultationsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('upcoming');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Mock data
  const consultations: Consultation[] = [
    {
      id: '1',
      lawyerName: 'Sarah Mitchell',
      date: '2026-03-25',
      time: '14:00',
      duration: 60,
      status: 'upcoming',
      meetingLink: 'https://meet.visaflow.com/abc123',
      price: 200
    },
    {
      id: '2',
      lawyerName: 'James Chen',
      date: '2026-03-10',
      time: '10:30',
      duration: 30,
      status: 'completed',
      price: 150,
      review: {
        rating: 5,
        comment: 'Very helpful and knowledgeable. Highly recommended!'
      }
    },
    {
      id: '3',
      lawyerName: 'Emma Rodriguez',
      date: '2026-02-28',
      time: '15:00',
      duration: 60,
      status: 'cancelled',
      price: 250
    }
  ];

  const filteredConsultations = consultations.filter(c => {
    if (activeFilter === 'upcoming') return c.status === 'upcoming';
    if (activeFilter === 'past') return c.status === 'completed';
    if (activeFilter === 'cancelled') return c.status === 'cancelled';
    return true;
  });

  const handleReviewSubmit = () => {
    console.log('Submitting review:', { rating: reviewRating, comment: reviewComment });
    setReviewModalOpen(false);
    setReviewRating(0);
    setReviewComment('');
  };

  const handleReschedule = () => {
    console.log('Rescheduling consultation:', selectedConsultation?.id);
    setRescheduleModalOpen(false);
  };

  const handleCancel = () => {
    console.log('Cancelling consultation:', selectedConsultation?.id);
    setCancelModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5" />
            Upcoming
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRate?.(star)}
            className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'}`}
          >
            <Star 
              className={`w-5 h-5 ${
                star <= rating 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/user/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Consultations</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Consultations</h1>
              <p className="text-slate-600 mt-1">Manage your appointments with immigration lawyers</p>
            </div>
            <Link
              href="/lawyers"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book New Consultation
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
          <div className="flex gap-2">
            {(['upcoming', 'past', 'cancelled'] as FilterTab[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {consultations.filter(c => {
                    if (filter === 'upcoming') return c.status === 'upcoming';
                    if (filter === 'past') return c.status === 'completed';
                    return c.status === 'cancelled';
                  }).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {filteredConsultations.length > 0 ? (
            filteredConsultations.map((consultation) => (
              <div 
                key={consultation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-slate-900">{consultation.lawyerName}</h3>
                        {getStatusBadge(consultation.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(consultation.date).toLocaleDateString('en-AU', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{consultation.time} ({consultation.duration} min)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {consultation.status === 'upcoming' && (
                      <>
                        <a
                          href={consultation.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Meeting
                        </a>
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setRescheduleModalOpen(true);
                          }}
                          className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Reschedule"
                        >
                          <RefreshCw className="w-5 h-5 text-slate-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setCancelModalOpen(true);
                          }}
                          className="p-2.5 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </>
                    )}

                    {consultation.status === 'completed' && (
                      <>
                        {consultation.review ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-slate-900">{consultation.review.rating}</span>
                            </div>
                            <p className="text-sm text-slate-600 max-w-xs truncate">&quot;{consultation.review.comment}&quot;</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedConsultation(consultation);
                              setReviewModalOpen(true);
                            }}
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Write Review
                          </button>
                        )}
                      </>
                    )}

                    {consultation.status === 'cancelled' && (
                      <Link
                        href={`/lawyers`}
                        className="inline-flex items-center px-5 py-2.5 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Book Again
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No {activeFilter} consultations
              </h3>
              <p className="text-slate-600 mb-6">
                {activeFilter === 'upcoming' 
                  ? 'Book a consultation with an immigration lawyer to get started'
                  : activeFilter === 'past'
                    ? 'You haven\'t completed any consultations yet'
                    : 'No cancelled consultations'
                }
              </p>
              {activeFilter === 'upcoming' && (
                <Link
                  href="/lawyers"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Find a Lawyer
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Write a Review</h2>
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">How was your consultation with {selectedConsultation?.lawyerName}?</p>
              <div className="flex justify-center">
                {renderStars(reviewRating, true, setReviewRating)}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={reviewRating === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Reschedule Consultation</h2>
              <button 
                onClick={() => setRescheduleModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <p className="text-slate-600 mb-6">
              Select a new date and time for your consultation with {selectedConsultation?.lawyerName}.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Time</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select a time slot...</option>
                  <option>09:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>02:00 PM</option>
                  <option>03:00 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Cancel Consultation</h2>
              <button 
                onClick={() => setCancelModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-red-50 rounded-xl">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Are you sure?</p>
                <p className="text-sm text-red-700">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-slate-600 mb-6">
              You are about to cancel your consultation with {selectedConsultation?.lawyerName} scheduled for {' '}
              {selectedConsultation && new Date(selectedConsultation.date).toLocaleDateString('en-AU', { 
                day: 'numeric', 
                month: 'long' 
              })} at {selectedConsultation?.time}.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">
                <strong>Refund Policy:</strong> Cancellations made 24 hours before the scheduled time are eligible for a full refund.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-slate-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Consultation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
