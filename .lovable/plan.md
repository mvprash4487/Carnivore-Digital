## Plan: Regenerate with straight-up 90° pan + 360 frames

### 1. Regenerate the video
- Call `videogen--generate_video` with a tighter prompt: modern 5-star hotel facade, **locked vertical tilt-up only, 90° straight upward camera move, no horizontal drift, no zoom, no roll**, starting at the ground-floor entrance and ending framed on the 11th-floor crown. Modern (not ornate) architecture — clean stone + floor-to-ceiling glass, brushed bronze fins, soft warm interior glow, dusk sky.
- Settings: 1080p, 9:16, 10s, `camera_fixed: false` (camera must move up).
- Save to `/tmp/hotel_facade_v2.mp4`. Spot-check first/middle/last frame to confirm it's a pure vertical pan before committing.
- If the model adds horizontal drift, retry with even stricter wording ("locked tripod tilt, axis purely vertical").

### 2. Re-extract to ~360 frames
- Delete `public/facade/*.jpg`.
- Use ffmpeg: `fps=36, scale=480:-2` → ~360 WebP frames (better compression than JPEG, ~50–60% smaller at same quality).
  `ffmpeg -i ... -vf "fps=36,scale=480:-2" -q:v 70 public/facade/frame_%04d.webp`
- Target total payload ≤ 12 MB. If still heavy, drop to 320 frames @ 440px.

### 3. Update the bg component
- Change `FRAME_COUNT` to actual count and `framePath` to `.webp`.
- Bump RAF lerp factor from `0.12` → `~0.18` so a much denser frame array catches up faster (otherwise chunked moves feel laggy with 3.6× more frames).
- Slightly reduce `HOLD` from `0.12` → `0.06` so most of each section is spent moving (since each section now gets ~51 frames, there's room to actually pan instead of holding).

### 4. Verify
- Page should: each section panning ~5 floors of facade with no lateral drift; transitions between sections smooth; no visible frame popping on mobile (390px) or desktop.

### Notes
- WebP is supported by all modern browsers Lovable previews target.
- If video gen still produces a slow/short pan that doesn't reach the 11th floor, we'll re-run once more rather than fake it with frame remapping.
