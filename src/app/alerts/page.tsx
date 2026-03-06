"use client";

import NavBar from "@/components/NavBar";
import AlertSubscribeForm from "@/components/AlertSubscribeForm";
import PushNotificationBanner from "@/components/PushNotificationBanner";

export default function AlertsPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <main id="main-content" className="min-h-screen pb-20" role="main">
        <NavBar currentPage="alerts" />

        <section className="max-w-3xl mx-auto px-4 py-8 page-enter">
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

          <div className="mt-8">
            <PushNotificationBanner />
          </div>
        </section>

        <footer className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }} role="contentinfo">
          <p>PawsitiveID - Built with love for every lost paw.</p>
        </footer>
      </main>
    </>
  );
}
