// Builds docs/brand/faith-hub.html: the clickable preview of FAITH's family UI
// (web/preview/app.tsx: React and the fonts bundled in, FAITH's emblem, example data). One file,
// nothing fetched from the internet (AGENTS.md: local only).
// Run: node web/scripts/preview.mjs
import { build } from "esbuild"; // the esbuild that comes with vite
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = await build({ entryPoints: [resolve(here, "../preview/app.tsx")], bundle: true, format: "iife", write: false, minify: true,
  jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment", target: "es2020", logLevel: "error",
  define: { "process.env.NODE_ENV": '"production"' } });
// The two fonts FAITH ships (@fontsource-variable), latin, as data: URLs.
const font = (pkg, file) => readFileSync(resolve(here, `../../node_modules/@fontsource-variable/${pkg}/files/${file}`)).toString("base64");
const face = (family, pkg, file, style, axes) => `@font-face{font-family:"${family}";font-style:${style};font-display:swap;${axes}src:url(data:font/woff2;base64,${font(pkg, file)}) format("woff2");}`;
const fonts = [
  face("Fraunces", "fraunces", "fraunces-latin-wght-normal.woff2", "normal", "font-weight:100 900;"),
  face("Fraunces", "fraunces", "fraunces-latin-wght-italic.woff2", "italic", "font-weight:100 900;"),
  face("Instrument Sans", "instrument-sans", "instrument-sans-latin-wght-normal.woff2", "normal", "font-weight:400 700;"),
].join("\n");
const page = readFileSync(resolve(here, "../preview/template.html"), "utf8").replace("/*FONTS*/", () => fonts).replace("/*APP*/", () => out.outputFiles[0].text);
writeFileSync(resolve(here, "../../docs/brand/faith-hub.html"), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${page}\n</html>\n`);
console.log("wrote docs/brand/faith-hub.html");
