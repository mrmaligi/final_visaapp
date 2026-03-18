export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            📐 Design Reference:{' '}
            <a href="/reference-designs/819cc0ab14684c3cbb4e62c73a777916.html" 
               target="_blank" 
               className="underline">
              View Stitch Design - News Listing
            </a>
          </p>
        </div>

        <h1 className="text-3xl font-bold mb-4">Immigration News & Updates</h1>
        <p className="text-gray-600 mb-8">Stay informed about Australian immigration policy changes</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <article key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <span className="text-xs font-semibold text-blue-600 uppercase">Policy Update</span>
                <h3 className="text-lg font-semibold mt-2 mb-2">New Visa Processing Changes Announced</h3>
                <p className="text-gray-600 text-sm mb-4">
                  The Department of Home Affairs has announced significant changes to visa processing...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Mar 18, 2026</span>
                  <a href="#" className="text-blue-600 hover:underline">Read more →</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
