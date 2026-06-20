import type { CSSProperties } from "react";

type IconProps = {
  size?: number;
  color?: string;
  style?: CSSProperties;
};

function Svg({
  children,
  size = 22,
  color = "currentColor",
  style
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </Svg>
  );
}

export function JournalIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 6h10" />
      <path d="M8 12h10" />
      <path d="M8 18h6" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </Svg>
  );
}

export function CompanionIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3a8 8 0 0 0-8 8c0 2.2.89 4.2 2.34 5.66L6 21l4.34-.34A8 8 0 1 0 12 3Z" />
      <path d="M9.5 10a.5.5 0 1 0 0 .001M14.5 10a.5.5 0 1 0 0 .001" />
      <path d="M9 14c.8.8 2 1.2 3 1.2s2.2-.4 3-1.2" />
    </Svg>
  );
}

export function ExerciseIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m4 20 6-6" />
      <path d="m14 10 6-6" />
      <path d="m14 4 6 6" />
      <path d="m4 14 6 6" />
    </Svg>
  );
}

export function TrendsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 16 10 10l4 4 6-8" />
      <path d="M20 6v6h-6" />
    </Svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="m19.4 15 1.1 1.9-1.8 3.1-2.2-.4a8 8 0 0 1-1.5.9l-.7 2.1H9.7L9 20.5a8 8 0 0 1-1.5-.9l-2.2.4-1.8-3.1L4.6 15a8.3 8.3 0 0 1 0-1.8l-1.1-1.9 1.8-3.1 2.2.4c.47-.35.98-.65 1.5-.9L9.7 5.6h4.6l.7 2.1c.52.25 1.03.55 1.5.9l2.2-.4 1.8 3.1-1.1 1.9c.08.6.08 1.2 0 1.8Z" />
    </Svg>
  );
}

export function SafetyIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 5 6v6c0 4.2 2.8 8.1 7 9 4.2-.9 7-4.8 7-9V6l-7-3Z" />
      <path d="M9.5 12.5 11 14l3.5-4" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12h14" />
      <path d="m13 5 7 7-7 7" />
    </Svg>
  );
}

export function MicIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="9" y="3" width="6" height="12" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v4" />
    </Svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" />
      <path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14Z" />
    </Svg>
  );
}

export function TimerIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13V9" />
      <path d="m9 3 6 0" />
    </Svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 4 3 20h18L12 4Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="m8 6 10 6-10 6V6Z" />
    </Svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Svg>
  );
}

