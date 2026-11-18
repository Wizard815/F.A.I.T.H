import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// FAITH's Home Assistant cards: one ES module the integration serves at
// /faith_static/faith-cards.js (built into ha/custom_components/faith/www so
// Home Assistant users don't need Node).
export default defineConfig({
  plugins: [react()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  css: { postcss: { plugins: [] } },
  build: {
    outDir: "../ha/custom_components/faith/www",
    emptyOutDir: false,
    sourcemap: false,
    lib: { entry: "src/ha/cards.tsx", formats: ["es"], fileName: () => "faith-cards.js" },
  },
});
