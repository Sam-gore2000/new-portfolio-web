// Pass the returned handler to onMouseMove; it feeds --mx/--my for the glow effects in index.css.
export default function useSpotlight() {
  return (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
}
