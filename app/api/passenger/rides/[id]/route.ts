import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Fetch ride details by ID
    const { data: ride, error: rideFetchError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', id)
      .single();

    if (rideFetchError) throw rideFetchError;

    // Fetch driver details
    const { data: driver, error: driverFetchError } = await supabase
      .from('profiles')
      .select('id, name,vehicle_info')
      .eq('id', ride.driver_id)
      .single();

    if (driverFetchError) throw driverFetchError;

    // Fetch event details
    const { data: event, error: eventFetchError } = await supabase
      .from('events')
      .select('id, title, date, time, location, description, image')
      .eq('id', ride.event_id)
      .single();

    if (eventFetchError) throw eventFetchError;

    return NextResponse.json({
      success: true,
      data: {
        ...ride,
        driver,
        event,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message || error },
      { status: 500 }
    );
  }
}