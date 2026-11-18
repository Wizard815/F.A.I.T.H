/** How a card talks to FAITH: Home Assistant's websocket, through the FAITH
 *  integration ("faith/call"), which adds the logged-in HA user itself. A
 *  shared tablet's sign-in (from the who card) is kept per screen and shared
 *  by every FAITH card on that tablet. */
export type Hass = { callWS: <T>(msg: Record<string, unknown>) => Promise<T>; user?: { id: string; name: string; is_admin: boolean }; themes?: { darkMode?: boolean } };
export type CardConfig = { screen?: string; title?: string; cards?: string[]; [k: string]: unknown };
export type Api = { call: <T = any>(path: string, body?: Record<string, unknown>) => Promise<T>; screen?: string; user?: Hass["user"] };

const key = (screen: string) => `faith.hub.${screen}`;
export const hubSession = (screen?: string) => { if (!screen) return undefined; try { return localStorage.getItem(key(screen)) || undefined; } catch { return undefined; } };
export function setHubSession(screen: string, token: string | null) {
  try { token ? localStorage.setItem(key(screen), token) : localStorage.removeItem(key(screen)); } catch { /* private mode: this tablet just won't remember */ }
  window.dispatchEvent(new CustomEvent("faith-hub-changed", { detail: { screen } }));
}

export function makeApi(getHass: () => Hass | undefined, config: CardConfig): Api {
  return {
    screen: config.screen,
    get user() { return getHass()?.user; },
    call: async <T,>(path: string, body: Record<string, unknown> = {}) => {
      const hass = getHass();
      if (!hass) throw new Error("Home Assistant isn't ready yet.");
      const hs = hubSession(config.screen);
      try {
        return await hass.callWS<T>({ type: "faith/call", path, body: { ...body, ...(config.screen ? { screen: config.screen } : {}), ...(hs ? { hub_session: hs } : {}) } });
      } catch (e: any) { throw new Error(e?.message || e?.code || "FAITH didn't answer."); }
    },
  };
}
