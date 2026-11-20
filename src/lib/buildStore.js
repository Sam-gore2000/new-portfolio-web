import { useSyncExternalStore } from "react";

// Tiny external store that tracks how many "layers" the page has built so far.
// Every <Blueprint> registers its weight on mount and reports when it has been built,
// so the HUD can show "34 / 108 layers" without re-rendering the whole tree.
const s = { ready: false, total: 0, done: 0 };
let snap = { ...s };
const subs = new Set();
const emit = () => { snap = { ...s }; subs.forEach((f) => f()); };

// Page-space rectangles of layers currently being drawn (the cursor swarm flies between them).
const targets = new Map();

export const buildStore = {
  targets,
  addTarget(id, r) { targets.set(id, r); },
  removeTarget(id) { targets.delete(id); },
  setReady(v) { if (s.ready !== v) { s.ready = v; emit(); } },
  add(w) { s.total += w; emit(); },
  remove(w, wasDone) { s.total -= w; if (wasDone) s.done -= w; emit(); },
  complete(w) { s.done += w; emit(); },
  subscribe(f) { subs.add(f); return () => subs.delete(f); },
  get() { return snap; },
};

export const useBuild = () => useSyncExternalStore(buildStore.subscribe, buildStore.get);
export const useBuildReady = () => useSyncExternalStore(buildStore.subscribe, () => s.ready);
