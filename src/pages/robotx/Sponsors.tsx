import { Card, Empty, PageShell } from "../../components/robotx/ui";
import { SPONSORS } from "../../data/robotxData";

export default function Sponsors() {
  return (
    <PageShell
      eyebrow="Thank you"
      title="Sponsors"
      intro="Our work is possible because of the organisations that back us."
    >
      {SPONSORS.length === 0 ? (
        <Empty text="Sponsor list coming soon." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPONSORS.map((s) => {
            const inner = (
              <Card className="flex h-full flex-col items-center justify-center gap-3 text-center">
                {s.logo ? (
                  <img src={s.logo} alt={`${s.name} logo`} loading="lazy" className="h-16 w-auto max-w-full object-contain" />
                ) : (
                  <span className="font-heading text-xl font-bold text-white">{s.name}</span>
                )}
                {s.logo && <span className="text-sm text-slate-300">{s.name}</span>}
                {s.tier && <span className="text-xs uppercase tracking-widest text-[#00B4D8]">{s.tier}</span>}
              </Card>
            );
            return (
              <li key={s.name}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] rounded-2xl">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      )}
    </PageShell>
  );
}
