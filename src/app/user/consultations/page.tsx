export default function UserConsultationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            📐 Design: To be generated - Consultations History
          </p>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Consultations</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No consultations scheduled yet.</p>
          <a href="/lawyers" className="text-blue-600 hover:underline mt-4 inline-block">
            Find a lawyer →
          </a>
        </div>
      </div>
    </div>
  );
}
