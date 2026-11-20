import React from "react";
import { motion } from "motion/react";
import ReactTypingEffect from "react-typing-effect";
import Tilt from "react-parallax-tilt";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import CodeBackground from "../Hero/CodeBackground";
import Magnetic from "../ui/Magnetic";
import Counter from "../ui/Counter";
import Blueprint, { useRevealed, WhenRevealed } from "../ui/Blueprint";
import { scrollToId } from "../../lib/scroll";
import { projects, experiences } from "../../constants";
import profileImage from "../../assets/sam-img.webp";
import profile from "../../assets/profile.png";


const RESUME = "https://drive.google.com/file/d/16T6EhixffmDncD4VxfyGz3FG5NSmcZfd/view?usp=drive_link";
const GITHUB = "https://github.com/Sam-gore2000/";
const LINKEDIN = "https://www.linkedin.com/in/samadhan-gore-542ba4208/";

// Letters of the name rise one by one - the single orchestrated moment on load.
const Letters = ({ text, delay = 0 }) => {
  const revealed = useRevealed();
  return (
    <span className="inline-block overflow-hidden align-bottom">
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: "115%", rotate: 8 }}
          animate={revealed ? { y: 0, rotate: 0 } : {}}
          transition={{ delay: delay + i * 0.045, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
};

const stats = [
  { to: 3, suffix: "+", label: "Years of experience" },
  { to: projects.length, suffix: "", label: "Projects shipped" },
  { to: experiences.length, suffix: "", label: "Roles held" },
];

const chips = [
  { t: "React JS", c: "text-cyan", pos: "-left-4 top-10 sm:-left-10", d: 0 },
  { t: "Node JS", c: "text-pink", pos: "-right-2 top-24 sm:-right-8", d: 1.2 },
  { t: "MongoDB", c: "text-violet-soft", pos: "-left-2 bottom-24 sm:-left-12", d: 2.1 },
  { t: "ASP .NET CORE", c: "text-cyan", pos: "-right-2 bottom-10 sm:-right-6", d: 0.6 },
];

const About = () => {
  return (
    <section id="about" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Developer-themed animated background: code rain + drifting snippets */}
      <CodeBackground />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent md:via-void/40" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-32 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        {/* Left */}
        <div className="text-center md:text-left">
          <Blueprint name="Badge" delay={0} build={0.8} className="mx-auto mb-6 w-fit md:mx-0">
            <p className="inline-flex items-center gap-3 rounded-full glass px-4 py-2 text-sm text-mist">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-cyan animate-pulseRing" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-cyan" />
              </span>
              Open to Fullstack roles
            </p>
          </Blueprint>

          <Blueprint name="Heading / Name" delay={0.15} build={1.3} className="mx-auto w-fit md:mx-0">
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              <span className="block text-2xl font-medium text-mist sm:text-3xl"><Letters text="Hi, I am" delay={0.05} /></span>
              <span className="block"><Letters text="Samadhan" delay={0.2} /></span>
              <span className="block text-gradient"><Letters text="Gore" delay={0.6} /></span>
            </h1>
          </Blueprint>

          <Blueprint name="Role" delay={0.45} build={0.9} className="mx-auto mt-6 w-fit md:mx-0">
            <h3 className="min-h-[2.2rem] font-display text-lg font-medium text-white sm:text-2xl">
              I am a{" "}
              <span className="text-cyan">
                <WhenRevealed>
                  <ReactTypingEffect
                    text={["Fullstack Developer", "Front End Developer", "React Js Developer", "Web Developer", "Coder"]}
                    speed={100}
                    eraseSpeed={50}
                    typingDelay={300}
                    eraseDelay={2000}
                    cursorRenderer={(cursor) => <span className="text-pink">{cursor}</span>}
                  />
                </WhenRevealed>
              </span>
            </h3>
          </Blueprint>

          <Blueprint name="Text / Bio" delay={0.65} build={1} className="mx-auto mt-6 max-w-xl md:mx-0">
            <p className="text-base leading-relaxed text-mist sm:text-lg">
              I am a Full Stack Developer with 3 years of experience, specializing in building modern, scalable, and
              user-focused web applications. With strong expertise in HTML, CSS, JavaScript, React.js, Tailwind CSS, PHP,
              Bootstrap, MySQL, and WordPress, I deliver high-quality solutions that are responsive, cross-browser
              compatible, and performance-driven.
            </p>
          </Blueprint>

          <Blueprint name="Actions" delay={0.85} build={0.9} className="mx-auto mt-9 w-fit md:mx-0">
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Magnetic>
              <a
                href={RESUME}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block overflow-hidden rounded-full bg-gradient-to-r from-violet to-pink px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(123,92,255,0.6)]"
              >
                <span className="relative z-10">Download CV</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 hover:translate-x-full" />
              </a>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => scrollToId("work")}
                className="rounded-full glass px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                See my projects
              </button>
            </Magnetic>
            <div className="flex gap-3 text-xl text-mist">
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-12 w-12 place-items-center rounded-full glass transition hover:text-cyan"><FaGithub /></a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="grid h-12 w-12 place-items-center rounded-full glass transition hover:text-cyan"><FaLinkedin /></a>
            </div>
          </div>
          </Blueprint>

          <Blueprint name="Stats" delay={1.05} build={0.9} className="mt-12">
          <dl className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-bold text-white sm:text-4xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </dt>
                <dd className="mt-1 text-xs text-mist sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
          </Blueprint>
        </div>

        {/* Right: portrait */}
        <Blueprint name="Image / Portrait" delay={0.3} build={1.5} className="mx-auto w-full max-w-[22rem] sm:max-w-sm">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-violet via-cyan to-pink opacity-40 blur-3xl animate-spinSlow" />
          <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} perspective={1000} scale={1.03} glareEnable glareMaxOpacity={0.25} glareColor="#2de2e6" glarePosition="all" glareBorderRadius="2rem" gyroscope>
            <div className="relative overflow-hidden rounded-[2rem] p-[2px] bg-gradient-to-br from-violet via-cyan to-pink">
              <div className="relative overflow-hidden rounded-[calc(2rem-2px)] bg-ink">
                <img src={profile} alt="Samadhan Gore" width="900" height="1350" className="aspect-[4/5] w-full object-cover object-top" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void via-void/80 to-transparent p-5 pt-16">
                  <p className="font-display text-lg font-semibold text-white">Samadhan Gore</p>
                  <p className="text-sm text-cyan">Fullstack Developer</p>
                </div>
              </div>
            </div>
          </Tilt>
          {chips.map((c) => (
            <span
              key={c.t}
              style={{ animationDelay: `${c.d}s` }}
              className={`absolute ${c.pos} animate-float rounded-full glass px-4 py-2 text-xs font-semibold shadow-xl sm:text-sm ${c.c}`}
            >
              {c.t}
            </span>
          ))}
        </Blueprint>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="absolute bottom-6 right-10 hidden flex-col items-center gap-2 text-xs text-mist md:flex"
      >
        Scroll
        <span className="relative h-10 w-[22px] rounded-full border border-white/30">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-cyan"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
          />
        </span>
      </motion.div>
    </section>
  );
};

export default About;
