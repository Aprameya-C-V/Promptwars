"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { MicIcon } from "@/components/icons";
import { VoiceVisualizer } from "@/components/VoiceVisualizer";
import { startVoiceSession, type VoiceSessionMessage, type VoiceSessionState } from "@/lib/live/session";

type SessionHandle = Awaited<ReturnType<typeof startVoiceSession>>;

const insightCards = [
  ["Exam Anxiety", "Focusing on stress reduction techniques for finals week."],
  ["Energy Shift", "Noticed a drop in cortisol patterns over the last 10 minutes."],
  ["Previous Summary", "Resolved lack of focus via deep breathing exercises."]
];

export default function VoicePage() {
  const sessionRef = useRef<SessionHandle | null>(null);
  const [state, setState] = useState<VoiceSessionState>("idle");
  const [status, setStatus] = useState("Voice mode is ready.");
  const [messages, setMessages] = useState<VoiceSessionMessage[]>([]);
  const [muted, setMuted] = useState(false);
  const [textInput, setTextInput] = useState("");

  const listeningLabel = useMemo(() => {
    if (state === "connecting") return "Connecting...";
    if (state === "connected" && muted) return "Muted";
    if (state === "connected") return "Listening...";
    if (state === "error") return "Connection issue";
    return "Voice ready";
  }, [state, muted]);

  async function beginSession() {
    if (sessionRef.current || state === "connecting") return;

    try {
      const session = await startVoiceSession({
        onStateChange: setState,
        onStatus: setStatus,
        onMessage: (message) => {
          setMessages((current) => {
            const last = current[current.length - 1];
            if (last && last.role === message.role && last.text === message.text) {
              return current;
            }
            return [...current.slice(-19), message];
          });
        }
      });

      sessionRef.current = session;
      setMuted(session.isMuted());
    } catch (error) {
      setState("error");
      setStatus(error instanceof Error ? error.message : "Unable to start voice session.");
    }
  }

  async function endSession() {
    if (!sessionRef.current) return;
    await sessionRef.current.stop();
    sessionRef.current = null;
    setMuted(false);
  }

  async function toggleMute() {
    if (!sessionRef.current) return;
    const nextMuted = await sessionRef.current.toggleMute();
    setMuted(nextMuted);
  }

  function sendText() {
    if (!sessionRef.current || !textInput.trim()) return;
    sessionRef.current.sendText(textInput.trim());
    setMessages((current) => [
      ...current.slice(-19),
      {
        role: "user",
        text: textInput.trim(),
        timestamp: new Date().toISOString()
      }
    ]);
    setTextInput("");
  }

  return (
    <AppChrome showSidebar={false}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 340px",
          border: "1px solid var(--border-muted)",
          borderRadius: 28,
          overflow: "hidden",
          minHeight: "calc(100vh - 170px)"
        }}
      >
        <section
          style={{
            padding: 30,
            display: "grid",
            alignContent: "center",
            justifyItems: "center",
            gap: 18
          }}
        >
          <div className="eyebrow" style={{ color: "var(--accent-primary-bright)" }}>
            {listeningLabel}
          </div>
          <h1 style={{ fontSize: 42, margin: 0 }}>Speak whenever you&apos;re ready</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0, maxWidth: 560, textAlign: "center" }}>
            {status}
          </p>
          <VoiceVisualizer />

          {messages.length ? (
            <div
              className="surface-card"
              style={{
                width: "100%",
                maxWidth: 720,
                padding: 20,
                display: "grid",
                gap: 12,
                maxHeight: 260,
                overflow: "auto"
              }}
            >
              {messages.slice(-8).map((message, index) => (
                <div key={`${message.timestamp}-${index}`}>
                  <div className="eyebrow" style={{ color: message.role === "assistant" ? "var(--accent-primary-bright)" : "var(--text-tertiary)", marginBottom: 6 }}>
                    {message.role}
                  </div>
                  <div style={{ color: "var(--text-secondary)", lineHeight: 1.65 }}>{message.text}</div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <aside
          style={{
            borderLeft: "1px solid var(--border-muted)",
            padding: 28,
            display: "grid",
            gap: 18,
            background: "rgba(29,28,28,0.78)"
          }}
        >
          <h2 style={{ margin: 0, fontSize: 30 }}>Recent insights</h2>
          {insightCards.map(([title, body]) => (
            <div key={title} className="surface-card" style={{ padding: 24 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 24 }}>{title}</h3>
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{body}</p>
            </div>
          ))}

          <Link href="/companion" className="dark-button" style={{ width: "100%", marginTop: "auto" }}>
            Session history
          </Link>
        </aside>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          marginTop: 18,
          flexWrap: "wrap"
        }}
      >
        <div className="small-muted">
          {state === "connected" ? "Live processing active" : "Session inactive"}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <textarea
            className="textarea-surface"
            value={textInput}
            onChange={(event) => setTextInput(event.target.value)}
            placeholder="Type instead"
            style={{ minHeight: 64, width: 260 }}
          />
          <button className="dark-button" type="button" onClick={sendText} disabled={!sessionRef.current}>
            Send text
          </button>

          {state === "idle" || state === "error" ? (
            <button
              className="primary-button"
              type="button"
              onClick={beginSession}
              style={{ width: 92, height: 92, borderRadius: "999px", padding: 0 }}
            >
              <MicIcon size={28} />
            </button>
          ) : (
            <button
              className={muted ? "dark-button" : "primary-button"}
              type="button"
              onClick={toggleMute}
              style={{ width: 92, height: 92, borderRadius: "999px", padding: 0 }}
            >
              <MicIcon size={28} />
            </button>
          )}

          <button
            className="dark-button"
            type="button"
            onClick={endSession}
            disabled={!sessionRef.current}
            style={{ color: "var(--accent-danger)" }}
          >
            End session
          </button>
        </div>
      </div>
    </AppChrome>
  );
}
