TinyPNG proxy Worker

How to deploy (Cloudflare Workers / Wrangler):

1. Install Wrangler: `npm install -g wrangler` (or use npx wrangler)
2. Put your TinyPNG key as a secret:

   ```bash
   npx wrangler secret put TINYPNG_API_KEY
   ```

3. (Optional) Create a KV namespace and bind it as `TINYPNG_USAGE_KV` in `wrangler.toml`.

4. Publish the worker:

   ```bash
   npx wrangler publish worker/tinypng-proxy.js --name imgcompressortool-proxy
   ```

Notes:
- This worker proxies the upload to TinyPNG so your API key is not exposed to clients.
- For production, add KV-backed usage tracking so you can track and enforce quotas server-side.
