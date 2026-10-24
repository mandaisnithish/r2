/* Author: Nithish Kaliannan Ananth */
// src/pages/NotFound.tsx
import { useLocation } from "react-router-dom";
import RelayButton from "../components/ui/RelayButton";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <section className="py-24 sm:py-36">
      <div className="grid-wrap max-w-3xl">
        <p className="stencil">ERR-404 // NO RETURN</p>
        <h1 className="display-l mt-5 text-bone">Signal lost below the waterline.</h1>
        <div className="mt-10">
          <EmptyState
            code={`PATH ${pathname}`}
            title="Nothing answers on this channel."
            action={
              <div className="flex flex-wrap gap-3">
                <RelayButton to="/">Surface to home</RelayButton>
                <RelayButton to="/contact" variant="secondary">Report it</RelayButton>
              </div>
            }
          >
            The page may have moved, or the link was mistyped.
          </EmptyState>
        </div>
      </div>
    </section>
  );
}
