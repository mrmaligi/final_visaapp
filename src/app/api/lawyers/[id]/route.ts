import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Get lawyer details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('lawyers')
      .select(`
        *,
        lawyer_specializations (*),
        reviews:reviews (
          rating,
          comment,
          created_at,
          user:client_id (
            full_name
          )
        )
      `)
      .eq('id', id)
      .eq('verification_status', 'approved')
      .single();

    if (error) {
      console.error('Error fetching lawyer:', error);
      return NextResponse.json(
        { error: 'Lawyer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ lawyer: data });

  } catch (error) {
    console.error('Lawyer fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
