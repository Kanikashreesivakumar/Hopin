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

// POST /api/admin/events - Adds a new event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('events').insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Event added', data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT /api/admin/events?eventId=... - Updates an event
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

// DELETE /api/admin/events?eventId=... - Deletes an event
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url!);
  const eventId = searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
  }
  try {
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) throw error;
    return NextResponse.json({ success: true, message: 'Event deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
