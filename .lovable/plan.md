## Plan

Shift the Forge knot's lifecycle earlier so it appears just after the hero settles.

In `src/components/three/LiquidGoldScene.tsx`, `Knot` component:

- `inT` range `0.30 → 0.50`  →  `0.10 → 0.30` (starts as About fades in, full-size by Services)
- `outT` range `0.66 → 0.85` →  `0.62 → 0.82` (slightly earlier exit so it doesn't overlap the lattice)

Single file, two-line change. Nothing else moves — sparks, lattice, camera spline stay as-is.