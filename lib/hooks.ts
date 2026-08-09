"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks `prefers-reduced-motion` reactively.
 *
 * Starts as `true` so the very first paint is the calm, static version —
 * we would rather briefly under-animate than flash a particle field at
 * someone who has asked the system for less motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Decides whether this device should get the WebGL layer at all.
 *
 * This is a medical site: a patient on an older phone needs the content to
 * load fast far more than they need a shader. We opt out on reduced-motion,
 * on machines without a usable WebGL context, and on devices reporting very
 * limited cores or memory.
 */
export function useWebGLEligible(): boolean {
  const prefersReduced = usePrefersReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setCapable(false);
      return;
    }

    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    if (cores <= 2 || memory <= 2) {
      setCapable(false);
      return;
    }

    let supported = false;
    try {
      const probe = document.createElement("canvas");
      supported = Boolean(
        probe.getContext("webgl2") ?? probe.getContext("webgl"),
      );
    } catch {
      supported = false;
    }

    setCapable(supported);
  }, [prefersReduced]);

  return capable;
}

/**
 * Reports whether an element is near the viewport.
 *
 * WebGL canvases use this to mount on approach and unmount once they are
 * well clear of the screen, so at most one or two contexts are ever alive.
 */
export function useNearViewport<T extends HTMLElement>(
  rootMargin = "300px",
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, near];
}

/** Reports whether the page has been scrolled past a given offset. */
export function useScrolledPast(offset = 24): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return past;
}

/**
 * Fixes a real Next.js `<Link>` quirk: clicking a hash link when the
 * browser is already sitting at that exact URL (path *and* hash) is a
 * no-op — the router sees the destination matches the current location and
 * skips the navigation entirely, so nothing scrolls. That is exactly what
 * happens after clicking "Book a consultation" once (landing on
 * `/#contact`), scrolling back up by hand, and clicking it again: the URL
 * never changed out from under it, so the second click does nothing.
 *
 * This bypasses the router for that one case. If the target id exists on
 * the current page, it scrolls there directly and syncs the URL itself
 * (push when the hash is actually changing, replace when it is not, so a
 * repeat click never litters browser history) — Next's navigation only
 * runs at all for hrefs it needs to, i.e. targets on a different page.
 * Modified clicks (open in new tab, etc.) are left alone.
 */
export function useHashLinkClick() {
  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const match = /^\/?#([\w-]+)$/.exec(href);
      if (!match) return;

      const id = match[1];
      const el = document.getElementById(id);
      // No matching id on this page — it lives elsewhere, so let Next's
      // Link perform the real cross-page navigation instead.
      if (!el) return;

      event.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });

      const newHash = `#${id}`;
      if (window.location.hash !== newHash) {
        history.pushState(null, "", `/${newHash}`);
      } else {
        history.replaceState(null, "", `/${newHash}`);
      }
    },
    [],
  );
}
