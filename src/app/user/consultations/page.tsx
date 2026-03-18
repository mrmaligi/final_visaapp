export default function ConsultationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Consultations</h1>
          <a href="/lawyers" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Book New Consultation
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['Upcoming', 'Past', 'Cancelled'].map((tab) => (
            <button key={tab} className="px-4 py-2 bg-white rounded-lg shadow text-sm font-medium">
              {tab}
            </button>
          ))}
        </div>

        {/* Consultation Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Sarah Williams</h3>
                  <p className="text-gray-600">Immigration Lawyer • 12 years experience</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-sm text-gray-600">(48 reviews)</span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">Mar 25, 2026</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">10:00 AM AEDT</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">1 hour</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold">$200</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Join Meeting
            </button>
            <button className="border px-4 py-2 rounded-lg">
              Reschedule
            </button>
            <button className="border px-4 py-2 rounded-lg text-red-600">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
