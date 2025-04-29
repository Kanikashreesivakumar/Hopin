import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  // Fetch the latest 4 events from Supabase
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })
    .limit(4);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch events', details: error.message }, { status: 500 });
  }
  return NextResponse.json({ events });
}
