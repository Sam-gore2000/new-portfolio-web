import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion, animate } from "motion/react";
import { buildStore, useBuildReady } from "../../lib/buildStore";

/*
  Blueprint - the "agents are building this page" effect.

  1. The layer is hidden. A wireframe is drawn over it, made of many small boxes that are
     measured from the layer's REAL contents (headings, text, images, buttons ...). The boxes
     fly in from random offsets and snap into place, each with handles and a size label.
  2. Cursors move across the boxes and the global swarm (AgentSwarm) hops between layers.
  3. The wireframe flashes green ("placed"), dissolves, and the real content resolves in.

  Children can call useRevealed() to start their own animations only once the layer is built.
*/

// Global speed knob: 1 = slow & dramatic, 0.5 = very snappy. All delays/durations are scaled by it.
export const TEMPO = 0.7;

export const AGENTS = [
  { name: "Layout", color: "#FF4F9A" },
  { name: "Type", color: "#FFD84F" },
  { name: "Motion", color: "#9B7BFF" },
  { name: "Color", color: "#5BF5A0" },
  { name: "Assets", color: "#FF9A3D" },
];

const LINE = "#4CC9FF";
const GREEN = "#5BF5A0";
const RevealCtx = createContext(true);
export const useRevealed = () => useContext(RevealCtx);
export const WhenRevealed = ({ children }) => (useRevealed() ? children : null);

const hash = (str) => [...String(str)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export const CursorIcon = ({ color, name }) => (
  <>
    <svg width="18" height="20" viewBox="0 0 18 20" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
      <path d="M2 1.5 L2 16 L6 12.4 L8.7 18.6 L11.2 17.5 L8.5 11.4 L14 11.2 Z" fill={color} stroke="#fff" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
    <span className="absolute left-4 top-4 whitespace-nowrap rounded px-1.5 py-[1px] font-mono text-[9px] font-semibold leading-tight text-black" style={{ background: color }}>
      {name}
    </span>
  </>
);

export const AgentCursor = ({ agent, from = { x: 90, y: -70 }, delay = 0, style, wander = true }) => (
  <motion.div
    className="absolute z-30"
    style={style}
    initial={{ x: from.x, y: from.y, opacity: 0, scale: 0.6 }}
    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <motion.div
      animate={wander ? { x: [0, 9, -5, 0], y: [0, -6, 7, 0] } : undefined}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
    >
      <CursorIcon color={agent.color} name={agent.name} />
    </motion.div>
  </motion.div>
);

// Cursor that visits the corners of the sub-boxes one after another.
const PathCursor = ({ agent, points, dur, offset }) => {
  const pts = points.length > 1 ? [...points.slice(offset % points.length), ...points.slice(0, offset % points.length)] : [...points, ...points];
  return (
    <motion.div
      className="absolute left-0 top-0 z-30"
      initial={{ x: pts[0].x + 140, y: pts[0].y - 110, opacity: 0 }}
      animate={{ x: pts.map((p) => p.x), y: pts.map((p) => p.y), opacity: 1 }}
      transition={{ duration: dur, ease: "easeInOut", opacity: { duration: 0.2 } }}
    >
      <CursorIcon color={agent.color} name={agent.name} />
    </motion.div>
  );
};

const Handle = ({ style, delay, size = 8 }) => (
  <motion.span
    className="absolute block bg-white"
    style={{ width: size, height: size, border: `1.5px solid ${LINE}`, ...style }}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 520, damping: 18, delay }}
  />
);

const Dim = ({ w, h }) => {
  const [v, setV] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const c = animate(0, 1, { duration: 0.4, ease: "easeOut", onUpdate: (t) => setV({ w: Math.round(w * t), h: Math.round(h * t) }) });
    return () => c.stop();
  }, [w, h]);
  return <>{v.w} × {v.h}</>;
};

// Measure the layer's real sub-elements (outermost matching ones, skipping near-full-size wrappers).
const FRAG_SEL = "h1,h2,h3,h4,p,img,button,a,li,svg,input,textarea,label,dt,dd";
const collect = (root, origin, W, H) => {
  const chosen = [];
  const out = [];
  root.querySelectorAll(FRAG_SEL).forEach((n) => {
    if (chosen.some((c) => c.contains(n))) return;
    const r = n.getBoundingClientRect();
    if (r.width < 28 || r.height < 14) return;
    if (r.width * r.height > W * H * 0.85) return; // let its children be the pieces instead
    chosen.push(n);
    out.push({ x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height });
  });
  return out.sort((a, b) => b.w * b.h - a.w * a.h).slice(0, 14).sort((a, b) => a.y - b.y || a.x - b.x);
};

