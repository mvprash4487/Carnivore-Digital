Fix the Open Graph image reference in index.html so social media platforms display the correct preview image instead of the favicon.

**Problem:** The `og:image` and `twitter:image` meta tags currently point to a GitHub raw content URL (`https://raw.githubusercontent.com/mvprash4487/Carnivore-Digital/main/public/social-preview.png`). Social media crawlers frequently fail to fetch images from GitHub raw URLs due to caching, content-type handling, or rate limiting, causing them to fall back to the favicon.

**Fix:**
1. In `index.html`, replace the GitHub raw URL in `og:image` and `twitter:image` with the project's custom domain: `https://www.carnivoredigital.com/social-preview.png`.
2. Add `og:url` and `<link rel="canonical">` pointing to `https://www.carnivoredigital.com/` to help crawlers resolve the page correctly.

**File changed:** `index.html` — 2 meta tag updates + 2 additions.

**Verify:** Check the `<head>` in the preview to confirm the four tags reference the custom domain.