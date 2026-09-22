import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, RotateCw, Send, WifiOff, X } from "lucide-react";
import {
  isChatConfigured,
  supabase,
  type ChatMessage,
} from "../../lib/supabase";

const NICK_KEY = "patdev-chat-nickname";
const MAX_NICK = 24;
const MAX_MESSAGE = 500;
const HISTORY_LIMIT = 200;

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Shared public community chat (Supabase `public.messages` + Realtime).
 * Mounted once in App; visibility is driven by the `open` prop.
 * Messages render as plain text — never HTML.
 */
export function CommunityChat({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [nickname, setNickname] = useState(
    () => localStorage.getItem(NICK_KEY) ?? ""
  );
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stickRef = useRef(true);

  // Reset session state on the render where the panel opens (adjusting state
  // during render for a prop transition — avoids setState inside an effect).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setLoadError(null);
      if (isChatConfigured) setLoading(true);
    }
  }

  // Lock page scroll + close on Escape while the panel is open.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Load history + subscribe to INSERTs each time the panel opens.
  // Unsubscribe on close/unmount so no channel leaks.
  useEffect(() => {
    const client = supabase;
    if (!open || !client) return;
    let cancelled = false;
    stickRef.current = true;

    client
      .from("messages")
      .select("id,nickname,message,created_at")
      .order("created_at", { ascending: true })
      .limit(HISTORY_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError("Couldn't load messages. Check your connection.");
        } else {
          setMessages((data ?? []) as ChatMessage[]);
        }
        setLoading(false);
      });

    const channel = client
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const row = payload.new as ChatMessage;
          // Dedupe: our own insert is appended optimistically on send.
          setMessages((prev) =>
            prev.some((m) => m.id === row.id) ? prev : [...prev, row]
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, [open]);

  // Focus the message box when the panel opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open ]);

  // Auto-scroll: follow new messages while the user sits near the bottom.
  useEffect(() => {
    if (open && stickRef.current) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }
  }, [messages, open, loading]);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    stickRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < 90;
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const nick = nickname.trim();
    const text = draft.trim();
    if (!nick || !text || sending) return;
    if (nick.length > MAX_NICK) {
      setSendError(`Nickname must be ${MAX_NICK} characters or fewer.`);
      return;
    }
    if (text.length > MAX_MESSAGE) {
      setSendError(`Messages must be ${MAX_MESSAGE} characters or fewer.`);
      return;
    }
    if (!supabase) {
      setSendError("Chat isn't configured in this environment.");
      return;
    }
    setSending(true);
    setSendError(null);
    const { data, error } = await supabase
      .from("messages")
      .insert({ nickname: nick, message: text })
      .select("id,nickname,message,created_at")
      .single();
    setSending(false);
    if (error || !data) {
      setSendError("Couldn't send. Try again in a moment.");
      return;
    }
    localStorage.setItem(NICK_KEY, nick);
    setDraft("");
    stickRef.current = true;
    const row = data as ChatMessage;
    setMessages((prev) =>
      prev.some((m) => m.id === row.id) ? prev : [...prev, row]
    );
  };

  const retry = () => {
    setLoadError(null);
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      setLoadError("Chat isn't configured in this environment.");
      return;
    }
    supabase
      .from("messages")
      .select("id,nickname,message,created_at")
      .order("created_at", { ascending: true })
      .limit(HISTORY_LIMIT)
      .then(({ data, error }) => {
        if (error) {
          setLoadError("Couldn't load messages. Check your connection.");
        } else {
          setMessages((data ?? []) as ChatMessage[]);
          stickRef.current = true;
        }
        setLoading(false);
      });
  };

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[70]"
          role="dialog"
          aria-modal="true"
          aria-label="Community chat"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.section
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Community chat panel"
            className="absolute inset-x-4 bottom-4 flex h-[min(560px,78vh)] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[384px] dark:border-neutral-800 dark:bg-neutral-950"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-2.5 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-pixel text-[13px] leading-none text-neutral-900 dark:text-neutral-100">
                  community chat
                </h2>
                <p className="mt-1 font-mono text-[10.5px] text-neutral-400">
                  <span className="pulse-dot mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
                  shared live with every visitor
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="min-h-0 flex-1 overflow-y-auto px-4 py-3"
              aria-live="polite"
            >
              {!isChatConfigured ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <WifiOff className="h-5 w-5 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
                  <p className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400">
                    Chat isn't configured in this environment.
                  </p>
                </div>
              ) : loading ? (
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-500 dark:border-neutral-700 dark:border-t-neutral-300"
                  />
                  <p className="font-mono text-[12px] text-neutral-400">
                    loading messages…
                  </p>
                </div>
              ) : loadError ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400">
                    {loadError}
                  </p>
                  <button
                    type="button"
                    onClick={retry}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 font-mono text-[12px] text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-neutral-100"
                  >
                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                    retry
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center">
                  <MessageCircle className="h-5 w-5 text-neutral-300 dark:text-neutral-600" aria-hidden="true" />
                  <p className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400">
                    No messages yet — say hi.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {messages.map((m) => (
                    <li key={m.id} className="min-w-0">
                      <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100">
                          {m.nickname}
                        </span>
                        <span className="font-mono text-[10.5px] text-neutral-400">
                          {formatTime(m.created_at)}
                        </span>
                      </p>
                      <p className="mt-0.5 break-words text-[13.5px] leading-relaxed whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">
                        {m.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={send}
              className="shrink-0 border-t border-neutral-200 px-4 py-3 dark:border-neutral-800"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="nickname"
                  aria-label="Nickname"
                  autoComplete="nickname"
                  maxLength={MAX_NICK}
                  className="w-28 shrink-0 rounded-lg border border-neutral-200 bg-white px-2.5 py-2 font-mono text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="say something kind…"
                  aria-label="Message"
                  autoComplete="off"
                  maxLength={MAX_MESSAGE}
                  className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="submit"
                  disabled={sending || !nickname.trim() || !draft.trim()}
                  aria-label="Send message"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {sendError ? (
                <p role="alert" className="mt-1.5 font-mono text-[11px] text-red-500">
                  {sendError}
                </p>
              ) : null}
            </form>
          </motion.section>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
