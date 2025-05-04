import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const events = await db.collection('events')
      .find({})
      .sort({ date: -1 })
      .limit(4)
      .toArray();

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' }, 
      { status: 500 }
    );
  }
}
