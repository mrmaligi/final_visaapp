import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return redirect("/login")
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  // Optional: Mark all as read when page is visited
  if (notifications && notifications.length > 0) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', session.user.id)
      .eq('read', false)
  }

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Notifications Center</h1>
      </div>

      <div className="flex flex-col gap-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg flex items-start gap-4 transition
                ${notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}
              `}
            >
              <div className="text-2xl mt-1">
                {notification.message.toLowerCase().includes('approved') ? '✅' : ''}
                {notification.message.toLowerCase().includes('rejected') ? '❌' : ''}
                {notification.message.toLowerCase().includes('processing') ? '⏳' : ''}
                {!notification.message.toLowerCase().includes('approved') &&
                 !notification.message.toLowerCase().includes('rejected') &&
                 !notification.message.toLowerCase().includes('processing') ? 'ℹ️' : ''}
              </div>
              <div className="flex-1">
                <p className={`text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <h3 className="text-xl font-semibold mb-2 text-gray-700">No Notifications</h3>
            <p className="text-gray-500">You&apos;re all caught up! New updates will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
