"use client";

import { useState, useEffect } from "react";
import {
  isNotificationSupported,
  requestNotificationPermission,
  subscribeToPush,
} from "@/lib/push-notifications";

const DISMISSED_KEY = "pawsitiveid-push-dismissed";

export default function PushNotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!isNotificationSupported()) return;
    if (Notification.permission === "granted") return;
    if (localStorage.getItem(DISMISSED_KEY)) return;
    setVisible(true);
  }, []);

  const handleEnable = async () => {
    setSubscribing(true);
    try {
      const subscription = await requestNotificationPermission();
      if (subscription) {
        await subscribeToPush(subscription, {});
        setSubscribed(true);
        setTimeout(() => setVisible(false), 2000);
      }
    } catch (err) {
      console.error("Push subscription failed:", err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="glass-card p-4 max-w-2xl mx-auto flex items-start gap-3"
      role="alert"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(249, 115, 22, 0.1)" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--paw-orange)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          {subscribed
            ? "Notifications enabled!"
            : "Get instant alerts when matching dogs are found"}
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {subscribed
            ? "You'll be notified when a found dog matches your area."
            : "Be the first to know — every minute counts for lost pets."}
        </p>

        {!subscribed && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleEnable}
              disabled={subscribing}
              className="glow-btn px-4 py-1.5 rounded-lg text-sm font-medium"
              style={{ opacity: subscribing ? 0.6 : 1 }}
            >
              {subscribing ? "Enabling..." : "Enable Notifications"}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Not now
            </button>
          </div>
        )}
      </div>

      {!subscribed && (
        <button
          onClick={handleDismiss}
          className="shrink-0 p-1"
          style={{ color: "var(--text-muted)" }}
          aria-label="Dismiss notification banner"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
