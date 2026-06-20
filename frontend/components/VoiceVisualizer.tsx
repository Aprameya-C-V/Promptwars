import type { VoiceSessionState } from "@/lib/live/session";

export function VoiceVisualizer({
  state,
  muted
}: {
  state: VoiceSessionState;
  muted: boolean;
}) {
  const heights = [40, 54, 68, 78, 82, 72, 56, 64, 60, 80, 58, 52, 46, 50, 76, 48, 44];
  const active = state === "connected" && !muted;

  return (
    <div
      className={`voice-orb ${active ? "active" : ""} ${muted ? "muted" : ""}`}
      aria-hidden="true"
    >
      <div className="wave-bars">
        {heights.map((height, index) => (
          <span
            key={`${height}-${index}`}
            style={{ height: active ? height : Math.max(18, height * 0.42) }}
          />
        ))}
      </div>
    </div>
  );
}
