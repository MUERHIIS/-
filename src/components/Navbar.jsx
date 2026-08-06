import { useEffect, useState } from "react";
import { ArrowUpRight } from "./Icons";

const links = [
  { id: "about", label: "关于" },
  { id: "allworks", label: "全部作品" },
  { id: "works", label: "精选" },
  { id: "experience", label: "实习经历" },
  { id: "strengths", label: "优势" },
  { id: "contact", label: "联系" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px" }
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="container nav-inner">
        <a className="nav-logo" href="#top">
          <span className="nav-logo-mark">MZ</span>
          <span className="nav-logo-text">
            马正阳
            <em className="mono">VISUAL DESIGN</em>
          </span>
        </a>

        <nav className={`nav-links mono ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? "is-active" : ""}
              onClick={() => setOpen(false)}
            >
              <i /> {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a className="btn btn-primary btn-sm" href="#contact">
            联系我 <ArrowUpRight />
          </a>
          <button
            className={`nav-burger ${open ? "is-open" : ""}`}
            aria-label="菜单"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>
    </header>
  );
}
