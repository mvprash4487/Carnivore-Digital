## Plan: Scroll-driven hotel facade background

### 1. Generate the video
- Use `videogen--generate_video` with a detailed prompt for a photoreal cinematic 5-star hotel facade, camera starting at street level and slowly tilting up floor-by-floor to the 11th floor. Warm evening light, shallow haze, subtle people/cars at base, ornate stone + glass facade, balconies, illuminated windows, no text/logos.
- Settings: 1080p, 9:16 aspect (matches a tall vertical pan and the site's portrait viewport), 10s, `camera_fixed: false`.
- Save to `/tmp/hotel_facade.mp4`.

### 2. Extract frames
- Use ffmpeg to extract ~120 frames evenly across the 10s clip (12 fps), resized to ~720px wide JPEGs (~80 quality) to keep total weight manageable (~3–6 MB).
- Save to `public/facade/frame_0001.jpg` … `frame_0120.jpg`.
- QA: spot-check first/middle/last frame to confirm pan covers ground → 11th floor cleanly.

### 3. Wire it up as scroll-driven background
- Create `src/components/ScrollFacadeBackground.tsx`:
  - Preloads all frames into `Image` objects.
  - Renders a fixed full-viewport `<canvas>` behind content (z-0, `pointer-events-none`).
  - On scroll, maps page scroll progress (0 → 1) to frame index and draws the matching frame (cover-fit).
  - Uses `requestAnimationFrame` throttling; integrates with existing Lenis smooth scroll.
  - Honors `prefers-reduced-motion` (shows only the first frame).
- Add a dark gradient overlay on top of the canvas (oxblood → near-black) so existing text stays legible against the photo.

### 4. Replace the current 3D background
- In `src/pages/Index.tsx`, swap the lazy `LiquidGoldScene` for `ScrollFacadeBackground`.
- Leave `LiquidGoldScene.tsx` in the repo (unused) so we can revert easily; remove only if you confirm.

### 5. Verify
- Load the page, scroll top → bottom, confirm the facade pans smoothly from ground floor to the 11th floor and content remains readable on mobile (390px) and desktop.

### Technical notes
- Frame-sequence-on-canvas (vs `<video>`) gives perfectly scrubbable, scroll-locked playback on iOS too, where inline `<video>` scrubbing is unreliable.
- Total payload target ≤ 6 MB; if heavier, drop to 90 frames or 640px width.
- All assets served from `/public/facade/` — no backend needed.
