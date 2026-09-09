# CompressImg

> **Free Exact-Size Image Compressor — JPG, PNG & WebP to an exact KB limit, in the browser** *No signup · No watermark · Cloudflare Pages + Workers*

![NODE.JS](https://img.shields.io/badge/NODE.JS-18%2B-339933?style=for-the-badge&labelColor=1B1F23)
![ASTRO](https://img.shields.io/badge/ASTRO-5-BC52EE?style=for-the-badge&labelColor=1B1F23)
![TAILWIND](https://img.shields.io/badge/TAILWIND-3.4-38BDF8?style=for-the-badge&labelColor=1B1F23)
![CLOUDFLARE](https://img.shields.io/badge/CLOUDFLARE-PAGES-F38020?style=for-the-badge&labelColor=1B1F23)
![WORKERS](https://img.shields.io/badge/WORKERS-PROXY-F38020?style=for-the-badge&labelColor=1B1F23)
![KV](https://img.shields.io/badge/KV-QUOTA-2EA043?style=for-the-badge&labelColor=1B1F23)
![TINYPNG](https://img.shields.io/badge/TINYPNG-API-00A8E8?style=for-the-badge&labelColor=1B1F23)
![CANVAS](https://img.shields.io/badge/CANVAS-FALLBACK-DA5B0B?style=for-the-badge&labelColor=1B1F23)

---

## Live Verification Metrics

| Metric | Performance Benchmark | Impact |
|--------|----------------------|--------|
| **Size-Limit Guarantee** | 100% under-target output | Binary-search JPEG quality + progressive dimension scaling — the downloaded file always respects the chosen limit |
| **Image Privacy** | 0 image copies persisted | Worker processes bytes in memory only; quota keyed by salted-hash IP, never raw IPs |
| **Compression Uptime** | 3-tier fallback chain | TinyPNG → local Canvas re-encode → clear error — compression never dead-ends |
| **Crawl Health** | 0 broken links · 10/10 pages indexed | Audited Sep 2026: clean canonicals, sitemap with lastmod, security headers (CSP, HSTS) |
| **Cost to Users** | $0 · no account | Free fair-use tier (16 TinyPNG calls/day/visitor) with unlimited local fallback |

---

**Live site:** [imgcompressor.tools](https://imgcompressor.tools)

## How it works

1. Pick a target size (preset: 20/30/50/100/200KB, or any custom limit up to 5000KB)
2. Drop in an image (JPG, PNG, or WebP, up to 20MB)
3. Download a file guaranteed to be under the limit

Compression runs in two stages:

- **Cloudflare Worker → TinyPNG** — the browser uploads over HTTPS to a [Cloudflare Worker](worker/) that forwards the image to TinyPNG for perceptual optimization. The Worker keeps no image copy and enforces a per-visitor daily fair-use quota with KV-backed counters.
- **Local Canvas fallback** — if the result still exceeds the limit, or TinyPNG is unavailable/quota-limited, the browser re-encodes locally, binary-searching JPEG quality and reducing dimensions only as needed.

## Tech stack

- [Astro](https://astro.build) (static output) + Tailwind CSS v3
- Cloudflare Pages hosting + custom `_headers` (CSP, HSTS)
- Cloudflare Worker (serverless proxy) + Workers KV (quota tracking)

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # build to dist/
npm run preview   # preview the production build
```

### Worker deployment

The proxy Worker lives in [`worker/`](worker/) and deploys separately:

```bash
cd worker
npx wrangler deploy
npx wrangler secret put TINYPNG_API_KEY   # TinyPNG API key (never commit it)
```

## Project structure

```
src/pages/                 landing pages (home, per-size compress pages, legal)
src/components/            CompressTool.astro — the compressor UI + logic
src/layouts/Layout.astro   head/meta/schema template shared by all pages
worker/                    TinyPNG proxy Worker (deployed separately)
public/                    robots.txt, llms.txt, _headers, og-image
```
