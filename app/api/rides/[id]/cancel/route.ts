import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: params.id },
      include: {
        driver: {
          include: {
            carDetails: true
          }
        },
        pickup: true,
        dropoff: true
      }
    });

    if (!ride) {
      return NextResponse.json(
        { message: 'Ride not found' },
        { status: 404 }
      );
    }

    const updatedRide = await prisma.ride.update({
      where: { id: params.id },
      data: { status: 'cancelled' },
      include: {
        driver: {
          include: {
            carDetails: true
          }
        },
        pickup: true,
        dropoff: true
      }
    });

    return NextResponse.json({
      message: 'Ride cancelled successfully',
      ride: updatedRide
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    return NextResponse.json(
      { message: 'Failed to cancel ride' },
      { status: 500 }
    );
  }
}