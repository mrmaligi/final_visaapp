export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '1,247', change: '+45 this week' },
    { label: 'Total Lawyers', value: '56', change: '5 pending' },
    { label: 'Visa Purchases', value: '3,421', change: '+12% this month' },
    { label: 'Consultations', value: '892', change: '124 this month' },
    { label: 'Revenue', value: '$67,829', change: '+8% this month' },
    { label: 'Active Issues', value: '3', change: 'Needs attention' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Action Required */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-800 mb-2">⚠️ Action Required</h3>
          <ul className="list-disc list-inside text-amber-700">
            <li>5 Lawyer applications awaiting verification</li>
            <li>2 Flagged reviews need moderation</li>
          </ul>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  'New user registration: sarah@email.com',
                  'Lawyer application submitted: John Doe',
                  'Visa purchased: Skilled Independent (189)',
                  'Review flagged for moderation',
                ].map((activity, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{activity}</span>
                    <span className="text-sm text-gray-500">{[2, 4, 5, 6][i]}h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Quick Links</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Manage Lawyers', href: '/admin/lawyers', color: 'bg-blue-100' },
                  { label: 'Manage Users', href: '/admin/users', color: 'bg-green-100' },
                  { label: 'Manage Visas', href: '/admin/visas', color: 'bg-purple-100' },
                  { label: 'Platform Settings', href: '/admin/settings', color: 'bg-gray-100' },
                ].map((link) => (
                  <a key={link.label} href={link.href} className={`${link.color} p-4 rounded-lg hover:opacity-80 transition-opacity`}>
                    <p className="font-medium">{link.label}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
