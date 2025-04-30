import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing email or password' }, { status: 400 });
  }
  // Sign in with Supabase Auth
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signInData.user) {
    return NextResponse.json({ success: false, error: signInError?.message || 'Login failed' }, { status: 401 });
  }
  // Fetch profile
  const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', signInData.user.id).single();
  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, user: { id: signInData.user.id, email, ...profile } });
}
