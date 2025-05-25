import { NextResponse } from 'next/server'
import { supabase } from '@/utils/supabaseClient'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Fetch rides for the driver with user.id === params.id
    const { data: rides, error } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', params.id)
    if (error) throw error
    return NextResponse.json({ success: true, data: rides })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ride details' },
      { status: 500 }
    )
  }
}