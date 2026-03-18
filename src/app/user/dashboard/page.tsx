"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { getUserApplications, getUserConsultations } from "@/lib/actions/visa-actions";

import { VisaPurchase, Consultation } from "@/lib/actions/visa-actions";

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<VisaPurchase[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;

      try {
        const [appsResult, consultsResult] = await Promise.all([
          getUserApplications(user.id),
          getUserConsultations(user.id),
        ]);

        if (appsResult.error) {
          toast.error("Failed to load applications");
          console.error(appsResult.error);
        } else {
          setApplications(appsResult.data || []);
        }

        if (consultsResult.error) {
          toast.error("Failed to load consultations");
          console.error(consultsResult.error);
        } else {
          setConsultations(consultsResult.data || []);
        }
      } catch (error) {
        toast.error("An error occurred while loading your dashboard");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-[#0052cc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "there"}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here&apos;s what&apos;s happening with your visa applications.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/visas" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🛂</div>
            <h3 className="font-semibold text-gray-900">Browse Visas</h3>
            <p className="text-sm text-gray-600 mt-1">Explore visa options</p>
          </Link>
          <Link href="/tracker" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900">Track Processing</h3>
            <p className="text-sm text-gray-600 mt-1">Check processing times</p>
          </Link>
          <Link href="/lawyers" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="font-semibold text-gray-900">Find Lawyer</h3>
            <p className="text-sm text-gray-600 mt-1">Get expert help</p>
          </Link>
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Visa Applications</h2>
            <Link href="/user/visas" className="text-[#0052cc] font-medium hover:underline">
              View All
            </Link>
          </div>

          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">You haven&apos;t started any visa applications yet.</p>
                <Link
                  href="/visas"
                  className="inline-flex items-center px-4 py-2 bg-[#0052cc] text-white font-medium rounded-lg hover:bg-[#0052cc]/90 transition-colors"
                >
                  Browse Visas
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.visa?.name || "Unknown Visa"}</h3>
                        <p className="text-sm text-gray-500">Purchased: {new Date(app.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.access_status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {app.access_status === "active" ? "Active" : "Expired"}
                      </span>
                    </div>
                    <Link
                      href={`/user/visas/${app.visa_id}`}
                      className="text-[#0052cc] font-medium hover:underline"
                    >
                      Continue Application →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Consultations</h2>
            <Link href="/user/consultations" className="text-[#0052cc] font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="p-6">
            {consultations.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">No consultations scheduled.</p>
                <Link href="/lawyers" className="text-[#0052cc] font-medium hover:underline">
                  Find a lawyer →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.slice(0, 3).map((consultation) => (
                  <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        👤
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{consultation.lawyer?.full_name || "Lawyer"}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(consultation.scheduled_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        consultation.status === "confirmed" 
                          ? "bg-green-100 text-green-800" 
                          : consultation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {consultation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
