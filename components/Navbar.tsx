import Link from "next/link"
import { createClient } from "@/utils/supabase/server"

export default async function Navbar() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/">VisaPlatform</Link>
          <div className="hidden sm:flex gap-4 font-normal">
            <Link href="/visa-types" className="hover:text-blue-600 transition">Visa Types</Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {session ? (
            <>
              <Link href="/dashboard" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="py-2 px-3 flex rounded-md no-underline bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
