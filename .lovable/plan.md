# Fix: 3D Background Invisible + Choppy Scroll

Two real bugs are causing both symptoms.

## Bug 1 — Background is invisible

The canvas is mounted at `fixed inset-0 -z-10`, but:

- `<body>` has `bg-background` (near-black) painting *over* it
- `Index.tsx`'s root wrapper has `bg-background` painting over it again
- Sections (`ServicesSection`, `ClientsSection`, `Footer`, hero gradient) all have opaque `bg-charcoal` / `bg-background` fills

So the 3D scene is rendering correctly — it's just hidden behind layers of black.

### Fix
- Move the canvas to `fixed inset-0 z-0` (not negative)
- Remove `bg-background` from `Index.tsx`'s wrapper; make body transparent (keep `--background` as a fallback `<html>` color so there's no flash)
- Wrap page content in `relative z-10` so it sits above the canvas
- Replace opaque section fills (`bg-charcoal`, full-width hero gradient) with subtle dark gradient overlays (`from-background/80 to-background/40`) so the 3D scene shows through but text stays legible
- Footer + Clients can keep a near-opaque dark layer for contrast — that's intentional dark "rest" zones between 3D moments

## Bug 2 — Choppy scrolling

Three compounding causes:

1. **`useScrollProgress` calls `setState` on every scroll tick**, re-rendering the entire `<Scene>` tree (and re-running every `useMemo`/`useTexture` lookup) 60+ times a second. This is the main cause of jank.
2. **`html { scroll-behavior: smooth }` in `index.css`** fights with Lenis — both try to interpolate scroll, causing stutter.
3. Lenis duration is set to 1.4s with a stiff easing — too long, feels rubbery on fast wheels.

### Fix
- Replace the `useState`-based scroll hook with a **ref-based** one: a single `window` scroll listener writes to `scrollProgressRef.current`, and `useFrame` reads it. Zero React re-renders during scroll.
- Remove `scroll-behavior: smooth` from `index.css`.
- Tune Lenis: `duration: 1.1`, simpler easing, `wheelMultiplier: 1`.

## Files to change

- `src/components/three/ScrollScene.tsx` — ref-based scroll, canvas at `z-0`
- `src/pages/Index.tsx` — wrapper transparent, content at `z-10`
- `src/index.css` — remove smooth scroll, add `html { background: hsl(var(--background)) }`
- `src/components/SmoothScroll.tsx` — Lenis tuning
- `src/components/HeroSection.tsx`, `ServicesSection.tsx`, `ClientsSection.tsx`, `Footer.tsx` — swap opaque fills for translucent overlays so the 3D scene reads through

## Out of scope

- No new 3D content — purely fixing what's already there
- No dependency changes
