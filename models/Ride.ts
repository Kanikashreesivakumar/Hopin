import { ObjectId } from 'mongodb';

export interface Ride {
  _id?: ObjectId;
  driverId: string;
  passengerId?: string;
  eventId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  pickupLocation: string;
  dropLocation: string;
  date: Date;
  time: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
