export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📐 Design Reference:{' '}
            <a href="/reference-designs/9c50ba82988c4c8884d27fa80abdf372.html" 
               target="_blank" 
               className="underline">
              View Stitch Design - User Dashboard
            </a>
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-6">Welcome back! 👋</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <a href="/visas" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">🛂</div>
            <h3 className="font-semibold">Browse Visas</h3>
            <p className="text-sm text-gray-600">Explore visa options</p>
          </a>
          <a href="/tracker" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold">Track Processing</h3>
            <p className="text-sm text-gray-600">Check processing times</p>
          </a>
          <a href="/lawyers" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="font-semibold">Find Lawyer</h3>
            <p className="text-sm text-gray-600">Get expert help</p>
          </a>
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">My Visa Applications</h2>
          </div>
          <div className="p-6">
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Skilled Independent (189)</h3>
                  <p className="text-sm text-gray-600">Purchased: Mar 15, 2026</p>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  60% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}\u003e</div>
              </div>
              <p className="text-sm text-gray-600 mb-3">Documents uploaded: 8/12</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Continue Application
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Upcoming Consultations</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">No consultations scheduled.</p>
            <a href="/lawyers" className="text-blue-600 hover:underline">
              Find a lawyer →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
