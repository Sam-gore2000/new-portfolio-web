import React, { useMemo } from "react";
import { motion } from "motion/react";

const COLORS = ["#7b5cff", "#2de2e6", "#ff4f9a", "#ffffff"];

// Burst of confetti from the centre of its parent. Re-fires whenever `trigger` changes.
export default function Confetti({ trigger }) {
  const pieces = useMemo(
    () =>
      trigger
        ? Array.from({ length: 36 }, (_, i) => {
            const a = (Math.PI * 2 * i) / 36 + Math.random() * 0.4;
            const d = 90 + Math.random() * 150;
            return {
              id: i,
              x: Math.cos(a) * d,
              y: Math.sin(a) * d - 40,
              r: Math.random() * 540 - 270,
              c: COLORS[i % COLORS.length],
              w: 6 + Math.random() * 6,
              h: 4 + Math.random() * 8,
            };
          })
        : [],
    [trigger]
  );
  return (
    <div key={trigger} className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 120], opacity: [1, 1, 0], rotate: p.r, scale: [1, 1, 0.6] }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          style={{ background: p.c, width: p.w, height: p.h }}
          className="absolute rounded-[2px]"
        />
      ))}
    </div>
  );
}
