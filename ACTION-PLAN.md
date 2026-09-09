# ACTION-PLAN — CompressImg SEO Fixes

**Status update (2026-09-09):** A1, A2, A3, A4, A5 and A6 are **implemented and verified in the local build** (canonical clean, FAQPage removed, `public/_headers` + `public/llms.txt` added, sitemap lastmod present, GA snippet restored in the new layout). A7 was dropped — the built H1 markup has correct spacing; the audit's "fragmented H1" was a parser artifact. A8–A9 remain open. **Deploy to production, then re-run the audit.**

Ordered by impact × effort. Each item maps to a finding in `FULL-AUDIT-REPORT.md`.

## 1. Immediate blockers (do first)

### A1 · Kill the double-slash URLs — Quick win · [F1]
**File:** `src/layouts/Layout.astro` (frontmatter)
```astro
const siteUrl = Astro.site || '';
const fullCanonical = new URL(canonical, siteUrl).href;   // was `${siteUrl}${canonical}`
const fullOgImage = new URL(ogImage, siteUrl).href;
```
Fixes canonical, og:url, twitter:url, og:image, and the schema `url` in one change. Then verify in the built HTML: `grep -o 'pages\.dev//' dist/index.html` should return nothing.

### A2 · Remove restricted FAQPage schema — Quick win · [F2]
**File:** `src/layouts/Layout.astro` — delete the `if (faqItems.length > 0) { schemaNodes.push({ '@type': 'FAQPage' ... }) }` block.
Keep the visible FAQ content on pages; only the JSON-LD node goes. FAQPage rich results are restricted to government/health authority sites (Aug 2023) — a commercial tool risks a spammy-structured-markup flag.

## 2. Quick wins (this week)

### A3 · Add security headers via `public/_headers` · [F3]
```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://imgcompressortool-proxy.paswanrounak55.workers.dev https://region1.google-analytics.com https://www.google-analytics.com; frame-ancestors 'self'
```
(Adjust GA endpoints if analytics config differs. Cloudflare Pages serves this file automatically on deploy.)

### A4 · Extend money-page meta descriptions to 150–160 chars · [F5]
Pattern for each of the 5 `compress-image-to-*kb` pages — lead with keyword, end with a benefit:
> "Compress JPG, PNG and WebP images to 100KB or less in seconds. Free, no signup — meet form, email and upload size limits while keeping the best possible quality."

### A5 · Publish `public/llms.txt` · [F4]
```
# CompressImg
> Free online tool that compresses JPG, PNG and WebP images to an exact target file size (20KB–200KB or custom).

Main tool: https://imgcompressortool.pages.dev/
Compress to 20KB: https://imgcompressortool.pages.dev/compress-image-to-20kb
Compress to 50KB: https://imgcompressortool.pages.dev/compress-image-to-50kb
Compress to 100KB: https://imgcompressortool.pages.dev/compress-image-to-100kb
Compress to 200KB: https://imgcompressortool.pages.dev/compress-image-to-200kb
About: https://imgcompressortool.pages.dev/about
```

## 3. Strategic / maintenance

### A6 · Sitemap `lastmod` · [F6]
Astro's sitemap integration supports `serialize(item)` — emit `lastmod: new Date().toISOString()` per entry in `astro.config.mjs`.

### A7 · Fix H1 span fragmentation · [F8]
In the 5 landing-page heroes, keep whole words inside the accent `<span>` (e.g. `Compress image to <span>100KB</span> online — free` already reads fine visually; add real spaces so extracted text isn't "to100KBonline").

### A8 · Simplify how-it-works copy · [F7]
Homepage Flesch 49.2 → target 55+. Shorten sentences over ~20 words in the FAQ and process sections.

### A9 · Measure CWV after re-deploy · [F9]
`python ~/.agents/skills/seo/scripts/pagespeed.py https://imgcompressortool.pages.dev --strategy mobile` (add `PAGESPEED_API_KEY` to `~/.agentic-seo/.env` to avoid rate limits). Re-run the full audit after deploying the redesign so on-page checks match production.

## Verified pass items (no action)

robots.txt + sitemap declaration, internal linking (10/10 pages, no orphans), 0 broken links, HTTPS redirect chain, OG/Twitter completeness, unique titles/H1s.
