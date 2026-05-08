## Direction — "Burgundy + Bone"

Trade gold-on-black for **oxblood + bone**. The 3D scene shifts to deep wine reds and matte black; UI text becomes a warm bone (`#F2EAD8`); a single brass accent replaces gold for buttons, dividers, and small marks. Far better contrast (bone on burgundy is ~10:1) and stays on-brand for "Carnivore."

## 1. Palette — token swap in `index.css` + `tailwind.config.ts`

Replace the existing HSL tokens. Light mode is unchanged (the site is dark-only).

```text
--background       0 0% 4%        # obsidian (unchanged)
--foreground       36 38% 90%     # bone   #F2EAD8
--muted-foreground 36 18% 70%     # warm gray-bone
--card             0 30% 10%      # deep wine card
--border           0 25% 18%      # wine border
--primary          16 70% 48%     # brass-copper accent #CC5A2E ← replaces gold
--accent           16 70% 48%     # same
--ring             16 70% 48%
--charcoal         0 30% 8%       # wine-black section bg
--gold             16 70% 48%     # alias kept; renders brass now
--gold-light       22 75% 60%
--gold-dark        12 55% 32%
```

`text-gold-gradient` keeps its name but the linear-gradient stops shift to brass tones. `selection` becomes brass at 30% on bone. No component changes needed for the rename.

## 2. Scene recolor — `LiquidGoldScene.tsx`

Just three constants change. Geometry, motion, structure all stay.

- Smoke shader `uGold` → `uTone = #6B1220` (oxblood). Add a second tint `uHi = #C2532F` for highlights so the scene reads burgundy in shadow / brass in light.
- Sparks color `#E0B85C` → `#E08A52` (warm brass).
- Knot material: keep metalness 1, change `color #C9A84C` → `#8A1F2E` (oxblood) with `emissive #2A0509`. Reads as polished wine-lacquer chrome under brass rim light.
- Lattice line color → `#A23A2C` (rust-brass). Lower opacity peak from 0.55 → 0.4.
- Lights: directional `#E08A52`, point `#8A1F2E`. Ambient drops to 0.10 so blacks stay deep.
- Bloom threshold 0.6 → 0.75 (less halo on bright UI text).
- Background clear color `#070707` → `#0A0506` (the slightest red shift; helps blend).

## 3. Choppiness fixes — same file

The current jumps come from three places.

- **Particle teleport.** `p.y = mod(p.y + 6.0, 12.0) - 6.0` snaps when a spark wraps. Replace with **alpha-fade-on-edges**: keep `p` unbounded but fade `vAlpha *= smoothstep(edge, 0., distFromCenter)` so sparks are invisible before they wrap. No more pops.
- **Knot opacity flicker.** Transparent + animated `opacity` causes draw-order pops at chapter boundaries. Switch to **scale-in / scale-out** as the visibility driver (scale → 0 = effectively gone) and keep the material **opaque**. Removes the alpha sort glitch.
- **Lattice respawn snap.** Same fix as sparks — fade-out the last 10% of cell life with `smoothstep` on `abs(z)` instead of a hard `mod` reset.
- **Camera lerp.** `lerp(pos, 0.12)` is too aggressive at high scroll velocity → step jitter. Drop to `0.08` and additionally smooth the scroll progress itself with a one-pole filter (`sp += (target - sp) * 0.15` per frame). This is the single biggest perceived smoothness gain.
- **`useScrollProgressRef`** currently writes the raw `scrollY/h` ratio. Add a separate `smoothScrollRef` updated in `useFrame` from the raw ref via the one-pole filter; every consumer (camera, shader uniforms, knot, lattice) reads the smoothed value. One source of truth → no chapters drift apart.

## 4. Section legibility cleanup

- `Footer` keeps its dark wine rest zone — change `bg-charcoal/50` to `bg-[hsl(var(--charcoal))]/60` (now wine-black).
- `Services`/`Clients` stay fully transparent — bone-on-scene contrast is now strong enough.
- Hero already overlay-free, no change.

## Files touched

- `src/index.css` — palette tokens
- `tailwind.config.ts` — gold/charcoal helpers if referenced
- `src/components/three/LiquidGoldScene.tsx` — colors + smoothing fixes
- `src/components/Footer.tsx` — token swap

No structural changes, no new dependencies, no asset changes.