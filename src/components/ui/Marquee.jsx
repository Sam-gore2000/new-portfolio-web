import React, { useRef } from "react";
import { motion, useScroll, useVelocity, useSpring, useMotionValue, useAnimationFrame } from "motion/react";

// Kinetic text strip. Drifts at a calm, steady pace (px per second) and only
// speeds up slightly while the visitor is scrolling.
export default function Marquee({ words, speed = 40, reverse = false }) {
  const inner = useRef(null);
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const dir = reverse ? 1 : -1;

  useAnimationFrame((_, delta) => {
    const setW = inner.current ? inner.current.scrollWidth / 4 : 0; // 4 identical copies
    if (!setW) return;
    const boost = Math.min(Math.abs(velocity.get()) * 0.03, 70);
    let next = x.get() + dir * (speed + boost) * (Math.min(delta, 64) / 1000);
    if (next <= -setW) next += setW;
    if (next >= 0 && dir > 0) next -= setW;
    x.set(next);
  });

  const row = words.map((w, i) => (
    <span key={i} className="flex shrink-0 items-center gap-8 pr-8">
      <span className={`font-display text-4xl font-bold sm:text-6xl ${i % 2 ? "text-ghost" : "text-white"}`}>{w}</span>
      <span className="text-3xl text-cyan sm:text-5xl">✦</span>
    </span>
  ));

  return (
    <div className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-6" aria-hidden="true">
      <motion.div ref={inner} style={{ x }} className="flex w-max whitespace-nowrap">
        {row}{row}{row}{row}
      </motion.div>
    </div>
  );
}
