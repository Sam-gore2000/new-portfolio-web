import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { scrollToId } from "../../lib/scroll";

const menuItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "education", label: "Education" },
];

const GITHUB = "https://github.com/Sam-gore2000/";
const LINKEDIN = "https://www.linkedin.com/in/samadhan-gore-542ba4208/";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const ids = [...menuItems.map((m) => m.id), "contact"];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const go = (id) => { setIsOpen(false); scrollToId(id); };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={`flex w-full max-w-5xl items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-[0_10px_40px_-10px_rgba(123,92,255,0.45)]" : "border border-transparent"
          }`}
        >
          <button onClick={() => go("about")} className="font-display text-sm font-semibold text-white sm:text-base" aria-label="Go to top">
            <span className="text-cyan">&lt;</span>Samadhan<span className="text-pink">/</span>Gore<span className="text-cyan">&gt;</span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => go(item.id)}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm transition-colors ${
                    active === item.id ? "text-white" : "text-mist hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-mist transition hover:text-cyan"><FaGithub size={20} /></a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-mist transition hover:text-cyan"><FaLinkedin size={20} /></a>
            <button
              onClick={() => go("contact")}
              className="rounded-full bg-gradient-to-r from-violet to-pink px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(123,92,255,0.55)] transition hover:scale-105"
            >
              Hire me
            </button>
          </div>

          <button className="text-2xl text-white md:hidden" onClick={() => setIsOpen((v) => !v)} aria-label="Toggle menu">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-void/95 backdrop-blur-xl md:hidden"
          >
            {[...menuItems, { id: "contact", label: "Contact" }].map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                onClick={() => go(item.id)}
                className="font-display text-3xl font-semibold text-white"
              >
                {item.label}
              </motion.button>
            ))}
            <div className="mt-4 flex gap-6 text-2xl text-mist">
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
