"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
    toast.error("Failed to load dashboard");
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-6">We couldn&apos;t load your dashboard. Please try again.</p>
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-[#0052cc] text-white font-semibold rounded-lg hover:bg-[#0052cc]/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
