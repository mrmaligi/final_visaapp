export default function VisasPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Visa Categories</h1>
        <p className="text-gray-600 mb-8">Browse all Australian visa categories</p>
        
        {/* Reference: 79bc425b300d471690192c41c72cd5ad.html */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📐 Design Reference:{' '}
            <a href="/reference-designs/79bc425b300d471690192c41c72cd5ad.html" 
               target="_blank" 
               className="underline">
              View Stitch Design
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Visa Category Cards - To be implemented */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Skilled Migration</h3>
            <p className="text-gray-600 text-sm">For skilled workers and professionals</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Family Visas</h3>
            <p className="text-gray-600 text-sm">Partner, parent, and family sponsorship</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Student Visas</h3>
            <p className="text-gray-600 text-sm">Study in Australia</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Business Visas</h3>
            <p className="text-gray-600 text-sm">Investors and business owners</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Visitor Visas</h3>
            <p className="text-gray-600 text-sm">Tourist and short-term visits</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Work Visas</h3>
            <p className="text-gray-600 text-sm">Employer sponsored visas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
