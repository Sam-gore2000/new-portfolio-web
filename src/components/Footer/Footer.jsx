import React from "react";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { scrollToId, scrollToTop } from "../../lib/scroll";

const links = [
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Experience", id: "experience" },
  { name: "Projects", id: "work" },
  { name: "Education", id: "education" },
  { name: "Contact", id: "contact" },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/10 px-6 pb-8 pt-20 md:px-10">
    <p
      className="flex select-none justify-center whitespace-nowrap font-display text-[9.5vw] font-bold leading-none sm:text-[8.5vw]"
      aria-label="Samadhan"
    >
      {"SAMADHAN".split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          <span className="ghost-letter text-ghost" data-cursor>{ch}</span>
        </motion.span>
      ))}
    </p>

    <div className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center gap-6 text-center">
      <h2 className="font-display text-xl font-semibold text-white">Samadhan Gore</h2>
      <p className="text-mist">Phone: <a href="tel:+917768969620" className="font-semibold text-white hover:text-cyan">7768969620</a></p>

      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links.map((l) => (
          <button key={l.id} onClick={() => scrollToId(l.id)} className="text-sm text-mist transition hover:text-cyan">
            {l.name}
          </button>
        ))}
      </nav>

      <div className="flex gap-4 text-xl text-mist">
        <a href="https://github.com/Sam-gore2000/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-12 w-12 place-items-center rounded-full glass transition hover:text-cyan"><FaGithub /></a>
        <a href="https://www.linkedin.com/in/samadhan-gore-542ba4208/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-12 w-12 place-items-center rounded-full glass transition hover:text-cyan"><FaLinkedin /></a>
        <button onClick={scrollToTop} aria-label="Back to top" className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet to-pink text-white shadow-[0_0_24px_rgba(123,92,255,0.6)] transition hover:-translate-y-1"><FiArrowUp /></button>
      </div>

      <p className="text-sm text-mist/70">© {new Date().getFullYear()} Samadhan Gore. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
