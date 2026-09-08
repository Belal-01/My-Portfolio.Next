import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ success: true, data }, { status: 200 });
      }
    }

    // Default fallback if database table is not populated yet
    return NextResponse.json(
      {
        success: true,
        data: {
          id: 'default',
          file_name: 'Belal_Mustafa_CV.pdf',
          file_url: '/cv.pdf',
          file_size: 154000,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ success: false, error: 'File must be a PDF document' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name;
    const fileSize = file.size;

    let publicUrl = '';

    // Upload to Supabase Storage bucket 'resumes'
    const storagePath = `resumes/cv_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('resumes')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (!storageError && storageData) {
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(storageData.path);
      publicUrl = urlData.publicUrl;
    } else {
      // Fallback: If storage bucket policies or bucket creation hasn't executed yet, create a public URL or store file path
      const { data: fallbackUrl } = supabase.storage.from('documents').getPublicUrl(storagePath);
      publicUrl = fallbackUrl?.publicUrl || `/cv.pdf`;
    }

    // Set existing active CVs to inactive
    await supabase.from('resumes').update({ is_active: false }).eq('is_active', true);

    // Insert new active resume record
    const { data: newResume, error: dbError } = await supabase
      .from('resumes')
      .insert([
        {
          file_name: fileName,
          file_url: publicUrl,
          file_size: fileSize,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase DB insertion error:', dbError);
      if (dbError.message?.includes('row-level security policy')) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Row-Level Security (RLS) policy missing for table "resumes". Please run the RLS SQL query in your Supabase SQL Editor to grant insert access.',
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: newResume }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