const Fragment = ({ f, i, n, build, seed }) => {
  const h = hash(seed + i);
  const jx = ((h % 7) - 3) * 30;
  const jy = (((h >> 3) % 7) - 3) * 24;
  const d = 0.04 + (i / Math.max(1, n)) * build * 0.5;
  const corners = [{ left: -3, top: -3 }, { right: -3, top: -3 }, { left: -3, bottom: -3 }, { right: -3, bottom: -3 }];
  return (
    <motion.div
      className="absolute"
      style={{ left: f.x, top: f.y, width: f.w, height: f.h, border: `1px solid ${LINE}`, background: "rgba(76,201,255,0.11)" }}
      initial={{ x: jx, y: jy, scale: 0.65, opacity: 0 }}
      animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      transition={{ delay: d, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
    >
      {f.w > 44 && corners.map((s, k) => <Handle key={k} style={s} size={6} delay={d + 0.12 + k * 0.02} />)}
      {f.w > 84 && f.h > 22 && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[2px] px-1 font-mono text-[8px] font-semibold text-[#04121a]" style={{ background: LINE }}>
          {Math.round(f.w)} × {Math.round(f.h)}
        </span>
      )}
    </motion.div>
  );
};

const Frame = ({ name, w, h, frags, build }) => {
  const big = w > 260 && h > 90;
  const hs = [
    { left: -4, top: -4 }, { right: -4, top: -4 }, { left: -4, bottom: -4 }, { right: -4, bottom: -4 },
    ...(big ? [{ left: "calc(50% - 4px)", top: -4 }, { left: "calc(50% - 4px)", bottom: -4 }, { left: -4, top: "calc(50% - 4px)" }, { right: -4, top: "calc(50% - 4px)" }] : []),
  ];
  const points = frags.length ? frags.map((f) => ({ x: f.x + f.w - 4, y: f.y + f.h - 2 })) : [{ x: w * 0.7, y: h * 0.6 }, { x: w * 0.3, y: h * 0.3 }];
  const h0 = hash(name);
  const cursors = [AGENTS[h0 % 5], AGENTS[(h0 + 2) % 5], AGENTS[(h0 + 3) % 5]].slice(0, w * h > 90000 ? 3 : 2);
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.35 } }}
      transition={{ duration: 0.15 }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ borderColor: LINE }}
        exit={{ borderColor: GREEN, boxShadow: "0 0 44px rgba(91,245,160,0.55)", transition: { duration: 0.12 } }}
        style={{ border: `1px solid ${LINE}`, background: "rgba(143,163,199,0.1)", boxShadow: "0 0 34px rgba(76,201,255,0.2), inset 0 0 40px rgba(76,201,255,0.06)" }}
      />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(76,201,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(76,201,255,.2) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
      {/* two scan lines racing down */}
      {[0, 0.22].map((dl) => (
        <motion.div key={dl} className="absolute inset-x-0 h-8" style={{ background: "linear-gradient(180deg, transparent, rgba(76,201,255,.4), transparent)" }}
          initial={{ top: "-12%" }} animate={{ top: "100%" }} transition={{ duration: build * 0.8, ease: "easeInOut", delay: dl }} />
      ))}
      {frags.map((f, i) => <Fragment key={i} f={f} i={i} n={frags.length} build={build} seed={name} />)}
      {hs.map((s, i) => <Handle key={i} style={s} delay={0.03 + i * 0.025} />)}
      {h > 56 && (
        <span className="absolute left-2 top-2 max-w-[80%] truncate font-mono text-[10px] font-semibold uppercase tracking-wider" style={{ color: LINE }}>{name}</span>
      )}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 whitespace-nowrap rounded-[3px] px-1.5 py-[1px] font-mono text-[10px] font-semibold text-[#04121a]" style={{ background: LINE }}>
        <Dim w={w} h={h} />
      </span>
      {cursors.map((a, i) => <PathCursor key={a.name} agent={a} points={points} dur={build * 1.15} offset={i * 3} />)}
    </motion.div>
  );
};

let uid = 0;
export default function Blueprint({ children, name = "Frame", delay = 0, build = 0.9, layers, className = "" }) {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const reduce = useReducedMotion();
  const ready = useBuildReady();
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [phase, setPhase] = useState(reduce ? "done" : "idle"); // idle -> draft -> done
  const [geo, setGeo] = useState({ w: 0, h: 0, frags: [] });
  const weight = useRef(1);
  const finished = useRef(false);
  const alive = useRef(true);
  const started = useRef(false);
  const id = useRef(++uid);
  const D = delay * TEMPO;
  const B = build * TEMPO;

  // Register this layer with the HUD (weight = roughly how many nodes it contains).
  useEffect(() => {
    const el = ref.current;
    weight.current = layers ?? Math.max(1, Math.min(14, Math.round(el.querySelectorAll("*").length / 6)));
    buildStore.add(weight.current);
    if (reduce) { finished.current = true; buildStore.complete(weight.current); }
    alive.current = true;
    return () => { alive.current = false; buildStore.removeTarget(id.current); buildStore.remove(weight.current, finished.current); };
  }, [layers, reduce]);

  useEffect(() => {
    if (reduce || !inView || !ready || started.current) return;
    started.current = true;
    const el = ref.current;
    const W = el.offsetWidth, H = el.offsetHeight;
    const origin = innerRef.current.getBoundingClientRect();
    setGeo({ w: W, h: H, frags: collect(el, origin, W, H) });
    // Timers live outside the effect cleanup on purpose: the phase change below must not cancel them.
    setTimeout(() => {
      if (!alive.current) return;
      const r = el.getBoundingClientRect();
      buildStore.addTarget(id.current, { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height });
      setPhase("draft");
    }, D * 1000);
    setTimeout(() => {
      if (!alive.current) return;
      buildStore.removeTarget(id.current);
      setPhase("done");
      finished.current = true;
      buildStore.complete(weight.current);
    }, (D + B) * 1000);
  }, [inView, ready, reduce, D, B]);

  const revealed = phase === "done";
  return (
    <div ref={ref} className={`relative ${className}`}>
      <RevealCtx.Provider value={revealed}>
        <motion.div
          ref={innerRef}
          className="h-full"
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
          animate={revealed ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.985 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </RevealCtx.Provider>
      <AnimatePresence>
        {phase === "draft" && <Frame key="frame" name={name} w={geo.w} h={geo.h} frags={geo.frags} build={B} />}
      </AnimatePresence>
    </div>
  );
}
