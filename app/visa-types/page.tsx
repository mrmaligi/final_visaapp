import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export default async function VisaTypesPage() {
  const supabase = createClient()

  const { data: visaTypes, error } = await supabase
    .from('visa_types')
    .select('*')
    .order('country', { ascending: true })

  if (error) {
    console.error('Error fetching visa types:', error)
  }

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Visa Types Catalogue</h1>
        <p className="text-gray-600">Browse available visa types and destinations.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visaTypes && visaTypes.length > 0 ? (
          visaTypes.map((visa) => (
            <div key={visa.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">{visa.country}</span>
                  <span className="font-bold text-lg text-gray-900">${visa.fee}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{visa.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{visa.description}</p>

                <div className="flex flex-col gap-2 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Processing Time:</span> {visa.processing_time || 'Varies'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Validity:</span> {visa.validity || 'Varies'}
                  </div>
                </div>
              </div>

              <Link
                href="/applications/new"
                className="w-full text-center bg-gray-50 border border-gray-200 text-blue-600 font-medium py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Apply Now
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">No Visa Types Available</h3>
            <p className="text-gray-500">Check back later for updated visa options.</p>
          </div>
        )}
      </div>
    </div>
  )
}
