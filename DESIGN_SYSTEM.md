Author: Nithish Kaliannan Ananth

# Aquaholics — Design System: "Hydro-Mechatronics"

Field-tested marine robotics, seen through the instruments of the people who build it.
The site should feel like a bench in a wet lab at 2 a.m.: oxidised steel, PVC pontoons,
an oscilloscope still glowing, a sonar screen sweeping the tank. Warm because it is
obviously hand-built; serious because every number on it is real.

This document is the source of truth for tokens, components, motion, 3D and media.
Code lives in `src/components/ui/` (HTML primitives) and `src/components/three/` (WebGL).

---

## 0. Ground truth (audited 24 Oct 2026)

Things the design must respect because they are real:

| Fact | Source | Design consequence |
|---|---|---|
| Walrus is a **twin-pontoon catamaran**: two capped PVC floats, a clear acrylic electronics box, a front collection arm/conveyor, rear thrusters. | Product gallery photos (Cloudinary `products/gallery/*`), CAD render | The 3D vessel is procedural and modelled on this, not on a generic monohull. |
| DRAKEN Mark 1 (USV) uses the same float + acrylic-box language; 650 × 500 × 500 mm, V-shaped hull, Pi 5 + Pixhawk, camera perception (no LiDAR). | `src/data/robotxData.ts`, `src/assets/robotx/DRAKEN Mark 1.jpeg` | Same procedural model, `variant="draken"`: no LiDAR mast, camera pod instead. |
| REVELATION (UAV) is an S500 quad: Pixhawk 2.4.8, Arducam IMX296, RadioLink SE100 GPS. | `robotxData.ts`, `REVELATION.jpeg` | Procedural S500 quad model. |
| `TESTS`, `MEDIA` and `SPONSORS` are intentionally empty. | `robotxData.ts` comments | Never invent hours, results or sponsors. Empty states are designed, not hidden. |
| Team portraits are illustrated posters (comic burst, name banner baked in). | `members/*` | Shown inside portrait frames cropped to the upper 78 %, so the baked banner never doubles the HTML name. |
| CMS stat says the Great Pacific Garbage Patch is "18M+ km²". The accepted figure is ≈ 1.6M km². | `home-stats` | Fallback copy uses 1.6M km²; flagged in `MEDIA_UPLOAD_GUIDE.md` for a CMS fix. |

> Note on names: the brief mentions "Nallathanni" and "Vaanam". Neither appears in the
> codebase or CMS; the vehicles are DRAKEN Mark 1 and REVELATION. Vehicle names are read
> from `VEHICLES[]`, so a rename is a one-line data change.

---

## 1. Research synthesis

Seven sites viewed at 1440 px on 24 Oct 2026. We took mechanisms, never layouts or assets.

| Site | Strongest pattern | What we abstracted | How it became Aquaholics |
|---|---|---|---|
| **Saronic** | Vessels as a *named fleet*; tiny mono kickers over big claims; one loud accent. | Name the machines; mono for provenance, display type for claims. | Walrus, DRAKEN Mark 1 and REVELATION each get a "hull plate" with a laser-etched serial (`AQH-USV-01`). Our accent is hydro-cyan on oxidised steel, not lime on grey. |
| **Saildrone** | Capabilities on a *topographic contour* field with targeting brackets; operating stats (years, nm, days at sea). | Data-as-texture; credibility through operating numbers. | Contours become a live **bathymetric shader** (§5) under the whole site. Our stats are the CMS ones (prize money, funding, competitions) — no invented sea-days. |
| **Anduril** | Black stage, a 1 px load bar, then a dense grid of product media tiles. | Authority from restraint; boot feeling. | A 400 ms **HUD boot line** replaces the 2 s blocking loader. Product media lives in `MediaSlot` frames with corner brackets. |
| **Boston Dynamics** | Product as a *teammate* in its real working environment; "Meet X" storytelling. | Hardware-first storytelling in context. | The vessel is always shown *in water* (3D) and *in the field* (real photos), never on a void. |
| **Clearpath** | Industrial grey, safety-yellow CTAs, rugged field photography. | Tooling-catalogue honesty; a warning colour that means something. | Arc-amber `#FFB800` is reserved for *electrical* moments (charge bars, relay clicks). It is never decoration. |
| **Skydio** | Product family + use-case tabs; ops-console screenshots. | Progressive disclosure through tabs. | **Schematic layer switch** (Hull / Avionics / Hydro-flow) and use-case tabs on Product. |
| **Zipline** | Scroll as *flight path*: the camera travels, huge condensed words reveal. | Scroll = physical journey. | Scroll = **descent**: 0.0 m canopy → −1.5 m waterline → −8.0 m sensors → −25.0 m core, with a depth gauge on the viewport edge. |

