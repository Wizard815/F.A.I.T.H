import { envValue, type MealieConnector as MealieCfg } from "../config.js";
import type { Caller } from "../scope.js";
import { call, ToolError, type Connector, type Tool } from "./types.js";

/** Mealie's own API, for what Home Assistant's Mealie actions can't do: adding a
 *  recipe (from a cookbook photo or a handwritten card). One Mealie API token for
 *  the household; recipes are the family's, not one person's. */
export class Mealie implements Connector {
  id: string;
  constructor(private cfg: MealieCfg, private env: NodeJS.ProcessEnv = process.env) { this.id = cfg.id; }
  describe() { return "Mealie: the family's recipe book (adding recipes from a photo, a card or a link)"; }

  private token() { return envValue(this.cfg.token_env, this.env); }
  private async req(method: "GET" | "POST", path: string, body?: unknown) {
    const t = this.token();
    if (!t) throw new ToolError(`No Mealie token: set ${this.cfg.token_env}.`);
    const r = await call(`${this.cfg.url}${path}`, { method, timeoutMs: 60_000, headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (r.status === 401 || r.status === 403) throw new ToolError(`Mealie refused the token in ${this.cfg.token_env} (${r.status}). Make a new one in Mealie: your profile > API Tokens.`);
    if (r.status === 404 && path.startsWith("/api/recipes/create")) throw new ToolError("This Mealie can't import a recipe from data. Update Mealie (1.10 or newer).");
    if (!r.ok) throw new ToolError(`Mealie answered ${r.status}${r.body?.detail?.message ? `: ${r.body.detail.message}` : ""}.`);
    return r.body;
  }

  async ping() { await this.req("GET", "/api/users/self"); }

  async tools(_caller: Caller): Promise<Tool[]> {
    if (!this.token()) return [];
    return [{
      name: "recipe_add", connector: this.id, write: true,
      explain: (a) => `add the recipe "${a?.name}" to Mealie (${list(a?.ingredients).length} ingredients, ${list(a?.steps).length} steps)`,
      description: "Add a new recipe to Mealie, written out in full: from a cookbook page, a recipe card or what the person tells you. Copy the ingredients and steps as written; don't invent missing ones. Returns recipe_id (for meal_plan).",
      parameters: { type: "object", additionalProperties: false, required: ["name", "ingredients", "steps"], properties: {
        name: { type: "string" },
        description: { type: "string", description: "One or two sentences, if the page has them." },
        servings: { type: "string", description: "As written, e.g. \"4\" or \"12 cookies\"." },
        prep_minutes: { type: "number" }, cook_minutes: { type: "number" }, total_minutes: { type: "number" },
        ingredients: { type: "array", items: { type: "string" }, description: "One line each, with its amount: \"2 cups flour\"." },
        steps: { type: "array", items: { type: "string" }, description: "One step each, in order." },
        notes: { type: "string", description: "Tips or notes written on the page or card." },
        source: { type: "string", description: "Where it's from: \"Grandma's card\", a cookbook and page." },
        tags: { type: "array", items: { type: "string" } },
      } },
      run: async (a) => {
        const name = String(a?.name || "").trim(), ingredients = list(a?.ingredients), steps = list(a?.steps);
        if (!name || !ingredients.length || !steps.length) throw new ToolError("A recipe needs a name, its ingredients and its steps. Ask for what's missing.");
        const r = await this.req("POST", "/api/recipes/create/html-or-json", { includeTags: true, data: JSON.stringify(schemaRecipe({ ...a, name, ingredients, steps })) });
        const slug = String(r ?? "");
        const got = slug ? await this.req("GET", `/api/recipes/${encodeURIComponent(slug)}`).catch(() => null) : null;
        return { ok: true, name: got?.name || name, slug, recipe_id: got?.id ? String(got.id) : undefined, note: "Saved in Mealie." };
      },
    }, {
      name: "recipe_import", connector: this.id, write: true, explain: (a) => `add the recipe at ${a?.url} to Mealie`,
      description: "Add a recipe to Mealie from a web page's address (Mealie reads the page itself). Returns recipe_id (for meal_plan).",
      parameters: { type: "object", additionalProperties: false, required: ["url"], properties: { url: { type: "string" } } },
      run: async (a) => {
        const url = String(a?.url || "").trim();
        if (!/^https?:\/\/\S+$/.test(url)) throw new ToolError("That isn't a web address (https://...).");
        const slug = String((await this.req("POST", "/api/recipes/create/url", { url, includeTags: true })) ?? "");
        const got = slug ? await this.req("GET", `/api/recipes/${encodeURIComponent(slug)}`).catch(() => null) : null;
        return { ok: true, name: got?.name || slug, slug, recipe_id: got?.id ? String(got.id) : undefined, note: "Saved in Mealie." };
      },
    }];
  }
}

const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean) : []);
const iso = (m: unknown) => (Number(m) > 0 ? `PT${Math.round(Number(m))}M` : undefined);

/** The recipe as a https://schema.org/Recipe object, which Mealie imports like a web page's. */
export function schemaRecipe(a: any) {
  const notes = String(a.notes || "").trim(), source = String(a.source || "").trim();
  return {
    "@context": "https://schema.org", "@type": "Recipe",
    name: a.name,
    description: [String(a.description || "").trim(), source ? `From ${source}.` : ""].filter(Boolean).join(" ") || undefined,
    recipeYield: a.servings ? String(a.servings) : undefined,
    prepTime: iso(a.prep_minutes), cookTime: iso(a.cook_minutes), totalTime: iso(a.total_minutes),
    recipeIngredient: list(a.ingredients),
    recipeInstructions: [...list(a.steps).map((text) => ({ "@type": "HowToStep", text })), ...(notes ? [{ "@type": "HowToStep", text: `Note: ${notes}` }] : [])],
    keywords: list(a.tags).join(", ") || undefined,
  };
}
