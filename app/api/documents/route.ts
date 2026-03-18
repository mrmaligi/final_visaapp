import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const application_id = searchParams.get('application_id')

  if (!application_id) {
    return NextResponse.json({ error: 'application_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', application_id)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const application_id = formData.get('application_id') as string

    if (!file || !application_id) {
      return NextResponse.json({ error: 'File and application_id are required' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${application_id}-${Math.random()}.${fileExt}`
    const filePath = `${session.user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    const { data, error } = await supabase
      .from('documents')
      .insert({
        application_id,
        user_id: session.user.id,
        name: file.name,
        file_url: publicUrlData.publicUrl,
        type: file.type || 'unknown',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
