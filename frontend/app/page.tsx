import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { ArrowRightIcon, CompanionIcon, ExerciseIcon, JournalIcon, PlayIcon, TimerIcon } from "@/components/icons";

function FeatureCard({
  title,
  description,
  accent,
  icon,
  meta,
  action
}: {
  title: string;
  description: string;
  accent: "green" | "yellow";
  icon: React.ReactNode;
  meta: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="surface-card"
      style={{
        padding: 28,
        minHeight: 230,
        position: "relative",
        overflow: "hidden",
        boxShadow: accent === "green" ? "var(--shadow-green)" : undefined
      }}
    >
      <div style={{ display: "grid", gap: 18 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            display: "grid",
            placeItems: "center",
            background: accent === "green" ? "rgba(91,228,107,0.12)" : "rgba(239,193,62,0.12)",
            color: accent === "green" ? "var(--accent-primary-bright)" : "var(--accent-warning)"
          }}
        >
          {icon}
        </div>
        <div>
          <h3 style={{ margin: "0 0 10px", fontSize: 30 }}>{title}</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: 420, lineHeight: 1.7 }}>
            {description}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
          {meta}
          {action}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <AppChrome showSidebar={false}>
      <section
        style={{
          padding: "10vh 0 72px",
          textAlign: "center",
          maxWidth: 760,
          margin: "0 auto"
        }}
      >
        <div className="pill" style={{ margin: "0 auto 28px", width: "fit-content", color: "var(--accent-primary-bright)" }}>
          <span className="eyebrow">Built for PromptWars</span>
        </div>
        <h1 style={{ fontSize: "clamp(54px, 7vw, 88px)", lineHeight: 1.02, margin: "0 0 18px" }}>
          Find stillness in the <span style={{ color: "var(--accent-primary-bright)" }}>academic storm.</span>
        </h1>
        <p style={{ margin: "0 auto 32px", color: "var(--text-secondary)", fontSize: 20, maxWidth: 700, lineHeight: 1.7 }}>
          A calm AI companion for students under pressure. Journal openly, surface hidden patterns, and get grounded support designed for high-stakes study.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <Link href="/journal" className="primary-button">
            Start Check-in <ArrowRightIcon size={18} />
          </Link>
          <Link href="/companion" className="ghost-button">
            Open Companion <CompanionIcon size={18} />
          </Link>
        </div>
      </section>

      <section style={{ display: "grid", gap: 24, marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 44, marginBottom: 8 }}>Focus Core</h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 560 }}>
            Your toolkit for emotional resilience and cognitive clarity during high-pressure exam cycles.
          </p>
        </div>

        <div className="two-grid">
          <FeatureCard
            title="Emotional Journal"
            description="Track the subtle shifts in your mental state. AI detects burnout patterns and pressure loops before they harden into noise."
            accent="green"
            icon={<JournalIcon size={24} />}
            meta={
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="pill small-muted">Deep tracking</span>
                <span className="pill small-muted">Sentiment analysis</span>
              </div>
            }
            action={<div style={{ fontSize: 36, color: "var(--accent-primary-bright)", fontFamily: "var(--font-heading)" }}>84%</div>}
          />

          <FeatureCard
            title="Exercises"
            description="Actionable recovery protocols. From five-minute vagus resets to grounding drills before mock tests."
            accent="yellow"
            icon={<ExerciseIcon size={24} />}
            meta={
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="small-muted">Current goal</span>
                  <span style={{ color: "var(--accent-warning)", fontWeight: 700 }}>In progress</span>
                </div>
                <div className="progress-bar">
                  <span style={{ width: "78%", background: "var(--accent-warning)" }} />
                </div>
              </div>
            }
          />
        </div>

        <div className="surface-card" style={{ padding: 18, display: "grid", gap: 12, alignItems: "center", gridTemplateColumns: "1.15fr .85fr" }}>
          <div style={{ padding: 18 }}>
            <h3 style={{ fontSize: 32, margin: "0 0 8px" }}>Real-time Companion</h3>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 16px" }}>
              An empathetic AI layer that sits alongside your study tools. Use text first, with voice-ready architecture for later.
            </p>
            <Link href="/companion" className="pill" style={{ width: "fit-content", color: "var(--accent-primary-bright)" }}>
              Instant support <ArrowRightIcon size={16} />
            </Link>
          </div>
          <div
            style={{
              height: 140,
              borderRadius: 18,
              background:
                "radial-gradient(circle at center, rgba(91,228,107,0.22), rgba(91,228,107,0.02) 45%, transparent 70%)",
              border: "1px solid var(--border-muted)",
              display: "grid",
              placeItems: "center"
            }}
          >
            <div style={{ width: "80%", height: 2, background: "linear-gradient(90deg, transparent, var(--accent-primary-bright), transparent)" }} />
          </div>
        </div>
      </section>

      <section className="two-grid" style={{ alignItems: "center", marginBottom: 42 }}>
        <div className="surface-card" style={{ padding: 30, display: "grid", placeItems: "center", minHeight: 390 }}>
          <div
            style={{
              width: "100%",
              maxWidth: 320,
              aspectRatio: "1 / 1",
              borderRadius: 28,
              border: "3px solid rgba(239,193,62,0.9)",
              background: "var(--bg-surface)",
              display: "grid",
              placeItems: "center",
              position: "relative"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 74, lineHeight: 1, fontFamily: "var(--font-heading)" }}>25:00</div>
              <div className="eyebrow" style={{ color: "var(--text-tertiary)", marginTop: 10 }}>
                Deep work session
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 30 }}>
                <button className="icon-button" type="button" style={{ width: 56, height: 56, background: "var(--accent-warning)", color: "#191510", border: "none" }}>
                  <PlayIcon size={18} />
                </button>
                <button className="icon-button" type="button" style={{ width: 56, height: 56 }}>
                  <TimerIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 42, marginBottom: 14 }}>Structured for the grind</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 28 }}>
            Built on simple recovery science and contextual reflection rather than generic motivation. The system should lower friction when the mind is overloaded.
          </p>
          <ul style={{ display: "grid", gap: 18, padding: 0, margin: 0, listStyle: "none" }}>
            <li>
              <strong style={{ display: "block", marginBottom: 6 }}>Adaptive breaks</strong>
              <span className="small-muted">Breaks lengthen when stress markers are high.</span>
            </li>
            <li>
              <strong style={{ display: "block", marginBottom: 6 }}>Flow detection</strong>
              <span className="small-muted">Longer deep-work windows when stability improves.</span>
            </li>
            <li>
              <strong style={{ display: "block", marginBottom: 6 }}>Pattern memory</strong>
              <span className="small-muted">Recurring triggers surface across entries instead of vanishing into chat history.</span>
            </li>
          </ul>
        </div>
      </section>

      <footer className="footer-row">
        <div>Privacy first. Your emotional data should remain under your control.</div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <span>Emergency protocol</span>
          <span>Privacy policy</span>
          <span>Support center</span>
        </div>
      </footer>
    </AppChrome>
  );
}
