'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle, 
  Calendar,
  Clock,
  Video,
  User,
  Mail,
  CalendarDays,
  ArrowRight,
  FileText
} from 'lucide-react';

export default function ConsultationSuccessPage() {
  const { id } = useParams();

  // Mock booking data - replace with actual data from API
  const booking = {
    id: 'CONS-2026-005678',
    lawyerName: 'Sarah Mitchell',
    lawyerTitle: 'Senior Immigration Lawyer',
    date: '2026-03-25',
    time: '14:00',
    duration: 60,
    amount: 250,
    meetingLink: 'https://meet.visaflow.com/abc123',
    visaType: 'Skilled Independent (189)',
    notes: 'Questions about points calculation and skills assessment'
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const addToCalendar = () => {
    // Generate calendar event
    const startTime = new Date(`${booking.date}T${booking.time}`);
    const endTime = new Date(startTime.getTime() + booking.duration * 60000);
    
    const event = {
      title: `Visa Consultation with ${booking.lawyerName}`,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      description: `Consultation regarding ${booking.visaType}. Meeting link: ${booking.meetingLink}`,
    };

    console.log('Adding to calendar:', event);
    alert('Calendar event created! Check your email for the invitation.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-blue-100">Your consultation has been scheduled successfully</p>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <span className="text-slate-600">Booking ID</span>
                <span className="font-mono font-medium text-slate-900">{booking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Amount Paid</span>
                <span className="text-xl font-bold text-slate-900">${booking.amount}</span>
              </div>
            </div>

            {/* Lawyer Details */}
            <div className="border border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{booking.lawyerName}</h2>
                  <p className="text-slate-600">{booking.lawyerTitle}</p>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Date</p>
                  <p className="font-medium text-slate-900">{formatDate(booking.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Time</p>
                  <p className="font-medium text-slate-900">{booking.time} ({booking.duration} minutes)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Meeting Link</p>
                  <p className="font-medium text-slate-900 truncate">{booking.meetingLink}</p>
                </div>
              </div>
            </div>

            {/* Consultation Notes */}
            <div className="border border-gray-200 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-slate-900 mb-2">Consultation Topic</h3>
              <p className="text-slate-600">{booking.visaType}</p>
              {booking.notes && (
                <>
                  <p className="text-sm text-slate-500 mt-2">Notes: {booking.notes}</p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={addToCalendar}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <CalendarDays className="w-5 h-5" />
                Add to Calendar
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/user/consultations"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  My Consultations
                </Link>
                <Link
                  href="/user/dashboard"
                  className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-800">
                A confirmation email with meeting details has been sent to your registered email address.
              </p>
            </div>

            {/* Reminder */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
              <h4 className="font-medium text-yellow-900 mb-2">What to Prepare</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Have your passport and visa documents ready</li>
                <li>• Prepare a list of questions you want to ask</li>
                <li>• Test your audio and video before the meeting</li>
                <li>• Join the meeting 5 minutes early</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 mb-4">Need to reschedule or have questions?</p>
          <Link
            href="/user/consultations"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Manage your consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
