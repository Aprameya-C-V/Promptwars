export function InsightChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid var(--border-muted)",
        color: "var(--text-secondary)"
      }}
    >
      {children}
    </span>
  );
}

