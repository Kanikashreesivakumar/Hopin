import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const rides = await db.collection('rides').find({}).toArray();

    // Transform MongoDB _id to string id for consistency
    const formattedRides = rides.map(ride => ({
      ...ride,
      id: ride._id.toString()
    }));

    return NextResponse.json({ success: true, data: formattedRides });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rides' }, 
      { status: 500 }
    );
  }
}
