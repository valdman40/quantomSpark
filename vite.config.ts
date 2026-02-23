import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all VITE_* vars from .env / .env.local into `env`
  const env = loadEnv(mode, process.cwd(), '');

  const ip = env.VITE_GATEWAY_IP;
  const port = env.VITE_GATEWAY_PORT ?? '4434';
  const cookie = env.VITE_GATEWAY_COOKIE;
  const token = env.VITE_GATEWAY_TOKEN ?? '';
  const gatewayOrigin = ip ? `https://${ip}:${port}` : undefined;

  // Startup diagnostics — printed once when Vite initialises the config.
  if (gatewayOrigin) {
    console.log('[proxy] target    :', gatewayOrigin);
    console.log(
      '[proxy] token     :',
      token ? `${token.slice(0, 6)}…` : '(empty — check VITE_GATEWAY_TOKEN)'
    );
    console.log(
      '[proxy] cookie    :',
      cookie ? `${cookie.slice(0, 20)}…` : '(empty — check VITE_GATEWAY_COOKIE)'
    );
  }

  return {
    plugins: [react()],
    server: {
      port: 3000,
      // Proxy /gateway/* → real Quantum Spark gateway (only when VITE_GATEWAY_IP is set).
      // This sidesteps CORS and the self-signed TLS cert; Node injects the Cookie header
      // because browsers' Forbidden-Header rules don't apply on the server side.
      ...(gatewayOrigin
        ? {
            proxy: {
              '/gateway': {
                target: gatewayOrigin,
                changeOrigin: true,
                secure: false, // accept self-signed cert
                rewrite: (path) => path.replace(/^\/gateway/, ''),
                configure: (proxy) => {
                  proxy.on('proxyReq', (proxyReq, req) => {
                    // ── Auth headers (Node.js can set these; browsers cannot from JS) ──
                    if (cookie) proxyReq.setHeader('Cookie', cookie);
                    proxyReq.setHeader('Origin', gatewayOrigin as string);
                    proxyReq.setHeader(
                      'Referer',
                      `${gatewayOrigin}/?token=${token}`
                    );
                    proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest');

                    // ── Browser hint headers ──────────────────────────────────────────
                    // When the request originates from Postman or a non-browser client
                    // these are absent. Force them so the gateway sees a request that
                    // is indistinguishable from a real Chrome browser hitting it directly.
                    proxyReq.setHeader('Accept', '*/*');
                    proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.9');
                    proxyReq.setHeader('Connection', 'keep-alive');
                    proxyReq.setHeader('Sec-Fetch-Dest', 'empty');
                    proxyReq.setHeader('Sec-Fetch-Mode', 'cors');
                    proxyReq.setHeader('Sec-Fetch-Site', 'same-origin');
                    proxyReq.setHeader(
                      'sec-ch-ua',
                      '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"'
                    );
                    proxyReq.setHeader('sec-ch-ua-mobile', '?0');
                    proxyReq.setHeader('sec-ch-ua-platform', '"Windows"');
                    proxyReq.setHeader(
                      'User-Agent',
                      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
                    );

                    // Log all headers that will actually reach the gateway.
                    console.log(
                      `\n[proxy] ── outgoing → ${req.method} ${req.url}`
                    );
                    const outgoing = proxyReq.getHeaders();
                    for (const [k, v] of Object.entries(outgoing)) {
                      console.log(`[proxy]   ${k}: ${v}`);
                    }
                  });
                },
              },
            },
          }
        : {}),
    },
  };
});
