import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

// GET /api/admin/events - Fetches all events
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const events = await Event.find({});
    return NextResponse.json({ success: true, data: events }, { status: 200 });
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
