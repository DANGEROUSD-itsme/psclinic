import type { Transition, Variants } from "motion/react";

/**
 * One shared motion language for the whole site.
 *
 * Every scroll reveal is a short upward drift plus a fade — 8–16px of
 * translate over 400–600ms with a soft ease-out. Sections import these
 * variants rather than hand-rolling timings, so the site reads as one
 * system instead of a stack of individually-tuned components.
 */

export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

export const revealTransition: Transition = {
  duration: 0.55,
  ease: EASE_OUT_SOFT,
};

/** Standard reveal: content drifts up 14px as it fades in. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

/** Smaller drift, for items inside an already-revealed block. */
export const fadeUpTight: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_SOFT } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT_SOFT } },
};

/**
 * Parent container that staggers its children's reveals.
 * Kept deliberately short — long stagger chains feel sluggish on a page
 * this dense.
 */
export function stagger(childDelay = 0.07, initialDelay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: childDelay,
        delayChildren: initialDelay,
      },
    },
  };
}

/** Shared viewport config so everything triggers at the same scroll depth. */
export const viewportOnce = { once: true, amount: 0.25 } as const;
export const viewportOnceSoft = { once: true, amount: 0.1 } as const;
