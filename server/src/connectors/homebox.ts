import { envValue, type HomeboxConnector as HomeboxCfg } from "../config.js";
import { policyOf, type Caller } from "../scope.js";
import { call, ToolError, type Connector, type Tool } from "./types.js";

/** Homebox, the house inventory: what the family owns, where it is, and its tags.
 *  One Homebox account for the household (everyone in a Homebox group sees the same
 *  items, so per-person accounts wouldn't keep anything apart). FAITH keeps two things
 *  from the kids and the shared views itself:
 *   - items with a private tag (private_tags, default "private"): grown-ups only;
 *   - prices, serial and model numbers, warranty and sale details: grown-ups only.
 *
 *  Homebox's API changed twice: labels became tags (0.23), then items and locations
 *  became "entities". FAITH asks which one it is talking to and speaks that. */
export class Homebox implements Connector {
  id: string;
  private session?: { token: string; until: number };
  private api?: Api;
  constructor(private cfg: HomeboxCfg, private env: NodeJS.ProcessEnv = process.env) { this.id = cfg.id; }
  describe() { return "Homebox: the house inventory (what we own, where it's kept, and its tags)"; }

  private configured() { return Boolean(envValue(this.cfg.token_env, this.env) || (envValue(this.cfg.user_env, this.env) && envValue(this.cfg.password_env, this.env))); }

