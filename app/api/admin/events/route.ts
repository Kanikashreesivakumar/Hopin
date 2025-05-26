import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

// GET /api/admin/events - Fetches all events
export async function GET(req: NextRequest) {
  try {
    const { data: events, error } = await supabase.from('events').select('*');
    if (error) throw error;
    const now = new Date();
    const eventsWithStatus = (events || []).map((event: any) => {
      const eventDate = new Date(event.date);
      return {
        ...event,
        status: eventDate >= now ? 'upcoming' : 'past',
      };
    });
    return NextResponse.json({ success: true, data: eventsWithStatus }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventData = {
      ...body,
      id: body.id || Date.now().toString() 
    };
    
    console.log('Creating event with data:', eventData);
    
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();
      
    if (error) throw error;
    
    console.log('Created event:', data); 
    return NextResponse.json({ success: true, message: 'Event added', data }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const eventId = searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('events').update(body).eq('id', eventId).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Event updated', data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const eventId = searchParams.get('eventId');

    console.log('Raw eventId:', eventId); // Debug log

    if (!eventId || eventId === 'undefined') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or missing eventId',
          details: { receivedId: eventId }
        },
        { status: 400 }
      );
    }

    console.log('Attempting to delete event with ID:', eventId); // Add logging

    // First check if event exists with detailed logging
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('*') // Change to select all fields for better debugging
      .eq('id', eventId)
      .single();

    console.log('Fetch result:', { existingEvent, fetchError }); // Add logging

    if (fetchError || !existingEvent) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event not found',
          details: { eventId, fetchError }
        },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json(
      { success: true, message: 'Event deleted successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Delete event error:', error);
    // Recreate searchParams from req.url
    let eventId = undefined;
    try {
      const { searchParams } = new URL(req.url!);
      eventId = searchParams.get('eventId');
    } catch {}
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to delete event',
        details: { eventId }
      },
      { status: 500 }
    );
  }
}

const deleteEvent = async (eventId: string) => {
  const response = await fetch(`/api/admin/events?eventId=${eventId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  console.log('Delete response:', data); // Add logging
  return data;
};
