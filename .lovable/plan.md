## Why the 3D scene isn't visible

Two things combine to hide it:

1. **Mobile cutoff.** `ScrollScene.tsx` does `if (window.innerWidth < 640) setEnabled(false)` and returns `null`. On a 390 px preview the canvas is never mounted at all.
2. **Heavy CSS vignette.** Even when mounted, an absolutely positioned div sits over the canvas with `radial-gradient(... transparent 35%, rgba(0,0,0,0.85) 100%)`. Combined with the per-section `bg-charcoal/40 backdrop-blur-sm` and the hero gradient, the visible area of the 3D scene shrinks to a tiny window in the center.

## Plan

### 1. Always mount the canvas — add a "lite" mobile mode
In `src/components/three/ScrollScene.tsx`:
- Remove the `small = innerWidth < 640` early-return. Mobile users should still see the scene.
- Track an `isMobile` flag (with a resize listener) and pass it into `<Scene isMobile />`.
- In lite mode:
  - Lower DPR to `[1, 1]`, FOV slightly wider.
  - Skip `<Environment preset="night" />` (expensive HDRI) — replace with a second cheap `pointLight`.
  - Drop the `Embers` particle count from 80 → 25 and disable on `prefers-reduced-motion`.
  - Skip the orbit cards group and the gold torus (decorative only).
  - Keep: hero flame plane, tuktuk drift plane, portfolio fly-through track. These are the storytelling beats.
- Keep `prefers-reduced-motion` as the only reason to fully disable.

### 2. Make the scene actually visible
Still in `ScrollScene.tsx` and section files:
- Soften the CSS vignette from `transparent 35% → rgba(0,0,0,0.85) 100%` to `transparent 55% → rgba(0,0,0,0.55) 100%` so the bright center is much larger and edges aren't crushed to black.
- Replace `bg-charcoal/40 backdrop-blur-sm` on `ServicesSection` and `ClientsSection` with `bg-charcoal/15` (no blur). Backdrop-blur on a fixed canvas is what's flattening the 3D background into a smear.
- Footer keeps its darker treatment but drop to `bg-charcoal/50` without blur.
- HeroSection gradient: keep, it's already light.
- AboutSection and PortfolioSection: leave fully transparent (already are).

### 3. Smooth the scroll a touch
- In `SmoothScroll.tsx`, set `lerp: 0.1` (let Lenis interpolate) and remove `duration` so wheel/touch feels native instead of "easing into a target". Keep `wheelMultiplier: 1`, `touchMultiplier: 1.4`.

### 4. Verify
- Switch preview to mobile and desktop, confirm hero flame visible behind the headline, tuktuk drifts in About, portfolio planes glide through Portfolio.
- Check console for three.js warnings; check FPS doesn't tank on mobile lite (target 45–60).

### Files touched
- `src/components/three/ScrollScene.tsx`
- `src/components/SmoothScroll.tsx`
- `src/components/ServicesSection.tsx`
- `src/components/ClientsSection.tsx`
- `src/components/Footer.tsx`

No new dependencies, no asset changes, no business-logic changes.