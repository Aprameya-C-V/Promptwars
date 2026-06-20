import { AppChrome } from "@/components/AppChrome";
import { ExerciseIcon, PlayIcon, TimerIcon } from "@/components/icons";

const steps = [
  {
    title: "Exhale completely",
    body: "Release all the air from your lungs through your mouth. Empty your chest entirely and let the shoulders drop."
  },
  {
    title: "Inhale (4 seconds)",
    body: "Breathe in slowly through your nose. Let the breath fill low in the body before it rises into the chest."
  },
  {
    title: "Hold (4 seconds)",
    body: "Stay soft at the top of the inhale. The goal is steadiness, not force."
  },
  {
    title: "Exhale and hold (4 seconds each)",
    body: "Exhale over 4 seconds, then hold the empty state for another 4. Repeat for the full cycle."
  }
];

export default function ExercisesPage() {
  return (
    <AppChrome>
      <div style={{ display: "grid", gap: 28, maxWidth: 940, margin: "0 auto" }}>
        <header style={{ textAlign: "center", paddingTop: 20 }}>
          <div className="eyebrow" style={{ color: "var(--accent-warning)", marginBottom: 16 }}>
            Active training
          </div>
          <h1 style={{ fontSize: 64, margin: "0 0 12px" }}>Mental Fortitude</h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: 620, margin: "0 auto", fontSize: 20, lineHeight: 1.7 }}>
            Precise physiological protocols designed to recalibrate your nervous system during high-stress academic cycles.
          </p>
        </header>

        <section className="surface-card" style={{ padding: 30, boxShadow: "var(--shadow-green)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "start", flexWrap: "wrap" }}>
            <div style={{ maxWidth: 520 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <span className="pill" style={{ background: "rgba(91,228,107,0.12)", color: "var(--accent-primary-bright)" }}>
                  Neural recovery
                </span>
                <span className="small-muted" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <TimerIcon size={16} /> 5 minutes
                </span>
              </div>
              <h2 style={{ fontSize: 44, margin: "0 0 12px" }}>Box Breathing</h2>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: 20 }}>
                A direct reset used to regain calm and attentional control. This exercise regulates breathing rhythm so the body stops acting like the threat is still present.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 24 }}>
                <button className="primary-button" type="button">
                  <PlayIcon size={18} /> Start timer
                </button>
                <button className="dark-button" type="button">
                  View research
                </button>
              </div>
            </div>

            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 28,
                background: "rgba(91,228,107,0.07)",
                display: "grid",
                placeItems: "center",
                color: "rgba(91,228,107,0.32)"
              }}
            >
              <ExerciseIcon size={42} />
            </div>
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: 34, marginBottom: 18 }}>Step-by-step protocol</h3>
          <div style={{ display: "grid", gap: 24 }}>
            {steps.map((step, index) => (
              <div key={step.title} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: 20 }}>
                <div style={{ display: "grid", justifyItems: "center" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--border-muted)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--accent-primary-bright)",
                      fontWeight: 700,
                      fontSize: 13
                    }}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 ? <div style={{ width: 1, flex: 1, background: "var(--border-muted)", minHeight: 54 }} /> : null}
                </div>
                <div>
                  <h4 style={{ margin: "0 0 8px", fontSize: 28 }}>{step.title}</h4>
                  <p style={{ color: "var(--text-secondary)", margin: 0, lineHeight: 1.75 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card" style={{ padding: 28 }}>
          <div className="eyebrow" style={{ color: "var(--accent-warning)", marginBottom: 10 }}>
            The neuroscience of calm
          </div>
          <h3 style={{ fontSize: 34, margin: "0 0 12px" }}>Scientific mechanism</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Box breathing helps stimulate parasympathetic recovery by slowing and stabilizing respiratory rhythm. In practice, it lowers the sense of internal urgency that makes studying feel mentally unsafe.
          </p>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
            For students, this is valuable because it helps reduce the “inner noise” of exam stress before it turns into avoidance, panic, or thought fragmentation.
          </p>
        </section>
      </div>
    </AppChrome>
  );
}
