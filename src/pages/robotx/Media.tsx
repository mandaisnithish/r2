// src/pages/robotx/Media.tsx
// Films, photos and the development story. Real assets first; empty
// MediaSlots mark the shots the team still needs (see MEDIA_UPLOAD_GUIDE.md).

import { MEDIA, MEDIA_STORY, TEAM, VIDEOS } from "../../data/robotxData";
import { DossierHero, DossierSection } from "../../components/robotx/ui";
import MediaSlot from "../../components/ui/MediaSlot";
import VideoSlot from "../../components/ui/VideoSlot";
import Reveal from "../../components/ui/Reveal";
import groupPhoto from "../../assets/robotx/groupphoto.jpeg";
import drakenImage from "../../assets/robotx/DRAKEN Mark 1.jpeg";
import revelationImage from "../../assets/robotx/REVELATION.jpeg";

const PHOTOS = [
  { slot: "RX_MEDIA_TEAM", src: groupPhoto, alt: `${TEAM.name} RobotX 2026 team in the lab`, title: "The team", aspect: "16:9" as const, brief: "Team group photo." },
  { slot: "RX_MEDIA_DRAKEN", src: drakenImage, alt: "DRAKEN Mark 1 in the test tank", title: "DRAKEN Mark 1 · tank test", aspect: "4:5" as const, brief: "DRAKEN on water." },
  { slot: "RX_MEDIA_REVELATION", src: revelationImage, alt: "REVELATION quadcopter on the bench", title: "REVELATION · bench", aspect: "4:3" as const, brief: "REVELATION on the bench." },
  ...MEDIA.filter((m) => m.type === "image" && m.url).map((m) => ({
    slot: `RX_MEDIA_${m.id.toUpperCase().replace(/-/g, "_")}`,
    src: m.url!,
    alt: m.description,
    title: m.title,
    aspect: "4:3" as const,
    brief: m.description,
  })),
];

const WANTED = [
  { slot: "RX_MEDIA_USV_OPEN_WATER", aspect: "16:9" as const, title: "DRAKEN on open water", brief: "DRAKEN Mark 1 under way on a lake or harbour, shot from the bank or a chase boat." },
  { slot: "RX_MEDIA_UAV_FLIGHT", aspect: "16:9" as const, title: "REVELATION in flight", brief: "REVELATION hovering over water, ideally with DRAKEN in frame." },
  { slot: "RX_MEDIA_AERIAL_POV", aspect: "21:9" as const, title: "Aerial POV", brief: "Footage from REVELATION's own camera looking down at DRAKEN (video loop, MP4)." },
];

export default function RobotXMedia() {
  return (
    <>
      <DossierHero
        code="RX-MED"
        section="MEDIA"
        title="Engineering progress, documented."
        intro="Development footage, testing sessions, demonstrations and competition documentation."
      />

      <DossierSection index="RX-MED-01" code="FILMS" title="Watch." divider="left">
        <div className="grid gap-8">
          {VIDEOS.map((v) => (
            <VideoSlot key={v.id} slotId={`RX_FILM_${v.youtubeId}`} url={`https://youtu.be/${v.youtubeId}`} title={v.title} brief="RobotX film (YouTube)." />
          ))}
        </div>
      </DossierSection>

      <DossierSection index="RX-MED-02" code="STILLS" title="See." lede="A visual record of the team and vehicle development." divider="right">
        <div className="grid gap-6 lg:grid-cols-12">
          {PHOTOS.map((p, i) => (
            <Reveal key={p.slot} delay={i * 0.06} className={i === 0 ? "lg:col-span-8" : i === 1 ? "lg:col-span-4" : "lg:col-span-6"}>
              <MediaSlot slotId={p.slot} src={p.src} alt={p.alt} aspect={p.aspect} brief={p.brief} caption={p.title} />
            </Reveal>
          ))}
          {WANTED.map((w, i) => (
            <Reveal key={w.slot} delay={i * 0.06} className={w.aspect === "21:9" ? "lg:col-span-12" : "lg:col-span-6"}>
              <MediaSlot slotId={w.slot} alt={w.title} aspect={w.aspect} kind={w.slot.includes("POV") ? "video" : "image"} brief={w.brief} caption={`${w.title} · wanted`} />
            </Reveal>
          ))}
        </div>
      </DossierSection>

      <DossierSection index="RX-MED-03" code="DEVELOPMENT STORY" title="From vehicles to a system." lede="RobotX development is documented as a progression from individual vehicle development toward an integrated autonomous System of Systems." divider="split">
        <ol className="grid gap-px border border-line bg-line md:grid-cols-3">
          {MEDIA_STORY.map((s, i) => (
            <li key={s.title} className="bg-abyss p-6">
              <span className="font-mono text-[10px] text-arc">PHASE 0{i + 1}</span>
              <h3 className="mt-3 font-display text-2xl font-semibold text-bone">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-fog">{s.text}</p>
            </li>
          ))}
        </ol>
      </DossierSection>
    </>
  );
}
