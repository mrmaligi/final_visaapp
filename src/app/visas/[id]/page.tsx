export default function VisaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📐 Design Reference:{' '}
            <a href="/reference-designs/b559c17b315c4687a73afbf3439ca761.html" 
               target="_blank" 
               className="underline">
              View Stitch Design - Visa Detail
            </a>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              Subclass {params.id}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Visa Details</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Processing Time</p>
              <p className="text-xl font-semibold">8-12 Months</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Application Fee</p>
              <p className="text-xl font-semibold">From $4,640</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-xl font-semibold">92%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
