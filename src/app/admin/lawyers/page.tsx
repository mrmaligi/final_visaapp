export default function AdminLawyersPage() {
  const lawyers = [
    { name: 'John Smith', email: 'john@lawfirm.com', status: 'Approved', consultations: 45, rating: 4.8 },
    { name: 'Sarah Williams', email: 'sarah@immigration.com', status: 'Approved', consultations: 127, rating: 4.9 },
    { name: 'Mike Chen', email: 'mike@law.com', status: 'Pending', consultations: 0, rating: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Lawyer Management</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {['All Lawyers', 'Pending Verification', 'Approved', 'Rejected'].map((tab) => (
            <button key={tab} className="px-4 py-2 bg-white rounded-lg shadow text-sm font-medium">
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Consultations</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {lawyers.map((lawyer, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{lawyer.name}</p>
                    <p className="text-sm text-gray-600">{lawyer.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      lawyer.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lawyer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{lawyer.consultations}</td>
                  <td className="px-6 py-4">{lawyer.rating > 0 ? `${lawyer.rating}/5` : '-'}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
