/* Author: Nithish Kaliannan Ananth */
// src/components/ui/iconMap.ts
// Curated icon lookup (see Icon.tsx). Kept in a plain module so the
// component file only exports components.

import type { ComponentType } from "react";
import {
  Anchor, Award, Banknote, BatteryCharging, BookOpen, Bot, Building2, Camera,
  Cloud, Cog, Compass, Cpu, Crosshair, Droplet, FileBadge, Fish, Flag, Gauge,
  Globe, Lightbulb, Mail, MapPin, Microscope, Milestone, Navigation, Newspaper,
  Phone, Radar, Radio, Recycle, Route, Satellite, Scan, ScrollText, ShieldCheck,
  Ship, SlidersHorizontal, Sun, Trash2, Trophy, Users, Waves, Wifi, Zap,
} from "lucide-react";
import {
  BallastGlyph, BathymetryGlyph, ConveyorGlyph, GitHubGlyph, InstagramGlyph,
  LinkedInGlyph, PcbGlyph, PontoonGlyph, PropellerGlyph, QuadGlyph, RelayGlyph,
  SonarGlyph, XGlyph, YouTubeGlyph,
} from "./glyphs";

export type IconProps = { size?: number | string; className?: string; strokeWidth?: number | string };
export type IconComponent = ComponentType<IconProps>;

const MAP: Record<string, IconComponent> = {
  // lucide names used by the CMS today
  route: Route, slidershorizontal: SlidersHorizontal, cog: Cog, gauge: Gauge,
  waves: Waves, building: Building2, building2: Building2, fish: Fish,
  zap: Zap, lightbulb: Lightbulb, globe: Globe, recycle: Recycle, cloud: Cloud,
  navigation: Navigation, microscope: Microscope,
  // tabler names from older fallbacks
  robot: Bot, bot: Bot, solarpanel: Sun, sun: Sun, wifi: Wifi, anchor: Anchor,
  scan: Scan, trash: Trash2, trash2: Trash2, droplet: Droplet, article: Newspaper,
  newspaper: Newspaper,
  // marine / robotics vocabulary
  radar: Radar, cpu: Cpu, battery: BatteryCharging, batterycharging: BatteryCharging,
  ship: Ship, camera: Camera, satellite: Satellite, radio: Radio,
  shield: ShieldCheck, shieldcheck: ShieldCheck, crosshair: Crosshair, target: Crosshair,
  compass: Compass, trophy: Trophy, award: Award, banknote: Banknote,
  filebadge: FileBadge, patent: FileBadge, scrolltext: ScrollText, publication: ScrollText,
  milestone: Milestone, flag: Flag, bookopen: BookOpen, users: Users,
  mail: Mail, phone: Phone, mappin: MapPin,
  // custom glyphs
  sonar: SonarGlyph, pontoon: PontoonGlyph, catamaran: PontoonGlyph,
  propeller: PropellerGlyph, thruster: PropellerGlyph,
  conveyor: ConveyorGlyph, screwconveyor: ConveyorGlyph,
  ballast: BallastGlyph, pcb: PcbGlyph, circuit: PcbGlyph,
  bathymetry: BathymetryGlyph, contours: BathymetryGlyph,
  quad: QuadGlyph, drone: QuadGlyph, uav: QuadGlyph, relay: RelayGlyph,
  // brands
  linkedin: LinkedInGlyph, brandlinkedin: LinkedInGlyph,
  github: GitHubGlyph, brandgithub: GitHubGlyph,
  instagram: InstagramGlyph, brandinstagram: InstagramGlyph,
  youtube: YouTubeGlyph, brandyoutube: YouTubeGlyph,
  x: XGlyph, twitter: XGlyph, brandx: XGlyph, brandtwitter: XGlyph,
};

/** "lucide-zap" / "ti-robot" / "SlidersHorizontal" -> "zap" / "robot" / "slidershorizontal". */
export function normaliseIconName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/^(ti\s+)?(ti|lucide|icon)[-_\s]/, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Unknown or empty names fall back to the sonar glyph. */
export function resolveIcon(name?: string | null): IconComponent {
  if (!name) return SonarGlyph;
  return MAP[normaliseIconName(name)] ?? SonarGlyph;
}
