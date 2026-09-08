import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MOCK_CERTIFICATIONS } from '@/lib/supabase/mockData';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    return NextResponse.json({ success: true, data: MOCK_CERTIFICATIONS, mode: 'mock' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
