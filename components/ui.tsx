"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

import { fadeUp, stagger, viewportOnce, viewportOnceSoft } from "@/lib/motion";

/* ------------------------------------------------------------------ reveal */

/**
 * Scroll-into-view reveal. Every section composes these rather than
 * defining its own timings, which is what keeps the choreography reading
 * as a single system.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  soft?: boolean;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={soft ? viewportOnceSoft : viewportOnce}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  );
}

/** Parent for staggered groups; children should be <RevealItem>. */
export function RevealGroup({
  children,
  className,
  childDelay = 0.07,
  as: Tag = motion.div,
}: {
  children: ReactNode;
  className?: string;
  childDelay?: number;
  as?: typeof motion.div | typeof motion.ul;
}) {
  return (
    <Tag
      className={className}
      variants={stagger(childDelay)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnceSoft}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as: Tag = motion.div,
}: {
  children: ReactNode;
  className?: string;
  as?: typeof motion.div | typeof motion.li;
}) {
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}

/* ---------------------------------------------------------------- headings */

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-clinical-600">
      <span aria-hidden className="h-px w-6 bg-clinical-300" />
      {children}
    </span>
  );
}

export function SectionHeading({
  label,
  title,
  lede,
  align = "left",
  className = "",
}: {
  label?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centred = align === "center";
  return (
    <div
      className={`${centred ? "mx-auto text-center" : ""} max-w-2xl ${className}`}
    >
      {label ? (
        <Reveal>
          <SectionLabel>{label}</SectionLabel>
        </Reveal>
      ) : null}
      <Reveal>
        <h2 className="mt-5 text-display-md sm:text-display-lg">{title}</h2>
      </Reveal>
      {lede ? (
        <Reveal>
          <p className={`mt-5 text-lg text-slate ${centred ? "mx-auto" : ""}`}>
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* ----------------------------------------------------------------- buttons */

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition duration-300 ease-out-soft disabled:cursor-not-allowed disabled:opacity-60";

const buttonSizes = {
  md: "px-6 py-3",
  lg: "px-7 py-3.5 text-[0.95rem]",
} as const;

const buttonTones = {
  /* Warm secondary is reserved for the primary action on a screen. */
  primary:
    "bg-ember-500 text-white shadow-lift hover:bg-ember-600 hover:shadow-float hover:-translate-y-0.5",
  clinical:
    "bg-clinical-700 text-white shadow-lift hover:bg-clinical-800 hover:shadow-float hover:-translate-y-0.5",
  outline:
    "border border-line-strong bg-white/70 text-ink backdrop-blur hover:border-clinical-300 hover:bg-white hover:-translate-y-0.5",
  ghost: "text-clinical-700 hover:text-clinical-800",
} as const;

type ButtonTone = keyof typeof buttonTones;

export function ButtonLink({
  href,
  tone = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  href: string;
  tone?: ButtonTone;
  size?: keyof typeof buttonSizes;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={`${buttonBase} ${buttonSizes[size]} ${buttonTones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export function Button({
  tone = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  tone?: ButtonTone;
  size?: keyof typeof buttonSizes;
} & ComponentProps<"button">) {
  return (
    <button
      className={`${buttonBase} ${buttonSizes[size]} ${buttonTones[tone]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------- flow */

/**
 * Softens the seam between two adjacent sections of different background
 * colour. Section backgrounds on this page alternate in flat blocks —
 * without this, every transition is a hard horizontal line. Dropped as the
 * first child of a section, it blends the incoming section's top edge from
 * the previous section's colour down to transparent, so the colour change
 * reads as a gradient rather than a cut.
 *
 * The parent section must have `relative isolate` classes. `isolate` gives
 * the section its own stacking context, so this negative z-index is scoped
 * to that section alone — it sits above the section's own background but
 * behind every other child, positioned or not, without needing z-index
 * bookkeeping on the rest of the section's content.
 *
 * `from` must be a token defined under `@theme` in globals.css (e.g.
 * "bone", "shell", "clinical-900") — it is interpolated directly into a
 * `var(--color-*)` reference.
 */
export function SectionSeam({
  from,
  edge = "top",
  height = "h-28 sm:h-36",
}: {
  from: string;
  edge?: "top" | "bottom";
  height?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 -z-10 ${edge === "top" ? "top-0" : "bottom-0"} ${height}`}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to ${edge === "top" ? "bottom" : "top"}, var(--color-${from}), transparent)`,
        }}
      />
      {/* Dithers the gradient above so it doesn't band on real displays —
          a separate low-opacity layer, not combined into the gradient's own
          background-image, since blending it there at full strength would
          make the grain itself visible instead of just smoothing the
          transition. Same texture as the .u-grain utility. */}
      <div className="u-grain absolute inset-0" />
    </div>
  );
}

/* ------------------------------------------------------------------- cards */

/**
 * The shared card surface. Conditions, journey steps, pricing and articles
 * all sit on this so the whole page feels like one considered system.
 */
export function Card({
  children,
  className = "",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-card border border-line bg-white/80 backdrop-blur-sm ${
        interactive
          ? "transition duration-300 ease-out-soft hover:-translate-y-1 hover:border-clinical-200 hover:shadow-float"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ arrows */

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      className={`h-4 w-4 ${className}`}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
