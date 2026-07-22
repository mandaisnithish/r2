// src/components/common/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Placed once inside <BrowserRouter>. On every route change (pathname
// change), it resets the window scroll position to the top — so
// navigating from, say, a scrolled-down Home page to About always
// lands you at the top of About, instead of inheriting your old
// scroll position.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}