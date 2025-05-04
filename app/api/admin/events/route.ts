import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/admin/events - Fetches all events
export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const events = await db.collection('events').find({}).toArray();
    
    const now = new Date();
    const eventsWithStatus = events.map((event: any) => {
      const eventDate = new Date(event.date);
      return {
        ...event,
        id: event._id.toString(),
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
    const { db } = await connectToDatabase();
    const body = await req.json();
    
    const result = await db.collection('events').insertOne(body);
    const insertedEvent = await db.collection('events').findOne({ _id: result.insertedId });

    return NextResponse.json(
      { success: true, message: 'Event added', data: insertedEvent }, 
      { status: 201 }
    );
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
    const { db } = await connectToDatabase();
    const body = await req.json();
    
    const result = await db.collection('events').findOneAndUpdate(
      { _id: new ObjectId(eventId) },
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: 'Event updated', data: result }, 
      { status: 200 }
    );
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
    const { db } = await connectToDatabase();
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Event deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
