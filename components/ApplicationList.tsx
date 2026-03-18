import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function ApplicationList() {
  const supabase = createClient()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: applications, error } = await supabase
    .from('visa_applications')
    .select('*, visa_types(name)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return <div className="text-red-500">Failed to load applications.</div>
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center shadow-sm">
        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
        <p className="text-gray-500 mb-6">Start your first visa application today.</p>
        <Link
          href="/applications/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          New Application
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <th className="p-4 font-medium">ID</th>
            <th className="p-4 font-medium">Visa Type</th>
            <th className="p-4 font-medium">Date Applied</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
              <td className="p-4 text-sm font-mono text-gray-500">{app.id.split('-')[0]}...</td>
              <td className="p-4 font-medium">{(app.visa_types as { name?: string })?.name || 'Unknown'}</td>
              <td className="p-4 text-gray-600">{new Date(app.created_at).toLocaleDateString()}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${app.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                  ${app.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  ${app.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                  ${!['pending', 'approved', 'rejected', 'processing'].includes(app.status) ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </td>
              <td className="p-4">
                <Link
                  href={`/applications/${app.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
