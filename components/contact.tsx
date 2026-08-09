"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { ArrowRight, Button, Reveal, SectionLabel, SectionSeam } from "@/components/ui";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { clinic } from "@/lib/site";
import { useSound } from "@/lib/use-sound";

const areas = [
  { value: "hands", label: "Hands" },
  { value: "underarms", label: "Underarms" },
  { value: "face", label: "Face or head" },
  { value: "multiple", label: "More than one" },
  { value: "unsure", label: "Not sure yet" },
];

const preferences = [
  { value: "in-person", label: "In person" },
  { value: "phone", label: "Phone" },
  { value: "video", label: "Video" },
];

const fieldClass =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-[0.95rem] text-ink placeholder:text-muted transition duration-200 focus:border-clinical-400 focus:outline-none focus:ring-4 focus:ring-clinical-100";

const labelClass = "block text-sm font-medium text-ink";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const { play } = useSound();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(body.error ?? "Something went wrong. Please try calling us.");
        setStatus("error");
        return;
      }

      setStatus("sent");
      // The one place a chime is warranted — a completed enquiry.
      play("chime");
    } catch {
      setError(
        `We could not send that just now. Please call the clinic on ${clinic.phone}.`,
      );
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative isolate bg-bone py-24 sm:py-32">
      <SectionSeam from="shell" />
      <div className="u-container">
        <div className="overflow-hidden rounded-panel border border-line bg-shell shadow-lift">
          <div className="grid lg:grid-cols-[0.85fr_1fr]">
            {/* Reassurance column */}
            <div className="relative overflow-hidden p-8 sm:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(169,225,233,0.6) 0%, transparent 68%)",
                }}
              />
              <div className="relative">
                <Reveal>
                  <SectionLabel>Book a consultation</SectionLabel>
                </Reveal>
                <Reveal>
                  <h2 className="mt-5 text-display-md">
                    Start with a conversation.
                  </h2>
                </Reveal>
                <Reveal>
                  <p className="mt-5 text-slate">
                    Send an enquiry and the clinic will be in touch to arrange a
                    consultation with Dr Sharma, in person at Mounts Bay Rd, or
                    by phone or video if you are regional.
                  </p>
                </Reveal>

                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Call the clinic
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={clinic.phoneHref}
                        className="font-display text-2xl text-ink transition-colors hover:text-clinical-700"
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
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Consulting suite
                    </dt>
                    <dd className="mt-1.5 text-slate">{clinic.addressLine}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      Hours
                    </dt>
                    <dd className="mt-1.5 space-y-1">
                      {clinic.hours.slice(0, 2).map((entry) => (
                        <p key={entry.days} className="text-sm text-slate">
                          {entry.days}{" "}
                          <span className="text-ink">{entry.time}</span>
                        </p>
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Form column */}
            <div className="border-t border-line bg-bone p-8 sm:p-12 lg:border-l lg:border-t-0">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE_OUT_SOFT }}
                    className="flex h-full min-h-[26rem] flex-col items-start justify-center"
                  >
                    <span
                      aria-hidden
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-clinical-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-7 w-7 text-clinical-700"
                      >
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <h3 className="mt-6 font-display text-2xl text-ink">
                      Enquiry received.
                    </h3>
                    <p className="mt-3 max-w-sm text-slate">
                      The clinic will be in touch shortly. If it is urgent,
                      please call{" "}
                      <a
                        href={clinic.phoneHref}
                        className="font-semibold text-clinical-700 underline-offset-4 hover:underline"
                      >
                        {clinic.phone}
                      </a>
                      .
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={false}
                    className="space-y-5"
                    noValidate
                  >
                    {/* Honeypot */}
                    <div aria-hidden className="hidden">
                      <label htmlFor="company">Company</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className={labelClass}>
                          Your name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          className={`mt-2 ${fieldClass}`}
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          Phone{" "}
                          <span className="font-normal text-muted">
                            (optional)
                          </span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          className={`mt-2 ${fieldClass}`}
                          placeholder="04.. ... ..."
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className={`mt-2 ${fieldClass}`}
                        placeholder="you@example.com"
                      />
                    </div>

                    <fieldset>
                      <legend className={labelClass}>
                        Which area affects you?
                      </legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {areas.map((area, index) => (
                          <label
                            key={area.value}
                            className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm text-slate transition duration-200 has-[:checked]:border-clinical-400 has-[:checked]:bg-clinical-50 has-[:checked]:text-clinical-800 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-clinical-100"
                          >
                            <input
                              type="radio"
                              name="area"
                              value={area.value}
                              defaultChecked={index === 0}
                              className="sr-only"
                            />
                            {area.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className={labelClass}>
                        Consultation preference
                      </legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {preferences.map((preference, index) => (
                          <label
                            key={preference.value}
                            className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm text-slate transition duration-200 has-[:checked]:border-clinical-400 has-[:checked]:bg-clinical-50 has-[:checked]:text-clinical-800 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-clinical-100"
                          >
                            <input
                              type="radio"
                              name="preference"
                              value={preference.value}
                              defaultChecked={index === 0}
                              className="sr-only"
                            />
                            {preference.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className={labelClass}>
                        Do you have a GP referral?
                      </legend>
                      <p className="mt-1 text-xs text-muted">
                        A valid referral entitles you to a Medicare rebate of
                        $86.15.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "Not yet" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm text-slate transition duration-200 has-[:checked]:border-clinical-400 has-[:checked]:bg-clinical-50 has-[:checked]:text-clinical-800 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-clinical-100"
                          >
                            <input
                              type="radio"
                              name="referral"
                              value={option.value}
                              className="sr-only"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Anything you would like Dr Sharma to know{" "}
                        <span className="font-normal text-muted">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className={`mt-2 resize-y ${fieldClass}`}
                        placeholder="How long it has affected you, what you have already tried…"
                      />
                    </div>

                    {error ? (
                      <p
                        role="alert"
                        className="rounded-2xl border border-ember-300 bg-ember-100 px-4 py-3 text-sm text-ember-700"
                      >
                        {error}
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === "sending"}
                      className="w-full sm:w-auto"
                    >
                      {status === "sending" ? "Sending…" : "Send enquiry"}
                      {status === "sending" ? null : <ArrowRight />}
                    </Button>

                    <p className="text-xs text-muted">
                      Your enquiry is forwarded to the clinic and is not stored
                      on this website. Please do not include detailed medical
                      history here; that conversation belongs in your
                      consultation.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
