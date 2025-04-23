import mongoose, { Schema, Document } from 'mongoose';

// Assuming a basic Ride structure, adjust fields as necessary
export interface IRide extends Document {
  driverId: mongoose.Schema.Types.ObjectId; // Example field, adjust as needed
  passengerIds: mongoose.Schema.Types.ObjectId[]; // Example field
  startLocation: string;
  endLocation: string;
  departureTime: Date;
  availableSeats: number;
}

const RideSchema: Schema = new Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Example
  passengerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Example
  startLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  departureTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
});

export default mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema);
