import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import ApplicationList from "@/components/ApplicationList"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return redirect("/login")
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 px-4 py-8 mx-auto">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || session.user.email}</h1>
        <div className="flex gap-4">
          <Link
            href="/profile"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            My Profile
          </Link>
          <Link
            href="/applications/new"
            className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition"
          >
            New Application
          </Link>
        </div>
      </div>

      <div className="w-full grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</h2>
          <div className="flex flex-col gap-3 mt-2">
            <Link href="/visa-types" className="text-blue-600 hover:text-blue-800 font-medium transition flex items-center gap-2">
              <span className="bg-blue-100 p-1.5 rounded text-blue-700">🔍</span> Browse Visa Types
            </Link>
            <Link href="/notifications" className="text-blue-600 hover:text-blue-800 font-medium transition flex items-center gap-2">
              <span className="bg-blue-100 p-1.5 rounded text-blue-700">🔔</span> Notifications
            </Link>
          </div>
        </div>

        <div className="md:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-xl font-bold">My Applications</h2>
          </div>
          <div className="p-0">
            <ApplicationList />
          </div>
        </div>
      </div>
    </div>
  )
}
