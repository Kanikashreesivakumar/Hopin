import { ObjectId } from 'mongodb';

export interface Event {
  _id?: ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
