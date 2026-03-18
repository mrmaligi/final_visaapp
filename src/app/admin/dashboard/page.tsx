export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📐 Design Reference:{' '}
            <a href="/reference-designs/3c7198d28b854150b60e2e452e38c348.html" 
               target="_blank" 
               className="underline">
              View Stitch Design - Admin Dashboard
            </a>
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '1,247' },
            { label: 'Total Lawyers', value: '56' },
            { label: 'Purchases', value: '3,421' },
            { label: 'Consultations', value: '892' },
            { label: 'Revenue', value: '$67,829' },
            { label: 'Active Issues', value: '3' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-4 rounded-lg shadow">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">Action Required</h3>
          <ul className="list-disc list-inside text-amber-700">
            <li>5 Lawyer applications awaiting verification</li>
            <li>2 Flagged reviews need moderation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
