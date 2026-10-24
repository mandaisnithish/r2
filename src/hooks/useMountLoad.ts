// src/hooks/useMountLoad.ts
// Runs an admin page's loader once after mount. Loaders set state
// (loading flags, rows), so the first call is scheduled as a task instead
// of running synchronously inside the effect; cleanup cancels it if the
// page unmounts first, which also avoids StrictMode's double fetch.
// The same `load` function is still called directly to refresh after edits.

import { useEffect, useRef } from "react";

export function useMountLoad(load: () => unknown) {
  const latest = useRef(load);
  useEffect(() => {
    latest.current = load;
  });
  useEffect(() => {
    const t = window.setTimeout(() => {
      void latest.current();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);
}
