# Perth Sweat Clinic

A cinematic rebuild of [perthsweatclinic.com.au](https://perthsweatclinic.com.au) — a
hyperhidrosis practice in Perth, WA, led by cardiothoracic surgeon Dr Sanjay Sharma.

Light, airy, clinical-premium. Tailwind for the design system, a small number of
WebGL moments where they earn their place, and static fallbacks everywhere they
do not.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| 3D / shaders | react-three-fiber + three |
| Motion | `motion` (Framer Motion) — `useScroll` scrubbing, no GSAP |
| Sound | Web Audio API, synthesised — zero audio assets |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Design system

Tokens live in `app/globals.css` under `@theme` — Tailwind v4 is CSS-first, so
there is no `tailwind.config`. The palette is deliberately small:

- **Surfaces** — `bone` (base), `shell`, `mist`, `line`
- **Ink** — `ink`, `slate`, `muted`
- **`clinical-*`** — the single accent, a clinical teal
- **`ember-*`** — the warm secondary, reserved for calls to action

Shape and depth are shared too (`rounded-card`, `rounded-panel`, `shadow-lift`,
`shadow-float`) so conditions, journey steps, pricing and articles all sit on one
card language.

Motion variants are centralised in `lib/motion.ts`. Sections compose `Reveal` /
`RevealGroup` from `components/ui.tsx` rather than defining their own timings —
that is what keeps the choreography reading as one system.

## The WebGL moments

Two, not everywhere:

1. **`webgl/dry-hand-field`** — the hero. Droplets as GPU points on the off-white
   base. Each has its own evaporation threshold, so scrolling clears the field
   unevenly the way a real surface dries; the cursor drags a local drying halo.
2. **`webgl/condition-field`** — the condition switcher. A procedural field per
   sub-type, with a ripple that distorts the surface as it sweeps between them.

There used to be a third — a scroll-scrubbed 3D animation of the sympathetic
nerve chain "switching off" for the ETS explainer. It was removed: a stylised
animation of a surgical mechanism on a marketing page risks reading as more
clinically authoritative than the page can responsibly back up, and it shipped
alongside an invented minute-by-minute procedure-day schedule that overclaimed
certainty about hospital scheduling. `components/ets-explainer.tsx` now states
plainly what the procedure treats, where it happens and its real risks, and
routes everything else — the technique, what to expect — to the consultation,
where it belongs.

### Guardrails

Every canvas is behind `useWebGLEligible()` (`lib/hooks.ts`), which opts out on
`prefers-reduced-motion`, on missing WebGL support, and on devices reporting very
limited cores or memory. Canvases mount on approach and unmount off-screen via
`useNearViewport`, so at most one context is ever alive.

Each has a real static fallback, not a blank box: the hero falls back to the
`u-wash` gradient, and the condition field to a per-condition CSS gradient.

## Sound

Off by default, toggled from the header, persisted to `localStorage`. Everything
is synthesised with the Web Audio API — an ambient "dry air" bed built from
filtered noise, a droplet tick when the hero field resolves, and a chime on a
completed enquiry. No audio files, so the feature costs nothing at load.

The `AudioContext` is only constructed when the visitor flips the toggle. On a
return visit the stored preference is restored but audio waits for the first real
interaction, since browsers require a gesture.

## The enquiry form

`app/api/enquiry/route.ts` validates and forwards enquiries. Nothing is stored or
logged — these carry health information.

Delivery uses the Resend REST API. Set these in Vercel → Project → Settings →
Environment Variables:

| Variable | Example |
|---|---|
| `RESEND_API_KEY` | `re_...` |
| `ENQUIRY_TO_EMAIL` | `contact@perthsweatclinic.com.au` |
| `ENQUIRY_FROM_EMAIL` | `website@perthsweatclinic.com.au` (must be a verified Resend sender) |

**Until these are set the form returns a clear "not set up yet, please call"
message rather than accepting an enquiry it cannot deliver.** A contact form that
silently drops a patient enquiry is worse than no form at all.

## Content

All clinic facts, fees, copy and FAQs live in `lib/site.ts` — one source of truth,
so figures cannot drift between sections. Structured data (`MedicalClinic`,
`Physician`, `FAQPage`) in `app/layout.tsx` is generated from the same data.

## Known gaps — things needing the clinic's input

- **Photos of the team.** This is a hard blocker, not a choice: the sandbox this
  site was built in cannot reach `perthsweatclinic.com.au` at all — both
  `curl` and the fetch tooling get a `403` from the network's egress policy —
  so no image could be downloaded from the live site to reuse here.
  `components/doctor.tsx` has a designed placeholder in a 4:5 frame, ready for
  an `<Image>` drop-in the moment real photos are supplied directly (upload,
  or a Drive/Dropbox link an operator can fetch), for both Dr Sharma and the
  clinical nurse coordinator introduced in the care-team card beneath his bio.
- **The nurse coordinator's name.** Her role, qualifications and career history
  in `careTeam` (`lib/site.ts`) are sourced from the clinic's own published
  About page — but that page does not give a personal name, so none is
  invented here. Replace `careTeam[0].name` directly once the clinic confirms
  one, and whether there are other staff (additional doctors, admin, reception)
  worth introducing the same way.
- **Patient stories.** `patientStories` in `lib/site.ts` is intentionally empty.
  Nothing on this site should be invented on a patient's behalf. Add consented,
  anonymised quotes and the block on the Results section appears automatically.
- **Booking.** The form is an enquiry flow, not live scheduling. Wiring it to a
  real booking system is a follow-up.

The Learn hub's five posts (`articles` in `lib/site.ts`) link out to the real
articles on `perthsweatclinic.com.au/blog/` with excerpts sourced from them —
not invented, and not reproduced in full; each card opens the original.
