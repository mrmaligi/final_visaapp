export default function LawyerDashboardPage() {
  const stats = [
    { label: 'Consultations This Month', value: '12', change: '+3 from last month' },
    { label: 'Revenue This Month', value: '$2,400', change: '+15% from last month' },
    { label: 'Average Rating', value: '4.8/5', change: 'Based on 247 reviews' },
    { label: 'Response Rate', value: '98%', change: 'Great!' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome back! 👋</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-lg shadow">
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Consultations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Upcoming Consultations</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { name: 'Michael Chen', visa: 'Skilled Independent (189)', time: 'Today, 2:00 PM' },
                  { name: 'Sarah Johnson', visa: 'Partner Visa (820)', time: 'Tomorrow, 10:00 AM' },
                ].map((apt, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {apt.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{apt.name}</p>
                      <p className="text-sm text-gray-600">{apt.visa}</p>
                    </div>
                    <p className="text-sm text-blue-600">{apt.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { text: 'New consultation booked', time: '2 hours ago' },
                  { text: 'Client uploaded documents', time: '5 hours ago' },
                  { text: 'New 5-star review received', time: '1 day ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{activity.text}</span>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
