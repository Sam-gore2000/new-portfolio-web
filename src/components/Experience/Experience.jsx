import React from "react";
import { motion } from "motion/react";
import Tilt from "react-parallax-tilt";
import { experiences } from "../../constants";
import SectionTitle from "../ui/SectionTitle";
import TimelineLine from "../ui/TimelineLine";
import useSpotlight from "../ui/useSpotlight";
import { tidy } from "../../lib/text";

const Experience = () => {
  const spot = useSpotlight();
  return (
    <section id="experience" className="relative px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="Work Experience"
          sub="A collection of my work experience and the roles I have taken in various organizations"
        />

        <TimelineLine>
          {experiences.map((exp, i) => {
            const left = i % 2 === 0;
            const current = /present/i.test(exp.date);
            return (
              <div key={exp.id} className={`relative mb-14 flex pl-14 md:pl-0 ${left ? "md:justify-start" : "md:justify-end"}`}>
                {/* node on the line */}
                <div className="absolute left-5 top-6 z-10 -translate-x-1/2 md:left-1/2">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
                  className="relative"
                >
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border-2 border-cyan bg-white shadow-[0_0_26px_rgba(45,226,230,0.65)]">
                    <img src={exp.img} alt={exp.company} className="h-full w-full object-cover" />
                  </span>
                  {current && <span className="absolute inset-0 rounded-full border border-cyan animate-pulseRing" />}
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
                      <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{exp.role}</h3>
                      <p className="mt-1 text-cyan">{exp.company}</p>
                    </div>
                    {current && (
                      <span className="shrink-0 rounded-full bg-cyan/15 px-3 py-1 text-xs font-semibold text-cyan">Current</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-mist">{exp.date}</p>
                  <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">{tidy(exp.desc)}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {exp.skills.map((s, k) => (
                      <motion.li
                        key={k}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + k * 0.04 }}
                        className="rounded-full border border-violet/40 bg-violet/15 px-3 py-1 text-xs text-white/90"
                      >
                        {s.trim()}
                      </motion.li>
                    ))}
                  </ul>
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

export default Experience;
