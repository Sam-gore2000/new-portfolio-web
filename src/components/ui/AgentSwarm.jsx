import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { buildStore, useBuildReady } from "../../lib/buildStore";
import { AGENTS, CursorIcon } from "./Blueprint";

// 10 agent cursors that roam the whole screen, hopping between whichever layers are being drawn.
const SWARM = Array.from({ length: 10 }, (_, i) => ({ ...AGENTS[i % 5], key: i }));

export default function AgentSwarm() {
  const ready = useBuildReady();
  const [pos, setPos] = useState(SWARM.map(() => ({ x: -80, y: -80 })));
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tick = () => {
      const list = [...buildStore.targets.values()];
      setOn(list.length > 0);
      if (!list.length) return;
      const sy = window.scrollY, sx = window.scrollX;
      setPos(SWARM.map(() => {
        const t = list[Math.floor(Math.random() * list.length)];
        return {
          x: Math.max(0, Math.min(window.innerWidth - 24, t.x - sx + Math.random() * t.w)),
          y: Math.max(0, Math.min(window.innerHeight - 24, t.y - sy + Math.random() * t.h)),
        };
      }));
    };
    const iv = setInterval(tick, 380);
    return () => clearInterval(iv);
  }, [ready]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[54] overflow-hidden" aria-hidden="true">
      {SWARM.map((a, i) => (
        <motion.div
          key={a.key}
          className="absolute left-0 top-0"
          initial={{ x: -80, y: -80, opacity: 0 }}
          animate={{ x: pos[i].x, y: pos[i].y, opacity: on ? 1 : 0 }}
          transition={{ x: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, y: { duration: 0.42, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 } }}
        >
          <CursorIcon color={a.color} name={a.name} />
        </motion.div>
      ))}
    </div>
  );
}
