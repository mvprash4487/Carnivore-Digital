## Plan: Section-chunked facade pan

### Goal
Instead of mapping every scroll pixel to a frame (continuous scrub), divide the 100 frames into one chunk per page section. As the user scrolls a section, the pan eases through that section's frame range, then "rests" briefly between sections so each floor reads as its own beat.

### Sections (in order, from `Index.tsx`)
1. Hero
2. About
3. Services
4. Portfolio
5. Clients
6. Contact
7. Footer

7 sections → split 100 frames into 7 ranges (~14 frames each, last one to 99).

### Changes
**`src/components/ScrollFacadeBackground.tsx`**
- Add IDs (or rely on existing ones) to each `<section>` so the bg component can `querySelectorAll` them on mount. Fallback: query `main > section, footer`.
- On scroll, for each section measure its top/bottom relative to viewport center. Determine:
  - which section is "active" (its midpoint is closest to viewport center, or whose range [top, bottom] contains the center line)
  - local progress `t` within that section (0 → 1)
- Apply an ease (`smoothstep`) to `t`, then compute frame:
  `frame = floor(lerp(rangeStart, rangeEnd, eased(t)))`
- Add a small "hold" at each end: clamp `t` into `[0.1, 0.9]` then remap, so each section starts and ends on a stable frame (the chunked feel).
- Smooth between scroll events with a single requestAnimationFrame loop that lerps `displayFrame` toward `targetFrame` at ~0.15 per tick, so chunks transition cleanly even with Lenis smooth scroll.

**Index.tsx / sections**
- Ensure each top-level section is a direct child wrapper the bg can find. If components already render `<section>`, no change needed; otherwise wrap them in `<section data-facade-chunk>` in `Index.tsx`.

### Also "fix the scroll first"
Interpreting as: the current continuous scrub feels janky / not aligned. The new model fixes both — per-section chunks + RAF-lerped frame index removes pixel-by-pixel jitter and aligns visual beats with content beats.

### Out of scope
- Regenerating the video for a perfectly vertical parallel pan (user said "let's see if this works" first). If after this they still want a true parallel-axis pan, we re-generate with a stricter prompt.
