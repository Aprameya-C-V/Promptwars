"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CompanionIcon,
  ExerciseIcon,
  HomeIcon,
  JournalIcon,
  SafetyIcon,
  SettingsIcon,
  TrendsIcon,
  UserIcon
} from "./icons";

const sidebarLinks = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/journal", label: "Journal", icon: JournalIcon },
  { href: "/companion", label: "Companion", icon: CompanionIcon },
  { href: "/exercises", label: "Exercises", icon: ExerciseIcon },
  { href: "/trends", label: "Trends", icon: TrendsIcon }
];

const topLinks = [
  { href: "/journal", label: "Journal" },
  { href: "/companion", label: "Companion" },
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

          <nav className="nav-list">
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
            <div className="nav-link">
              <SettingsIcon size={20} />
              <span>Settings</span>
            </div>
            <div className="nav-link">
              <SafetyIcon size={20} />
              <span>Safety</span>
            </div>
            <button className="primary-button" type="button" style={{ width: "100%" }}>
              Need Help?
            </button>
          </div>
        </aside>
      ) : null}

      <div className={showSidebar ? "dashboard-main" : undefined}>
        <header className="top-tabs">
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
          <div style={{ display: "flex", gap: 10 }}>
            <button className="icon-button" type="button" aria-label="Settings">
              <SettingsIcon size={18} />
            </button>
            <button className="icon-button" type="button" aria-label="Account">
              <UserIcon size={18} />
            </button>
          </div>
        </header>

        <div className={showSidebar ? "dashboard-content" : "page-shell"}>{children}</div>
      </div>
    </div>
  );
}

