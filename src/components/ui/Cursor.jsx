import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

// Custom cursor: small dot + trailing ring that grows over links/buttons.
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [big, setBig] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 220, damping: 22, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.body.classList.add("has-cursor");
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e) => setBig(!!e.target.closest("a, button, input, textarea, [data-cursor]"));
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[95] h-2 w-2 rounded-full bg-cyan"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[95] rounded-full border border-violet-soft/70 mix-blend-screen"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: big ? 64 : 34, height: big ? 64 : 34, backgroundColor: big ? "rgba(123,92,255,0.18)" : "rgba(123,92,255,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
    </>
  );
}
