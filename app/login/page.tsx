import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    return redirect("/dashboard")
  }

  const signIn = async (formData: FormData) => {
    "use server"

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect("/login?message=Could not authenticate user")
    }

    return redirect("/dashboard")
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto h-screen">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signIn}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
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
          Sign In
        </button>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-red-100 text-red-900 text-center rounded-md">
            {searchParams.message}
          </p>
        )}
        <div className="text-center mt-4 text-sm">
          Don&apos;t have an account? <a href="/signup" className="text-blue-600 underline">Sign Up</a>
        </div>
      </form>
    </div>
  )
}
