import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: string;
  createdAt: Date;
  vehicleInfo?: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
    color?: string;
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
  vehicleInfo: {
    make: { type: String },
    model: { type: String },
    year: { type: String },
    licensePlate: { type: String },
    color: { type: String },
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
