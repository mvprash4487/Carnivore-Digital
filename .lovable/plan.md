I found the likely missing piece: the current `og:image` points at `https://www.carnivoredigital.com/...`, but that URL 302 redirects to the primary non-www domain. Some social scrapers are picky and may reject redirected Open Graph images, then fall back to the favicon.

Plan:
1. Update `index.html` to use the primary domain directly for scraper metadata:
   - `og:url` → `https://carnivoredigital.com/`
   - canonical → `https://carnivoredigital.com/`
   - `og:image`, `og:image:secure_url`, `twitter:image` → `https://carnivoredigital.com/social-preview.png?v=3`
2. Keep the validated image dimensions/type:
   - width `1200`
   - height `598`
   - type `image/png`
3. Bump cache busting from `?v=2` to `?v=3` so LinkedIn/Facebook/X fetch a fresh image URL after publishing.

After this, publish the update and re-scrape the exact URL `https://carnivoredigital.com/`, not the `www` version.