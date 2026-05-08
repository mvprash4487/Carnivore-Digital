# Replace Media + Apple-Style 3D Scroll Experience

## Part 1 — Replace All Media with Uploaded Assets

Copy the 9 uploaded images into `src/assets/` and wire them into the site. Map:

| Asset | Used For |
|---|---|
| `CANO1025.jpg` (flame steak) | New hero background — cinematic, on-brand |
| `0a9811e7...JPG` (lobster + salt) | Portfolio: Burger & Lobster |
| `96615056...JPG` (chef burger) | Portfolio: Canolini *(or Artisan Burgers)* |
| `80-CANO9271.jpg` (truffle dish) | Portfolio: Thara Thong / fine dining |
| `ASTL9983-1.jpg` (chef plating) | Portfolio: ROSH / kitchen craft |
| `MG_3425_copy2.jpg` (wine glasses) | Portfolio: Ocean Marina / hospitality |
| `Burger_Lobster.jpg` | Portfolio: Aspira *(or secondary card)* |
| `83194242...jpg` (neon tuktuk) | About / Bangkok culture accent |
| `Black_Backround.jpg` | Section dividers / texture overlays |

Delete the 7 old AI-generated images in `public/images/`. Switch components to ES6 imports from `src/assets/` for proper bundling.

## Part 2 — Apple-Style 3D Scroll Motion

Goal: a cinematic, scroll-driven background where 3D elements respond to scroll position — pinned hero, depth parallax, floating geometry, smooth camera moves between sections.

### Tech
- **`@react-three/fiber@^8.18`** + **`@react-three/drei@^9.122`** + **`three@^0.160`** for 3D
- **`framer-motion`** (already installed) `useScroll` / `useTransform` for scroll progress
- **`lenis`** for buttery smooth scroll (industry standard for Apple-clone sites)

### Architecture
```
<SmoothScrollProvider> (Lenis)
  <ScrollScene>            ← fixed full-viewport <Canvas>
    <Camera>               animated via scroll progress
    <FloatingMeditations>  geometry + image planes
    <PostFX>               bloom, vignette, chromatic aberration
  </ScrollScene>
  <Content>                normal sections scroll over the canvas
</SmoothScrollProvider>
```

### Scroll-Driven Moments
1. **Hero (0–15%)** — flame/steak image plane front-and-center, embers rising, slow zoom-in. Headline fades up.
2. **About (15–35%)** — camera dollies back, gold ring forms, tuktuk neon plane drifts past in background.
3. **Services (35–55%)** — 4 floating glass cards orbit the camera; each rotates into focus as you scroll.
4. **Portfolio (55–80%)** — image planes (the food photos) arranged on a 3D track; camera flies through them like an Apple product reveal. Each photo scales + tilts on its turn.
5. **Clients (80–92%)** — particles/dust converge into a gold spiral.
6. **Contact (92–100%)** — camera pulls into deep black, embers settle, CTA glows in.

### Polish
- Scroll-locked typography (text scales/blurs based on progress)
- Section pinning via Framer's `useScroll({ offset })`
- `@react-three/drei` `<Float>`, `<Environment>`, `<MeshTransmissionMaterial>` for luxury glass
- Subtle film grain + vignette overlay
- Mobile fallback: detect coarse pointer or low DPR → render static images instead of full Canvas
- Reduce motion: respect `prefers-reduced-motion`

### File Plan
- `src/components/three/ScrollScene.tsx` — root Canvas + scroll hook
- `src/components/three/HeroFlame.tsx`, `PortfolioTrack.tsx`, `ServicesOrbit.tsx`
- `src/components/SmoothScroll.tsx` — Lenis wrapper
- `src/hooks/useScrollProgress.ts`
- Update each section to be transparent over the fixed canvas

### Performance
- DPR clamped to `[1, 1.5]`
- Lazy-load Canvas (`React.lazy`)
- Texture compression (KTX2 not needed; just sized JPGs)
- `frameloop="demand"` when off-screen

## Out of Scope
- Backend / CMS
- Real video — using your stills only
