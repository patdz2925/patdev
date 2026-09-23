import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Row shape of the existing `public.messages` table. */
export interface ChatMessage {
  id: string;
  nickname: string;
  message: string;
  created_at: string;
  /** Soft-delete marker; null = visible. Only the admin can read muted rows. */
  deleted_at: string | null;
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

/**
 * Supabase Auth UID of the chat admin (the site owner). Empty/unset means
 * no admin UI is offered. The UID itself is not a secret — enforcement
 * happens server-side in RLS; this only gates which buttons render.
 */
export const ADMIN_UID =
  (import.meta.env.VITE_CHAT_ADMIN_UID as string | undefined) || "";

/**
 * Shared Supabase client (publishable key only — anon RLS policies apply).
 * Null when the env vars are missing so the chat can degrade gracefully
 * instead of crashing the page.
 */
export const supabase: SupabaseClient | null =
  url && publishableKey ? createClient(url, publishableKey) : null;

export const isChatConfigured = supabase !== null;
