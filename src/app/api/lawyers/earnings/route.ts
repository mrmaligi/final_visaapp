import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Get lawyer earnings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lawyerId = searchParams.get('lawyerId');

    if (!lawyerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: lawyerId' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get earnings with consultation details
    const { data: earnings, error: earningsError } = await supabase
      .from('lawyer_earnings')
      .select(`
        *,
        consultation:consultation_id (
          scheduled_at,
          visa_type,
          duration_minutes,
          client:client_id (
            full_name
          )
        )
      `)
      .eq('lawyer_id', lawyerId)
      .order('created_at', { ascending: false });

    if (earningsError) {
      console.error('Error fetching earnings:', earningsError);
      return NextResponse.json(
        { error: 'Failed to fetch earnings' },
        { status: 500 }
      );
    }

    // Calculate summary
    const { data: allEarnings, error: summaryError } = await supabase
      .from('lawyer_earnings')
      .select('net_amount, status, created_at')
      .eq('lawyer_id', lawyerId);

    if (summaryError) {
      console.error('Error fetching earnings summary:', summaryError);
    }

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const summary = (allEarnings || []).reduce((acc, earning) => {
      acc.totalEarned += earning.net_amount;
      acc.totalConsultations += 1;
      
      if (earning.status === 'pending') {
        acc.pendingAmount += earning.net_amount;
      }

      const earningDate = new Date(earning.created_at);
      if (earningDate >= thisMonthStart) {
        acc.thisMonth += earning.net_amount;
      }

      return acc;
    }, {
      totalEarned: 0,
      pendingAmount: 0,
      totalConsultations: 0,
      thisMonth: 0
    });

    return NextResponse.json({ 
      earnings: earnings || [],
      summary 
    });

  } catch (error) {
    console.error('Earnings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
