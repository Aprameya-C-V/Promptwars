"use client";

import { useMemo, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { MetricCard } from "@/components/MetricCard";
import { InsightChip } from "@/components/InsightChip";
import { JournalIcon, MicIcon, SparkIcon, TimerIcon } from "@/components/icons";
import { analyzeJournal } from "@/lib/api";
import { storage } from "@/lib/storage";
import type { ExamType, JournalAnalysis, JournalEntry, SafetyStatus } from "@/lib/types";

const examOptions: ExamType[] = ["NEET", "JEE", "CUET", "CAT", "GATE", "UPSC", "OTHER"];

const fallbackAnalysis: JournalAnalysis = {
  moodScore: 7.4,
  energyLevel: "medium",
  primaryEmotion: "anxious",
  stressTriggers: ["Physics backlog", "Mock percentile", "Sleep deprivation"],
  hiddenPattern: "You tend to feel more anxious midweek when performance comparisons stack up.",
  urgency: "medium",
  supportiveSummary:
    "You are carrying pressure, but the writing also shows persistence. Focus on the chapter you can close today instead of the entire exam horizon."
};

export default function JournalPage() {
  const [text, setText] = useState("I'm feeling overwhelmed by the mock test results today...");
  const [examType, setExamType] = useState<ExamType>("NEET");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<JournalAnalysis>(fallbackAnalysis);
  const [safety, setSafety] = useState<{ status: SafetyStatus; message?: string }>({ status: "ok" });

  const progressMessage = useMemo(() => {
    if (safety.status === "crisis") return safety.message ?? "Immediate support is recommended.";
    if (safety.status === "elevated") return safety.message ?? "Let's keep this practical and grounded.";
    return "Despite the pressure, your journaling is showing resilience. Keep the next step small and specific.";
  }, [safety]);

  async function onSubmit() {
    setLoading(true);
    try {
      const result = await analyzeJournal({ text, examType });
      setAnalysis(result.analysis);
      setSafety(result.safety);

      const nextEntry: JournalEntry = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        examType,
        rawText: text,
        analysis: result.analysis
      };

      const entries = [nextEntry, ...storage.loadJournalEntries()].slice(0, 30);
      storage.saveJournalEntries(entries);
    } catch {
      setAnalysis(fallbackAnalysis);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppChrome>
      <div style={{ display: "grid", gap: 24 }}>
        <div>
          <h1 style={{ fontSize: 52, margin: "0 0 8px" }}>Journal Entry</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            Unload the signal beneath the noise. Open writing is the fastest way to surface patterns.
          </p>
        </div>

        <div className="info-grid">
          <div className="surface-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 18, alignItems: "start" }}>
              <div>
                <div style={{ fontSize: 54, lineHeight: 1, color: "var(--accent-primary-bright)", fontFamily: "var(--font-heading)" }}>
                  Unload your thoughts.
                </div>
                <p style={{ color: "var(--text-secondary)", maxWidth: 400, lineHeight: 1.6 }}>
                  Don&apos;t filter. Speak your mind about today&apos;s prep, the friction you felt, and what keeps looping.
                </p>
              </div>

              <div style={{ minWidth: 180 }}>
                <div className="eyebrow" style={{ color: "var(--text-tertiary)", marginBottom: 10 }}>
                  Active goal
                </div>
                <select
                  className="select-surface"
                  value={examType}
                  onChange={(event) => setExamType(event.target.value as ExamType)}
                >
                  {examOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} Aspirant
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              className="textarea-surface"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="What is taking up too much space in your head right now?"
            />

            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="icon-button" type="button" aria-label="Voice input">
                  <MicIcon size={18} />
                </button>
                <button className="icon-button" type="button" aria-label="Attach prompt">
                  <JournalIcon size={18} />
                </button>
              </div>

              <button className="primary-button" type="button" onClick={onSubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Submit Entry"}
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: 28 }}>AI Analysis Insights</h2>
              <span className="pill" style={{ background: "rgba(91,228,107,0.12)", color: "var(--accent-primary-bright)" }}>
                Real-time
              </span>
            </div>

            <MetricCard label="Mood score" value={`${analysis.moodScore.toFixed(1)} / 10`} accent="green" icon={<JournalIcon size={28} />} />
            <MetricCard label="Energy level" value={analysis.energyLevel[0].toUpperCase() + analysis.energyLevel.slice(1)} accent="yellow" icon={<TimerIcon size={28} />} />

            <div className="surface-card" style={{ padding: 24 }}>
              <div className="eyebrow" style={{ color: "var(--text-tertiary)", marginBottom: 16 }}>
                Top stress triggers
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {analysis.stressTriggers.map((trigger) => (
                  <InsightChip key={trigger}>{trigger}</InsightChip>
                ))}
              </div>
            </div>

            <div className="surface-card" style={{ padding: 24, boxShadow: "inset 3px 0 0 var(--accent-warning)" }}>
              <div className="eyebrow" style={{ color: "var(--text-tertiary)", marginBottom: 12 }}>
                Hidden pattern detected
              </div>
              <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: 22, lineHeight: 1.6 }}>
                “{analysis.hiddenPattern ?? "No recurring pattern is stable enough to surface yet."}”
              </p>
            </div>

            <div className="surface-card" style={{ padding: 28, background: "linear-gradient(180deg, rgba(32,38,49,0.94), rgba(32,38,49,0.88))", boxShadow: "var(--shadow-green)" }}>
              <div style={{ display: "flex", alignItems: "start", gap: 14 }}>
                <SparkIcon size={24} color="var(--accent-primary-bright)" />
                <div>
                  <h3 style={{ margin: "0 0 10px", color: "var(--accent-primary-bright)", fontSize: 34 }}>
                    You&apos;re making progress.
                  </h3>
                  <p style={{ color: "var(--text-primary)", margin: "0 0 18px", lineHeight: 1.7 }}>{progressMessage}</p>
                  <a href="/exercises" style={{ color: "var(--accent-primary-bright)", fontWeight: 700 }}>
                    View suggested exercise →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
