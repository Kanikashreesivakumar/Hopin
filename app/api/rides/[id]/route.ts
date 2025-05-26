import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { parseISO, isValid } from 'date-fns';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ride ID is required' },
        { status: 400 }
      );
    }

    const { data: rides, error } = await supabase
      .from('rides')
      .select(`
        *,
        events (
          id,
          title,
          date,
          location
        ),
        users (
          id,
          name,
          email
        )
      `)
      .eq('driver_id', id);

    if (error) {
      throw error;
    }

    // Transform the data and ensure valid date format
    const ridesWithDetails = rides.map(ride => {
      let eventDate = null;
      if (ride.events?.date) {
        try {
          // Convert the date string to a timestamp first
          const timestamp = Date.parse(ride.events.date);
          if (!isNaN(timestamp)) {
            eventDate = new Date(timestamp).toISOString();
          }
        } catch (e) {
          console.error('Date parsing error:', e);
        }
      }

      return {
        ...ride,
        event: ride.events,
        driver: ride.users,
        eventDate
      };
    });

    return NextResponse.json(
      { success: true, data: ridesWithDetails },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching ride:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch ride details' },
      { status: 500 }
    );
  }
}