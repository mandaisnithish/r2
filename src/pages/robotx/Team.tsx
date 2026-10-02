import { Card, PageShell } from "../../components/robotx/ui";
import { ADVISOR, MEMBERS, TEAM, type Member } from "../../data/robotxData";

function Avatar({ m }: { m: Member }) {
  if (m.photo) {
    return <img src={m.photo} alt={`Portrait of ${m.name}`} loading="lazy" className="h-20 w-20 rounded-full object-cover" />;
  }
  const initials = m.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      aria-hidden="true"
      className="h-20 w-20 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#0077B6] flex items-center justify-center font-heading text-xl font-bold text-white"
    >
      {initials}
    </div>
  );
}

function MemberCard({ m }: { m: Member }) {
  return (
    <Card className="flex items-start gap-4">
      <Avatar m={m} />
      <div>
        <h3 className="font-heading text-lg font-bold text-white">{m.name}</h3>
        <p className="text-sm font-semibold text-[#00B4D8]">{m.role}</p>
        {m.bio && <p className="mt-2 text-sm text-slate-300">{m.bio}</p>}
      </div>
    </Card>
  );
}

export default function Team() {
  return (
    <PageShell
      eyebrow="Who we are"
      title={`Team ${TEAM.name}`}
      intro={`Student engineers from the ${TEAM.institution}, ${TEAM.location}.`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map((m, i) => (
          <MemberCard key={`${m.name}-${i}`} m={m} />
        ))}
      </div>
      <h2 className="font-heading text-2xl font-bold text-white mt-12 mb-4">Faculty Advisor</h2>
      <div className="max-w-xl">
        <MemberCard m={ADVISOR} />
      </div>
    </PageShell>
  );
}
