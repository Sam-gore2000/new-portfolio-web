import React from "react";
import { motion } from "motion/react";
import Tilt from "react-parallax-tilt";
import { SkillsInfo } from "../../constants";
import SectionTitle from "../ui/SectionTitle";
import useSpotlight from "../ui/useSpotlight";

const accents = ["from-violet/30", "from-cyan/25", "from-pink/25"];

const Skills = () => {
  const spot = useSpotlight();
  const all = SkillsInfo.flatMap((c) => c.skills);

  return (
    <section id="skills" className="relative px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title="My Tech Skills"
          sub="A collection of my technical skills and expertise honed through various projects and experiences"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {SkillsInfo.map((category, ci) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: ci * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} perspective={1200} scale={1.01} className="h-full">
                <div
                  onMouseMove={spot}
                  className="group glass glow-border relative h-full overflow-hidden rounded-3xl p-6 sm:p-8"
                >
                  <div className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${accents[ci % 3]} to-transparent blur-3xl`} />
                  <div className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative mb-6 flex items-baseline justify-between">
                    <h3 className="font-display text-2xl font-semibold text-white">{category.title}</h3>
                    <span className="text-sm text-mist">{category.skills.length} skills</span>
                  </div>
                  <ul className="relative grid grid-cols-2 gap-3">
                    {category.skills.map((skill, i) => (
                      <motion.li
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.7 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 260, damping: 18 }}
                        whileHover={{ y: -4, scale: 1.05 }}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 transition-colors hover:border-cyan/60 hover:bg-cyan/10"
                      >
                        <img src={skill.logo} alt="" style={{ animationDelay: `${(i * 0.37) % 2.4}s` }} className="h-7 w-7 animate-bob object-contain" loading="lazy" />
                        <span className="text-sm text-white/90">{skill.name}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>

        {/* Logo conveyor: two rows moving in opposite directions */}
        <div className="mt-16 space-y-4 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" aria-hidden="true">
          {[false, true].map((rev) => (
            <div key={String(rev)} className={`flex w-max gap-4 ${rev ? "animate-marquee-rev" : "animate-marquee"}`}>
              {[...all, ...all].map((s, i) => (
                <div key={i} className="flex items-center gap-3 rounded-full glass px-5 py-3">
                  <img src={s.logo} alt="" className="h-6 w-6 object-contain" loading="lazy" />
                  <span className="whitespace-nowrap text-sm text-white/80">{s.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
