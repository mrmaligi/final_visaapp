export default function TrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Visa Processing Time Tracker</h1>
        <p className="text-gray-600 mb-8">Community-reported processing times for Australian visas</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold">5,432</p>
            <p className="text-gray-600">Total data points</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold">8.5 months</p>
            <p className="text-gray-600">Average processing time</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-3xl font-bold">2 hours</p>
            <p className="text-gray-600">Most recent entry</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <input 
              type="text" 
              placeholder="Search by visa name or subclass..."
              className="w-full md:w-96 px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="p-4">
            <p className="text-gray-600">Processing time data table will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
