#!/usr/bin/env node
/**
 * Simple local TinyPNG proxy server (temporary until Worker is deployed)
 * Usage: node worker/local-proxy.js
 * Then update CompressTool component to POST to http://localhost:3000/shrink
 */

const http = require('http');
const https = require('https');

const TINYPNG_API_KEY = 'f1X77QGzPZtS3cZ2MCwmQmHSwjl6fNnB';
const PORT = 3000;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/shrink') {
    let body = Buffer.alloc(0);

    req.on('data', chunk => {
      body = Buffer.concat([body, chunk]);
    });

    req.on('end', () => {
      // Proxy to TinyPNG API
      const options = {
        hostname: 'api.tinify.com',
        port: 443,
        path: '/shrink',
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('api:' + TINYPNG_API_KEY).toString('base64'),
          'Content-Length': body.length
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let responseBody = '';

        proxyRes.on('data', chunk => {
          responseBody += chunk;
        });

        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, {
            ...proxyRes.headers,
            'Access-Control-Allow-Origin': '*'
          });
          res.end(responseBody);
        });
      });

      proxyReq.on('error', (err) => {
        console.error('Proxy error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', message: 'Local TinyPNG proxy ready. POST to /shrink' }));
  }
});

server.listen(PORT, () => {
  console.log(`✅ Local TinyPNG proxy running on http://localhost:${PORT}`);
  console.log(`📝 Update CompressTool.astro to POST to: http://localhost:${PORT}/shrink`);
  console.log(`⚠️  Only for local testing — use Cloudflare Worker for production.`);
});
