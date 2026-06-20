import { AppChrome } from "@/components/AppChrome";
import { SparkIcon, WarningIcon } from "@/components/icons";

const barValues = [38, 44, 35, 56, 63, 59, 72, 78, 69, 85, 92, 81, 66, 50];
const triggers = [
  { label: "Digital Noise", events: 14, width: "86%" },
  { label: "Sleep Latency", events: 8, width: "54%" },
  { label: "Context Switching", events: 6, width: "39%" },
  { label: "Environment Temp", events: 3, width: "16%" }
];

export default function TrendsPage() {
  return (
    <AppChrome>
      <div style={{ display: "grid", gap: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <h1 style={{ fontSize: 72, margin: "0 0 12px", color: "var(--accent-primary-bright)" }}>Trends</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 22, maxWidth: 780, lineHeight: 1.6 }}>
              Uncover the underlying architecture of your academic focus and mental clarity over the past 30 days.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <button className="dark-button" type="button">Last 7 days</button>
            <button className="ghost-button" type="button">Last 30 days</button>
          </div>
        </div>

        <section className="surface-card" style={{ padding: 30 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: "0 0 10px", fontSize: 36 }}>Focus &amp; Clarity Velocity</h2>
              <p style={{ color: "var(--text-secondary)", margin: 0 }}>Aggregated emotional telemetry and cognitive focus metrics.</p>
            </div>
            <div style={{ display: "flex", gap: 18, color: "var(--text-secondary)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: "var(--accent-primary-bright)" }} /> Clarity
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: "var(--accent-warning)" }} /> Stability
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 28, alignItems: "end", height: 280, marginTop: 30, padding: "0 10px" }}>
            {barValues.map((value, index) => (
              <div key={index} style={{ display: "grid", gap: 10, justifyItems: "center", flex: 1 }}>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 26,
                    height: `${value * 2}px`,
                    borderRadius: 8,
                    background: "linear-gradient(180deg, var(--accent-primary-bright), rgba(91,228,107,0.18))"
                  }}
                />
                {index % 3 === 0 ? <span className="small-muted">W{Math.floor(index / 3) + 1}</span> : <span className="small-muted" />}
              </div>
            ))}
          </div>
        </section>

        <div className="two-grid">
          <section className="surface-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(239,193,62,0.14)", display: "grid", placeItems: "center", color: "var(--accent-warning)" }}>
                <WarningIcon size={24} />
              </div>
              <h2 style={{ margin: 0, fontSize: 28 }}>Focus Triggers</h2>
            </div>

            <div style={{ display: "grid", gap: 28 }}>
              {triggers.map((trigger) => (
                <div key={trigger.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <strong>{trigger.label}</strong>
                    <span style={{ color: "var(--accent-warning)", fontWeight: 700 }}>{trigger.events} Events</span>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: trigger.width, background: "var(--accent-warning)" }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(91,228,107,0.12)", display: "grid", placeItems: "center", color: "var(--accent-primary-bright)" }}>
                  <SparkIcon size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: 28 }}>Hidden Patterns</h2>
              </div>
              <span className="pill" style={{ color: "var(--accent-primary-bright)" }}>AI insights active</span>
            </div>

            <div className="two-grid">
              {[
                ["The Golden Hour", "Your journaling clarity is strongest when conducted within 15 minutes of waking."],
                ["Circadian Drift", "Wednesday dips in stability correlate with late-night Tuesday study sprints."],
                ["Exercise Synergy", "Light movement before study sessions appears to reduce overload and recovery lag."],
                ["Companion Frequency", "Companion check-ins on Sundays improve Monday stability and outlook."]
              ].map(([title, body]) => (
                <div key={title} className="thin-card" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: 24, margin: "0 0 12px" }}>{title}</h3>
                  <p style={{ color: "var(--text-secondary)", margin: 0, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>

            <button className="dark-button" type="button" style={{ width: "100%", marginTop: 24 }}>
              View full subconscious report
            </button>
          </section>
        </div>

        <div className="three-grid">
          {[
            { label: "Stability index", value: "8.4", sub: "+12% from last week", color: "var(--accent-primary-bright)" },
            { label: "Deep work hrs", value: "42.5", sub: "Near all-time high", color: "var(--accent-warning)" },
            { label: "Mental resilience", value: "Elite", sub: "Optimized state", color: "var(--text-primary)" }
          ].map((card) => (
            <div key={card.label} className="thin-card" style={{ padding: 30, textAlign: "center" }}>
              <div className="eyebrow" style={{ color: "var(--text-tertiary)", marginBottom: 12 }}>{card.label}</div>
              <div style={{ fontSize: 64, fontFamily: "var(--font-heading)", color: card.color }}>{card.value}</div>
              <div style={{ color: card.color === "var(--text-primary)" ? "var(--accent-primary-bright)" : "var(--text-secondary)", marginTop: 10 }}>{card.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </AppChrome>
  );
}
