import React, { useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";

// Fixed backdrop: colour blobs drift at different speeds as you scroll (parallax),
// and a soft spotlight follows the cursor across the whole page.
export default function Background() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 6000], [0, -500]);
  const y2 = useTransform(scrollY, [0, 6000], [0, 380]);
  const y3 = useTransform(scrollY, [0, 6000], [0, -260]);

  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const move = (e) => { mx.set(e.clientX - 300); my.set(e.clientY - 300); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void">
      <motion.div style={{ y: y1 }} className="absolute -left-[10vw] top-[5vh] h-[45vw] w-[45vw] rounded-full bg-violet/20 blur-[130px] animate-aurora" />
      <motion.div style={{ y: y2 }} className="absolute -right-[10vw] top-[40vh] h-[40vw] w-[40vw] rounded-full bg-cyan/10 blur-[130px] animate-aurora [animation-delay:-9s]" />
      <motion.div style={{ y: y3 }} className="absolute bottom-[-10vh] left-[25vw] h-[35vw] w-[35vw] rounded-full bg-pink/10 blur-[130px] animate-aurora [animation-delay:-15s]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,#000_30%,transparent_100%)]" />
      <motion.div
        style={{ x: sx, y: sy }}
        className="absolute left-0 top-0 hidden h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(123,92,255,0.22),rgba(45,226,230,0.07)_45%,transparent_70%)] md:block"
      />
    </div>
  );
}
