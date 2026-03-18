export default function TrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Visa Processing Time Tracker</h1>
        <p className="text-gray-600 mb-8">Community-reported processing times for Australian visas</p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-blue-600">5,432</p>
            <p className="text-gray-600">Total data points</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-blue-600">8.5 months</p>
            <p className="text-gray-600">Average processing time</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold text-blue-600">2 hours</p>
            <p className="text-gray-600">Most recent entry</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <input 
              type="text" 
              placeholder="Search by visa name..."
              className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg"
            />
            <select className="px-4 py-2 border rounded-lg">
              <option>All Categories</option>
              <option>Skilled Migration</option>
              <option>Family</option>
              <option>Student</option>
            </select>
            <select className="px-4 py-2 border rounded-lg">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Refused</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Visa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Lodged</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Decision</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Processing Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { visa: 'Skilled Independent (189)', lodged: 'Jan 15, 2024', decision: 'Sep 20, 2024', time: '8 months', outcome: 'Approved' },
                { visa: 'Partner Visa (820)', lodged: 'Mar 10, 2024', decision: 'Nov 5, 2024', time: '8 months', outcome: 'Approved' },
                { visa: 'Student Visa (500)', lodged: 'Jun 1, 2024', decision: 'Jul 15, 2024', time: '1.5 months', outcome: 'Approved' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{row.visa}</td>
                  <td className="px-6 py-4">{row.lodged}</td>
                  <td className="px-6 py-4">{row.decision}</td>
                  <td className="px-6 py-4 font-medium">{row.time}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {row.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Help the Community</h3>
          <p className="text-gray-600 mb-4">Share your visa processing experience to help others</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Add Your Data
          </button>
        </div>
      </div>
    </div>
  );
}
