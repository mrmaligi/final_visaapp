"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        setEmail(session.user.email || "")

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          // If no profile exists, create one
          if (error.code === 'PGRST116') {
            await supabase.from('profiles').insert({
              id: session.user.id,
              email: session.user.email || "",
            })
          } else {
            console.error('Error fetching profile', error)
          }
        } else if (data) {
          setFullName(data.full_name || "")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setMessage("")

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email || "",
          full_name: fullName,
        })

      if (error) throw error

      setMessage("Profile updated successfully!")
    } catch (error: unknown) {
      console.error(error)
      const msg = error instanceof Error ? error.message : "Failed to update profile"
      setMessage(msg)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>
  }

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-8">
      <h1 className="text-3xl font-bold mb-8">Profile Management</h1>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            disabled
            className="border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-500"
            value={email}
          />
          <p className="text-xs text-gray-500">Email address cannot be changed here.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            placeholder="John Doe"
            className="border border-gray-300 p-3 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="mt-4 bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
