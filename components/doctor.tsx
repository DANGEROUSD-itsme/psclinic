"use client";

import Image from "next/image";

import { ArrowRight, ButtonLink, Reveal, RevealGroup, RevealItem, SectionLabel, SectionSeam } from "@/components/ui";
import { careTeam, doctor } from "@/lib/site";

/**
 * Dr Sharma leads the practice and his credentials are its strongest single
 * asset, so they get a full section rather than a paragraph in an about
 * page — but he is not the only person a patient deals with. The care team
 * strip at the end of this section introduces who else is involved.
 */
export function Doctor() {
  return (
    <section id="doctor" className="relative isolate overflow-hidden bg-shell py-24 sm:py-32">
      <SectionSeam from="bone" />
      {/* Section-break wash — the only decorative layer down here. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[38rem] w-[38rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(169,225,233,0.55) 0%, transparent 68%)",
        }}
      />

      <div className="u-container relative grid gap-14 lg:grid-cols-[0.85fr_1fr] lg:items-start lg:gap-20">
        {/* Portrait + quote */}
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-panel border border-line bg-shell shadow-lift">
              <Image
                src={doctor.photo}
                alt={`${doctor.name}, ${doctor.role}`}
                fill
                priority
                sizes="(min-width: 1024px) 32vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal>
            <figure className="mt-8 rounded-card border border-line bg-white/80 p-7 backdrop-blur">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-clinical-300"
              >
                <path
                  d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 .5-3.5 2.5-4.5L9.5 6Zm9 0C15.5 7.5 14 10 14 13v5h6v-6h-3c0-2 .5-3.5 2.5-4.5L18.5 6Z"
                  fill="currentColor"
                />
              </svg>
              <blockquote className="mt-4 font-display text-lg leading-snug text-ink">
                {doctor.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">
                {doctor.name}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Bio */}
        <div>
          <Reveal>
            <SectionLabel>Meet the team</SectionLabel>
          </Reveal>

          <Reveal>
            <h2 className="mt-5 text-display-md sm:text-display-lg">
              {doctor.name}
            </h2>
          </Reveal>

          <Reveal>
            <p className="mt-3 text-base font-medium text-clinical-700">
              {doctor.quals}
            </p>
          </Reveal>

          <Reveal>
            <p className="mt-7 text-lg text-slate">{doctor.intro}</p>
          </Reveal>

          <RevealGroup className="mt-9 space-y-5">
            {doctor.bio.map((paragraph) => (
              <RevealItem key={paragraph.slice(0, 40)}>
                <p className="text-slate">{paragraph}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Credentials */}
          <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
            {doctor.credentials.map((credential) => (
              <RevealItem key={credential.label} className="bg-bone px-6 py-6">
                <p className="font-display text-base text-ink">
                  {credential.label}
                </p>
                <p className="mt-1.5 text-sm text-muted">{credential.detail}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          {/* Timeline */}
          <div className="mt-12">
            <Reveal>
              <h3 className="text-lg font-semibold text-ink">
                Practising in Perth since 2004
              </h3>
            </Reveal>

            <RevealGroup className="mt-6 space-y-0" childDelay={0.06}>
              {doctor.milestones.map((milestone) => (
                <RevealItem
                  key={milestone.year}
                  className="relative flex gap-6 border-l border-line pb-7 pl-7 last:pb-0"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[5px] top-[9px] h-2.5 w-2.5 rounded-full border-2 border-shell bg-clinical-500"
                  />
                  <span className="w-12 shrink-0 pt-px font-display text-sm font-semibold text-clinical-700">
                    {milestone.year}
                  </span>
                  <span className="text-slate">{milestone.event}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal>
            <div className="mt-11">
              <ButtonLink href="/#contact" tone="clinical" size="lg">
                Consult with Dr Sharma
                <ArrowRight />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>

      {/* The wider care team. Dr Sharma leads the practice, but a patient's
          day-to-day contact is often the nurse coordinator below. */}
      <div className="u-container relative mt-20">
        <Reveal>
          <div className="rounded-panel border border-line bg-bone/80 p-8 backdrop-blur sm:p-10">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-clinical-600">
              Care team
            </p>
            <h3 className="mt-4 font-display text-2xl text-ink">
              Who else you will meet
            </h3>
            <p className="mt-3 max-w-2xl text-slate">
              Dr Sharma leads every consultation and performs every
              procedure, but he does not do it alone. Here is who else is
              involved in your care.
            </p>

            <RevealGroup className="mt-8 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
              <RevealItem className="bg-white px-7 py-7">
                <div className="flex items-center gap-4">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-clinical-200">
                    <Image
                      src={doctor.photo}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <div>
                    <p className="font-display text-lg text-ink">
                      {doctor.name}
                    </p>
                    <p className="text-sm text-clinical-700">
                      Founder & Lead Specialist
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate">{doctor.quals}</p>
              </RevealItem>

              {careTeam.map((member) => (
                <RevealItem key={member.name} className="bg-white px-7 py-7">
                  <div className="flex items-center gap-4">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-clinical-200">
                      <Image
                        src={member.photo}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </span>
                    <div>
                      <p className="font-display text-lg text-ink">
                        {member.name}
                      </p>
                      <p className="text-sm text-clinical-700">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate">{member.quals}</p>
                  <p className="mt-3 text-sm text-slate">{member.summary}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