What nobody else does, and we will: the brand name is literally about water, so every
transition is *hydrodynamic* (wave wipes, sonar pings, wakes that follow the cursor), and
every electrical cue comes from how the team actually wires boats (MAVLink, relays, LiPo charge).

---

## 2. Colour

Dark, cold, wet metal with two lights: one hydro (cyan) and one electrical (amber).

| Token | Hex | Role | Contrast on `abyss` |
|---|---|---|---|
| `abyss` | `#060A0E` | Page background, deepest water | — |
| `hull` | `#0D151C` | Panels, oxidised steel surfaces | — |
| `hull-2` | `#121D26` | Raised panels, inputs | — |
| `line` | `#1B2833` | 1 px blueprint hairlines | decorative |
| `line-2` | `#2A3A47` | Borders on interactive elements | 3:1 for UI |
| `bone` | `#E2E8F0` | Primary text, stencils | 16.1 : 1 |
| `fog` | `#8A9BAB` | Secondary text | 7.0 : 1 |
| `drift` | `#7D8E9E` | Tertiary labels, captions | 5.9 : 1 |
| `hydro` | `#00E5FF` | Water, sonar, links, focus | 12.9 : 1 |
| `hydro-deep` | `#0B6A7A` | Water fills, wave-wipe body | decorative |
| `arc` | `#FFB800` | Electrical: charge, relay, voltage | 11.5 : 1 |
| `rust` | `#FF3B30` | Warnings, kill-switch, errors | 5.6 : 1 |

Rules
- **No radial gradient blobs. No purple.** Gradients only as *physical* light: a waterline
  falloff, a CRT bloom 2 px wide, a depth fog.
- Cyan and amber never share a component state: cyan = water/data, amber = power/action.
- Rust is for things that can hurt you (kill switch, failed validation, form errors).

## 3. Typography

| Role | Family | Use |
|---|---|---|
| Display | **Chakra Petch** 600/700 | Headlines, hull plates, big numerals. Angular cut corners read as machined, not "techy". |
| Body | **IBM Plex Sans** 400/500/600 | Paragraphs, UI labels. |
| Telemetry | **IBM Plex Mono** 400/500 | Coordinates, depth, voltages, section indices, timestamps, serials. |

Scale (fluid, `clamp`): display-xl 56→112, display-l 40→72, display-m 30→48, h3 20→24,
body 16→18 / 1.65, small 14, micro (mono) 11 with `+0.08em` tracking, uppercase.

Section index pattern: `[SYS-01 // HYDRO-CLEAN]` in Plex Mono 11, `drift`, followed by a
1 px rule that runs to the grid edge and ends in a `+`.

Headlines are sentence case. Uppercase is reserved for mono indices and stencils.

## 4. Grid, surface, texture

- **12-column grid**, 1320 px max, 24 px gutters; content is *asymmetric*: headline spans
  cols 1–7, body 8–12, media breaks the frame by bleeding one column past the grid.
- **Blueprint layer**: a fixed 1 px grid (`line`, 8 % opacity) with `+` crosshairs at
  every 4th intersection. Sonar pings temporarily brighten it around the click point.
- **Hard edges.** Radius 2 px on inputs, 0 on panels. Panels use *corner brackets*
  (L-shaped 12 px strokes) instead of rounded borders.
