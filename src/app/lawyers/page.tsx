export default function LawyersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📐 Design Reference:{' '}
            <a href="/reference-designs/de6619c7e17a4fb4b0ce55447b5f23d7.html" 
               target="_blank" 
               className="underline">
              View Stitch Design - Lawyers Directory
            </a>
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-4">Find Immigration Lawyers</h1>
        <p className="text-gray-600 mb-8">Connect with verified Australian immigration lawyers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <h3 className="text-lg font-semibold">Lawyer Name</h3>
              <p className="text-sm text-gray-600 mb-2">Immigration Specialist</p>
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>
              <p className="text-lg font-semibold text-blue-600 mb-3">$200/hour</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Book Consultation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
