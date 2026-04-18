"use server";

import { createClient } from '@supabase/supabase-js';

/**
 * submitSuggestion — Server Action
 *
 * ✅ FIX: status was incorrectly set to 'pending'.
 *
 * The suggestions table has a CHECK constraint:
 *   CHECK (status IN ('new', 'reviewed', 'approved', 'rejected'))
 *
 * 'pending' is NOT in this list → every suggestion submission was failing
 * with "violates check constraint suggestions_status_check".
 *
 * Fix: default status = 'new' (the correct initial status).
 */

export async function submitSuggestion(data: {
  name: string;
  phone: string;
  description: string;
  image_url?: string;
}) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('[submitSuggestion] Missing Supabase env vars');
    }

    const supabase = createClient(url, key);

    const payload = {
      name:        data.name        || null,
      phone:       data.phone       || null,
      description: data.description,
      image_url:   data.image_url   || null,
      status:      'new' as const,   // ← was 'pending' → violates CHECK constraint
    };

    const { error } = await supabase.from('suggestions').insert(payload);
    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error('[submitSuggestion] error:', err);
    return { success: false, error: err.message };
  }
}
