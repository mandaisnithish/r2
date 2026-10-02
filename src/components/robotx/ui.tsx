import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <header className="mb-10 max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#00B4D8] mb-3">{eyebrow}</p>
        )}
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">{title}</h1>
        {intro && <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">{intro}</p>}
      </header>
      {children}
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 ${className}`}>{children}</div>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[#00B4D8]/40 bg-[#00B4D8]/10 px-3 py-1 text-xs font-semibold text-[#00F5FF]">
      {children}
    </span>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">{text}</p>
  );
}

export function SubHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="font-heading text-2xl sm:text-3xl font-bold text-white mb-6 scroll-mt-40">
      {children}
    </h2>
  );
}
