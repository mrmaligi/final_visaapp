export default function DocumentsPage() {
  const documents = [
    { name: 'Passport_Bio.pdf', category: 'Identity', visa: 'Skilled Independent (189)', size: '2.4 MB', date: 'Mar 16, 2026' },
    { name: 'Birth_Certificate.pdf', category: 'Identity', visa: 'Skilled Independent (189)', size: '1.1 MB', date: 'Mar 15, 2026' },
    { name: 'Police_Check.pdf', category: 'Character', visa: 'Skilled Independent (189)', size: '856 KB', date: 'Mar 14, 2026' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Documents</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border rounded-lg">
              <option>All Visas</option>
              <option>Skilled Independent (189)</option>
            </select>
            <select className="px-4 py-2 border rounded-lg">
              <option>All Categories</option>
              <option>Identity</option>
              <option>Character</option>
              <option>Evidence</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xs">PDF</span>
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.visa}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{doc.category}</span>
                    <span className="text-xs text-gray-500">{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{doc.date}</span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">👁️</button>
                  <button className="p-2 hover:bg-gray-100 rounded">⬇️</button>
                  <button className="p-2 hover:bg-gray-100 rounded">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
