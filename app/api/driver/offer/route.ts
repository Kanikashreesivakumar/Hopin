import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(req: NextRequest) {
  // Fetch id, title, date, time, and location from events table
  const { data, error } = await supabase
    .from('events')
    .select('id, title, date, time, location');

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Return event_id as id, event_location as location
  return NextResponse.json({ success: true, events: data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expecting: driver_id, event_id, start_location, end_location, departure_time, available_seats, cost, carmodel, notes
    const {
      driver_id,
      event_id,
      start_location,
      end_location,
      departure_time,
      available_seats,
      cost,
      notes
    } = body;
    if (!driver_id || !event_id || !start_location || !end_location || !departure_time || !available_seats || !cost ) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    // Insert into rides table
    const { error } = await supabase.from('rides').insert([
      {
        driver_id,
        event_id,
        start_location,
        end_location,
        departure_time,
        available_seats: Number(available_seats),
        cost: Number(cost),
        notes,
      },
    ]);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
