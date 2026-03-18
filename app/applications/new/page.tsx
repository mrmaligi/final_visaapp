"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function NewApplicationPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [visaTypes, setVisaTypes] = useState<{ id: string, name: string, country: string }[]>([])
  const [selectedVisaType, setSelectedVisaType] = useState("")
  const [intendedDate, setIntendedDate] = useState("")
  const [purpose, setPurpose] = useState("")
  const [documents, setDocuments] = useState<File[]>([])

  useEffect(() => {
    async function loadVisaTypes() {
      const { data } = await supabase.from('visa_types').select('id, name, country').order('name')
      if (data) setVisaTypes(data)
    }
    loadVisaTypes()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // 1. Create Application
      const { data: application, error: appError } = await supabase
        .from('visa_applications')
        .insert({
          user_id: session.user.id,
          visa_type_id: selectedVisaType,
          status: 'pending',
          intended_date: intendedDate,
          purpose: purpose,
        })
        .select()
        .single()

      if (appError) throw appError

      // 2. Upload Documents
      for (const file of documents) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${application.id}-${Math.random()}.${fileExt}`
        const filePath = `${session.user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) {
          console.error("Upload error:", uploadError)
          continue
        }

        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)

        await supabase.from('documents').insert({
          application_id: application.id,
          user_id: session.user.id,
          name: file.name,
          file_url: publicUrlData.publicUrl,
          type: file.type || 'unknown',
        })
      }

      router.push(`/applications/${application.id}`)
    } catch (error) {
      console.error(error)
      alert("Error creating application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
  }

  return (
    <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-8">
      <h1 className="text-3xl font-bold mb-8">Start New Application</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Visa Type</label>
          <select
            required
            className="border border-gray-300 p-3 rounded-lg bg-white"
            value={selectedVisaType}
            onChange={(e) => setSelectedVisaType(e.target.value)}
          >
            <option value="" disabled>Select a visa type...</option>
            {visaTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.country} - {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Intended Date of Travel</label>
          <input
            type="date"
            required
            className="border border-gray-300 p-3 rounded-lg"
            value={intendedDate}
            onChange={(e) => setIntendedDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Purpose of Visit</label>
          <textarea
            required
            rows={4}
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Briefly describe your reason for travel..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Required Documents</label>
          <p className="text-sm text-gray-500 mb-2">Upload your passport, photos, and any supporting documents.</p>
          <input
            type="file"
            multiple
            required
            className="border border-gray-300 p-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange}
          />
          {documents.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
              {documents.map((doc, idx) => (
                <li key={idx}>{doc.name}</li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  )
}
