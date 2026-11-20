import React, { useEffect, useState } from "react";
import { motion, animate } from "motion/react";
import { AGENTS, AgentCursor } from "./Blueprint";

const STEPS = ["Sketching the layout", "Setting the type", "Wiring up motion", "Mixing colour", "Placing the final layers"];
const LINE = "#4CC9FF";

// Intro: the name is "drawn" as a blueprint frame by a swarm of agents while the counter runs,
// then the curtain lifts and the page starts building itself.
export default function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, 100, {
      duration: 2.0,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setTimeout(onDone, 200),
    });
    return () => c.stop();
  }, [onDone]);

  const step = STEPS[Math.min(STEPS.length - 1, Math.floor(n / 20))];
  const corners = [{ left: -4, top: -4 }, { right: -4, top: -4 }, { left: -4, bottom: -4 }, { right: -4, bottom: -4 }];

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-void"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-violet/30 blur-[120px] animate-aurora" />
        <div className="absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora [animation-delay:-8s]" />
        <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_30%,transparent_100%)]" style={{ backgroundImage: "linear-gradient(rgba(76,201,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(76,201,255,.09) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
      </div>

      {/* The name inside a wireframe frame */}
      <div className="relative px-8 py-6 sm:px-12 sm:py-8">
        <motion.div
          className="absolute inset-0"
          style={{ border: `1px solid ${LINE}`, background: "rgba(143,163,199,0.1)", boxShadow: "0 0 40px rgba(76,201,255,0.18)" }}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {corners.map((s, i) => (
            <motion.span key={i} className="absolute block h-2 w-2 bg-white" style={{ border: `1.5px solid ${LINE}`, ...s }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 500, damping: 18 }} />
          ))}
        </motion.div>
        <motion.span
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-[3px] px-1.5 py-[1px] font-mono text-[10px] font-semibold text-[#04121a]"
          style={{ background: LINE }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        >
          {Math.round(n * 6.4)} × 96
        </motion.span>
        <div className="relative overflow-hidden">
          <motion.h1
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Samadhan <span className="text-gradient">Gore</span>
          </motion.h1>
        </div>
        <AgentCursor agent={AGENTS[0]} delay={0.5} from={{ x: -160, y: -90 }} style={{ left: "6%", top: "-6px" }} />
        <AgentCursor agent={AGENTS[1]} delay={0.7} from={{ x: 170, y: -70 }} style={{ right: "10%", top: "-14px" }} />
        <AgentCursor agent={AGENTS[3]} delay={0.9} from={{ x: 140, y: 110 }} style={{ right: "26%", bottom: "-6px" }} />
        <AgentCursor agent={AGENTS[2]} delay={1.1} from={{ x: -130, y: 100 }} style={{ left: "30%", bottom: "-10px" }} />
      </div>

      <p className="relative mt-10 font-mono text-xs text-mist">10 agents · {step}…</p>
      <div className="relative mt-4 h-px w-56 overflow-hidden bg-white/10 sm:w-72">
        <motion.div className="h-full bg-gradient-to-r from-violet via-cyan to-pink" style={{ width: `${n}%` }} />
      </div>
      <span className="relative mt-4 font-display text-xl text-white/80 tabular-nums">{n}%</span>
    </motion.div>
  );
}
