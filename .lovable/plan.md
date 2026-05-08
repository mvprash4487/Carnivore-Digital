## Plan

1. Copy `user-uploads://Site_Icon.png` to `/tmp/site_icon.png`.
2. Use ImageMagick to auto-trim white/transparent space and produce a square, transparent-background PNG: `public/favicon.png` (e.g. trim + pad to square, output ~512×512).
3. Keep `index.html` favicon link as `/favicon.png` (already in place from prior change).
4. Verify by viewing the resulting `public/favicon.png`.

No other files change.