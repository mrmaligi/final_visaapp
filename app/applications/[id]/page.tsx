import { createClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"

export default async function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return redirect("/login")
  }

  const { data: application, error } = await supabase
    .from('visa_applications')
    .select('*, visa_types(*)')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (error || !application) {
    return notFound()
  }

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', application.id)

  const steps = [
    { id: 'pending', name: 'Application Submitted', description: 'We have received your application.' },
    { id: 'processing', name: 'Processing', description: 'Your application is being reviewed.' },
    { id: 'approved', name: 'Approved', description: 'Your visa has been approved!' },
    { id: 'rejected', name: 'Rejected', description: 'Your application was rejected.' }
  ]

  const currentStepIndex = steps.findIndex(s => s.id === application.status) >= 0 ? steps.findIndex(s => s.id === application.status) : 0

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-8">
      <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
        <div>
          <Link href="/dashboard" className="text-blue-600 hover:underline mb-2 inline-block text-sm">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Application Details</h1>
          <p className="text-gray-500 font-mono mt-1">ID: {application.id}</p>
        </div>
        <div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider
            ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${application.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
            ${application.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
            ${application.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
          `}>
            {application.status}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Visa Information</h2>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-gray-500 text-sm">Destination</span>
                <p className="font-medium">{(application.visa_types as { country?: string })?.country}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Visa Type</span>
                <p className="font-medium">{(application.visa_types as { name?: string })?.name}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Intended Date of Travel</span>
                <p className="font-medium">{application.intended_date ? new Date(application.intended_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Purpose</span>
                <p className="font-medium whitespace-pre-wrap">{application.purpose}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Uploaded Documents</h2>
            {documents && documents.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {documents.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                    <span className="truncate mr-4 text-sm font-medium">{doc.name}</span>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No documents found.</p>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-6">
            <h2 className="text-xl font-semibold mb-6">Status Tracking</h2>
            <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4">
              {steps.map((step, index) => {
                const isCompleted = application.status === 'rejected' ? index <= currentStepIndex : index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                const isRejected = application.status === 'rejected' && isCurrent

                return (
                  <div key={step.id} className="mb-8 ml-6 relative">
                    <span className={`absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white
                      ${isCompleted && !isRejected ? 'bg-blue-600' : ''}
                      ${isRejected ? 'bg-red-600' : ''}
                      ${!isCompleted ? 'bg-gray-200' : ''}
                    `}>
                      {isCompleted ? (
                        <svg className="w-3 h-3 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                        </svg>
                      ) : null}
                    </span>
                    <h3 className={`font-semibold text-lg leading-tight ${isCurrent ? (isRejected ? 'text-red-600' : 'text-blue-600') : (isCompleted ? 'text-gray-900' : 'text-gray-500')}`}>
                      {step.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                    {isCurrent && (
                      <div className="mt-2 text-xs text-gray-400">
                        Last updated: {new Date(application.created_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
