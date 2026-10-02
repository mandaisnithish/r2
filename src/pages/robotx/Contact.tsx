import { Card, PageShell } from "../../components/robotx/ui";
import { TEAM } from "../../data/robotxData";

export default function Contact() {
  return (
    <PageShell eyebrow="Get in touch" title="Contact" intro="Sponsors, organisers, mentors and fellow teams — we would love to hear from you.">
      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        <Card>
          <h2 className="font-heading text-xl font-bold text-white mb-3">Team</h2>
          <p className="text-white font-semibold">{TEAM.name}</p>
          <p className="text-slate-300">{TEAM.institution}</p>
          <p className="text-slate-300">{TEAM.location}</p>
        </Card>
        <Card>
          <h2 className="font-heading text-xl font-bold text-white mb-3">Reach us</h2>
          <ul className="space-y-2 text-slate-300">
            <li>
              Email:{" "}
              <a href={`mailto:${TEAM.email}`} className="text-[#00B4D8] hover:text-[#00F5FF] underline underline-offset-2">
                {TEAM.email}
              </a>
            </li>
            {TEAM.phone && <li>Phone: {TEAM.phone}</li>}
            {TEAM.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-[#00B4D8] hover:text-[#00F5FF] underline underline-offset-2">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
