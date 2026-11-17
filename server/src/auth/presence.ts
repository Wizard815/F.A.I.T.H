import type { Config } from "../config.js";

export type HaStateReader = (entityId: string) => Promise<{ state: string; attributes?: Record<string, any> } | null>;
type DevState = { present: boolean | null; since: number; face: string | null; faceAt: number };

const PRESENT = new Set(["on", "home", "detected", "occupied", "true", "present"]);
const ABSENT = new Set(["off", "not_home", "clear", "away", "false", "absent", "0"]);

/** Watches each hub's presence sensor (a camera's person detection, mmWave...)
 *  and face sensor through Home Assistant. Polls every few seconds; a sensor
 *  that's unavailable counts as unknown, and then only the idle timer applies. */
export class Presence {
  private states = new Map<string, DevState>();
  private timer?: NodeJS.Timeout;
  constructor(private cfg: () => Config, private read: HaStateReader | undefined, private now: () => number = Date.now) {}

  state(deviceId: string): DevState | undefined { return this.states.get(deviceId); }

  /** The person id whose face the hub's face sensor reported in the last 30 seconds. */
  face(deviceId: string): string | undefined {
    const s = this.states.get(deviceId);
    if (!s?.face || this.now() - s.faceAt > 30_000) return undefined;
    const name = s.face.toLowerCase();
    return this.cfg().people.find((p) => p.id === name || p.name.toLowerCase() === name || p.face_names?.some((f) => f.toLowerCase() === name))?.id;
  }

  async poll() {
    if (!this.read) return;
    for (const d of this.cfg().hub.devices) {
      const prev = this.states.get(d.id) ?? { present: null, since: this.now(), face: null, faceAt: 0 };
      const next = { ...prev };
      if (d.presence_entity) {
        let present: boolean | null = null;
        try {
          const s = await this.read(d.presence_entity);
          const v = String(s?.state ?? "").toLowerCase();
          present = PRESENT.has(v) || (Number(v) > 0) ? true : ABSENT.has(v) ? false : null;
        } catch { present = null; }
        if (present !== prev.present) { next.present = present; next.since = this.now(); }
      }
      if (d.face_entity) {
        try {
          const s = await this.read(d.face_entity);
          const v = String(s?.state ?? "");
          if (v && !["unknown", "unavailable", "none", ""].includes(v.toLowerCase()) && v !== prev.face) { next.face = v; next.faceAt = this.now(); }
          else if (v && v === prev.face && s?.attributes?.last_seen) next.faceAt = Date.parse(s.attributes.last_seen) || prev.faceAt;
        } catch { /* keep the last */ }
      }
      this.states.set(d.id, next);
    }
  }

  /** For tests and HA webhooks: set a device's presence directly. */
  set(deviceId: string, present: boolean | null, face?: string) {
    const prev = this.states.get(deviceId);
    this.states.set(deviceId, { present, since: prev?.present === present ? prev.since : this.now(), face: face ?? prev?.face ?? null, faceAt: face ? this.now() : prev?.faceAt ?? 0 });
  }

  start(everyMs = 4000) { if (this.read && this.cfg().hub.devices.some((d) => d.presence_entity || d.face_entity)) this.timer = setInterval(() => { this.poll().catch(() => {}); }, everyMs).unref(); }
  stop() { if (this.timer) clearInterval(this.timer); }
}
