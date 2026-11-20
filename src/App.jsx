import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "motion/react";
import Lenis from "lenis";
import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";
import Skills from "./components/Skills/Skills";
import Experience from "./components/Experience/Experience";
import Work from "./components/Work/Work";
import Education from "./components/Education/Education";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Preloader from "./components/ui/Preloader";
import Cursor from "./components/ui/Cursor";
import ScrollProgress from "./components/ui/ScrollProgress";
import Background from "./components/ui/Background";
import Marquee from "./components/ui/Marquee";
import AgentHUD from "./components/ui/AgentHUD";
import AgentSwarm from "./components/ui/AgentSwarm";
import { buildStore } from "./lib/buildStore";

const App = () => {
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);

  // Smooth inertial scrolling (skipped when the visitor prefers reduced motion).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); delete window.__lenis; };
  }, []);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    // The page only starts "building itself" once the preloader curtain is lifting.
    buildStore.setReady(!loading);
  }, [loading]);

  return (
    <div className="grain relative text-white">
      <AnimatePresence>{loading && <Preloader key="pre" onDone={done} />}</AnimatePresence>
      <Cursor />
      <ScrollProgress />
     
      <AgentSwarm />
      <Background />
      <Navbar />
      <main className="overflow-x-clip">
        <About />
        <Marquee words={["Fullstack Developer", "React JS", "Node JS", "MongoDB", "PHP & MySQL", "WordPress"]} speed={38} />
        <Skills />
        <Experience />
        <Marquee words={["Animated Websites", "SaaS Platforms", "REST APIs", "Real-time Apps", "Dashboards"]} speed={38} reverse />
        <Work />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;
