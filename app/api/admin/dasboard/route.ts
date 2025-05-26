import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function GET() {
  try {
    // Fetch total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
    if (usersError) throw usersError;

    // Fetch total rides and active rides
    const { data: rides, error: ridesError } = await supabase
      .from('rides')
      .select('id, departure_time');
    if (ridesError) throw ridesError;

    const totalRides = rides.length;
    const activeRides = rides.filter((ride) => new Date(ride.departure_time) > new Date()).length;

    // Fetch total events
    const { count: totalEvents, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact' });
    if (eventsError) throw eventsError;

    // Fetch upcoming events
    const { data: upcomingEvents, error: upcomingEventsError } = await supabase
      .from('events')
      .select('id, title, date, time, location, attendees')
      .order('date', { ascending: true })
      .limit(5);
    if (upcomingEventsError) throw upcomingEventsError;

    // Fetch recent rides
    const { data: recentRides, error: recentRidesError } = await supabase
      .from('rides')
      .select('id, driver_id, passenger_ids, event_id, departure_time')
      .order('departure_time', { ascending: false })
      .limit(5);
    if (recentRidesError) throw recentRidesError;

    // Map recent rides with driver and event details
    const recentRidesWithDetails = await Promise.all(
      recentRides.map(async (ride) => {
        const { data: driver, error: driverError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', ride.driver_id)
          .single();
        if (driverError) throw driverError;

        const { data: event, error: eventError } = await supabase
          .from('events')
          .select('title')
          .eq('id', ride.event_id)
          .single();
        if (eventError) throw eventError;

        return {
          id: ride.id,
          driverName: driver?.name || 'Unknown Driver',
          passengerCount: ride.passenger_ids.length,
          eventName: event?.title || 'Unknown Event',
          date: ride.departure_time,
          status: new Date(ride.departure_time) > new Date() ? 'upcoming' : 'completed',
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalRides,
        totalEvents,
        activeRides,
        upcomingEvents,
        recentRides: recentRidesWithDetails,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}