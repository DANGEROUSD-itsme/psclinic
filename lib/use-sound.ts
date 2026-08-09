"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { soundEngine } from "./sound";

/**
 * React binding for the opt-in sound layer.
 *
 * Components call `play()` freely — the engine ignores every cue while
 * sound is switched off, so callers never have to check first.
 */
export function useSound() {
  const enabled = useSyncExternalStore(
    soundEngine.subscribe,
    soundEngine.getSnapshot,
    soundEngine.getServerSnapshot,
  );

  useEffect(() => {
    soundEngine.hydrate();
  }, []);

  const play = useCallback((cue: "droplet" | "chime") => {
    soundEngine.play(cue);
  }, []);

  const toggle = useCallback(() => {
    soundEngine.toggle();
  }, []);

  return { enabled, play, toggle };
}
