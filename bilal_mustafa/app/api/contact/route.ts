import { NextResponse } from 'next/server';
import { sanitizeInput } from '@/lib/security';
import { createClient } from '@/lib/supabase/server';
import { MOCK_MESSAGES } from '@/lib/supabase/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sender_name, sender_email, message } = body;

    const name = (sender_name || '').trim();
    const email = (sender_email || '').trim();
    const msg = (message || '').trim();

    // Basic Input Validation
    if (!name || !email || !msg) {
      return NextResponse.json(
        { success: false, error: 'Name, Email, and Message are all required.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // DevSecOps Input Sanitization
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanMessage = sanitizeInput(msg);

    // Attempt Supabase insertion
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
      const supabase = await createClient();
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_name: cleanName,
            sender_email: cleanEmail,
            message: cleanMessage,
            is_read: false,
          },
        ]);

      if (error) {
        console.error('Supabase error saving message:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true }, { status: 201 });
    } else {
      // Fallback local mock mode behavior
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender_name: cleanName,
        sender_email: cleanEmail,
        message: cleanMessage,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      MOCK_MESSAGES.unshift(newMessage);
      return NextResponse.json({ success: true, data: newMessage, mode: 'mock' }, { status: 201 });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'خطأ في معالجة طلب التواصل' },
      { status: 500 }
    );
  }
}
