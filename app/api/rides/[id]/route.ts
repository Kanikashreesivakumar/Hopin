import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    const id = params?.id;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ride ID is required' },
        { status: 400 }
      );
    }

  
    const { data: rides, error } = await supabase
      .from('rides')
      .select('*')
      .eq('user', id)
      .single();

    if (error) {
      throw error;
    }

    if (!rides) {
      return NextResponse.json(
        { success: false, error: 'Ride not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rides });
  } catch (error) {
    console.error('Error fetching ride:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ride details' },
      { status: 500 }
    );
  }
}