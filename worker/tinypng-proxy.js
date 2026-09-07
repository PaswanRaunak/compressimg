/**
 * Cloudflare Worker: TinyPNG proxy with KV-backed quota tracking
 * - Reads TINYPNG_API_KEY from Worker secret (do not hardcode)
 * - Proxies uploads to https://api.tinify.com/shrink
 * - Tracks daily/monthly usage in TINYPNG_USAGE_KV namespace
 * - Enforces 16 calls/day limit server-side
 * - Returns remaining count to client in response header
 *
 * Deploy:
 * - Create KV namespace: npx wrangler kv:namespace create tinypng-usage-kv
 * - Add TINYPNG_API_KEY: npx wrangler secret put TINYPNG_API_KEY
 * - Update wrangler.toml with KV namespace binding
 * - Publish: npx wrangler publish
 */

const MAX_DAILY_CALLS = 16;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Expose-Headers': 'X-Compressions-Remaining'
        }
      });
    }

    if (request.method === 'POST' && url.pathname === '/shrink') {
      const apiKey = env.TINYPNG_API_KEY;
      if (!apiKey) {
        return jsonResponse({ error: 'TinyPNG API key not configured' }, 500);
      }

      // Use a one-way identifier so raw IP addresses are not written to KV.
      const clientIP = request.headers.get('cf-connecting-ip') || 'unknown';
      const clientIdentifier = await hashIdentifier(clientIP, env.QUOTA_SALT);
      const today = new Date().toDateString();
      const monthKey = getMonthKey();
      const usageKey = `usage:${clientIdentifier}:${today}`;
      const storedMonthKey = `month:${clientIdentifier}`;

      // Check if new month — reset usage
      const storedMonth = await env.TINYPNG_USAGE_KV.get(storedMonthKey);
      if (storedMonth !== monthKey) {
        await env.TINYPNG_USAGE_KV.put(storedMonthKey, monthKey, { expirationTtl: 2764800 });
        await env.TINYPNG_USAGE_KV.put(usageKey, '0', { expirationTtl: 86400 });
      }

      // Get current usage
      let usage = parseInt(await env.TINYPNG_USAGE_KV.get(usageKey) || '0', 10);

      if (usage >= MAX_DAILY_CALLS) {
        return jsonResponse(
          { error: 'Daily TinyPNG quota exceeded (16 calls/day). Using Canvas fallback.' },
          429,
          { 'X-Compressions-Remaining': '0' }
        );
      }

      // Forward request to TinyPNG
      const bodyBuffer = await request.arrayBuffer();
      const tinifyRes = await fetch('https://api.tinify.com/shrink', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('api:' + apiKey),
          'Content-Type': request.headers.get('Content-Type') || 'application/octet-stream'
        },
        body: bodyBuffer
      });

      if (!tinifyRes.ok) {
        return jsonResponse(
          { error: 'TinyPNG request failed', status: tinifyRes.status },
          tinifyRes.status
        );
      }

      // Parse TinyPNG response to get output URL
      const tinifyBody = await tinifyRes.text();
      const tinifyData = JSON.parse(tinifyBody);

      // Increment usage AFTER successful compression
      usage += 1;
      await env.TINYPNG_USAGE_KV.put(usageKey, String(usage), { expirationTtl: 86400 }); // 24h

      const remaining = MAX_DAILY_CALLS - usage;

      // Now download the compressed image from TinyPNG output URL
      const outputUrl = tinifyData.output.url;
      if (!outputUrl) {
        return jsonResponse(
          { error: 'TinyPNG response missing output URL' },
          400
        );
      }

      const outputRes = await fetch(outputUrl);
      if (!outputRes.ok) {
        return jsonResponse(
          { error: 'Failed to download compressed image from TinyPNG', status: outputRes.status },
          outputRes.status
        );
      }

      // Return compressed image blob directly to client with remaining quota
      const compressedBlob = await outputRes.arrayBuffer();
      return new Response(compressedBlob, {
        status: 200,
        headers: {
          'Content-Type': outputRes.headers.get('Content-Type') || 'image/jpeg',
          'Content-Length': String(compressedBlob.byteLength),
          'X-Compressions-Remaining': String(remaining),
          'X-Compressed-Size': tinifyData.output.size || '',
          'X-Original-Size': tinifyData.input.size || '',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': 'X-Compressions-Remaining',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // Health check
    return jsonResponse({ status: 'ok', message: 'TinyPNG proxy ready. POST an image to /shrink' });
  }
};

function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

async function hashIdentifier(value, salt = 'compressimg-quota') {
  const bytes = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...extraHeaders
    }
  });
}
