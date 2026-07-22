// src/components/common/ScrollToTop.tsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Remembers scroll position per history entry (keyed by React Router's
// location.key, which is unique per navigation, including repeated
// visits to the same path). Module-level so it survives across
// re-renders/remounts of this component for the lifetime of the tab.
const scrollPositions = new Map<string, number>();

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"
  const prevKey = useRef<string | null>(null);

  useEffect(() => {
    // Save the scroll position of the page we're leaving, under its own key,
    // right before we move to the new one.
    if (prevKey.current) {
      scrollPositions.set(prevKey.current, window.scrollY);
    }
    prevKey.current = location.key;

    if (navigationType === "POP") {
      // Back/Forward button — restore where the user was.
      const saved = scrollPositions.get(location.key);
      if (saved != null) {
        // Wait a tick for the page's content to actually render/lay out
        // before jumping to the saved offset, or it can land short.
        requestAnimationFrame(() => {
          window.scrollTo({ top: saved, left: 0, behavior: "instant" as ScrollBehavior });
        });
        return;
      }
    }

    // Any fresh navigation (clicking a link, etc.) — start at the top,
    // like a normal new page.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location, navigationType]);

  return null;
}