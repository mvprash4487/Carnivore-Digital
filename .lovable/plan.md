The newly uploaded Open Graph image already lives at:
`https://storage.googleapis.com/gpt-engineer-file-uploads/446EYhlKMxb85lRLQUHyQ6jVbOn2/social-images/social-1779513837820-social-preview.webp`

Right now `index.html` is inconsistent: `og:image` and `twitter:image` point to that uploaded URL, but `og:image:secure_url` still points to the old `og-preview.webp?v=4`. Scrapers that read `secure_url` will fetch the wrong asset, which is likely why the preview still looks off.

Plan:
1. In `index.html`, set `og:image`, `og:image:secure_url`, and `twitter:image` all to the uploaded storage.googleapis.com URL.
2. Keep `og:image:type=image/webp`, `og:image:width=1200`, `og:image:height=630`, and the alt text.
3. Leave canonical and `og:url` on `https://carnivoredigital.com/`.
4. After Publish → Update, re-scrape `https://carnivoredigital.com/` in the Facebook and LinkedIn debuggers to clear their caches.

That's the only code change needed to push the freshly uploaded image as the Open Graph image.