"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

const SESSION_KEY = "exitIntentShown";
const MIN_TIME_ON_PAGE_MS = 30_000;

export function ExitIntentModal() {
  const [visible, setVisible] = useState(false);
  const posthog = usePostHog();

  const close = useCallback(() => setVisible(false), []);

  useEffect(() => {
    // Already shown this session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const pageLoadTime = Date.now();
    let triggered = false;

    function handleMouseLeave(e: MouseEvent) {
      if (triggered) return;
      // Only trigger when cursor exits toward the top of the viewport
      if (e.clientY > 0) return;
      if (Date.now() - pageLoadTime < MIN_TIME_ON_PAGE_MS) return;

      triggered = true;
      sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(true);
    }

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  // Track when the modal becomes visible
  useEffect(() => {
    if (visible) {
      posthog?.capture("exit_intent_shown");
    }
  }, [visible, posthog]);

  // Close on Escape key
  useEffect(() => {
    if (!visible) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setVisible(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={close}
    >
      <div
        className="relative max-w-sm w-full mx-4 rounded-2xl bg-white dark:bg-[#1e293b] p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-xl font-bold text-center text-[#111827] dark:text-gray-100">
          Attendez — votre CV est peut-être invisible aux recruteurs.
        </h2>
        <p className="text-sm text-center mt-2 text-[#6b7280] dark:text-gray-400">
          Testez gratuitement votre score ATS en 30 secondes.
        </p>
        <Link
          href="/analyze"
          onClick={() => posthog?.capture("exit_intent_converted")}
          className="mt-6 flex items-center justify-center w-full min-h-[48px] rounded-xl bg-[#16a34a] text-white font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Analyser gratuitement →
        </Link>
        <button
          type="button"
          onClick={close}
          className="mt-3 w-full text-sm text-center text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}
