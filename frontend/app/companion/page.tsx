"use client";

import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { AppChrome } from "@/components/AppChrome";
import { CompanionIcon, MicIcon, SafetyIcon, SparkIcon } from "@/components/icons";
import { ApiError, sendCompanionMessage } from "@/lib/api";
import { storage } from "@/lib/storage";
import type { CompanionMessage, JournalEntry, SafetyStatus } from "@/lib/types";

function createWelcomeMessage(): CompanionMessage {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    text: "I’m here. Tell me what feels heaviest about your preparation right now, and we’ll reduce it to one manageable next step.",
    createdAt: new Date().toISOString()
  };
}

function formatMessageTime(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  }).format(new Date(createdAt));
}

export default function CompanionPage() {
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [safety, setSafety] = useState<{ status: SafetyStatus; message?: string }>({
    status: "ok"
  });
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = storage.loadCompanionMessages();
    setMessages(stored.length ? stored : [createWelcomeMessage()]);
    setJournalEntries(storage.loadJournalEntries());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) storage.saveCompanionMessages(messages);
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [hydrated, messages, loading]);

  const quickReplies = useMemo(
    () => ["Help me calm down", "Plan my next 30 minutes", "I feel stuck"],
    []
  );

  const latestAnalysis = journalEntries[0]?.analysis;
  const recentMood = latestAnalysis ? `${latestAnalysis.moodScore.toFixed(1)}/10` : "No check-in";
  const trendDescription = latestAnalysis
    ? `${latestAnalysis.primaryEmotion} · ${latestAnalysis.energyLevel} energy`
    : "Complete a journal check-in to personalize this space.";

  async function submitMessage(messageText: string, appendUser = true) {
    if (!messageText.trim() || loading) return;

    const userMessage: CompanionMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText.trim(),
      createdAt: new Date().toISOString()
    };
    const nextMessages = appendUser ? [...messages, userMessage] : messages;

    if (appendUser) setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await sendCompanionMessage({
        message: userMessage.text,
        recentEntries: journalEntries.slice(0, 3),
        recentMessages: nextMessages.slice(-10)
      });
      const reply: CompanionMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: result.reply.text,
        createdAt: new Date().toISOString()
      };

      setMessages((current) => [...current, reply]);
      setSafety(result.safety);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Hesychia could not respond. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitMessage(input);
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(input);
    }
  }

  const safetyLabel =
    safety.status === "crisis"
      ? "Immediate support recommended"
      : safety.status === "elevated"
        ? "Extra support active"
        : "Private companion session";

  return (
    <AppChrome>
      <div
        className={`safety-banner ${safety.status}`}
        role={safety.status === "crisis" ? "alert" : "status"}
      >
        <span className="eyebrow">{safetyLabel}</span>
        <button className="text-button" type="button" onClick={() => setShowSupport((value) => !value)} aria-expanded={showSupport}>
          Access support options
        </button>
      </div>

      {showSupport ? (
        <div className="support-panel" role="region" aria-label="Immediate support options">
          <strong>If you may be in immediate danger, contact local emergency services now.</strong>
          <p>
            You can also call a trusted person and ask them to stay with you. Hesychia is not an
            emergency service or a substitute for professional care.
          </p>
        </div>
      ) : null}

      <div className="companion-layout">
        <section className="chat-panel" aria-label="Companion conversation">
          <div className="chat-scroll" aria-live="polite" aria-busy={loading}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message-row ${message.role === "user" ? "user" : "assistant"}`}
              >
                <div className={`chat-bubble ${message.role === "user" ? "user" : "bot"}`}>
                  {message.text}
                </div>
                <time className="small-muted" dateTime={message.createdAt}>
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            ))}

            {loading ? (
              <div className="chat-bubble bot typing-indicator">
                <span />
                <span />
                <span />
                <span className="sr-only">Hesychia is thinking</span>
              </div>
            ) : null}
            <div ref={scrollAnchorRef} />
          </div>

          <form className="chat-composer" onSubmit={onSubmit}>
            <div className="quick-replies" aria-label="Suggested messages">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  className="pill quick-reply"
                  type="button"
                  onClick={() => void submitMessage(reply)}
                  disabled={loading}
                >
                  {reply}
                </button>
              ))}
            </div>

            {error ? (
              <div className="inline-error" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    const last = messages.at(-1);
                    if (last?.role === "user") void submitMessage(last.text, false);
                  }}
                >
                  Retry
                </button>
              </div>
            ) : null}

            <div className="composer-row">
              <label className="sr-only" htmlFor="companion-message">
                Message Hesychia
              </label>
              <textarea
                id="companion-message"
                className="textarea-surface"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onComposerKeyDown}
                placeholder="What is on your mind?"
                maxLength={2000}
              />
              <button className="primary-button" type="submit" disabled={loading || !input.trim()}>
                {loading ? "Sending…" : "Send"}
              </button>
            </div>

            <div className="composer-meta">
              <Link href="/voice" className="voice-link">
                <MicIcon size={16} /> Switch to live voice
              </Link>
              <span>Enter to send · Shift+Enter for a new line</span>
            </div>
          </form>
        </section>

        <aside className="companion-insights">
          <div>
            <div className="eyebrow section-label">Latest check-in</div>
            <div className="surface-card insight-summary">
              <div className="latest-mood">{recentMood}</div>
              <p>{trendDescription}</p>
              <div className="mood-bars" aria-label="Recent journal mood scores">
                {journalEntries
                  .slice(0, 5)
                  .reverse()
                  .map((entry) => (
                    <span
                      key={entry.id}
                      style={{ height: `${entry.analysis.moodScore * 10}%` }}
                    />
                  ))}
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow section-label">Useful now</div>
            <div className="recommendation-list">
              {[
                {
                  title: "4-7-8 Breathing",
                  meta: "2 mins · De-stress",
                  icon: <SparkIcon size={20} color="var(--accent-primary-bright)" />
                },
                {
                  title: "Body Scan",
                  meta: "5 mins · Grounding",
                  icon: <SafetyIcon size={20} color="var(--accent-warning)" />
                },
                {
                  title: "Mind Dump",
                  meta: "Quick journaling",
                  icon: <CompanionIcon size={20} color="var(--accent-low)" />
                }
              ].map((item) => (
                <div key={item.title} className="surface-card recommendation-card">
                  <div className="recommendation-icon">{item.icon}</div>
                  <div>
                    <div className="recommendation-title">{item.title}</div>
                    <div className="small-muted">{item.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card voice-cta">
            <h3>Prefer speaking?</h3>
            <p>
              Move into a low-latency Gemini Live session with spoken responses and live
              transcription.
            </p>
            <Link href="/voice" className="primary-button">
              <MicIcon size={18} /> Start voice session
            </Link>
          </div>
        </aside>
      </div>
    </AppChrome>
  );
}
