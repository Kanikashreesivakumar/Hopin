import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Event from '@/models/Event';

export async function GET() {
  await dbConnect();
  try {
    // Only return the latest 4 events
    const events = await Event.find({}).sort({ date: -1 }).limit(4);
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
