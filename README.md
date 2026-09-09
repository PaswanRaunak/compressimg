# CompressImg

Free online image compressor that reduces JPG, PNG, and WebP files to an **exact target size** — 20KB, 30KB, 50KB, 100KB, 200KB, or any custom limit between 1KB and 5000KB. No account, no watermark.

**Live site:** [imgcompressor.tools](https://imgcompressor.tools)

## How it works

1. Pick a target size (preset or custom)
2. Drop in an image (up to 20MB)
3. Download a file guaranteed to be under the limit

Compression runs in two stages:

- **Cloudflare Worker → TinyPNG** — the browser uploads the image over HTTPS to a [Cloudflare Worker](worker/) that forwards it to TinyPNG for perceptual optimization. The Worker processes bytes in memory, keeps no image copy, and enforces a per-visitor daily fair-use quota with KV-backed counters (IPs are hashed before storage).
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
