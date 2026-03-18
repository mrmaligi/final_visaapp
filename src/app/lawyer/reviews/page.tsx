export default function LawyerReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Client Reviews</h1>
          <div className="text-right">
            <p className="text-3xl font-bold">4.8/5</p>
            <p className="text-gray-600">247 reviews</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex gap-4 p-4 border-b">
            <select className="px-4 py-2 border rounded-lg">
              <option>All Reviews</option>
              <option>5 Stars</option>
              <option>4 Stars</option>
            </select>
            <select className="px-4 py-2 border rounded-lg">
              <option>Most Recent</option>
              <option>Highest Rated</option>
            </select>
          </div>

          <div className="divide-y">
            {[
              { name: 'John Smith', rating: 5, text: 'Excellent service and very knowledgeable about the visa process.', date: '2 days ago', visa: 'Skilled Independent (189)' },
              { name: 'Emma Wilson', rating: 5, text: 'Sarah made the whole process so much easier. Highly recommended!', date: '1 week ago', visa: 'Partner Visa (820)' },
            ].map((review, i) => (
              <div key={i} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.name}</span>
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-blue-600 mb-2">{review.visa}</p>
                <p className="text-gray-700 mb-3">{review.text}</p>
                <button className="text-blue-600 text-sm hover:underline">Respond</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
