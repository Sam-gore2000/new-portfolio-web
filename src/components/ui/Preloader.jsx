import React, { useEffect, useState } from "react";
import { motion, animate } from "motion/react";

// Intro sequence: counter + name reveal, then the curtain lifts.
export default function Preloader({ onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const c = animate(0, 100, {
      duration: 2.1,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setN(Math.round(v)),
      onComplete: () => setTimeout(onDone, 250),
    });
    return () => c.stop();
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-void"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-violet/30 blur-[120px] animate-aurora" />
        <div className="absolute -bottom-40 -right-40 h-[40rem] w-[40rem] rounded-full bg-cyan/20 blur-[120px] animate-aurora [animation-delay:-8s]" />
      </div>
      <div className="relative overflow-hidden">
        <motion.h1
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-display text-3xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Samadhan <span className="text-gradient">Gore</span>
        </motion.h1>
      </div>
      <p className="relative mt-3 text-sm text-mist">Loading portfolio</p>
      <div className="relative mt-10 h-px w-56 overflow-hidden bg-white/10 sm:w-72">
        <motion.div className="h-full bg-gradient-to-r from-violet via-cyan to-pink" style={{ width: `${n}%` }} />
      </div>
      <span className="relative mt-4 font-display text-xl text-white/80 tabular-nums">{n}%</span>
    </motion.div>
  );
}
