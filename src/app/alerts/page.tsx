"use client";

import PawLogo from "@/components/PawLogo";
import ThemeToggle from "@/components/ThemeToggle";
import AlertSubscribeForm from "@/components/AlertSubscribeForm";

export default function AlertsPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen pb-20" role="main">
        <header className="app-header sticky top-0 z-50" role="banner">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3" aria-label="Go to PawsitiveID home">
              <PawLogo size={40} />
              <div>
                <h1 className="text-xl font-bold gradient-text">PawsitiveID</h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  AI-Powered Pet Matching
                </p>
              </div>
            </a>
            <div className="flex items-center gap-3">
              <a
                href="/map"
                className="text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                style={{ color: "var(--paw-orange)" }}
              >
                Map
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <section className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <svg className="w-16 h-16" style={{ color: "var(--paw-orange)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-2">
              Lost Pet Alerts
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Get notified when a dog matching your description is found in your area.
            </p>
          </div>

          <AlertSubscribeForm />
        </section>

        <footer className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }} role="contentinfo">
          <p>PawsitiveID - Built with love for every lost paw.</p>
        </footer>
      </main>
    </>
  );
}
