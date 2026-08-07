import { useEffect, useRef, useState } from "react";

export default function IntroLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const mobile = window.innerWidth < 768;
    const duration = mobile ? 900 : 2050;
    const hold = mobile ? 200 : 320;
    const fade = mobile ? 600 : 900;
    const start = performance.now();
    let raf = 0;
    let timers = [];

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        timers.push(
          setTimeout(() => setFading(true), hold),
          setTimeout(() => onDoneRef.current(), hold + fade)
        );
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={`intro ${fading ? "is-out" : ""}`} aria-hidden="true">
      <div className="intro-glow" />

      <div className="intro-m-wrap">
        <svg className="intro-m" viewBox="0 0 200 200" fill="none">
          <line className="m-line m-line-1" pathLength="1" x1="38" y1="44" x2="38" y2="156" />
          <line className="m-line m-line-2" pathLength="1" x1="38" y1="44" x2="100" y2="148" />
          <line className="m-line m-line-3" pathLength="1" x1="100" y1="148" x2="162" y2="44" />
          <line className="m-line m-line-4" pathLength="1" x1="162" y1="44" x2="162" y2="156" />
        </svg>

        <h1 className="intro-word">MUERHIIS</h1>
        <p className="intro-caption mono">VISUAL DESIGN · POST-PRODUCTION</p>
      </div>

      <div className="intro-progress">
        <div className="intro-bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <div className="intro-meta mono">
          <span>LOADING</span>
          <strong>{String(progress).padStart(3, "0")}%</strong>
        </div>
      </div>
    </div>
  );
}
