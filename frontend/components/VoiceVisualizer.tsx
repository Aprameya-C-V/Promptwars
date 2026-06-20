export function VoiceVisualizer() {
  const heights = [40, 54, 68, 78, 82, 72, 56, 64, 60, 80, 58, 52, 46, 50, 76, 48, 44, 50, 56, 70, 66, 54, 82, 62, 68, 72, 60, 68, 58, 62, 54, 46, 58, 42];

  return (
    <div className="wave-bars" aria-hidden="true">
      {heights.map((height, index) => (
        <span key={`${height}-${index}`} style={{ height }} />
      ))}
    </div>
  );
}

