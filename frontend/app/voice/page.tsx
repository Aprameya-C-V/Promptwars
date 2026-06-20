"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { MicIcon } from "@/components/icons";
import { VoiceVisualizer } from "@/components/VoiceVisualizer";
import {
  startVoiceSession,
  type LiveSessionHandle,
  type VoiceSessionMessage,
  type VoiceSessionState
} from "@/lib/live/session";
import { mergeTranscriptMessage } from "@/lib/live/transcript";
import { hasImmediateRiskLanguage } from "@/lib/safety";
import { storage } from "@/lib/storage";
import type { JournalEntry } from "@/lib/types";

export default function VoicePage() {
  const sessionRef = useRef<LiveSessionHandle | null>(null);
  const [state, setState] = useState<VoiceSessionState>("idle");
  const [status, setStatus] = useState("Start when you are ready. Your browser will ask for microphone access.");
  const [messages, setMessages] = useState<VoiceSessionMessage[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [muted, setMuted] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [crisisDetected, setCrisisDetected] = useState(false);

  useEffect(() => {
    setJournalEntries(storage.loadJournalEntries());
    return () => {
      void sessionRef.current?.stop();
      sessionRef.current = null;
    };
  }, []);

  const listeningLabel = useMemo(() => {
    if (state === "connecting") return "Connecting securely";
    if (state === "connected" && muted) return "Microphone muted";
    if (state === "connected") return "Live voice active";
    if (state === "error") return "Connection needs attention";
    return "Gemini Live companion";
  }, [state, muted]);

  async function beginSession() {
    if (sessionRef.current || state === "connecting") return;
    setMessages([]);
    setCrisisDetected(false);

    try {
      const handle = await startVoiceSession({
        onStateChange: setState,
        onStatus: setStatus,
        recentEntries: journalEntries.slice(0, 3),
        onMessage: (message) => {
          setMessages((current) => mergeTranscriptMessage(current, message));
          if (
            message.role === "user" &&
            message.final &&
            hasImmediateRiskLanguage(message.text)
          ) {
            setCrisisDetected(true);
            setStatus("Voice coaching paused. Please contact immediate human support now.");
            const activeSession = sessionRef.current;
            sessionRef.current = null;
            if (activeSession) {
              void activeSession.stop().finally(() => {
                setStatus("Voice coaching paused. Please contact immediate human support now.");
              });
            }
          }
        },
        onEnded: () => {
          sessionRef.current = null;
          setMuted(false);
        }
      });

      sessionRef.current = handle;
      setMuted(handle.isMuted());
    } catch {
      sessionRef.current = null;
    }
  }

  async function endSession() {
    const current = sessionRef.current;
    sessionRef.current = null;
    if (current) await current.stop();
    setMuted(false);
  }

  function toggleMute() {
    if (!sessionRef.current) return;
    setMuted(sessionRef.current.toggleMute());
  }

  function sendText(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = textInput.trim();
    if (!sessionRef.current || !text) return;
    sessionRef.current.sendText(text);
    setMessages((current) =>
      mergeTranscriptMessage(current, {
        role: "user",
        text,
        timestamp: new Date().toISOString(),
        final: true
      })
    );
    setTextInput("");
  }

  const recentContext = journalEntries.slice(0, 3);

  return (
    <AppChrome>
      <div className="voice-layout">
        <section className="voice-stage" aria-labelledby="voice-title">
          <div className="eyebrow voice-state">{listeningLabel}</div>
          <h1 id="voice-title">A conversation that meets you where you are.</h1>
          <p className="voice-status" role="status" aria-live="polite">
            {status}
          </p>

          {crisisDetected ? (
            <div className="voice-crisis-alert" role="alert">
              <strong>Immediate human support matters more than continuing this session.</strong>
              <p>
                Contact local emergency services, a crisis line in your country, or a trusted
                person who can stay with you now.
              </p>
            </div>
          ) : null}

          <VoiceVisualizer state={state} muted={muted} />

          <div className="voice-controls" aria-label="Voice session controls">
            {state === "idle" || state === "error" ? (
              <button
                className="voice-primary-control"
                type="button"
                onClick={() => void beginSession()}
                aria-label="Start voice session"
              >
                <MicIcon size={30} />
                <span>Start</span>
              </button>
            ) : (
              <>
                <button
                  className={`voice-primary-control ${muted ? "muted" : ""}`}
                  type="button"
                  onClick={toggleMute}
                  disabled={state === "connecting"}
                  aria-pressed={muted}
                >
                  <MicIcon size={30} />
                  <span>{muted ? "Unmute" : "Mute"}</span>
                </button>
                <button className="dark-button end-voice-button" type="button" onClick={() => void endSession()}>
                  End session
                </button>
              </>
            )}
          </div>

          <div className="voice-privacy-note">
            Audio streams directly to Gemini Live for this session. Your long-lived Gemini API key
            never enters the browser.
          </div>

          <div className="transcript-panel" aria-live="polite">
            <div className="transcript-header">
              <h2>Live transcript</h2>
              <span>{messages.length ? `${messages.length} turns` : "Waiting for conversation"}</span>
            </div>
            <div className="transcript-scroll">
              {messages.length ? (
                messages.map((message, index) => (
                  <div className={`transcript-line ${message.role}`} key={`${message.timestamp}-${index}`}>
                    <span>{message.role === "assistant" ? "Hesychia" : "You"}</span>
                    <p>{message.text}</p>
                  </div>
                ))
              ) : (
                <p className="transcript-empty">
                  Your words and Hesychia&apos;s responses will appear here once the session begins.
                </p>
              )}
            </div>

            <form className="voice-text-form" onSubmit={sendText}>
              <label className="sr-only" htmlFor="voice-text-input">
                Type a message during the voice session
              </label>
              <input
                id="voice-text-input"
                className="input-surface"
                value={textInput}
                onChange={(event) => setTextInput(event.target.value)}
                placeholder="Type if speaking is difficult right now"
                disabled={state !== "connected"}
              />
              <button
                className="dark-button"
                type="submit"
                disabled={state !== "connected" || !textInput.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </section>

        <aside className="voice-context">
          <div>
            <div className="eyebrow section-label">Context carried in</div>
            <h2>Your recent signals</h2>
            <p>
              Voice support stays grounded in the themes you have already surfaced through
              journaling.
            </p>
          </div>

          <div className="voice-context-list">
            {recentContext.length ? (
              recentContext.map((entry) => (
                <div className="surface-card voice-context-card" key={entry.id}>
                  <div>
                    <span>{entry.analysis.primaryEmotion}</span>
                    <strong>{entry.analysis.moodScore.toFixed(1)}/10</strong>
                  </div>
                  <p>{entry.analysis.supportiveSummary}</p>
                </div>
              ))
            ) : (
              <div className="surface-card voice-context-card">
                <p>No journal context yet. Voice mode still works as a private standalone check-in.</p>
              </div>
            )}
          </div>

          <div className="voice-safety-card">
            <strong>Hesychia supports reflection, not emergency care.</strong>
            <p>If you may hurt yourself or someone else, contact local emergency services or a trusted person now.</p>
          </div>

          <Link href="/companion" className="dark-button">
            Continue in text chat
          </Link>
        </aside>
      </div>
    </AppChrome>
  );
}
