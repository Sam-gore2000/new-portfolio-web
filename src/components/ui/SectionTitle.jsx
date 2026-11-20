import React from "react";
import { motion } from "motion/react";
import Blueprint, { useRevealed } from "./Blueprint";

// Headline whose words rise out of a mask once its blueprint layer has been built.
const Inner = ({ title, sub, align }) => {
  const inView = useRevealed();
  const words = title.split(" ");
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
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
};

export default function SectionTitle({ title, sub, align = "center" }) {
  return (
    <Blueprint name={`Heading / ${title}`} build={1} className={`mb-14 w-fit max-w-full ${align === "center" ? "mx-auto" : ""}`}>
      <Inner title={title} sub={sub} align={align} />
    </Blueprint>
  );
}
