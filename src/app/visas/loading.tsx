// Visa list loading skeleton
export default function VisasLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mb-4" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-96" />
        </div>

        {/* Search & Filter Skeleton */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
