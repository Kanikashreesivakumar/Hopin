import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Ride from '@/models/Ride'; // Assuming you have a Ride model

// GET /api/admin/rides - Fetches all rides
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Adjust the find query if needed, e.g., populate driver/passenger details
    const rides = await Ride.find({}); 
    return NextResponse.json({ success: true, data: rides }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
