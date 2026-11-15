import React, { useEffect, useRef } from "react";

const GLYPHS = "01{}[]()<>/=+;:$#&|!?*".split("");

// Floating code snippets that drift up and fade - the "developer at work" layer.
const snippets = [
  { t: "const dev = 'Samadhan';", x: "4%", y: "20%", d: 0, c: "text-cyan" },
  { t: "<App />", x: "34%", y: "10%", d: 2.5, c: "text-pink" },
  { t: "npm run dev", x: "46%", y: "78%", d: 4.2, c: "text-violet-soft" },
  { t: "app.listen(3000)", x: "58%", y: "16%", d: 1.2, c: "text-cyan" },
  { t: "useEffect(() => {}, [])", x: "70%", y: "86%", d: 5.8, c: "text-pink" },
  { t: "SELECT * FROM projects;", x: "6%", y: "70%", d: 3.3, c: "text-violet-soft" },
  { t: "git push origin main", x: "82%", y: "8%", d: 6.6, c: "text-cyan" },
  { t: "res.json({ ok: true })", x: "88%", y: "52%", d: 1.9, c: "text-pink" },
  { t: "docker compose up", x: "24%", y: "90%", d: 7.4, c: "text-violet-soft" },
  { t: "await fetch('/api')", x: "40%", y: "36%", d: 4.9, c: "text-cyan" },
];

export default function CodeBackground() {
  const wrap = useRef(null);
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const size = window.innerWidth < 768 ? 18 : 22; // column width
    let w = 0, h = 0, cols = 0, drops = [], speeds = [];
    const mouse = { x: -999, y: -999 };
    let visible = true, raf = 0, last = 0, acc = 0;

    const resize = () => {
      w = box.clientWidth; h = box.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / size);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
      speeds = Array.from({ length: cols }, () => 0.35 + Math.random() * 0.75);
      ctx.clearRect(0, 0, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const onMove = (e) => {
      const r = box.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(box);

    const step = () => {
      // fade previous frame to leave soft trails (canvas stays transparent)
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `${size - 6}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      for (let i = 0; i < cols; i++) {
        const x = i * size, y = drops[i] * size;
        const near = Math.hypot(x - mouse.x, y - mouse.y) < 140;
        const g = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        ctx.fillStyle = near ? "#ffffff" : i % 5 === 0 ? "#2de2e6" : i % 7 === 0 ? "#ff4f9a" : "#7b5cff";
        ctx.globalAlpha = near ? 1 : 0.85;
        ctx.fillText(g, x, y);
        drops[i] += speeds[i] * (near ? 0.4 : 1);
        if (y > h && Math.random() > 0.975) { drops[i] = Math.random() * -20; speeds[i] = 0.35 + Math.random() * 0.75; }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      raf = requestAnimationFrame(loop);
      if (!visible) { last = t; return; }
      acc += t - last; last = t;
      if (acc > 48) { step(); acc = 0; } // ~20fps looks right for code rain and stays light
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* soft colour wash */}
      <div className="absolute -right-[10%] top-[10%] h-[60vh] w-[60vh] rounded-full bg-violet/25 blur-[120px] animate-aurora" />
      <div className="absolute bottom-[0%] right-[25%] h-[45vh] w-[45vh] rounded-full bg-cyan/15 blur-[120px] animate-aurora [animation-delay:-10s]" />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full opacity-[0.38] [mask-image:linear-gradient(90deg,transparent_5%,#000_55%)] md:opacity-[0.5]" />
      {snippets.map((s, i) => (
        <span
          key={i}
          style={{ left: s.x, top: s.y, animationDelay: `${s.d}s`, ["--o"]: 0.5 }}
          className={`absolute whitespace-nowrap ${i > 5 ? "hidden md:block" : ""} animate-drift rounded-lg border border-white/10 bg-void/60 px-3 py-1.5 font-mono text-[11px] opacity-0 backdrop-blur-sm sm:text-xs ${s.c}`}
        >
          {s.t}
        </span>
      ))}
    </div>
  );
}
