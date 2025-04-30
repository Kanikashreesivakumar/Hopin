import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'driver' | 'passenger';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {
  id: string;
}
