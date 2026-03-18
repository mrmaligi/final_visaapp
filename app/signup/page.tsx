import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    return redirect("/dashboard")
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect("/signup?message=Could not authenticate user")
    }

    return redirect("/signup?message=Check email to continue sign in process")
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto h-screen">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signUp}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-blue-600 text-white rounded-md px-4 py-2 text-foreground mb-2">
          Sign Up
        </button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-gray-100 text-center rounded-md">
            {searchParams.message}
          </p>
        )}
        <div className="text-center mt-4 text-sm">
          Already have an account? <a href="/login" className="text-blue-600 underline">Sign In</a>
        </div>
      </form>
    </div>
  )
}
