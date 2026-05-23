I checked both the project code and the live site. The OG image URL is being published correctly and the asset is reachable, but the code has one likely metadata problem:

- `public/social-preview.png` is **1200×598**
- `index.html` declares it as **1200×630** via `og:image:height`

Some social scrapers are strict about image dimensions and can reject the image when the declared size does not match the actual file, falling back to the favicon.

Plan:
1. Update `index.html` so the metadata matches the real image:
   - `og:image:height` from `630` to `598`
   - add `og:image:secure_url` pointing to the same HTTPS image URL
   - add `og:image:type` as `image/png`
2. Keep the existing cache-busting `?v=2` URL unless you want me to bump it to `?v=3` for another forced re-scrape.
3. After implementation, publish the site and re-scrape Facebook/LinkedIn so they fetch the corrected metadata.