  /** A token: the configured one, or a login with the household account (kept until it expires). */
  private async token(fresh = false): Promise<string> {
    const fixed = envValue(this.cfg.token_env, this.env);
    if (fixed) return fixed.startsWith("Bearer ") ? fixed : `Bearer ${fixed}`;
    if (!fresh && this.session && this.session.until > Date.now()) return this.session.token;
    const username = envValue(this.cfg.user_env, this.env), password = envValue(this.cfg.password_env, this.env);
    if (!username || !password) throw new ToolError(`No Homebox account: set ${this.cfg.user_env} and ${this.cfg.password_env}.`);
    const r = await call(`${this.cfg.url}/api/v1/users/login`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ username, password, stayLoggedIn: true }) });
    if (r.status === 401 || r.status === 403 || r.status === 400) throw new ToolError(`Homebox refused the login in ${this.cfg.user_env} / ${this.cfg.password_env}. Check them by signing in to Homebox with them.`);
    if (!r.ok || !r.body?.token) throw new ToolError(`Homebox answered ${r.status} to the login.`);
    const t = String(r.body.token), token = t.startsWith("Bearer ") ? t : `Bearer ${t}`;
    const exp = Date.parse(String(r.body.expiresAt || ""));
    this.session = { token, until: Math.min(Number.isFinite(exp) ? exp - 60_000 : Infinity, Date.now() + 12 * 3600_000) };
    return token;
  }

  private async req(method: "GET" | "POST" | "PUT", path: string, body?: unknown, retry = true): Promise<any> {
    const r = await call(`${this.cfg.url}/api/v1${path}`, { method, timeoutMs: 30_000, headers: { Authorization: await this.token(), Accept: "application/json", ...(body !== undefined ? { "Content-Type": "application/json" } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (r.status === 401 && retry && !this.cfg.token_env) { this.session = undefined; return this.req(method, path, body, false); }
    if (r.status === 401 || r.status === 403) throw new ToolError(this.cfg.token_env ? `Homebox refused the token in ${this.cfg.token_env}.` : "Homebox refused FAITH's login. Check the Homebox account in FAITH's settings.");
    if (r.status === 404) throw new NotFound(path);
    if (!r.ok) throw new ToolError(`Homebox answered ${r.status}${r.body?.error ? `: ${r.body.error}` : ""}.`);
    return r.body;
  }

  /** Which Homebox API this is (asked once). */
  private async which(): Promise<Api> {
    if (this.api) return this.api;
    let entities = false;
    try { await this.req("GET", "/entities?pageSize=1"); entities = true; } catch (e) { if (!(e instanceof NotFound)) throw e; }
    let tags = entities;
    if (!entities) { try { await this.req("GET", "/tags"); tags = true; } catch (e) { if (!(e instanceof NotFound)) throw e; } }
    this.api = { entities, tags };
    return this.api;
  }

  async ping() { await this.which(); }

  private grownUp(caller: Caller) { return ["admin", "parent", "parents"].includes(policyOf(caller)); }
  private hidden(caller: Caller, tagNames: string[]) {
    if (this.grownUp(caller)) return false;
    const priv = this.cfg.private_tags.map((t) => t.toLowerCase());
    return tagNames.some((t) => priv.includes(t.toLowerCase()));
  }

  private async locations(): Promise<Named[]> {
    const api = await this.which();
    const r = api.entities ? await this.req("GET", "/entities?isLocation=true&pageSize=1000") : await this.req("GET", "/locations");
    return rows(r).map((l: any) => ({ id: String(l.id), name: String(l.name ?? ""), count: Number(l.itemCount ?? 0) || 0, parent: l.parent?.name ? String(l.parent.name) : undefined }));
  }
  private async tagList(): Promise<Named[]> {
    const api = await this.which();
    return rows(await this.req("GET", api.tags ? "/tags" : "/labels")).map((t: any) => ({ id: String(t.id), name: String(t.name ?? "") }));
  }

  /** A location by name: exact (any case), else the only one containing the words. */
  private async location(name: string): Promise<Named> {
    const all = await this.locations(), n = name.trim().toLowerCase();
    const exact = all.filter((l) => l.name.toLowerCase() === n);
    if (exact.length === 1) return exact[0];
    const near = all.filter((l) => l.name.toLowerCase().includes(n));
    if (!exact.length && near.length === 1) return near[0];
    const opts = (exact.length ? exact : near.length ? near : all).slice(0, 15).map((l) => (l.parent ? `${l.name} (in ${l.parent})` : l.name));
    throw new ToolError(`${exact.length > 1 || near.length > 1 ? `More than one Homebox location matches "${name}"` : `Homebox has no location "${name}"`}. Locations: ${opts.join(", ") || "none yet"}. Ask which one, or add it with inventory_add_location.`);
  }

  /** Tag ids by name; tags that don't exist yet are made. */
  private async tagIds(names: string[]): Promise<string[]> {
    if (!names.length) return [];
    const api = await this.which();
    const all = await this.tagList(), out: string[] = [];
    for (const name of names) {
      const hit = all.find((t) => t.name.toLowerCase() === name.toLowerCase());
      if (hit) { out.push(hit.id); continue; }
      const made = await this.req("POST", api.tags ? "/tags" : "/labels", { name, description: "", color: "" });
      all.push({ id: String(made.id), name }); out.push(String(made.id));
    }
    return out;
  }

  private itemPath(id: string) { return `${this.api!.entities ? "/entities" : "/items"}/${encodeURIComponent(id)}`; }

  /** An item as the model sees it, with what this view may not see left out. */
  private view(caller: Caller, it: any) {
    const tags = tagNames(it), place = it.location ?? it.parent;
    const out: Record<string, unknown> = { id: String(it.id), name: it.name, quantity: it.quantity, location: place?.name, tags };
    if (it.description) out.description = it.description;
    if (it.notes) out.notes = it.notes;
    if (it.archived) out.archived = true;
    if (it.assetId && it.assetId !== "000-000") out.asset_id = it.assetId;
    if (it.manufacturer) out.manufacturer = it.manufacturer;
    if (Array.isArray(it.fields) && it.fields.length) out.fields = Object.fromEntries(it.fields.map((f: any) => [f.name, f.textValue ?? f.numberValue ?? f.booleanValue]));
    if (this.grownUp(caller)) {
      for (const [k, v] of [["model_number", it.modelNumber], ["serial_number", it.serialNumber], ["purchase_price", Number(it.purchasePrice) || undefined], ["purchased_from", it.purchaseFrom],
        ["purchased", day(it.purchaseTime)], ["warranty_until", it.lifetimeWarranty ? "lifetime" : day(it.warrantyExpires)], ["insured", it.insured || undefined]] as const)
        if (v) out[k] = v;
    }
    return out;
  }

  /** One item, if this view may see it. */
  private async item(caller: Caller, id: string) {
    await this.which();
    let it: any;
    try { it = await this.req("GET", this.itemPath(id)); } catch (e) { if (e instanceof NotFound) throw new ToolError(`Homebox has no item ${id}. Search for it first.`); throw e; }
    if (this.hidden(caller, tagNames(it))) throw new ToolError(`Homebox has no item ${id}. Search for it first.`);
    return it;
  }

  async tools(caller: Caller): Promise<Tool[]> {
    if (!this.configured()) return [];
    const id = this.id, strs = { type: "array", items: { type: "string" } };
    return [{
      name: "inventory_search", connector: id, write: false,
      description: "Search the house inventory (Homebox): what we own and where it's kept. Words match names, descriptions and notes. Filter by a location or tags by name. Returns item ids for inventory_item and inventory_update.",
      parameters: { type: "object", additionalProperties: false, properties: {
        query: { type: "string", description: "Words, e.g. \"hdmi cable\" or \"camping\". Empty: everything (with a filter)." },
        location: { type: "string", description: "Only items in this location, e.g. \"Garage\"." },
        tags: { ...strs, description: "Only items with all of these tags." },
        archived: { type: "boolean", description: "Include archived items." },
        limit: { type: "number", description: "Default 20, at most 100." },
      } },
      run: async (a) => {
        const api = await this.which();
        const q = new URLSearchParams({ page: "1", pageSize: String(Math.min(100, Math.max(1, Number(a?.limit) || 20))) });
        if (String(a?.query || "").trim()) q.set("q", String(a.query).trim());
        if (a?.archived) q.set("includeArchived", "true");
        if (String(a?.location || "").trim()) q.append(api.entities ? "parentIds" : "locations", (await this.location(String(a.location))).id);
        const want = list(a?.tags);
        if (want.length) {
          const all = await this.tagList(), ids = want.map((n) => all.find((t) => t.name.toLowerCase() === n.toLowerCase())?.id);
          if (ids.some((x) => !x)) return { items: [], total: 0, note: `Homebox has no tag ${want.filter((_, i) => !ids[i]).join(", ")}. Tags: ${all.map((t) => t.name).join(", ")}.` };
          for (const t of ids) q.append(api.tags ? "tags" : "labels", t!);
        }
        const r = await this.req("GET", `${api.entities ? "/entities" : "/items"}?${q}`);
        const items = rows(r).filter((it: any) => !this.hidden(caller, tagNames(it)));
        return { total: items.length < rows(r).length ? items.length : Number(r?.total ?? items.length), items: items.map((it: any) => this.view(caller, it)) };
      },
    }, {
      name: "inventory_item", connector: id, write: false,
      description: "One inventory item in full: where it is, quantity, tags, notes and its extra fields (item_id from inventory_search).",
      parameters: { type: "object", additionalProperties: false, required: ["item_id"], properties: { item_id: { type: "string" } } },
      run: async (a) => this.view(caller, await this.item(caller, String(a?.item_id || ""))),
    }, {
      name: "inventory_locations", connector: id, write: false,
      description: "The places things are kept in Homebox (rooms, shelves, boxes), with how many items each holds.",
      parameters: { type: "object", additionalProperties: false, properties: {} },
      run: async () => ({ locations: (await this.locations()).map((l) => ({ name: l.name, in: l.parent, items: l.count })) }),
    }, {
      name: "inventory_tags", connector: id, write: false,
      description: "The tags used to sort the inventory in Homebox.",
      parameters: { type: "object", additionalProperties: false, properties: {} },
      run: async () => {
        const priv = this.cfg.private_tags.map((t) => t.toLowerCase());
        return { tags: (await this.tagList()).map((t) => t.name).filter((n) => this.grownUp(caller) || !priv.includes(n.toLowerCase())) };
      },
    }, {
      name: "inventory_add", connector: id, write: true,
      explain: (a) => `add ${Number(a?.quantity) > 1 ? `${a.quantity} × ` : ""}"${a?.name}" to the inventory in ${a?.location}${list(a?.tags).length ? `, tagged ${list(a.tags).join(", ")}` : ""}`,
      description: "Add an item to the house inventory (Homebox), in a location that exists (see inventory_locations). Tags that don't exist yet are made. Search first so you don't add something twice.",
      parameters: { type: "object", additionalProperties: false, required: ["name", "location"], properties: {
        name: { type: "string" }, location: { type: "string" },
        quantity: { type: "number", description: "Default 1." },
        tags: strs, description: { type: "string" }, notes: { type: "string" },
      } },
      run: async (a) => {
        const name = String(a?.name || "").trim();
        if (!name) throw new ToolError("An item needs a name.");
        const api = await this.which(), loc = await this.location(String(a?.location || "")), tags = list(a?.tags);
        if (this.hidden(caller, tags)) throw new ToolError("Only a grown-up can add an item with that tag.");
        const tagIdList = await this.tagIds(tags);
        const made = await this.req("POST", api.entities ? "/entities" : "/items", { name, description: String(a?.description || ""), [api.entities ? "parentId" : "locationId"]: loc.id, [api.tags ? "tagIds" : "labelIds"]: tagIdList });
        const qty = Number(a?.quantity) || 1, notes = String(a?.notes || "").trim();
        if (qty !== 1 || notes) await this.put(String(made.id), (b) => { b.quantity = qty; if (notes) b.notes = notes; });
        return { ok: true, item_id: String(made.id), name, location: loc.name, tags, note: "Added to Homebox." };
      },
    }, {
      name: "inventory_update", connector: id, write: true,
      explain: (a) => `change the inventory item ${a?.item_id}: ${changes(a) || "nothing"}`,
      description: "Change an inventory item (item_id from inventory_search): move it, rename it, set how many there are, add or remove tags, change its notes, or archive it when it's gone. Only what you pass changes.",
      parameters: { type: "object", additionalProperties: false, required: ["item_id"], properties: {
        item_id: { type: "string" }, name: { type: "string" },
        location: { type: "string", description: "Move it here." },
        quantity: { type: "number" },
        add_tags: strs, remove_tags: strs,
        description: { type: "string" }, notes: { type: "string", description: "Replaces the notes." },
        archived: { type: "boolean", description: "true: it's gone (given away, used up, broken); false: back." },
      } },
      run: async (a) => {
        const itemId = String(a?.item_id || "");
        const it = await this.item(caller, itemId), api = this.api!;
        const add = list(a?.add_tags), drop = list(a?.remove_tags).map((t) => t.toLowerCase());
        if (this.hidden(caller, add)) throw new ToolError("Only a grown-up can give an item that tag.");
        const loc = String(a?.location || "").trim() ? await this.location(String(a.location)) : undefined;
        const keep = (it.tags ?? it.labels ?? []).filter((t: any) => !drop.includes(String(t.name).toLowerCase())).map((t: any) => String(t.id));
        const tagIdList = [...new Set([...keep, ...(await this.tagIds(add))])];
        await this.put(itemId, (b) => {
          if (a?.name) b.name = String(a.name);
          if (a?.quantity !== undefined) b.quantity = Number(a.quantity);
          if (a?.description !== undefined) b.description = String(a.description);
          if (a?.notes !== undefined) b.notes = String(a.notes);
          if (a?.archived !== undefined) b.archived = Boolean(a.archived);
          if (loc) b[api.entities ? "parentId" : "locationId"] = loc.id;
          b[api.tags ? "tagIds" : "labelIds"] = tagIdList;
        }, it);
        return { ok: true, item_id: itemId, changed: changes(a), note: "Saved in Homebox." };
      },
    }, {
      name: "inventory_add_location", connector: id, write: true,
      explain: (a) => `add the location "${a?.name}" to Homebox${a?.inside ? ` inside ${a.inside}` : ""}`,
      description: "Add a place to keep things in Homebox (a room, shelf, bin or box), optionally inside another location.",
      parameters: { type: "object", additionalProperties: false, required: ["name"], properties: { name: { type: "string" }, inside: { type: "string", description: "The location it's in, e.g. \"Garage\"." }, description: { type: "string" } } },
      run: async (a) => {
        const name = String(a?.name || "").trim();
        if (!name) throw new ToolError("A location needs a name.");
        const api = await this.which(), parent = String(a?.inside || "").trim() ? await this.location(String(a.inside)) : undefined;
        const body: Record<string, unknown> = { name, description: String(a?.description || ""), ...(parent ? { parentId: parent.id } : {}) };
        if (api.entities) {
          const types = rows(await this.req("GET", "/entity-types").catch(() => [])), t = types.find((x: any) => x.isLocation);
          if (t) body.entityTypeId = t.id;
          body.isLocation = true;
        }
        const made = await this.req("POST", api.entities ? "/entities" : "/locations", body);
        return { ok: true, location: name, inside: parent?.name, id: String(made?.id ?? ""), note: "Added to Homebox." };
      },
    }];
  }

  /** Homebox's update replaces the whole item, so send it back with the changes made. */
  private async put(id: string, change: (b: Record<string, any>) => void, it?: any) {
    const api = await this.which();
    it ??= await this.req("GET", this.itemPath(id));
    const b: Record<string, any> = {};
    for (const [k, v] of Object.entries(it)) if (!SKIP.has(k)) b[k] = v;
    b.id = String(it.id);
    if (api.entities) { b.parentId = it.parent?.id ?? null; if (it.entityType?.id) b.entityTypeId = it.entityType.id; }
    else { b.locationId = it.location?.id ?? null; b.parentId = it.parent?.id ?? null; }
    b[api.tags ? "tagIds" : "labelIds"] = (it.tags ?? it.labels ?? []).map((t: any) => String(t.id));
    change(b);
    await this.req("PUT", this.itemPath(id), b);
  }
}

type Api = { entities: boolean; tags: boolean };
type Named = { id: string; name: string; count?: number; parent?: string };
class NotFound extends ToolError { constructor(path: string) { super(`Homebox has nothing at ${path}.`); } }
const SKIP = new Set(["location", "parent", "labels", "tags", "entityType", "attachments", "children", "createdAt", "updatedAt", "imageId", "thumbnailId", "totalPrice", "itemCount", "maintenance"]);
const rows = (r: any): any[] => (Array.isArray(r) ? r : Array.isArray(r?.items) ? r.items : []);
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean) : []);
const tagNames = (it: any): string[] => (it?.tags ?? it?.labels ?? []).map((t: any) => String(t?.name ?? "")).filter(Boolean);
const day = (v: unknown) => { const s = String(v || ""); return s && !s.startsWith("0001") ? s.slice(0, 10) : undefined; };
const changes = (a: any) => [
  a?.name ? `name "${a.name}"` : "", a?.location ? `move to ${a.location}` : "", a?.quantity !== undefined ? `quantity ${a.quantity}` : "",
  list(a?.add_tags).length ? `tag ${list(a.add_tags).join(", ")}` : "", list(a?.remove_tags).length ? `untag ${list(a.remove_tags).join(", ")}` : "",
  a?.description !== undefined ? "new description" : "", a?.notes !== undefined ? "new notes" : "", a?.archived === true ? "archive it" : a?.archived === false ? "unarchive it" : "",
].filter(Boolean).join(", ");
