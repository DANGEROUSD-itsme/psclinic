"use client";

import { Reveal, RevealGroup, RevealItem, SectionHeading, SectionSeam } from "@/components/ui";
import { clinic, locations } from "@/lib/site";

const mapsQuery = encodeURIComponent(`${clinic.addressLine}, Australia`);

export function Locations() {
  return (
    <section id="locations" className="relative isolate bg-shell py-24 sm:py-32">
      <SectionSeam from="bone" />
      <div className="u-container">
        <SectionHeading
          label="Locations"
          title="One consulting suite, four partner hospitals."
          lede="Consultations and miraDry happen at the Mounts Bay Rd suite and the Mount Hospital suite. Surgery is performed at accredited private hospitals across Perth."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Primary suite */}
          <Reveal soft>
            <div className="flex h-full flex-col overflow-hidden rounded-panel border border-line bg-bone shadow-lift">
              <div className="p-8 sm:p-10">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-clinical-600">
                  {locations.clinic.name}
                </span>
                <h3 className="mt-4 font-display text-2xl text-ink">
                  {clinic.address.suite}
                </h3>
                <p className="mt-2 text-slate">
                  {clinic.address.locality} {clinic.address.region}{" "}
                  {clinic.address.postcode}
                </p>
                <p className="mt-5 text-sm text-muted">
                  {locations.clinic.note}
                </p>

                <dl className="mt-8 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Phone
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={clinic.phoneHref}
                        className="font-semibold text-clinical-700 underline-offset-4 hover:underline"
                      >
                        {clinic.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Email
                    </dt>
                    <dd className="mt-1.5 break-all">
                      <a
                        href={clinic.emailHref}
                        className="font-semibold text-clinical-700 underline-offset-4 hover:underline"
                      >
                        {clinic.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Map. Loaded lazily and only on demand by the browser — the
                  embed is not worth blocking anything above it. */}
              <div className="mt-auto aspect-[16/9] w-full border-t border-line bg-mist">
                <iframe
                  title={`Map showing ${clinic.addressLine}`}
                  src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                />
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {/* Hospitals */}
            <Reveal soft>
              <div className="rounded-panel border border-line bg-bone p-8 sm:p-10">
                <h3 className="font-display text-xl text-ink">
                  Partner hospitals
                </h3>
                <ul className="mt-6 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
                  {locations.hospitals.map((hospital) => (
                    <li
                      key={hospital.name}
                      className="flex items-baseline justify-between gap-4 bg-bone px-5 py-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {hospital.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {hospital.note}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted">
                        {hospital.suburb}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Hours */}
            <Reveal soft>
              <div className="rounded-panel border border-line bg-bone p-8 sm:p-10">
                <h3 className="font-display text-xl text-ink">Clinic hours</h3>
                <RevealGroup className="mt-6 space-y-3.5" childDelay={0.05}>
                  {clinic.hours.map((entry) => (
                    <RevealItem
                      key={entry.days}
                      className="flex items-baseline justify-between gap-6 border-b border-line pb-3.5 last:border-b-0 last:pb-0"
                    >
                      <span className="text-sm text-slate">{entry.days}</span>
                      <span className="text-sm font-semibold text-ink">
                        {entry.time}
                      </span>
                    </RevealItem>
                  ))}
                </RevealGroup>
                <p className="mt-6 text-sm text-muted">
                  Phone and video consultations are available for patients
                  outside Perth.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
