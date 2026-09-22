import { useEffect, useState } from "react";
import type {
  RealtimeChannel,
  SupabaseClient,
} from "@supabase/supabase-js";

/**
 * Live anonymous visitor keys via Supabase Presence.
 * Returns null when Realtime is unavailable (env missing/offline) so
 * callers can gracefully hide presence UI instead of showing stale data.
 *
 * The client is dynamically imported so supabase-js stays out of the main
 * bundle (this hook runs inside the always-mounted sidebar).
 */
export function useViewers(): string[] | null {
  const [viewers, setViewers] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    let client: SupabaseClient | null = null;
    let channel: RealtimeChannel | null = null;

    (async () => {
      const { supabase } = await import("../lib/supabase");
      if (cancelled || !supabase) return;
      client = supabase;
      const key = Math.random().toString(36).slice(2);
      channel = client.channel("viewers", {
        config: { presence: { key } },
      });
      channel
        .on("presence", { event: "sync" }, () => {
          if (channel) setViewers(Object.keys(channel.presenceState()));
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED" && channel) {
            await channel.track({ online_at: new Date().toISOString() });
          }
        });
    })();

    return () => {
      cancelled = true;
      if (client && channel) client.removeChannel(channel);
    };
  }, []);

  return viewers;
}
