## Plan: 100x the facade — regenerate footage + smooth scroll

### 1. Regenerate the source video
Use `videogen--generate_video` with a starting frame to lock the composition before the camera moves.

- **First, generate a wide hero still** (`imagegen` premium, 1080x1920 portrait):
  - Modern luxury 5-star hotel, full ground floor visible, **shot wide enough to show the entire 11-story facade context** with sky above
  - Two tall, lush palm trees flanking the entrance (one left, one right), fronds catching warm sunset light
  - Rich architectural detail: stone base, brass-trimmed revolving door, valet awning, illuminated signage, balconies with planters, layered window mullions, decorative cornices, rooftop crown
  - Symmetrical, dead-center framing, lens at ground level looking slightly up
  - Cinematic golden hour, soft haze, shallow ambient glow
- **Then generate the video** (10s, 1080p, 9:16, `camera_fixed: false` but prompt enforces locked pan):
  - "Locked tripod tilt-up, perfectly vertical 90° camera pan from ground floor to the 11th-floor rooftop crown. No dolly, no zoom, no horizontal drift, no parallax sway. Constant slow speed. Palm trees stay in frame on both sides as the camera rises. Final frame rests on the rooftop crown against sky."
  - `starting_frame` = the still above so framing is preserved
- **Re-extract 360 frames** with ffmpeg into `public/facade/frame_XXXX.jpg` (overwrite 1–360, delete 361–362), bump `ASSET_VERSION` to `4` for cache bust.

### 2. Smoother scroll choreography in `ScrollFacadeBackground.tsx`
Current scroll feels rigid because: (a) RAF lerp factor 0.18 is snappy not silky, (b) `Math.round` quantizes to integer frames causing micro-jitter, (c) the hard band edges (t<0.4 → 0, t>0.6 → 1) create a visible "kick" when entering/leaving the band.

Changes:
- **Sub-frame blending**: drop the `rounded !== last` gate. Draw every RAF tick, and crossfade between the two nearest integer frames using fractional alpha (`ctx.globalAlpha`) so motion looks continuous even with 320 frames over a long scroll.
- **Softer easing core**: replace `smoothstep` with `smootherstep` (`6t⁵−15t⁴+10t³`) for the band, and widen the band to `BAND_START=0.25 / BAND_END=0.75` so the pan breathes across more of each section rather than snapping in the middle.
- **Critically-damped follow** instead of fixed lerp: replace `*= 0.18` with a time-aware exponential smoothing using delta-time (`1 - exp(-dt / tau)`, tau ≈ 0.18s). Makes the catch-up frame-rate independent and visibly creamier on fast scrolls.
- **Velocity-aware easing**: clamp the per-tick frame delta so a fling-scroll still glides instead of jumping — the displayed frame trails the target with a max speed cap (e.g. 6 frames / 16ms).
- **Subtle parallax life**: while holding on an anchor, add a tiny sinusoidal offset (±0.4 frames at 0.15Hz) so the image is never perfectly frozen — kills the "stuck poster" feel without breaking the hold semantics.
- **Reduced-motion**: keep current behavior (snap to anchor, no easing).

### 3. Verify
- Spot-check generated stills (`code--view` the new frame_0001, _0090, _0180, _0270, _0360) to confirm wide framing, palms present, strict vertical progression.
- Scroll through preview to confirm: hero shows new wide entrance, each section holds with subtle drift, transitions glide between floors, last section ends on rooftop crown.

### Out of scope
- Changing section count, hero copy, or layout
- Adding new sections to absorb extra frames
