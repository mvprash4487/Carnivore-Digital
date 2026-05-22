# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server on port 8080
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch mode

# Video generation (requires RUNWAY_API_KEY)
$env:RUNWAY_API_KEY="your_key"; npm run generate:videos
$env:RUNWAY_API_KEY="your_key"; $env:FORCE="1"; npm run generate:videos  # overwrite existing
```

## Architecture

### Rendering layers (z-index)

The page is composed of fixed layers stacked behind scrollable content:

```
z-0     VideoBackground   — fixed, 6 scroll-chapter videos
z-[1]   LiquidGoldScene   — fixed Three.js WebGL canvas (hero only, fades out at scroll 22%)
z-[2]   AmbientParticles  — fixed canvas, floating gold particles
z-[9998] CustomCursor     — fixed, replaces native cursor (hidden on touch)
z-10    Page content       — relative, scrolls normally inside <SmoothScroll>
```

### Scroll system

`SmoothScroll.tsx` wraps the app in Lenis (smooth scroll). It exports two globals used throughout the codebase:

- `globalScrollProgress` — a Framer Motion `MotionValue<number>` (0–1), updated every RAF frame. Feed this to `useScrollProgress()` for mapped ranges.
- `lenisInstance` — the raw Lenis instance for imperative control (e.g. in LiquidGoldScene).

`VideoBackground.tsx` maintains its own scroll listener (not Lenis) and switches between 6 video chapters based on `window.scrollY / scrollHeight`. Videos are served from jsDelivr CDN (`cdn.jsdelivr.net/gh/mvprash4487/Carnivore-Digital@main/public/videos`). Switch the `CDN` constant to `"/videos"` for local dev after generating new videos, then revert before committing.

### Motion / animation stack

- **Framer Motion** — all component-level animation (tilt cards, split text, magnetic buttons, parallax). `SplitTextReveal`, `TiltCard3D`, `MagneticButton`, `ParallaxSection` are in `src/components/motion/` and exported via its `index.ts`.
- **Three.js / R3F** — `LiquidGoldScene.tsx` renders burgundy smoke + gold sparks over the hero. Uses its own scroll listener on top of Lenis. `frameloop` stops at scroll 22% — the wrapper div fades to `opacity: 0` via CSS transition before the loop freezes to avoid a visible flash.
- **Canvas** — `AmbientParticles.tsx` draws directly to a 2D canvas at 33ms frame lock.

### Custom hooks

| Hook | Purpose |
|------|---------|
| `useScrollProgress` | Maps `globalScrollProgress` to an output range with clamp |
| `useMouseParallax` | Returns `rotateX/Y` MotionValues from mouse position |
| `useMagneticEffect` | Returns a ref + `x/y` spring values for magnetic attraction |

### Styling

- **Fonts:** Playfair Display (`font-serif`) for all headings, Inter (`font-sans`) for body. Both set in `tailwind.config.ts`.
- **Gold accent:** `hsl(38 88% 54%)` — referenced as `text-primary`, `bg-primary`, or via `.text-gold-gradient` (gradient text utility in `index.css`).
- **Text over video:** Always add `text-shadow-hard` class. Defined in `index.css` as a multi-layer drop shadow.
- **Path alias:** `@/` maps to `src/`.

### Video generation script

`scripts/generate-videos.ts` calls the Runway Gen-4 Turbo API (`api.dev.runwayml.com`). Each chapter has a `seedImagePath` pointing to real Bangkok photos in `D:/Carnivore Digital/Website/Images/`. The script resizes seed images to 1280×720 via `ffmpeg-static`, encodes to base64, and passes them as `promptImage`. Videos download sequentially to `public/videos/`. Re-runs skip existing files unless `FORCE=1`.