- **Grain**: one fixed SVG `feTurbulence` overlay at 5 % opacity, `mix-blend-mode: overlay`.
- **Stencils & serials**: hull plates carry a serial (`AQH-USV-01 · REV C`) and a
  timestamp (`T+ 2026-10-24 21:40:12 IST`). Serials are generated from data ids, never random.
- No drop shadows. Depth comes from the 3D scene, hairlines and fog.

## 5. 3D: the Hydro-Field

One persistent `<Canvas>` behind the public site and RobotX (never loaded in admin).

| Layer | Implementation |
|---|---|
| Water surface | 1 plane, 160² segments desktop / 72² mobile. Vertex shader: 4 summed directional waves + a cursor wake (ring of decaying sine around `uWake`, 6 s half-life). |
| Bathymetry | Fragment shader bands `fract(height * k)` into contour lines (`line` → `hydro` at crests), Saildrone-style data texture but alive. |
| Caustics | Cheap 2-octave value noise on the seabed plane, additive, 0.15 intensity. |
| Depth descent | Camera y is bound to page scroll: `+2.2` (canopy) → `−1.5` (waterline) → `−8` (sensors) → `−25` (core). Fog colour lerps `#0A1620 → #03070A`. |
| Bubbles | `Points`, 600 desktop / 180 mobile, rise and drift with the cursor's x. |
| Route ripple | Route changes and sonar pings write to a 4-slot ring buffer of ripples in the water shader. |

Vessel models (`src/components/three/`): procedural, no external GLB, so the bundle stays
small and the shapes match the photos. Subsystems: **Propulsion**, **Vision / LiDAR array**,
**Collection conveyor**, **Power core (BMS)**, **Avionics (Pi 5 + Pixhawk)**. Each has an
anchor for `<Html>` telemetry pins and an *explode vector*.

Schematic layers: **Hull** (solid oxidised materials) → **Avionics** (hull goes 12 %
transparent, PCB and harness glow) → **Hydro-flow** (streamlines around the pontoons).

Quality tiers: `high` (DPR ≤ 2, full segments), `low` (DPR 1, reduced segments, no
bubbles) chosen from `hardwareConcurrency`, `deviceMemory`, viewport width and a 20-frame
FPS probe. No WebGL or `prefers-reduced-motion` → static CSS bathymetry poster, no canvas.

Performance budget: 3D chunk lazy-loaded after first paint; JS for the first route
≤ 250 KB gz excluding three; 60 fps on an M1 / 45 fps on a mid Android at `low`.

## 6. Motion

Easing tokens
- `--ease-hydro`: `cubic-bezier(.22,.9,.24,1)` — damped, settles like a float finding its waterline.
- Spring (framer-motion): `{ type: "spring", stiffness: 140, damping: 22, mass: 1.1 }`.
- `--ease-servo`: `steps(6, end)` — stepper-motor homing for brackets and compass roses.

Where things move (and nowhere else):

| Moment | Effect | Plays |
|---|---|---|
| First load | HUD boot line + 3 status lines, 400 ms, non-blocking | once per session |
| Route change | `HydroRouteTransition`: dark-teal wave wipe with a sonar edge + bubbles, content slides 24 px | per navigation, 650 ms |
| Section boundary | `CircuitDivider`: trace draws, a charge pulse runs, next heading flickers once | once per divider |
| CTA hover / press | `RelayButton`: amber charge bar fills (380 ms); on press an oscilloscope spike + spark | on interaction |
| Clicks on cards/tabs | `SonarPing`: concentric rings + grid brightening + ripple in the water | on interaction |
| Bracket enters view | `ServoBracket`: rotates in 6 stepped ticks | once |
| Scroll | Depth gauge needle, camera descent | continuous, damped |

Not allowed: infinite pulsing glows, floating blobs, parallax on text, count-up-from-zero
numbers, bounce easing.

Reduced motion: transitions become 150 ms opacity fades, the canvas renders one still
frame, servo/charge/spike effects are skipped; content is identical.

## 7. Components

HTML primitives (`src/components/ui/`)

