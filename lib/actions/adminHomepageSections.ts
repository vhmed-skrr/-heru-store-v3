"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('[adminHomepageSections] Missing env vars');
  }
  return createClient(url, key);
}

const PATHS = ['/', '/admin/homepage-sections'];

function revalidateAll() {
  PATHS.forEach((p) => revalidatePath(p));
}

export async function addSectionToHomepage(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from('categories')
      .update({ show_on_homepage: true })
      .eq('id', categoryId);
    if (error) throw error;
    revalidateAll();
    return { success: true };
  } catch (err: any) {
    console.error('[addSectionToHomepage]', err);
    return { success: false, error: err.message };
  }
}

export async function removeSectionFromHomepage(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from('categories')
      .update({ show_on_homepage: false })
      .eq('id', categoryId);
    if (error) throw error;
    revalidateAll();
    return { success: true };
  } catch (err: any) {
    console.error('[removeSectionFromHomepage]', err);
    return { success: false, error: err.message };
  }
}

export async function updateSectionOrder(categoryId: string, sortOrder: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from('categories')
      .update({ sort_order: sortOrder })
      .eq('id', categoryId);
    if (error) throw error;
    revalidateAll();
    return { success: true };
  } catch (err: any) {
    console.error('[updateSectionOrder]', err);
    return { success: false, error: err.message };
  }
}

export async function toggleSectionVisibility(categoryId: string, visible: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from('categories')
      .update({ show_on_homepage: visible })
      .eq('id', categoryId);
    if (error) throw error;
    revalidateAll();
    return { success: true };
  } catch (err: any) {
    console.error('[toggleSectionVisibility]', err);
    return { success: false, error: err.message };
  }
}
