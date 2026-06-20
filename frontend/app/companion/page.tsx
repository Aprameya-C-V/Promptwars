"use client";

import { useEffect, useMemo, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { CompanionIcon, MicIcon, SafetyIcon, SparkIcon } from "@/components/icons";
import { sendCompanionMessage } from "@/lib/api";
import { storage } from "@/lib/storage";
import type { CompanionMessage, SafetyStatus } from "@/lib/types";

const starterMessages: CompanionMessage[] = [
  {
    id: "companion-intro-1",
    role: "assistant",
    text: "Hello. I noticed your recent check-ins suggest elevated strain. Would you like to talk about what is weighing on you, or should we switch to a grounding exercise first?",
    createdAt: new Date().toISOString()
  },
  {
    id: "companion-user-1",
    role: "user",
    text: "I'm really overwhelmed with the final project submission. I feel like I'm running out of time.",
    createdAt: new Date().toISOString()
  },
  {
    id: "companion-intro-2",
    role: "assistant",
    text: "Time pressure is one of the most common triggers for academic anxiety. Let’s break the next hour down. What is the single smallest task you could complete in 15 minutes?",
    createdAt: new Date().toISOString()
  }
];

export default function CompanionPage() {
  const [messages, setMessages] = useState<CompanionMessage[]>(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [safety, setSafety] = useState<{ status: SafetyStatus; message?: string }>({
    status: "elevated",
    message: "Elevated concern detected"
  });

  useEffect(() => {
    const stored = storage.loadCompanionMessages();
    if (stored.length) setMessages(stored);
  }, []);

  useEffect(() => {
    storage.saveCompanionMessages(messages);
  }, [messages]);

  const quickReplies = useMemo(() => ["Outline Chapter 2", "Format citations", "I don't know"], []);

  async function submitMessage(messageText: string) {
    if (!messageText.trim()) return;

    const userMessage: CompanionMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: messageText.trim(),
      createdAt: new Date().toISOString()
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const result = await sendCompanionMessage({
        message: userMessage.text,
        recentEntries: storage.loadJournalEntries().slice(0, 3),
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
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I hit a network issue. Stay with the next smallest task you can finish in 10 minutes, and try again when you’re ready.",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppChrome>
      <div style={{ marginBottom: 20, padding: "14px 18px", borderRadius: 0, background: "rgba(239,193,62,0.14)", border: "1px solid rgba(239,193,62,0.25)", color: "var(--accent-warning)", display: "flex", justifyContent: "space-between", gap: 16 }}>
        <span className="eyebrow">{safety.status === "elevated" ? "Elevated concern detected" : "Companion active"}</span>
        <span style={{ textDecoration: "underline" }}>Access SOS Mode</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) 320px", gap: 0, border: "1px solid var(--border-muted)", borderRadius: 28, overflow: "hidden", minHeight: "calc(100vh - 220px)" }}>
        <section style={{ padding: 28, display: "grid", gridTemplateRows: "1fr auto", background: "rgba(19,19,19,0.92)" }}>
          <div className="chat-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: "grid",
                  justifyItems: message.role === "user" ? "end" : "start",
                  gap: 8
                }}
              >
                <div className={`chat-bubble ${message.role === "user" ? "user" : "bot"}`}>{message.text}</div>
                <span className="small-muted">
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}

            {loading ? (
              <div className="chat-bubble bot" style={{ width: "fit-content" }}>
                Thinking through the next useful step...
              </div>
            ) : null}
          </div>

          <div style={{ display: "grid", gap: 12, paddingTop: 18 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {quickReplies.map((reply) => (
                <button key={reply} className="pill" type="button" onClick={() => submitMessage(reply)} style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)" }}>
                  {reply}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
              <textarea
                className="textarea-surface"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your reflection..."
                style={{ minHeight: 118 }}
              />
              <button className="primary-button" type="button" onClick={() => submitMessage(input)} disabled={loading}>
                Send
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 24, color: "var(--text-tertiary)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <MicIcon size={16} /> Voice input
              </span>
              <span>Attach mood log</span>
            </div>
          </div>
        </section>

        <aside style={{ padding: 28, background: "rgba(32,31,31,0.6)", borderLeft: "1px solid var(--border-muted)", display: "grid", gap: 22, alignContent: "start" }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--text-secondary)", marginBottom: 14 }}>
              Recent mood trend
            </div>
            <div className="surface-card" style={{ padding: 22 }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>
                <span style={{ color: "var(--accent-warning)", fontSize: 42, fontFamily: "var(--font-heading)" }}>Low</span> Stability
              </div>
              <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Your stress level has increased by <span style={{ color: "var(--accent-warning)" }}>24%</span> since yesterday morning.
              </p>
              <div style={{ display: "flex", gap: 8, alignItems: "end", height: 74 }}>
                {[42, 56, 28, 66, 82].map((value, index) => (
                  <span
                    key={index}
                    style={{
                      flex: 1,
                      height: `${value}%`,
                      borderRadius: 6,
                      background: index === 4 ? "rgba(239,193,62,0.42)" : "rgba(255,255,255,0.08)"
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "var(--text-secondary)", marginBottom: 14 }}>
              For you
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { title: "4-7-8 Breathing", meta: "2 mins • De-stress", icon: <SparkIcon size={20} color="var(--accent-primary-bright)" /> },
                { title: "Body Scan", meta: "5 mins • Grounding", icon: <SafetyIcon size={20} color="var(--accent-warning)" /> },
                { title: "Mind Dump", meta: "Quick journaling", icon: <CompanionIcon size={20} color="var(--accent-low)" /> }
              ].map((item) => (
                <div key={item.title} className="surface-card" style={{ padding: 22, display: "flex", gap: 16, alignItems: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 18,
                      display: "grid",
                      placeItems: "center",
                      background: "rgba(255,255,255,0.06)"
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{item.title}</div>
                    <div className="small-muted">{item.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card" style={{ padding: 24, background: "rgba(91,228,107,0.08)", borderColor: "rgba(91,228,107,0.18)" }}>
            <h3 style={{ marginTop: 0, color: "var(--accent-primary-bright)" }}>Overwhelmed?</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}>
              It&apos;s okay to step away. Start a shorter focus mode, then come back to the task with lower load.
            </p>
            <button className="primary-button" type="button" style={{ width: "100%" }}>
              Start focus mode
            </button>
          </div>
        </aside>
      </div>
    </AppChrome>
  );
}
