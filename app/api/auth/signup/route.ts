import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { signJwt } from '@/lib/utils';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { name, email, password, role, vehicleInfo } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  let userData: any = { name, email, password: hashed, role };
  if (role === 'driver' && vehicleInfo) {
    userData.vehicleInfo = vehicleInfo;
  }
  const user = await User.create(userData);
  const token = signJwt({ userId: user._id, email: user.email, name: user.name, role: user.role });
  return NextResponse.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, vehicleInfo: user.vehicleInfo } });
}
