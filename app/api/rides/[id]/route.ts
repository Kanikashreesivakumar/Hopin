import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);


export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
<<<<<<< HEAD
    
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
=======
    const { id } = context.params

    // Fetch rides for the driver with user.id === params.id
    const { data: rides, error: ridesFetchError } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', id)

    if (ridesFetchError) throw ridesFetchError

    // Fetch passenger details and event details for each ride
    const ridesWithDetails = await Promise.all(
      rides.map(async (ride) => {
        const passengerIds = ride.passenger_ids || []

        // Fetch passengers
        const { data: passengers, error: passengersFetchError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', passengerIds)

        if (passengersFetchError) throw passengersFetchError

        // Fetch event details
        const { data: event, error: eventFetchError } = await supabase
          .from('events')
          .select('id, title, date, time, location, description, image')
          .eq('id', ride.event_id)
          .single()

        if (eventFetchError) throw eventFetchError

        return {
          ...ride,
          passengers: passengers || [],
          event: event || null,
        }
      })
    )

    return NextResponse.json({ success: true, data: ridesWithDetails })
>>>>>>> 0b244d0bb06656db757e3de2a97dbae395a9abad
  } catch (error) {
    console.error('Error fetching ride:', error);
    return NextResponse.json(
<<<<<<< HEAD
      { success: false, error: 'Failed to fetch ride details' },
=======
      { error: (error as Error).message || error },
>>>>>>> 0b244d0bb06656db757e3de2a97dbae395a9abad
      { status: 500 }
    );
  }
}