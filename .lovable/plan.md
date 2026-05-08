## Plan

### 1. Tuk-tuk full screen
In `src/components/three/ScrollScene.tsx`:
- Increase the tuktuk plane scale from `[3.2, 3.2]` to about `[14, 9]` so it covers the full viewport at the camera's near distance.
- Move it closer to camera (`position z` ~ `0` instead of `-3`) and travel from `x: -20 → 20` so it sweeps fully across.
- Boost peak opacity from `0.5` to `0.9` so it reads as a hero moment, not a faint cameo.

### 2. Remove the vignette
- Delete the `radial-gradient` overlay div in `ScrollScene.tsx`. Nothing replaces it.

### 3. Add the logo image
- Copy `user-uploads://Logo_-_Carnivore_Digital.png` to `src/assets/logo-carnivore.png`.
- In `src/components/Navigation.tsx`, replace the text wordmark with `<img src={logo} alt="Carnivore Digital" />`, sized roughly `h-8 md:h-10 w-auto`.
- In `src/components/Footer.tsx`, replace the text wordmark with the same image at `h-8 w-auto`.

### 4. Update phone number
- In `src/components/ContactSection.tsx`, change `+66 2 XXX XXXX` → `+66 84 221 7954` and wrap it in a `tel:` link.

### 5. Social links — LinkedIn only
- In `src/components/Footer.tsx`, replace the `["Facebook", "Instagram", "LinkedIn"]` array with a single LinkedIn link to `https://www.linkedin.com/company/72004968/` opening in a new tab with `rel="noopener noreferrer"`.

### Files touched
- `src/components/three/ScrollScene.tsx`
- `src/components/Navigation.tsx`
- `src/components/Footer.tsx`
- `src/components/ContactSection.tsx`
- `src/assets/logo-carnivore.png` (new)

No new dependencies.