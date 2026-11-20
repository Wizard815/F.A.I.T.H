// Builds docs/brand/faith-hub.html: the clickable preview of FAITH's family UI
// (web/preview/app.tsx: React from cdnjs, FAITH's emblem, example data). One file.
// Run: node web/scripts/preview.mjs
import { build } from "esbuild"; // the esbuild that comes with vite
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = await build({ entryPoints: [resolve(here, "../preview/app.tsx")], bundle: true, format: "iife", write: false, minify: true,
  jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment", target: "es2020", logLevel: "error" });
const page = readFileSync(resolve(here, "../preview/template.html"), "utf8").replace("/*APP*/", () => out.outputFiles[0].text);
writeFileSync(resolve(here, "../../docs/brand/faith-hub.html"), `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${page}\n</html>\n`);
console.log("wrote docs/brand/faith-hub.html");
