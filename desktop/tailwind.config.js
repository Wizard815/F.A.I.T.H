import web from "../web/tailwind.config.js";

/** FAITH's own theme (web/tailwind.config.js), for the desktop app's page and web/src/ui.tsx. */
export default { ...web, content: ["./src/renderer/**/*.{ts,tsx,html}", "../web/src/ui.tsx"] };
