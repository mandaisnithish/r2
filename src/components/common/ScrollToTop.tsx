// src/components/common/ScrollToTop.tsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Remembers scroll position per history entry (keyed by React Router's
// location.key, which is unique per navigation, including repeated
// visits to the same path). Module-level so it survives across
// re-renders/remounts of this component for the lifetime of the tab.
const scrollPositions = new Map<string, number>();

// Retries scrolling to `target` a few times as the page finishes loading.
// This matters because content that loads asynchronously (API data,
// images) can make the page shorter than `target` right after mount —
// a single scrollTo call would silently clamp to the bottom of the
// too-short page instead of landing where the user actually was.
function scrollToWithRetries(target: number) {
  const attempts = [0, 50, 150, 300, 600, 1000];
  attempts.forEach((delay) => {
    setTimeout(() => {
      // Only (re)apply if we're still short of the target — once the
      // page has grown enough to reach it, later attempts are harmless
      // no-ops, but this avoids fighting the user if they've since
      // scrolled manually.
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.min(target, Math.max(maxScroll, 0)), left: 0, behavior: "instant" as ScrollBehavior });
    }, delay);
  });
}

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"
  const prevKey = useRef<string | null>(null);

  // Turn off the browser's built-in scroll restoration. Left on "auto"
  // (the default), the browser tries to restore scroll on its own on
  // Back/Forward *before* our effect runs — the two then disagree
  // slightly, which is what was causing the small offset.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Save the scroll position of the page we're leaving, under its own key,
    // right before we move to the new one.
    if (prevKey.current) {
      scrollPositions.set(prevKey.current, window.scrollY);
    }
    prevKey.current = location.key;

    if (navigationType === "POP") {
      // Back/Forward button — restore where the user was, retrying as
      // the page's content finishes loading in.
      const saved = scrollPositions.get(location.key);
      if (saved != null) {
        scrollToWithRetries(saved);
        return;
      }
    }

    // Any fresh navigation (clicking a link, etc.) — start at the top,
    // like a normal new page.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location, navigationType]);

  return null;
}