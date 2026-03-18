export default function LawyerPricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Consultation Pricing</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Default Hourly Rate</h2>
          <p className="text-gray-600 mb-4">This rate applies to all visa types unless you set a custom rate.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">$200</span>
            <span className="text-gray-600">/hour</span>
            <button className="ml-auto text-blue-600 hover:underline">Edit</button>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">30-minute consultation: $100</p>
            <p className="text-sm text-gray-600">1-hour consultation: $200</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Custom Rates by Visa Type</h2>
          
          <div className="space-y-4">
            {[
              { type: 'Partner Visas', rate: '$250/hour', custom: true },
              { type: 'Skilled Migration', rate: '$200/hour', custom: false },
              { type: 'Student Visas', rate: '$200/hour', custom: false },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>{item.type}</span>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{item.rate}</span>
                  {item.custom ? (
                    <button className="text-red-600 text-sm">Remove Custom</button>
                  ) : (
                    <button className="text-blue-600 text-sm">Set Custom</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
