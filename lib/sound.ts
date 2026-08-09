"use client";

/**
 * Opt-in sound layer.
 *
 * Nothing here makes a sound until the visitor explicitly turns it on —
 * this is a medical site and autoplaying audio would be indefensible.
 *
 * Every sound is synthesised with the Web Audio API rather than loaded
 * from a file, so the feature costs zero network bytes and cannot delay
 * first paint. The AudioContext itself is only constructed at the moment
 * the visitor flips the toggle, which doubles as the user gesture browsers
 * require before audio is permitted.
 */

const STORAGE_KEY = "psc-sound-enabled";

/** Master ceiling, roughly -20dB relative to typical system volume. */
const MASTER_GAIN = 0.1;
const AMBIENT_GAIN = 0.035;

type Cue = "droplet" | "chime";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambient: { source: AudioBufferSourceNode; gain: GainNode } | null = null;
  private listeners = new Set<() => void>();

  enabled = false;

  // ---------------------------------------------------------------- store

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.enabled;

  /** The server has no idea what the visitor previously chose; assume off. */
  getServerSnapshot = () => false;

  private emit() {
    this.listeners.forEach((listener) => listener());
  }

  private hydrated = false;

  /** Restores the previous choice on mount. Never enables audio by itself. */
  hydrate() {
    if (typeof window === "undefined" || this.hydrated) return;
    this.hydrated = true;
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== "true") return;

      this.enabled = true;
      this.emit();

      // The visitor opted in on a previous visit, but browsers still require
      // a gesture before audio may start. Wait for the first real interaction
      // and bring the ambient bed up then.
      const resume = () => {
        if (this.enabled) {
          this.ensureContext();
          this.startAmbient();
        }
        window.removeEventListener("pointerdown", resume);
        window.removeEventListener("keydown", resume);
      };
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    } catch {
      /* storage unavailable — stay silent */
    }
  }

  // -------------------------------------------------------------- context

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;

      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = MASTER_GAIN;
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  // --------------------------------------------------------------- toggle

  toggle() {
    this.setEnabled(!this.enabled);
  }

  setEnabled(next: boolean) {
    this.enabled = next;

    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* non-fatal */
    }

    if (next) {
      this.ensureContext();
      this.startAmbient();
    } else {
      this.stopAmbient();
    }

    this.emit();
  }

  // --------------------------------------------------------------- ambient

  /**
   * A near-subliminal "dry air" bed: looping noise pushed through a narrow
   * band-pass whose centre drifts slowly, so it breathes rather than hisses.
   * Always faded in and out — a hard start would be jarring.
   */
  private startAmbient() {
    const ctx = this.ensureContext();
    if (!ctx || !this.master || this.ambient) return;

    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Low-passed random walk — closer to soft moving air than white noise.
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 620;
    band.Q.value = 0.7;

    // Slow drift across the band so the loop never reads as a loop.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.05;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 180;
    lfo.connect(lfoDepth).connect(band.frequency);

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(AMBIENT_GAIN, ctx.currentTime + 2.5);

    source.connect(band).connect(gain).connect(this.master);
    source.start();
    lfo.start();

    this.ambient = { source, gain };
  }

  private stopAmbient() {
    const ctx = this.ctx;
    const ambient = this.ambient;
    if (!ctx || !ambient) return;

    this.ambient = null;
    ambient.gain.gain.cancelScheduledValues(ctx.currentTime);
    ambient.gain.gain.setValueAtTime(ambient.gain.gain.value, ctx.currentTime);
    ambient.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    window.setTimeout(() => {
      try {
        ambient.source.stop();
      } catch {
        /* already stopped */
      }
    }, 900);
  }

  // ------------------------------------------------------------------ cues

  play(cue: Cue) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;

    if (cue === "droplet") this.playDroplet(ctx, this.master);
    if (cue === "chime") this.playChime(ctx, this.master);
  }

  /**
   * A droplet resolving: a short pitch-drop blip, ~120ms end to end.
   * Used when the hero particle field finishes clearing — a rare moment,
   * not a hover sound.
   */
  private playDroplet(ctx: AudioContext, out: GainNode) {
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1180, now);
    osc.frequency.exponentialRampToValueAtTime(460, now + 0.11);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.5, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain).connect(out);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * A gentle two-note confirmation for a completed enquiry. Reserved for
   * genuinely meaningful actions.
   */
  private playChime(ctx: AudioContext, out: GainNode) {
    const now = ctx.currentTime;
    // A fifth — open and settled rather than triumphant.
    [
      { freq: 784, at: 0 },
      { freq: 1175, at: 0.11 },
    ].forEach(({ freq, at }) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now + at);
      gain.gain.exponentialRampToValueAtTime(0.34, now + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + at + 0.5);

      osc.connect(gain).connect(out);
      osc.start(now + at);
      osc.stop(now + at + 0.55);
    });
  }
}

export const soundEngine = new SoundEngine();
