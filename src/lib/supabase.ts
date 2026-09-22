import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Row shape of the existing `public.messages` table. */
export interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  created_at: string;
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

/**
 * Shared Supabase client (publishable key only — anon RLS policies apply).
 * Null when the env vars are missing so the chat can degrade gracefully
 * instead of crashing the page.
 */
export const supabase: SupabaseClient | null =
  url && publishableKey ? createClient(url, publishableKey) : null;

export const isChatConfigured = supabase !== null;
