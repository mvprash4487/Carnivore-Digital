I checked both the code and the live site. The tags are present and the image URL returns 200, so the issue is not a missing tag. The remaining likely problem is image compatibility: the current `social-preview.png` is 1200×598 with an alpha channel, while there is already a cleaner `og-preview.webp` asset at the standard 1200×630 size.

Plan:
1. Update `index.html` so all social preview tags use `https://carnivoredigital.com/og-preview.webp?v=4` instead of `social-preview.png?v=3`.
2. Set `og:image:type` to `image/webp`.
3. Set `og:image:height` to `630` and keep width `1200`.
4. Keep canonical and `og:url` on `https://carnivoredigital.com/`.
5. After publishing, re-scrape `https://carnivoredigital.com/` so Facebook/LinkedIn/X discard the cached favicon preview.

This is the most direct one-shot code fix because it removes the nonstandard PNG dimensions/alpha issue and gives scrapers a fresh image URL.