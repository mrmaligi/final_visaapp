export default function LawyerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            📐 Design: To be generated - Lawyer Dashboard
          </p>
        </div>
        <h1 className="text-3xl font-bold mb-6">Lawyer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Consultations', value: '12' },
            { label: 'Revenue', value: '$2,400' },
            { label: 'Rating', value: '4.8/5' },
            { label: 'Response Rate', value: '98%' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-lg shadow">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
