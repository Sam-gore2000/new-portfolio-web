import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

// Vertical line that draws itself as the timeline scrolls through the viewport.
export default function TimelineLine({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  return (
    <div ref={ref} className="relative">
      <div className="absolute bottom-0 left-5 top-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        style={{ scaleY }}
        className="absolute bottom-0 left-5 top-0 w-[3px] origin-top -translate-x-[1px] rounded-full bg-gradient-to-b from-violet via-cyan to-pink shadow-[0_0_18px_rgba(45,226,230,0.7)] md:left-1/2 md:-translate-x-1/2"
      />
      {children}
    </div>
  );
}
