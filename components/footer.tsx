"use client";

import Image from "next/image";
import Link from "next/link";

import { SectionSeam } from "@/components/ui";
import { useHashLinkClick } from "@/lib/hooks";
import { clinic, navLinks } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const handleHashClick = useHashLinkClick();

  return (
    <footer className="relative isolate bg-shell">
      {/* Replaces the old hard border-t — a gradient blend from the
          preceding bone section keeps the seam consistent with the rest of
          the page instead of ending on a flat line. */}
      <SectionSeam from="bone" />
      <div className="u-container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/logo-full.png"
              alt="Perth Sweat Clinic, hyperhidrosis specialists"
              width={890}
              height={333}
              className="h-16 w-auto"
            />
            <p className="u-measure mt-6 text-sm text-slate">
              Hyperhidrosis treatment in Perth: endoscopic thoracic
              sympathectomy and miraDry, led by cardiothoracic surgeon Dr Sanjay
              Sharma.
            </p>
            <a
              href={clinic.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate transition duration-300 hover:border-clinical-300 hover:text-clinical-700"
            >
              <span className="sr-only">Perth Sweat Clinic on Facebook</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M11.5 18v-7h2.3l.35-2.7H11.5V6.58c0-.78.22-1.31 1.34-1.31h1.43V2.86c-.25-.03-1.1-.11-2.08-.11-2.06 0-3.47 1.26-3.47 3.57V8.3H6.4V11h2.32v7h2.78Z" />
              </svg>
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Explore
            </h2>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(event) => handleHashClick(event, link.href)}
                    className="text-sm text-slate transition-colors duration-300 hover:text-clinical-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#locations"
                  onClick={(event) => handleHashClick(event, "/#locations")}
                  className="text-sm text-slate transition-colors duration-300 hover:text-clinical-700"
                >
                  Locations
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Contact
            </h2>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={clinic.phoneHref}
                  className="font-semibold text-ink transition-colors duration-300 hover:text-clinical-700"
                >
                  {clinic.phone}
                </a>
              </li>
              <li>
                <a
                  href={clinic.emailHref}
                  className="break-all text-slate transition-colors duration-300 hover:text-clinical-700"
                >
                  {clinic.email}
                </a>
              </li>
              <li className="pt-2 text-slate">{clinic.addressLine}</li>
              {clinic.hours.slice(0, 2).map((entry) => (
                <li key={entry.days} className="text-slate">
                  {entry.days}{" "}
                  <span className="text-ink">{entry.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {clinic.name}. All rights reserved.
          </p>
          <p className="u-measure">
            The information on this website is general in nature and is not a
            substitute for medical advice. Individual results vary. Discuss the
            risks and benefits of any procedure with Dr Sharma.
          </p>
        </div>

        <p className="mt-6 text-xs text-muted">
          Site by{" "}
          <a
            href="https://studiosdpe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate transition-colors duration-300 hover:text-clinical-700"
          >
            Dheera Jayachitra, Studio SDPE
          </a>
        </p>
      </div>
    </footer>
  );
}
