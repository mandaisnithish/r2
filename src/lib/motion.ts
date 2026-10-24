/* Author: Nithish Kaliannan Ananth */
// src/lib/motion.ts
// Motion tokens (DESIGN_SYSTEM.md §6). Damped, never bouncy.

export const EASE_HYDRO = [0.22, 0.9, 0.24, 1] as const;

export const SPRING_HYDRO = { type: "spring", stiffness: 140, damping: 22, mass: 1.1 } as const;

/** Standard scroll reveal: rises 24 px and settles. Plays once. */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: { duration: 0.8, ease: EASE_HYDRO, delay },
});

/** Same, sideways — used for offset editorial columns. */
export const revealSide = (dir: 1 | -1 = 1, delay = 0) => ({
  initial: { opacity: 0, x: 28 * dir },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: { duration: 0.9, ease: EASE_HYDRO, delay },
});
