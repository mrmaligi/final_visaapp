export default function LawyerClientsPage() {
  const clients = [
    { name: 'Michael Chen', visa: 'Skilled Independent (189)', consultations: 3, lastActive: '2 days ago' },
    { name: 'Sarah Johnson', visa: 'Partner Visa (820)', consultations: 1, lastActive: '5 days ago' },
    { name: 'David Kim', visa: 'Student Visa (500)', consultations: 2, lastActive: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Clients</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <input 
              type="text" 
              placeholder="Search clients..."
              className="w-full md:w-96 px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div className="divide-y">
            {clients.map((client, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-sm text-gray-600">{client.visa}</p>
                    <p className="text-sm text-gray-500">{client.consultations} consultations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last active: {client.lastActive}</p>
                  <button className="text-blue-600 hover:underline mt-1">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
