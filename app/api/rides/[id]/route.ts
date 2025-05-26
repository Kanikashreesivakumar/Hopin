import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabaseClient'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
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
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || error },
      { status: 500 }
    )
  }
}