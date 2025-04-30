import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: NextRequest) {
  const { name, email, password, role, vehicleInfo } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }
  // Create user in Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError || !signUpData.user) {
    return NextResponse.json({ success: false, error: signUpError?.message || 'Signup failed' }, { status: 400 });
  }
  // Insert profile row
  const { error: profileError } = await supabase.from('profiles').insert([
    { id: signUpData.user.id, name, role, vehicle_info: vehicleInfo }
  ]);
  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, user: { id: signUpData.user.id, email, name, role, vehicleInfo } });
}
