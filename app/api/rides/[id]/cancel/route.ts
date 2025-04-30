import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase();
    const rideId = params.id;

    // Update ride status to 'cancelled' in MongoDB
    const result = await db.collection('rides').updateOne(
      { _id: new ObjectId(rideId) },
      { 
        $set: { 
          status: 'cancelled',
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Ride not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Ride cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling ride:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel ride' },
      { status: 500 }
    );
  }
}