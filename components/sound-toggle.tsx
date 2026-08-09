"use client";

import { useSound } from "@/lib/use-sound";

/**
 * The only control for the sound layer. Sound is off until this is pressed,
 * and the choice persists across visits.
 */
export function SoundToggle({ className = "" }: { className?: string }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title={enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-slate transition duration-300 ease-out-soft hover:border-clinical-300 hover:text-clinical-700 ${className}`}
    >
      <span className="sr-only">
        {enabled ? "Turn ambient sound off" : "Turn ambient sound on"}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        className="h-[18px] w-[18px]"
      >
        <path
          d="M4 8v4h2.5L10 15V5L6.5 8H4Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {enabled ? (
          <>
            <path
              d="M13 7.5a3.5 3.5 0 0 1 0 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M15.5 5.5a6.5 6.5 0 0 1 0 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          </>
        ) : (
          <path
            d="M13 8.5l4 3m0-3l-4 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
