import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    // Fetch all rides, including driver and event details
    const { data: rides, error: ridesError } = await supabase
      .from('rides')
      .select(`*,
        driver:driver_id(name),
        event:event_id(title)`);

    if (ridesError) throw ridesError;

    // Map the rides to include driver name and event title
    const mappedRides = rides.map((ride) => ({
      ...ride,
      driverName: ride.driver?.name || 'Unknown Driver',
      eventName: ride.event?.title || 'Unknown Event',
    }));

    return NextResponse.json({ success: true, data: mappedRides });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch rides' }, { status: 500 });
  }
}
