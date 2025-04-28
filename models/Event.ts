import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  name: string;
  date: Date;
  time?: string;
  location: string;
  description: string;
  image?: string;
  createdAt?: Date;
  attendees: number;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  attendees: { type: Number, required: true },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
