export default function UserDocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800">
            📐 Design: To be generated - Documents Management
          </p>
        </div>
        <h1 className="text-3xl font-bold mb-6">My Documents</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6">
          Upload Document
        </button>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No documents uploaded yet.</p>
        </div>
      </div>
    </div>
  );
}
