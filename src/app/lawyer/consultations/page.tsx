export default function LawyerConsultationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Consultations</h1>

        <div className="flex gap-4 mb-6">
          {['Upcoming', 'Today', 'Past', 'Cancelled'].map((tab) => (
            <button key={tab} className="px-4 py-2 bg-white rounded-lg shadow text-sm font-medium">
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">MC</div>
                <div>
                  <p className="font-semibold">Michael Chen</p>
                  <p className="text-sm text-gray-600">Skilled Independent (189)</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                In 2 hours
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">📅 Today, 2:00 PM AEDT • 1 hour</p>
              <p className="text-sm text-gray-600">💰 $200 • Documents shared: Yes</p>
            </div>

            <div className="flex gap-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Join Meeting
              </button>
              <button className="border px-4 py-2 rounded-lg">
                Prepare Notes
              </button>
              <button className="border px-4 py-2 rounded-lg">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
