## Plan: Fix hero, trim tail, switch to transition-only scrubbing

### 1. Fix stale hero (old facade visible)
- Cause: we overwrote `frame_0001.jpg` etc. with the same names, so the browser is serving cached frames from the previous video.
- Fix: append a cache-busting query string to `framePath`, e.g. `?v=3`. Bump the version every time we regenerate frames.

### 2. Tighten the tail
- The v3 video starts tight on the entrance (good) but the final ~1 second pulls back to show the whole building. Cap the usable frame range so the pan ends on a clean upper-facade frame.
- Implementation: introduce `FRAME_END = 320` (out of 362) and use that as the upper bound when computing slice ranges. We keep all 362 files on disk in case we want to adjust, but only frames 1–320 are used.

### 3. New scroll model: hold during section, scrub between sections
Replace the current "progress within a section drives the frame" with:
- **Per-section anchor frames.** Each of the N sections has a fixed target frame:
  `anchor[i] = lerp(FRAME_START, FRAME_END, i / (N - 1))`.
  When section i is the "active" section (its midpoint nearest viewport center), the bg sits at `anchor[i]` — completely still.
- **Inter-section transition zone.** Define a transition window equal to the last ~25% of one section and the first ~25% of the next. Inside that window, scrub from `anchor[i]` to `anchor[i+1]` using an eased local progress. Outside the window, hold.
- Mechanically:
  - For each frame, find the two nearest section midpoints (`mPrev`, `mNext`) around viewport center.
  - `t = (centerY - mPrev) / (mNext - mPrev)` clamped to [0, 1].
  - Define a transition band, e.g. start scrub when `t > 0.4`, finish when `t > 0.6`. Remap `t` into [0,1] only inside that band; outside, snap to 0 or 1.
  - Apply `smoothstep`, then `frame = lerp(anchor[prevIdx], anchor[nextIdx], eased)`.
- Keep the RAF lerp (0.18) so the snap from "holding" into "scrubbing" still feels smooth, not a hard step.

### 4. Verify
- Hero shows the new entrance frame on load (no cached old facade).
- Scrolling through About / Services / etc.: background freezes during the body of each section, then visibly pans up only as you cross into the next.
- Final section ends on a clean upper-floor frame, not a pulled-back wide.

### Out of scope
- Re-generating the video again. We'll see if cropping the frame range + the new hold/scrub model gets it where you want it. If the still-visible pull-back at frame ~340 bothers you after this, we can re-gen.
