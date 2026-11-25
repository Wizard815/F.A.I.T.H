// The main process and the preload script, bundled for Electron (the page is built by Vite).
import { build } from "esbuild";

const common = { bundle: true, platform: "node", format: "cjs", target: "node22", external: ["electron"], sourcemap: false, logLevel: "warning" };
await build({ ...common, entryPoints: ["src/main.ts"], outfile: "dist/main.cjs" });
await build({ ...common, entryPoints: ["src/preload.ts"], outfile: "dist/preload.cjs" });
