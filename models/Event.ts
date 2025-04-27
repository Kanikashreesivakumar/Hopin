import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  attendees: { type: Number, required: true },
  image: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
