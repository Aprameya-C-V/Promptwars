export function MetricCard({
  label,
  value,
  accent = "low",
  subtitle,
  icon
}: {
  label: string;
  value: string;
  accent?: "green" | "yellow" | "low";
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`surface-card metric-card ${accent}`}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
        <div>
          <div className="eyebrow" style={{ color: "var(--text-tertiary)" }}>
            {label}
          </div>
          <div className="metric-value">{value}</div>
          {subtitle ? <div className="small-muted" style={{ marginTop: 10 }}>{subtitle}</div> : null}
        </div>
        {icon ? (
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "999px",
              display: "grid",
              placeItems: "center",
              border: "1px solid var(--border-strong)",
              color: accent === "yellow" ? "var(--accent-warning)" : "var(--accent-primary-bright)"
            }}
          >
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

