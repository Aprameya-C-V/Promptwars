"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CompanionIcon,
  ExerciseIcon,
  HomeIcon,
  JournalIcon,
  MicIcon,
  SafetyIcon,
  TrendsIcon
} from "./icons";

const sidebarLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/journal", label: "Journal", icon: JournalIcon },
  { href: "/companion", label: "Companion", icon: CompanionIcon },
  { href: "/voice", label: "Voice", icon: MicIcon },
  { href: "/exercises", label: "Exercises", icon: ExerciseIcon },
  { href: "/trends", label: "Trends", icon: TrendsIcon }
];

const topLinks = [
  { href: "/journal", label: "Journal" },
  { href: "/companion", label: "Companion" },
  { href: "/voice", label: "Voice" },
  { href: "/exercises", label: "Exercises" },
  { href: "/trends", label: "Trends" }
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function AppChrome({
  children,
  showSidebar = true
}: {
  children: React.ReactNode;
  showSidebar?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className={showSidebar ? "dashboard-shell" : undefined}>
      {showSidebar ? (
        <aside className="sidebar">
          <div className="sidebar-brand">
            <strong>Hesychia</strong>
            <span>Digital Sanctuary</span>
          </div>

          <nav className="nav-list" aria-label="Sidebar">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(pathname, link.href) ? "active" : ""}`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div style={{ marginTop: "auto", display: "grid", gap: 10 }}>
            <Link className="nav-link" href="/companion">
              <SafetyIcon size={20} />
              <span>Support</span>
            </Link>
            <Link className="primary-button" href="/companion" style={{ width: "100%" }}>
              Need Help?
            </Link>
          </div>
        </aside>
      ) : null}

      <div className={showSidebar ? "dashboard-main" : undefined}>
        <header className={`top-tabs ${showSidebar ? "dashboard-top-tabs" : "landing-top-tabs"}`}>
          <div style={{ color: "var(--accent-primary-bright)", fontWeight: 700, minWidth: 120 }}>
            Hesychia
          </div>
          <nav className="top-tab-links" aria-label="Primary">
            {topLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`top-tab ${isActive(pathname, link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/voice" className="icon-button" aria-label="Open live voice">
            <MicIcon size={18} />
          </Link>
        </header>

        <div className={showSidebar ? "dashboard-content" : "page-shell"}>{children}</div>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
