// Small helper so Navbar/Footer can use Lenis smooth scroll with a native fallback.
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};
export const scrollToTop = () => {
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
};
