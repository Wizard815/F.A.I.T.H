import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// The page uses FAITH's own look (web/src/index.css and ui.tsx). Their packages
// (React, the fonts, the icons) come from this folder's node_modules.
const here = (p: string) => resolve(import.meta.dirname, p);
export default defineConfig({
  root: here("src/renderer"),
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@web", replacement: here("../web/src") },
      { find: /^(react|react-dom|lucide-react|@fontsource-variable\/[^/]+)(\/.*)?$/, replacement: `${here("node_modules")}/$1$2` },
    ],
  },
  css: { postcss: here(".") },
  build: { outDir: here("dist/renderer"), emptyOutDir: true, sourcemap: false, assetsInlineLimit: 0 },
});
