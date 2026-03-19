import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Get lawyer pricing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lawyerId = searchParams.get('lawyerId');
    const visaType = searchParams.get('visaType');

    if (!lawyerId) {
      return NextResponse.json(
        { error: 'Missing required parameter: lawyerId' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from('lawyer_pricing')
      .select('*')
      .eq('lawyer_id', lawyerId)
      .eq('is_active', true);

    if (visaType) {
      query = query.eq('visa_type', visaType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching pricing:', error);
      return NextResponse.json(
        { error: 'Failed to fetch pricing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ pricing: data });

  } catch (error) {
    console.error('Pricing fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update/create lawyer pricing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      lawyerId, 
      visaType, 
      duration30Price, 
      duration60Price, 
      duration90Price 
    } = body;

    if (!lawyerId || !visaType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if pricing already exists for this visa type
    const { data: existingPricing } = await supabase
      .from('lawyer_pricing')
      .select('id')
      .eq('lawyer_id', lawyerId)
      .eq('visa_type', visaType)
      .single();

    let result;

    if (existingPricing) {
      // Update existing pricing
      result = await supabase
        .from('lawyer_pricing')
        .update({
          duration_30_price: duration30Price || 150,
          duration_60_price: duration60Price || 250,
          duration_90_price: duration90Price || 350,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingPricing.id)
        .select()
        .single();
    } else {
      // Create new pricing
      result = await supabase
        .from('lawyer_pricing')
        .insert({
          lawyer_id: lawyerId,
          visa_type: visaType,
          duration_30_price: duration30Price || 150,
          duration_60_price: duration60Price || 250,
          duration_90_price: duration90Price || 350,
          currency: 'USD',
          is_active: true,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving pricing:', result.error);
      return NextResponse.json(
        { error: 'Failed to save pricing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      pricing: result.data 
    });

  } catch (error) {
    console.error('Pricing save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete lawyer pricing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pricingId = searchParams.get('id');

    if (!pricingId) {
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('lawyer_pricing')
      .delete()
      .eq('id', pricingId);

    if (error) {
      console.error('Error deleting pricing:', error);
      return NextResponse.json(
        { error: 'Failed to delete pricing' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Pricing delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
