import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function POST() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    await supabase.auth.signOut()
  }

  return redirect("/")
}
