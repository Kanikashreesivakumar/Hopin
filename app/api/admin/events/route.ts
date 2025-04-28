import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

// GET /api/admin/events - Fetches all events
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const events = await Event.find({});
    const now = new Date(); // Use new Date() in production
    const eventsWithStatus = events.map((event: any) => {
      const eventDate = new Date(event.date);
      return {
        ...event.toObject(),
        status: eventDate >= now ? "upcoming" : "past",
      };
    });
    return NextResponse.json({ success: true, data: eventsWithStatus }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// POST /api/admin/events - Adds a new event
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const event = await Event.create(body);
    return NextResponse.json({ success: true, message: 'Event added', data: event }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Consider more specific error handling, e.g., for validation errors
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 }); // Use 400 for client-side errors like validation
  }
}

// PUT /api/admin/events?eventId=... - Updates an event
export async function PUT(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url!);
  const eventId = searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const updated = await Event.findByIdAndUpdate(eventId, body, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Event updated', data: updated }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

// DELETE /api/admin/events?eventId=... - Deletes an event
export async function DELETE(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url!);
  const eventId = searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ success: false, error: 'Missing eventId' }, { status: 400 });
  }
  try {
    const deleted = await Event.findByIdAndDelete(eventId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Event deleted' }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
