import React from "react";
import { motion } from "motion/react";
import Tilt from "react-parallax-tilt";
import { education } from "../../constants";
import SectionTitle from "../ui/SectionTitle";
import TimelineLine from "../ui/TimelineLine";
import Counter from "../ui/Counter";
import useSpotlight from "../ui/useSpotlight";
import { tidy } from "../../lib/text";

// "7.75 CGPA" -> 77.5 %, "85%" -> 85 %
const parseGrade = (grade) => {
  const num = parseFloat(grade);
  const isCgpa = /cgpa/i.test(grade);
  return { value: num, pct: isCgpa ? num * 10 : num, label: isCgpa ? "CGPA" : "%" };
};

const GradeRing = ({ grade }) => {
  const { value, pct, label } = parseGrade(grade);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-24 w-24 shrink-0 place-items-center">
      <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7b5cff" />
            <stop offset="50%" stopColor="#2de2e6" />
            <stop offset="100%" stopColor="#ff4f9a" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <motion.circle
          cx="40" cy="40" r={r} fill="none" stroke="url(#ring)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c * (1 - pct / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="text-center leading-tight">
        <div className="font-display text-lg font-bold text-white">
          <Counter to={value} decimals={label === "CGPA" ? 2 : 0} duration={1.6} />
        </div>
        <div className="text-[10px] text-mist">{label}</div>
      </div>
    </div>
  );
};

const Education = () => {
  const spot = useSpotlight();
  return (
    <section id="education" className="relative px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="My Education"
          sub="My education has been a journey of self-discovery and growth. My educational details are as follows."
        />

        <TimelineLine>
          {education.map((edu, i) => {
            const left = i % 2 === 0;
            return (
              <div key={edu.id} className={`relative mb-14 flex pl-14 md:pl-0 ${left ? "md:justify-start" : "md:justify-end"}`}>
                <div className="absolute left-5 top-6 z-10 -translate-x-1/2 md:left-1/2">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                  className="relative"
                >
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border-2 border-pink bg-white shadow-[0_0_26px_rgba(255,79,154,0.6)]">
                    <img src={edu.img} alt={edu.school} className="h-full w-full object-cover" />
                  </span>
                </motion.div>
                </div>

                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1200} scale={1.015} className={`w-full md:w-[calc(50%-3.5rem)] ${left ? "md:mr-auto" : "md:ml-auto"}`}>
                <motion.article
                  initial={{ opacity: 0, x: left ? -80 : 80, rotateY: left ? 12 : -12 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  onMouseMove={spot}
                  style={{ transformPerspective: 1000 }}
                  className="glass glow-border h-full w-full rounded-3xl p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white sm:text-xl">{edu.degree}</h3>
                      <p className="mt-2 text-cyan">{edu.school}</p>
                      <p className="mt-1 text-sm text-mist">{edu.date}</p>
                    </div>
                    <GradeRing grade={edu.grade} />
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-white/75">{tidy(edu.desc)}</p>
                </motion.article>
                </Tilt>
              </div>
            );
          })}
        </TimelineLine>
      </div>
    </section>
  );
};

export default Education;
