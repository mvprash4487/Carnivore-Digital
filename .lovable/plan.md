## Direction — "Liquid Gold"

Scrap every photo plane (flame, tuktuk, lobster, portfolio fly-through). Replace the entire background with a single, continuous abstract scene that scrolls like one long camera move through molten material. No photographs. No collage. Pure motion design driven by the gold/charcoal brand palette.

The feeling: a dark gallery where a sculpture of light slowly turns. Apple-product-page restraint, not a showreel.

## The new scene — five chapters in one camera move

```text
  scroll 0 ─────────── 1
  ┌──────┬──────┬──────┬──────┬──────┐
  │ I    │ II   │ III  │ IV   │ V    │
  │ Ember│ Drift│ Forge│ Lattice│ Dawn│
  └──────┴──────┴──────┴──────┴──────┘
   Hero   About  Servic Portfo Contact
```

**I. Ember (0–0.18) — Hero**
A single point of warm gold light at the center, breathing. Behind it: a slow-rotating volumetric noise field (raymarched in a fragment shader), reading like dark smoke catching firelight. No objects, just atmosphere. Camera completely still. This is the calm.

**II. Drift (0.18–0.40) — About**
Camera dollies forward into the smoke. Hundreds of GPU-instanced gold particles begin streaming past on curl-noise paths, like sparks caught in a draft. Density rises with scroll. Color stays in the `#0A0A0A → #C9A84C` band only.

**III. Forge (0.40–0.62) — Services**
The particles converge into a slowly turning torus knot rendered as a chrome-gold MeshPhysicalMaterial with anisotropy. Behind it, a soft bloom and a single rim light. The knot rotates one revolution across this chapter — the centerpiece.

**IV. Lattice (0.62–0.85) — Portfolio**
The knot dissolves outward into a 3D grid of thin gold wireframe cells (instanced lines). The grid expands past the camera, giving the parallax illusion of flying through architecture. Subtle chromatic aberration on the post pass.

**V. Dawn (0.85–1) — Contact**
Everything settles. The lattice fades, the smoke clears, a single horizon line of warm gold light glows at the bottom of the canvas like sunrise. Camera comes to rest.

Transitions between chapters are crossfades on the scroll progress curve — no hard cuts. The camera path is one continuous spline; chapters are just points along it.

## Why this 100x's it

- **One coherent world** instead of disconnected photo planes flying in. Apple/Stripe/Linear all do this — a single scene that *responds* to scroll.
- **Brand-pure palette.** Removing photography removes color noise. Gold reads as gold.
- **Procedural, not asset-based.** Shaders + instanced geometry → tiny payload, sharp at any DPR, no jpegs to load.
- **Motion is the content.** Particles, rotation, parallax — the eye always has something moving slowly somewhere. Never busy.
- **Legibility built in.** The scene is dark and low-contrast by design, so foreground type sits on it without overlays or vignettes.

## Technical plan

New file: `src/components/three/LiquidGoldScene.tsx`. Delete the photo-plane scene entirely.

- **Smoke field (I & II):** ShaderMaterial on a fullscreen plane behind everything. 3D simplex noise sampled at `(uv, time, scroll)`, output a radial gradient masked by noise, gold tint. ~30 lines of GLSL.
- **Particles (II–III):** `THREE.Points` with 800 instances on desktop / 200 on mobile. Velocity from curl noise computed in vertex shader (no CPU loop). Additive blending, depth-write off.
- **Torus knot (III):** `MeshPhysicalMaterial` with `roughness: 0.15`, `metalness: 1`, `clearcoat: 1`, `iridescence: 0.3`. One directional light + one rim light. Scale eased in/out via scroll range.
- **Lattice (IV):** `InstancedMesh` of `EdgesGeometry(BoxGeometry)` — ~400 cells in a 3D grid, each cell scaled tiny but stroke-only. Camera flies through Z.
- **Horizon (V):** A wide thin emissive plane at the bottom with a soft falloff shader.
- **Post:** `@react-three/postprocessing` — Bloom (intensity 0.6, threshold 0.85) + faint ChromaticAberration (0.0008) + Vignette OFF.
- **Camera spline:** A single `CatmullRomCurve3` with 5 control points; `camera.position = curve.getPoint(scrollProgress)`, `camera.lookAt(curve.getPoint(scrollProgress + 0.02))`. Smooth, no jumps.
- **Scroll → time:** keep the existing ref-based `scrollProgressRef`. `useFrame` reads it and drives every uniform / position via eased ranges.
- **Mobile lite:** disable post-processing, drop particle count to 200, swap MeshPhysicalMaterial → MeshStandardMaterial, lattice cells 120.
- **Performance budget:** target 60 fps desktop / 45 fps mobile. DPR clamp `[1, 1.5]` desktop, `[1, 1]` mobile. Single `frameloop="always"` while tab visible.

## What gets removed

- All photo imports in `ScrollScene.tsx` (`heroFlame`, `tuktuk`, `lobster`, `burgerChef`, `truffle`, `chefPlating`, `wineGlasses`, `burgerLobster`).
- The Embers points class, the orbit cards group, the gold torus, the portfolio fly-through track, the hero flame plane.
- The photo asset files themselves — leave on disk for now in case you want them in PortfolioSection later, but unimport from the 3D scene.
- The `<Environment preset="night" />` HDRI — replaced by explicit lights.

## Section layer cleanup

With a coherent dark scene, the section translucency tweaks from before are no longer needed:

- `ServicesSection` and `ClientsSection`: remove `bg-charcoal/15`, go fully transparent.
- `Footer`: keep `bg-charcoal/50` (it's a deliberate rest zone).
- `HeroSection`: already overlay-free, leave it.

## Files touched

- `src/components/three/LiquidGoldScene.tsx` *(new)*
- `src/components/three/ScrollScene.tsx` *(deleted)*
- `src/pages/Index.tsx` *(import swap)*
- `src/components/ServicesSection.tsx`
- `src/components/ClientsSection.tsx`
- `package.json` *(add `@react-three/postprocessing@^2.16` — compatible with R3F 8)*

No new design assets, no image generation, no copy changes.