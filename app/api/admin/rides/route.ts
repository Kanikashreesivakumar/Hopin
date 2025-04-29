import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    // Fetch all rides, including driver, event, and passengers
    const { data: rides, error } = await supabase.from('rides').select('*');
    if (error) throw error;
    // Optionally, fetch related user/event data in separate queries if needed
    return NextResponse.json({ success: true, data: rides });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch rides' }, { status: 500 });
  }
}
