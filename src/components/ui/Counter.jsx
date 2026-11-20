import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useRevealed } from "./Blueprint";

export default function Counter({ to, decimals = 0, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const revealed = useRevealed();
  const inView = seen && revealed;
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, to, duration]);
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>;
}
