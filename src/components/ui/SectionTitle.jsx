import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

// Headline whose words rise out of a mask when scrolled into view.
// The scroll trigger watches the heading itself (not the masked words, which start clipped).
export default function SectionTitle({ title, sub, align = "center" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const words = title.split(" ");
  return (
    <div className={`mb-14 ${align === "center" ? "text-center" : "text-left"}`}>
      <h2 ref={ref} className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
        {words.map((w, i) => (
          <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom pb-1">
            <motion.span
              className={`inline-block ${i === words.length - 1 ? "text-gradient" : ""}`}
              initial={{ y: "110%", rotate: 4 }}
              animate={inView ? { y: 0, rotate: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`mt-5 h-[3px] w-28 rounded-full bg-gradient-to-r from-violet via-cyan to-pink shadow-[0_0_16px_rgba(45,226,230,0.6)] ${align === "center" ? "mx-auto origin-center" : "origin-left"}`}
      />
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className={`mt-5 max-w-2xl text-base text-mist sm:text-lg ${align === "center" ? "mx-auto" : ""}`}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