| Component | Purpose | Notes |
|---|---|---|
| `HudPanel` | Bracketed panel with optional serial + status LED | Replaces `GlowCard` and every `rounded-2xl` card. |
| `BlueprintCard` | Content card on blueprint hairlines | For features, values, use cases. |
| `RelayButton` | Primary/secondary/ghost actions; link or button | Charge bar on hover, spike on press, focus ring in hydro. |
| `CircuitDivider` | Section divider with travelling charge | `variant="left" | "right" | "split"`. |
| `SonarBadge` | Status chip with sonar LED (`validated`, `partial`, `ongoing`, `offline`) | Validation lists, admin status. |
| `TelemetryHeader` | Section index + title + optional readouts | `[SYS-03 // PROPULSION]`. |
| `DepthGauge` | Fixed viewport-edge depth indicator bound to scroll | Hidden < 900 px. |
| `MediaSlot` / `VideoSlot` | Real media with industrial framing, or a blueprint placeholder | See §8. |
| `ServoBracket` | Corner brackets that home in | Used by `HudPanel`, `MediaSlot`. |
| `SchematicSwitch` | Mechanical 3-position switch with detents | Drives vessel layers. |
| `Icon` | Curated icon map + custom glyphs | Resolves CMS names (`Route`, `lucide-zap`, `ti-robot`). |

3D (`src/components/three/`): `HydroStage` (persistent canvas + store), `HydroSurface`
(shader), `Seabed`, `Bubbles`, `VesselModel` (`variant="walrus" | "draken"`),
`UavModel`, `VesselViewer` (orbit + layers + pins), `QualityProvider`.

## 8. Media

`MediaSlot` renders real media when `src` resolves; otherwise a blueprint placeholder
showing slot id, aspect, target resolution and what to upload. Every slot is listed in
`MEDIA_UPLOAD_GUIDE.md`.

Real assets in use today:

| Asset | Where it goes |
|---|---|
| `home-content.solutionImageUrl` (Walrus on a lake) | Home "Solution" — framed field photo next to the 3D vessel |
| `home-content.problemImageUrl` (boatman in plastic) | Home "Problem" — full-bleed, desaturated, telemetry overlay |
| `products-active.coverImageUrl` (Walrus top view, open hull) | Product overview — the photo the 3D model is matched to |
| `products-images[0–4]` (CAD, skeleton, chassis, 50 % model, real-time test) | Product build log — a strip ordered by build stage |
| `products-usecases[0–2]` | Product use-case tabs |
| `products-active.videoUrl` (YouTube `LPK7dAEQOzk`) | Home + Product `VideoSlot` (click-to-load, no iframe until asked) |
| `members[*].photoUrl` (poster portraits) | About crew — cropped portrait frames |
| `about-content.storyImageUrl` (Ideas to Impact team) | About story |
| `blogs[*].coverImageUrl` | Blog cards and post header |
| `timeline[*].imageUrl` (currently empty) | Impact log entries, when present |
| `src/assets/robotx/DRAKEN Mark 1.jpeg`, `REVELATION.jpeg` | RobotX vehicle dossiers |
| `src/assets/robotx/groupphoto.jpeg` | RobotX team + media |
| `src/assets/companylogo.jpeg` | Favicon/OG only; the UI uses an SVG wordmark |

## 9. Sub-app flavours

- **Public site** — "the instrument": water first, then machine, then people. Warmest copy.
- **RobotX** — "the dossier": classified mission-control feel, more amber, denser telemetry,
  section serials `RX-26/…`, the vehicles inspectable in 3D.
- **Admin** — "the console": no WebGL, no grain, high contrast, keyboard-friendly, same
  tokens and type so it still feels like the same company.

## 10. Anti-slop checklist (run on every page)

- [ ] No purple, no glow blobs, no glassmorphism.
- [ ] No three identical rounded cards in a row with icons in glowing circles.
- [ ] At least one asymmetric break (media bleeding past the grid, offset headline).
- [ ] Every number is from the CMS or `robotxData.ts`.
- [ ] Every motion has a reason from §6 and stops.
- [ ] Copy sounds like the team (CMS voice), not like a SaaS landing page.
