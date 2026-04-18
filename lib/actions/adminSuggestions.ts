"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { Suggestion } from '@/types';

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getSuggestions(): Promise<{ data: Suggestion[] | null; error: string | null }> {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data as Suggestion[], error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export async function updateSuggestionStatus(
  id: string,
  status: Suggestion['status']
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from('suggestions')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/suggestions');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteSuggestion(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('suggestions').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/suggestions');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
