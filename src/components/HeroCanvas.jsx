import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let w = 0;
    let h = 0;
    let parts = [];
    let gridCv = null;
    let vignetteCv = null;
    let t = 0;
    let inView = true;
    let docVisible = !document.hidden;
    let running = true;
    const mouse = { x: 0.5, y: 0.5 };
    const target = { x: 0.5, y: 0.5 };

    const ribbons = [
      { y: 0.56, amp: 0.1, speed: 0.00032, phase: 0, color: "125,230,216", alpha: 0.11, width: 340 },
      { y: 0.4, amp: 0.13, speed: 0.00022, phase: 2.2, color: "106,155,255", alpha: 0.075, width: 460 },
      { y: 0.74, amp: 0.07, speed: 0.00042, phase: 4.1, color: "125,230,216", alpha: 0.05, width: 240 },
    ];

    const makeStaticLayer = (draw) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const cv = document.createElement("canvas");
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      const c = cv.getContext("2d");
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(c);
      return cv;
    };

    const buildGrid = () =>
      makeStaticLayer((c) => {
        const horizon = h * 0.66;
        const vp = { x: w / 2, y: horizon };
        c.strokeStyle = "rgba(125,230,216,0.09)";
        c.lineWidth = 1;
        for (let i = -16; i <= 16; i++) {
          c.beginPath();
          c.moveTo(vp.x, vp.y);
          c.lineTo(w / 2 + i * (w / 30), h + 60);
          c.stroke();
        }
        for (let j = 1; j <= 16; j++) {
          const p = Math.pow(j / 16, 2.1);
          const y = horizon + (h - horizon) * p;
          c.beginPath();
          c.moveTo(0, y);
          c.lineTo(w, y);
          c.stroke();
        }
        const fade = c.createLinearGradient(0, horizon - 60, 0, horizon + 40);
        fade.addColorStop(0, "rgba(8,8,14,0)");
        fade.addColorStop(1, "rgba(8,8,14,0.92)");
        c.fillStyle = fade;
        c.fillRect(0, horizon - 60, w, 100);
      });

    const buildVignette = () =>
      makeStaticLayer((c) => {
        const v = c.createRadialGradient(
          w / 2,
          h * 0.42,
          Math.min(w, h) * 0.35,
          w / 2,
          h * 0.5,
          Math.max(w, h) * 0.85
        );
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(0,0,0,0.5)");
        c.fillStyle = v;
        c.fillRect(0, 0, w, h);
      });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gridCv = buildGrid();
      vignetteCv = buildVignette();
      parts = Array.from({ length: 80 }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: 0.4 + Math.random() * 1.4,
        vy: -(0.00002 + Math.random() * 0.00009),
        vx: (Math.random() - 0.5) * 0.00006,
        tw: Math.random() * Math.PI * 2,
        tws: 0.2 + Math.random() * 0.9,
      }));
    };

    const onMouse = (e) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };

    const syncRun = () => {
      const next = inView && docVisible;
      if (next === running) return;
      running = next;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      docVisible = !document.hidden;
      syncRun();
    };

    const draw = () => {
      if (!running) return;
      raf = requestAnimationFrame(draw);
      t++;
      target.x += (mouse.x - target.x) * 0.025;
      target.y += (mouse.y - target.y) * 0.025;
      const ox = (target.x - 0.5) * w * 0.05;
      const oy = (target.y - 0.5) * h * 0.05;

      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#08080e");
      bg.addColorStop(0.55, "#0a0c14");
      bg.addColorStop(1, "#060608");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        { x: 0.2, y: 0.28, r: 0.46, c: "125,230,216", a: 0.05 },
        { x: 0.84, y: 0.6, r: 0.52, c: "106,155,255", a: 0.042 },
        { x: 0.5, y: 0.95, r: 0.42, c: "125,230,216", a: 0.028 },
      ];
      blobs.forEach((b, i) => {
        const bx = b.x * w + (i % 2 ? ox : -ox);
        const by = b.y * h + (i % 2 ? -oy : oy);
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r * Math.max(w, h));
        g.addColorStop(0, `rgba(${b.c},${b.a})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      ribbons.forEach((r) => {
        const yBase = r.y * h + Math.sin(t * r.speed * 55) * h * 0.018;
        ctx.beginPath();
        const steps = 64;
        for (let i = 0; i <= steps; i++) {
          const x = (i / steps) * w * 1.4 - w * 0.2;
          const y = yBase + Math.sin((x / w) * 3.4 + r.phase + t * r.speed * 14) * r.amp * h;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        for (let i = steps; i >= 0; i--) {
          const x = (i / steps) * w * 1.4 - w * 0.2;
          const y =
            yBase +
            r.width * 0.42 +
            Math.sin((x / w) * 3.4 + r.phase + t * r.speed * 14 + 1.4) * r.amp * h * 0.65;
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        const g = ctx.createLinearGradient(0, yBase - r.width * 0.4, 0, yBase + r.width * 0.4);
        g.addColorStop(0, `rgba(${r.color},0)`);
        g.addColorStop(0.5, `rgba(${r.color},${r.alpha})`);
        g.addColorStop(1, `rgba(${r.color},0)`);
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = g;
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      });

      if (gridCv) ctx.drawImage(gridCv, 0, 0, w, h);

      parts.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.tw += p.tws * 0.016;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        const a = 0.14 + 0.5 * Math.abs(Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214,238,238,${a})`;
        ctx.fill();
      });

      if (vignetteCv) ctx.drawImage(vignetteCv, 0, 0, w, h);
    };

    resize();
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncRun();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    running = true;
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
