// Dashboard loading skeleton
export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-48 mt-2" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse mb-3" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            </div>
          ))}
        </div>

        {/* Applications Section Skeleton */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-48 mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                  </div>
                  <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-40 mb-3" />
                <div className="w-32 h-8 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Consultations Section Skeleton */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
