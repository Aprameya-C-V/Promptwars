"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { JournalIcon, SparkIcon, WarningIcon } from "@/components/icons";
import { storage } from "@/lib/storage";
import { summarizeTrends } from "@/lib/trends";
import type { JournalEntry } from "@/lib/types";

export default function TrendsPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [days, setDays] = useState<7 | 30>(30);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(storage.loadJournalEntries());
    setLoaded(true);
  }, []);

  const summary = useMemo(() => summarizeTrends(entries, days), [days, entries]);
  const chartMaximum = Math.max(
    10,
    ...summary.entries.map((entry) => entry.analysis.moodScore)
  );

  return (
    <AppChrome>
      <div className="trends-page">
        <header className="trends-header">
          <div>
            <div className="eyebrow" style={{ color: "var(--accent-primary-bright)" }}>
              Your actual check-ins
            </div>
            <h1>Patterns, not guesses.</h1>
            <p>
              Hesychia turns your journal history into a transparent view of mood shifts,
              recurring stress triggers, and patterns worth noticing.
            </p>
          </div>
          <div className="trend-range" aria-label="Trend range">
            <button
              className={days === 7 ? "ghost-button active" : "dark-button"}
              type="button"
              onClick={() => setDays(7)}
              aria-pressed={days === 7}
            >
              7 days
            </button>
            <button
              className={days === 30 ? "ghost-button active" : "dark-button"}
              type="button"
              onClick={() => setDays(30)}
              aria-pressed={days === 30}
            >
              30 days
            </button>
          </div>
        </header>

        {loaded && !summary.entries.length ? (
          <section className="surface-card trends-empty">
            <JournalIcon size={34} />
            <h2>Your trend line begins with an honest check-in.</h2>
            <p>
              Add at least one journal entry. Hesychia will show only patterns grounded in what
              you actually recorded.
            </p>
            <Link href="/journal" className="primary-button">
              Start a journal check-in
            </Link>
          </section>
        ) : (
          <>
            <section className="trend-metrics" aria-label="Trend summary">
              <div className="thin-card">
                <span>Average mood</span>
                <strong>{summary.averageMood?.toFixed(1) ?? "—"}</strong>
                <small>out of 10</small>
              </div>
              <div className="thin-card">
                <span>Average energy</span>
                <strong>{summary.averageEnergy?.toFixed(1) ?? "—"}</strong>
                <small>normalized score</small>
              </div>
              <div className="thin-card">
                <span>Mood direction</span>
                <strong>
                  {summary.moodChange === null
                    ? "—"
                    : `${summary.moodChange >= 0 ? "+" : ""}${summary.moodChange.toFixed(1)}`}
                </strong>
                <small>first to latest entry</small>
              </div>
            </section>

            <section className="surface-card trend-chart-card">
              <div>
                <h2>Mood check-in history</h2>
                <p>{summary.entries.length} entries in the selected period.</p>
              </div>
              <div className="trend-chart" role="img" aria-label="Mood scores over time">
                {summary.entries.map((entry) => (
                  <div className="trend-bar-item" key={entry.id}>
                    <span
                      className="trend-bar"
                      style={{
                        height: `${Math.max(8, (entry.analysis.moodScore / chartMaximum) * 100)}%`
                      }}
                      title={`${entry.analysis.moodScore}/10 on ${new Date(entry.createdAt).toLocaleDateString("en")}`}
                    />
                    <time dateTime={entry.createdAt}>
                      {new Date(entry.createdAt).toLocaleDateString("en", {
                        month: "short",
                        day: "numeric"
                      })}
                    </time>
                  </div>
                ))}
              </div>
            </section>

            <div className="two-grid">
              <section className="surface-card trend-detail-card">
                <div className="trend-section-title">
                  <WarningIcon size={22} />
                  <h2>Recurring stress triggers</h2>
                </div>
                {summary.triggerSummaries.length ? (
                  <div className="trigger-list">
                    {summary.triggerSummaries.map((trigger) => (
                      <div key={trigger.label}>
                        <div>
                          <strong>{trigger.label}</strong>
                          <span>{trigger.events} {trigger.events === 1 ? "entry" : "entries"}</span>
                        </div>
                        <div className="progress-bar">
                          <span
                            style={{
                              width: `${trigger.percentage}%`,
                              background: "var(--accent-warning)"
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="small-muted">No recurring triggers have been recorded yet.</p>
                )}
              </section>

              <section className="surface-card trend-detail-card">
                <div className="trend-section-title green">
                  <SparkIcon size={22} />
                  <h2>Journal patterns</h2>
                </div>
                {summary.hiddenPatterns.length ? (
                  <div className="pattern-list">
                    {summary.hiddenPatterns.map((pattern) => (
                      <blockquote key={pattern}>{pattern}</blockquote>
                    ))}
                  </div>
                ) : (
                  <p className="small-muted">
                    More entries are needed before a supported pattern can be surfaced.
                  </p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </AppChrome>
  );
}
