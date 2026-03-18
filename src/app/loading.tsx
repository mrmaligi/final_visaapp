// Loading skeleton for the home page
export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="h-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="w-20 h-10 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-20 h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="h-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-16 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="flex gap-4 pt-4">
              <div className="w-40 h-14 bg-gray-200 rounded-lg animate-pulse" />
              <div className="w-40 h-14 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="aspect-[4/3] bg-gray-200 rounded-3xl animate-pulse" />
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mx-auto" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-2xl border border-gray-200 bg-white">
                <div className="w-14 h-14 bg-gray-200 rounded-xl mb-6 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Skeleton */}
      <div className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-700 rounded animate-pulse w-24" />
                <div className="h-4 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-4/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
