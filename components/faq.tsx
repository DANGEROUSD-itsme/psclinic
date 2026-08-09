"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Reveal, SectionHeading, SectionSeam } from "@/components/ui";
import { EASE_OUT_SOFT } from "@/lib/motion";
import { clinic, faqs } from "@/lib/site";

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-answer-${index}`}
          className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors duration-300 hover:text-clinical-700"
        >
          <span className="font-display text-lg text-ink">{question}</span>
          <span
            aria-hidden
            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong transition-transform duration-300 ease-out-soft ${
              open ? "rotate-45 border-clinical-400 bg-clinical-50" : ""
            }`}
          >
            <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
              <path
                d="M6 1.5v9M1.5 6h9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`faq-answer-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
            className="overflow-hidden"
          >
            <p className="u-measure pb-7 text-slate">{answer}</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative isolate bg-shell py-24 sm:py-32">
      <SectionSeam from="bone" />
      <div className="u-container grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            label="Questions"
            title="The things people ask before booking."
            lede="If your question is not here, call the clinic — you will speak to someone who can answer it properly."
          />
          <Reveal>
            <a
              href={clinic.phoneHref}
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-line-strong bg-white px-5 py-3 text-sm font-semibold text-ink transition duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-clinical-300 hover:shadow-lift"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 text-clinical-600"
              >
                <path
                  d="M4.5 3.5h3l1.5 3.5-2 1.2a9 9 0 0 0 4.3 4.3l1.2-2 3.5 1.5v3a1.5 1.5 0 0 1-1.6 1.5C8.6 16.1 3.9 11.4 3 4.9A1.5 1.5 0 0 1 4.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              {clinic.phone}
            </a>
          </Reveal>
        </div>

        <Reveal soft>
          <div className="rounded-panel border border-line bg-bone px-8 shadow-lift sm:px-10">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.q}
                index={index}
                question={faq.q}
                answer={faq.a}
                open={openIndex === index}
                onToggle={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
