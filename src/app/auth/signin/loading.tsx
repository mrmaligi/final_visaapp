// Auth loading skeleton
export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4 p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-6" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mb-8" />
          <div className="w-full space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
