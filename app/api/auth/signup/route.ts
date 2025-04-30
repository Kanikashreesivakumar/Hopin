import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { hash } from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password, name, role } = await req.json();

  if (!email || !password || !name || !role) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Return user data without password
    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId.toString(),
        email,
        name,
        role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
