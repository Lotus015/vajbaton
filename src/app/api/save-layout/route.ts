import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { levelId, levelName, positions, completionTime } = await request.json();

    console.log('Attempting to save layout:', { levelId, levelName, completionTime });

    const { data, error } = await supabase
      .from('layouts')
      .insert({
        level_id: levelId,
        level_name: levelName,
        positions,
        completion_time: completionTime
      })
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: 'Failed to save layout', 
        details: error.message 
      }, { status: 500 });
    }

    console.log('Layout saved successfully:', data);
    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
