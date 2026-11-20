import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate } from "motion/react";
import { useBuild } from "../../lib/buildStore";
import { AGENTS } from "./Blueprint";

// Floating status bar: "10 agents · 34 / 108 layers · Building".
// The numbers are real - every Blueprint on the page is one or more layers.
export default function AgentHUD() {
  const { ready, total, done } = useBuild();
  const complete = total > 0 && done >= total;
  const [shown, setShown] = useState(0);
  const last = useRef(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const c = animate(last.current, done, { duration: 0.6, ease: "easeOut", onUpdate: (v) => setShown(Math.round(v)) });
    last.current = done;
    return () => c.stop();
  }, [done]);

  // Fade the bar out a few seconds after the whole page is built.
  useEffect(() => {
    if (!complete) { setGone(false); return; }
    const t = setTimeout(() => setGone(true), 4000);
    return () => clearTimeout(t);
  }, [complete]);

  const pct = total ? Math.min(100, (done / total) * 100) : 0;

  return (
    <AnimatePresence>
      {ready && !gone && (
        <motion.div
          key="hud"
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22, delay: 0.4 }}
          className="pointer-events-none fixed inset-x-0 bottom-3 z-[55] flex justify-center px-3 sm:bottom-4"
          role="status"
          aria-live="off"
        >
          <div className="flex max-w-full items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0a0918]/85 px-3.5 py-2.5 font-mono text-[11px] text-white/85 shadow-[0_10px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(76,201,255,0.12)] backdrop-blur-xl sm:gap-4 sm:px-4 sm:text-xs">
            <span className="flex items-center gap-2">
              <span className="flex -space-x-1.5">
                {AGENTS.map((a, i) => (
                  <motion.span
                    key={a.name}
                    className="block h-3 w-3 rounded-full ring-2 ring-[#0a0918]"
                    style={{ background: a.color }}
                    animate={complete ? { scale: 1 } : { scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.2, repeat: complete ? 0 : Infinity, delay: i * 0.18 }}
                  />
                ))}
              </span>
              <span className="whitespace-nowrap"><span className="hidden min-[420px]:inline">10 agents</span><span className="min-[420px]:hidden">10</span></span>
            </span>
            <span className="h-4 w-px bg-white/15" />
            <span className="whitespace-nowrap tabular-nums">
              <span className="text-white">{shown}</span> <span className="text-white/40">/ {total} layers</span>
            </span>
            <span className="hidden h-1 w-20 overflow-hidden rounded-full bg-white/10 sm:block">
              <motion.span className="block h-full rounded-full bg-gradient-to-r from-violet via-cyan to-pink" animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
            </span>
            <span className={`flex items-center gap-1.5 rounded-lg px-2 py-1 font-semibold ${complete ? "bg-[#5BF5A0]/15 text-[#5BF5A0]" : "bg-cyan/15 text-cyan"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${complete ? "bg-[#5BF5A0]" : "bg-cyan animate-pulse"}`} />
              {complete ? "Live" : "Building"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
