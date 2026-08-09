/**
 * A soft rain-streak backdrop, in the spirit of the iOS Weather app's
 * rainy-day view — thin, near-vertical lines drifting down at a slight
 * wind angle, layered for depth.
 *
 * Pure CSS (see `.u-rain` in globals.css): three tiled gradient layers at
 * different spacing, thickness, opacity and speed, each animating its own
 * `background-position-y`. No canvas, no JS animation loop, nothing to
 * mount or unmount — cheap enough to leave running behind static content.
 * `prefers-reduced-motion` freezes all three via the site-wide animation
 * override, which is enough: motionless rain streaks still read as rain.
 */
export function Rain() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="u-rain absolute inset-0"
        style={
          {
            "--rain-gap": "22px",
            "--rain-width": "0.5px",
            "--rain-opacity": "0.1",
            "--rain-duration": "5.2s",
          } as React.CSSProperties
        }
      />
      <div
        className="u-rain absolute inset-0"
        style={
          {
            "--rain-gap": "36px",
            "--rain-width": "0.9px",
            "--rain-opacity": "0.16",
            "--rain-duration": "3.6s",
          } as React.CSSProperties
        }
      />
      <div
        className="u-rain absolute inset-0 blur-[0.5px]"
        style={
          {
            "--rain-gap": "58px",
            "--rain-width": "1.4px",
            "--rain-opacity": "0.22",
            "--rain-duration": "2.5s",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
