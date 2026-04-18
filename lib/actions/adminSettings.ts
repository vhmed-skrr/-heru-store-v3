"use server";

/**
 * adminSettings — Server Action
 *
 * DB Schema (schema.sql):
 *   settings(id UUID PRIMARY KEY, key TEXT NOT NULL UNIQUE, value JSONB, created_at)
 *
 * This is a KEY-VALUE table — each setting is its own ROW.
 * There are NO individual setting columns (no `announcement_active` column, etc.)
 *
 * WRONG approach (old code):
 *   upsert({ id: 1, announcement_active: true, store_name: 'Heru' })
 *   → Supabase error: "Could not find the 'announcement_active' column"
 *
 * CORRECT approach (this code):
 *   upsert([
 *     { key: 'announcement_active', value: true  },
 *     { key: 'store_name',          value: 'Heru' },
 *     ...
 *   ], { onConflict: 'key' })
 *   → Each setting is upserted as its own row, keyed by `key`.
 */

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('[adminSettings] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, key);
}

export async function saveSettings(settingsData: Record<string, unknown>) {
  try {
    const supabase = getAdminSupabase();

    /**
     * Convert the flat settings object into an array of { key, value } rows.
     * Supabase's JSONB `value` column natively stores strings, booleans,
     * numbers, arrays, and objects — no need to JSON.stringify.
     */
    const rows = Object.entries(settingsData)
      .filter(([key]) => key !== 'id' && key !== 'created_at') // strip metadata
      .map(([key, value]) => ({ key, value }));

    if (rows.length === 0) {
      return { success: true }; // nothing to save
    }

    const { error } = await supabase
      .from('settings')
      .upsert(rows, { onConflict: 'key' }); // key is UNIQUE, so this is safe

    if (error) throw error;

    revalidatePath('/');
    revalidatePath('/shop');
    revalidatePath('/product', 'layout'); // revalidates all /product/* pages
    revalidatePath('/admin/settings');

    return { success: true };
  } catch (err: any) {
    console.error('[adminSettings] saveSettings error:', err);
    return { success: false, error: err.message };
  }
}
