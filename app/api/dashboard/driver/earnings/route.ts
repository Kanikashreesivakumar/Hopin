import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    

    const driverId = 'your-driver-id';

    const rides = await db.collection('rides')
      .find({ 
        driverId: driverId,
        status: { $in: ['completed', 'pending'] }
      })
      .sort({ date: -1 })
      .toArray();

    const earnings = rides.map(ride => ({
      rideId: ride._id.toString(),
      amount: ride.price,
      date: ride.date,
      status: ride.status
    }));

    const totalEarnings = rides
      .filter(ride => ride.status === 'completed')
      .reduce((total, ride) => total + (ride.price || 0), 0);

    return NextResponse.json({
      success: true,
      earnings,
      totalEarnings
    });
  } catch (error) {
    console.error('Error fetching driver earnings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch earnings' },
      { status: 500 }
    );
  }
}