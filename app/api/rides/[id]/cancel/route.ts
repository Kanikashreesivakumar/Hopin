import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Update ride status to 'cancelled' in Supabase
    const { data: ride, error } = await supabase
      .from('rides')
      .update({ status: 'cancelled' })
      .eq('id', params.id)
      .select()
      .single();
    if (!ride || error) {
      return NextResponse.json(
        { message: 'Ride not found or failed to cancel', details: error?.message },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Ride cancelled successfully', ride });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to cancel ride' },
      { status: 500 }
    );
  }
}