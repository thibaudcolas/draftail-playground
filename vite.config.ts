import { defineConfig } from "vite-plus";
import { loadEnv } from "vite-plus";

/**
 * draft-js 0.10 / fbjs use Node's bare `global` (e.g. fbjs/lib/setImmediate,
 * draft-js/lib/editOnInput). CRA's webpack polyfilled it; Vite does not.
 * Define it as window before any dependency code runs.
 */
const globalPolyfill = () => ({
  name: "global-polyfill",
  transformIndexHtml() {
    return [
      {
        tag: "script",
        children: "window.global = window;",
        injectTo: "head-prepend",
      },
    ];
  },
});

/**
 * Serves the Flask export API in development, mirroring CRA's "proxy" field.
 * The API runs separately: `python api/...` (see README).
 */
const apiProxy = {
  "/api": {
    target: "http://localhost:5000",
    changeOrigin: true,
  },
};

/**
 * CRA injected `%REACT_APP_RAVEN%` into index.html from env files.
 * Vite has no HTML env interpolation, so do it here: replace a
 * `<!-- RAVEN -->` marker with the `RAVEN` env var (empty in dev,
 * Sentry script tag in production via .env.production).
 */
const injectRaven = () => ({
  name: "inject-raven",
  transformIndexHtml: {
    order: "pre",
    handler: (html: string, ctx) => {
      const env = loadEnv(ctx.server ? "development" : "production", process.cwd(), "");
      const raven = env.RAVEN ?? "";
      return html.replace("<!-- RAVEN -->", raven);
    },
  },
});

export default defineConfig({
  plugins: [globalPolyfill(), injectRaven()],
  server: {
    // Listen on all interfaces (LAN + Tailscale), reachable as 100.74.2.125 or lat26.
    host: true,
    allowedHosts: ["lat26", "lat26.tail67c68a.ts.net"],
    proxy: apiProxy,
  },
  // CRA served the app at the root; keep that.
  base: "/",
  build: {
    outDir: "build",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    globals: true,
  },
  fmt: {
    semi: true,
    singleQuote: false,
  },
});
