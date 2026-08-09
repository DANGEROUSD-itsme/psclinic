"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { SoundToggle } from "@/components/sound-toggle";
import { ArrowRight, ButtonLink } from "@/components/ui";
import { useScrolledPast } from "@/lib/hooks";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { clinic, navLinks } from "@/lib/site";

function Wordmark() {
  return (
    <Link href="#main" className="group flex shrink-0 items-center gap-3">
      {/*
        Sized up from the original 36px badge so it actually reads as a
        mark rather than a favicon next to the wordmark, while staying well
        short of competing with the nav's own 80px height (h-20) for
        attention. shadow-lift gives it a touch of the same lift the card
        surfaces get elsewhere, rather than sitting flat.
      */}
      <span
        aria-hidden
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-clinical-700 shadow-lift transition-transform duration-300 ease-out-soft group-hover:scale-105 sm:h-12 sm:w-12"
      >
        {/* A droplet, resolving. */}
        <svg viewBox="0 0 20 20" fill="none" className="h-[22px] w-[22px] sm:h-6 sm:w-6">
          <path
            d="M10 3.5c2.6 3 4 5 4 6.8a4 4 0 1 1-8 0c0-1.8 1.4-3.8 4-6.8Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {/*
        The clinic name itself is always visible, at every viewport width —
        it is the one thing in the header that should never disappear. Only
        the smaller tagline line under it, a "nice to have" rather than
        identifying information, is held back below `sm` to keep the header
        from feeling cramped on the narrowest phones.
      */}
      <span className="leading-tight">
        <span className="block whitespace-nowrap font-display text-[0.82rem] font-semibold tracking-tight text-ink sm:text-[0.95rem]">
          Perth Sweat Clinic
        </span>
        <span className="hidden whitespace-nowrap text-[0.68rem] uppercase tracking-[0.14em] text-muted sm:block">
          Hyperhidrosis specialists
        </span>
      </span>
    </Link>
  );
}

export function SiteNav() {
  const scrolled = useScrolledPast(40);
  const [menuOpen, setMenuOpen] = useState(false);

  // A mobile menu that stayed open behind a scrolling page would be a trap.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-500 ease-out-soft ${
        scrolled
          ? "border-b border-line bg-bone/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="u-container flex h-20 items-center justify-between gap-6"
      >
        <Wordmark />

        <ul className="hidden shrink-0 items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="whitespace-nowrap text-[0.8125rem] font-medium text-slate transition-colors duration-300 hover:text-clinical-700"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          {/*
            Wrapped rather than given `hidden sm:*` directly: these controls
            set their own `display`, and Tailwind resolves conflicting display
            utilities by stylesheet order, not by class order — so `hidden`
            on the element itself would lose to the base `inline-flex`.
            Below `sm` both live in the mobile menu instead.
          */}
          <span className="hidden sm:contents">
            <SoundToggle className="shrink-0" />
          </span>
          <a
            href={clinic.phoneHref}
            className="hidden whitespace-nowrap text-sm font-semibold text-ink transition-colors duration-300 hover:text-clinical-700 xl:block"
          >
            {clinic.phone}
          </a>
          <span className="hidden sm:contents">
            <ButtonLink href="/#contact" className="whitespace-nowrap">
              Book a consultation
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink lg:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
            <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" fill="none">
              {menuOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 12h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE_OUT_SOFT }}
            className="border-t border-line bg-bone/97 backdrop-blur-xl lg:hidden"
          >
            <div className="u-container flex flex-col gap-1 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-ink transition-colors duration-200 hover:bg-shell"
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 flex items-center gap-3 border-t border-line pt-5">
                <ButtonLink
                  href="/#contact"
                  size="lg"
                  className="flex-1"
                  onClick={() => setMenuOpen(false)}
                >
                  Book a consultation
                  <ArrowRight />
                </ButtonLink>
                <SoundToggle className="h-11 w-11 shrink-0" />
              </div>

              <a
                href={clinic.phoneHref}
                className="mt-3 px-4 text-sm text-muted"
              >
                Or call{" "}
                <span className="font-semibold text-clinical-700">
                  {clinic.phone}
                </span>
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
