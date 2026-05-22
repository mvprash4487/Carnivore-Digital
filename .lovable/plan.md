**Goal:** Get social platforms to pick up the new compressed `social-preview.png` instead of the cached favicon fallback.

**Status:** Image is now 917 KB (well under the 5 MB limit). Meta tags already point to `https://www.carnivoredigital.com/social-preview.png`. The remaining problem is **crawler cache** — Facebook/LinkedIn/X cached the earlier failed fetch and will keep serving the favicon until busted.

**Fix (one small code change):**
1. In `index.html`, append a version query string to the image URL in both tags:
   - `og:image` → `https://www.carnivoredigital.com/social-preview.png?v=2`
   - `twitter:image` → same

   The `?v=2` forces crawlers to treat it as a new asset. No file rename needed.

**File changed:** `index.html` — 2 lines.

**After implementing, you must do these manually (I can't do them for you):**
1. **Click Publish → Update** in Lovable. The `index.html` change only goes live at carnivoredigital.com after publishing.
2. **Re-scrape each platform** so they refetch:
   - Facebook / Instagram: https://developers.facebook.com/tools/debug/ → paste your URL → **Scrape Again**
   - LinkedIn: https://www.linkedin.com/post-inspector/ → paste URL → **Inspect**
   - X / Twitter: post a test tweet with the URL (X has no manual debugger anymore)
3. Verify the new image appears in the preview on each platform.

If after re-scraping you still see the favicon, the most likely cause is the publish step was skipped — check that `view-source:https://www.carnivoredigital.com/` shows the `?v=2` URL.