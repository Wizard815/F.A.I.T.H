// Builds docs/brand/emblem.html: the emblem in every state, on dark and on paper,
// with the palette. One file, no network. Run: node web/scripts/emblem-preview.mjs
import { build } from "esbuild"; // the esbuild that comes with vite
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const out = await build({ entryPoints: [resolve(here, "../src/emblem/emblem.ts")], bundle: true, format: "iife", globalName: "FaithEmblem", write: false, minify: true });
const html = readFileSync(resolve(here, "emblem-preview.html"), "utf8").replace("/*EMBLEM*/", () => out.outputFiles[0].text);
writeFileSync(resolve(here, "../../docs/brand/emblem.html"), html);
console.log("wrote docs/brand/emblem.html");
