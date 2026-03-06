"use client";

import { useState, useEffect, useRef } from "react";
import PawLogo from "@/components/PawLogo";
import ThemeToggle from "@/components/ThemeToggle";

interface NavBarProps {
  currentPage?: "home" | "map" | "alerts" | "dog";
  actions?: React.ReactNode;
}

const NAV_LINKS = [
  { href: "/", label: "Home", page: "home" as const },
  { href: "/map", label: "Map", page: "map" as const },
  { href: "/alerts", label: "Alerts", page: "alerts" as const },
];

export default function NavBar({ currentPage, actions }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  return (
    <header className="app-header sticky top-0 z-50" role="banner">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group" aria-label="PawsitiveID home">
          <PawLogo size={36} />
          <div>
            <span className="text-lg font-bold gradient-text leading-tight block">PawsitiveID</span>
            <span className="text-[10px] leading-tight block" style={{ color: "var(--text-muted)" }}>
              AI-Powered Pet Matching
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.page}
              href={link.href}
              className="nav-link px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                color: currentPage === link.page ? "var(--paw-orange)" : "var(--text-secondary)",
                background: currentPage === link.page ? "rgba(249, 115, 22, 0.1)" : "transparent",
              }}
              aria-current={currentPage === link.page ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
          {actions}
          <ThemeToggle />
        </nav>

        {/* Mobile: theme + hamburger */}
        <div className="flex md:hidden items-center gap-2" ref={menuRef}>
          {actions}
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
            style={{
              background: menuOpen ? "rgba(249, 115, 22, 0.1)" : "transparent",
              color: menuOpen ? "var(--paw-orange)" : "var(--text-secondary)",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Mobile dropdown */}
          {menuOpen && (
            <nav
              id="mobile-menu"
              className="mobile-menu absolute top-full right-4 mt-2 w-48 rounded-xl overflow-hidden shadow-lg"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-card)",
              }}
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.page}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium transition-colors"
                  style={{
                    color: currentPage === link.page ? "var(--paw-orange)" : "var(--text-primary)",
                    background: currentPage === link.page ? "rgba(249, 115, 22, 0.1)" : "transparent",
                    borderBottom: "1px solid var(--border-card)",
                  }}
                  aria-current={currentPage === link.page ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
