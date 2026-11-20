import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Tilt from "react-parallax-tilt";
import { FiExternalLink, FiGithub, FiX, FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { projects } from "../../constants";
import SectionTitle from "../ui/SectionTitle";
import Blueprint from "../ui/Blueprint";
import { tidy } from "../../lib/text";

const has = (p, re) => p.tags.some((t) => re.test(t));
// Category filters are derived from each project's own tags.
const categorize = (p) => {
  const cats = [];
  if (has(p, /node|express/i) && has(p, /react/i)) cats.push("Full-stack");
  if (has(p, /react/i)) cats.push("React");
  if (has(p, /php|wordpress/i)) cats.push("PHP & WordPress");
  return cats;
};
const FILTERS = ["All", "Full-stack", "React", "PHP & WordPress"];
const valid = (url) => url && url !== "#";
const PER_PAGE = 6;
const EASE = [0.22, 1, 0.36, 1];

// Page transition: the whole grid slides out in the direction you are paging,
// then the new cards cascade in one by one with a slight 3D flip.
const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
  exit: (d) => ({ opacity: 0, x: d * -90, filter: "blur(6px)", transition: { duration: 0.35, ease: "easeIn" } }),
};
const cardV = {
  hidden: (d) => ({ opacity: 0, y: 60, x: d * 50, scale: 0.92, rotateX: 14 }),
  show: { opacity: 1, y: 0, x: 0, scale: 1, rotateX: 0, transition: { duration: 0.65, ease: EASE } },
};

const Work = () => {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [dir, setDir] = useState(1);
  const gridRef = useRef(null);

  const items = useMemo(() => projects.map((p) => ({ ...p, cats: categorize(p) })), []);
  const shown = filter === "All" ? items : items.filter((p) => p.cats.includes(filter));
  const totalPages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const pageItems = shown.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const from = shown.length ? (page - 1) * PER_PAGE + 1 : 0;
  const to = Math.min(page * PER_PAGE, shown.length);

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setDir(p > page ? 1 : -1);
    setPage(p);
    const el = gridRef.current;
    if (el) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -130, duration: 1.1 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const changeFilter = (f) => { setFilter(f); setPage(1); setDir(1); };

  // Modal: Esc to close + stop page scroll behind it.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="work" className="relative px-6 py-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionTitle
          title="My Projects"
          sub="A showcase of the projects I have worked on, highlighting my skills and experience in various technologies"
        />

        {/* Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${filter === f ? "text-white" : "text-mist hover:text-white"}`}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-violet to-pink shadow-[0_0_24px_rgba(123,92,255,0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>

        {/* Grid (paginated) */}
        <div ref={gridRef} className="scroll-mt-32">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`${filter}-${page}`}
              custom={dir}
              variants={gridV}
              initial="hidden"
              whileInView="show"
              exit="exit"
              viewport={{ once: true, amount: 0.08 }}
              style={{ perspective: 1200 }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((project, pi) => (
                <motion.div key={project.id} custom={dir} variants={cardV}>
                  <Blueprint name={`Project / ${project.title.trim()}`} delay={(pi % 3) * 0.14} build={1.15} className="h-full">
                  <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1100} scale={1.02} glareEnable glareMaxOpacity={0.12} glareColor="#2de2e6" glareBorderRadius="1.5rem" className="h-full">
                    <button
                      onClick={() => setSelected(project)}
                      data-cursor
                      className="group glass glow-border flex h-full w-full flex-col overflow-hidden rounded-3xl text-left"
                      onMouseMove={(e) => {
                        const r = e.currentTarget.getBoundingClientRect();
                        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                      }}
                    >
                      {/* Media: on hover the screenshot slowly pans top to bottom, like a screen recording */}
                      <div className="relative m-3 aspect-[16/10] overflow-hidden rounded-2xl bg-ink">
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          className="h-full w-full object-cover object-top transition-[object-position,transform] duration-[5s] ease-linear group-hover:object-bottom group-hover:scale-[1.04]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-40" />
                        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        {valid(project.webapp) && (
                          <span className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-void/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inset-0 rounded-full bg-pink animate-pulseRing" />
                              <span className="relative h-2 w-2 rounded-full bg-pink" />
                            </span>
                            LIVE
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-3 place-items-center rounded-full bg-white text-void opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <FiArrowUpRight size={20} />
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6 pt-3">
                        <h3 className="font-display text-base font-semibold leading-snug text-white sm:text-lg">{project.title.trim()}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mist">{tidy(project.description)}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {project.tags.slice(0, 5).map((t, k) => (
                            <li key={k} className="rounded-full border border-violet/40 bg-violet/15 px-2.5 py-1 text-[11px] text-white/90">{t.trim()}</li>
                          ))}
                          {project.tags.length > 5 && (
                            <li className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-mist">+{project.tags.length - 5}</li>
                          )}
                        </ul>
                      </div>
                    </button>
                  </Tilt>
                  </Blueprint>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.nav
            aria-label="Projects pagination"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-14 flex flex-col items-center gap-5"
          >
            <div className="flex items-center gap-2 rounded-full glass p-2">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className="grid h-11 w-11 place-items-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <FiChevronLeft size={20} />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => goTo(n)}
                  aria-label={`Page ${n}`}
                  aria-current={n === page ? "page" : undefined}
                  className={`relative grid h-11 w-11 place-items-center rounded-full font-display text-sm font-semibold transition-colors ${n === page ? "text-white" : "text-mist hover:text-white"}`}
                >
                  {n === page && (
                    <motion.span
                      layoutId="page-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-violet to-pink shadow-[0_0_24px_rgba(123,92,255,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                  <span className="relative z-10">{n}</span>
                </button>
              ))}

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className="grid h-11 w-11 place-items-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <FiChevronRight size={20} />
              </motion.button>
            </div>

            <p className="text-sm text-mist">
              Showing <span className="font-semibold text-white">{from}-{to}</span> of <span className="font-semibold text-white">{shown.length}</span> projects
            </p>
            <div className="h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet via-cyan to-pink"
                animate={{ width: `${(page / totalPages) * 100}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </motion.nav>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-void/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
          >
            <motion.div
              data-lenis-prevent
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85, y: 60, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              style={{ transformPerspective: 1200 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-ink shadow-[0_0_80px_rgba(123,92,255,0.35)]"
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close project"
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-void/70 text-white backdrop-blur transition hover:bg-pink"
              >
                <FiX size={20} />
              </button>
              <img src={selected.image} alt={selected.title} className="w-full object-cover" />
              <div className="p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{selected.title.trim()}</h3>
                <p className="mt-4 text-sm leading-relaxed text-mist sm:text-base">{tidy(selected.description)}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {selected.tags.map((t, k) => (
                    <li key={k} className="rounded-full border border-violet/40 bg-violet/15 px-3 py-1 text-xs text-white/90">{t.trim()}</li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  {valid(selected.github) && (
                    <a href={selected.github} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full glass px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                      <FiGithub /> View Code
                    </a>
                  )}
                  {valid(selected.webapp) && (
                    <a href={selected.webapp} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet to-pink px-6 py-3 font-semibold text-white shadow-[0_0_30px_rgba(123,92,255,0.5)] transition hover:scale-[1.03]">
                      <FiExternalLink /> View Live
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Work;
