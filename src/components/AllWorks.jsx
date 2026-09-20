import { useEffect, useRef, useState } from "react";
import Art from "./Art";
import { ArrowUpRight } from "./Icons";
import { allWorks, workCategories } from "../data";
import MediaModal from "./MediaModal";
import { getWorkIcons, iconSrc } from "../lib/icons";
import { assetUrl, lqipUrl } from "../lib/assets";

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// 只有短片才在轨道中央自动播放，避免大文件在浏览时消耗流量
const AUTOPLAY_MAX_SECONDS = 60;
// 卡片在中央稳定停留多久后才开始播放（避免刚滑进区域就立刻播放）
const AUTOPLAY_DELAY_MS = 700;
// 需要多接近正中央才允许播放（0-1，越大越严格）
const AUTOPLAY_CENTER_FOCUS = 0.9;

const durationToSeconds = (d) => {
  if (!d) return Infinity;
  const parts = String(d).split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return Infinity;
  return parts.reduce((acc, v) => acc * 60 + v, 0);
};

export default function AllWorks() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const barRef = useRef(null);
  const counterRef = useRef(null);
  const smoothRef = useRef(0);
  const runningRef = useRef(false);
  const playingIdRef = useRef(null);
  const armRef = useRef({ idx: -1, since: 0 });
  const endedRef = useRef(null);
  const [cat, setCat] = useState("main");
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [muted, setMuted] = useState(true);
  const [stage, setStage] = useState(true);

  const catInfo = workCategories.find((c) => c.id === cat) || workCategories[0];
  const works = allWorks.filter((w) => catInfo.ids.includes(w.id));
  const N = works.length;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const sync = () => setStage(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 切到后台标签页时停止轨道视频，避免继续缓冲
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPlaying(null);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!stage || !N) return;
    const section = sectionRef.current;
    const stageEl = stageRef.current;
    const cards = Array.from(stageEl.querySelectorAll(".allworks-card"));
    if (!cards.length) return;

    smoothRef.current = 0;
    setCurrent(0);
    setPlaying(null);

    const DEG = Math.PI / 180;
    const TAU = Math.PI * 2;
    const tilt = -9 * DEG;
    let raf = 0;
    let lastIdx = -1;

    const update = () => {
      if (runningRef.current) raf = requestAnimationFrame(update);
      const sr = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (sr.bottom < -vh || sr.top > vh * 1.4) return;

      const total = sr.height - vh;
      const targetP = total > 0 ? Math.min(1, Math.max(0, -sr.top / total)) : 0;
      smoothRef.current += (targetP - smoothRef.current) * 0.12;
      const p = smoothRef.current;
      const idx = Math.min(N - 1, Math.floor(p * N));

      if (idx !== lastIdx) {
        lastIdx = idx;
        setCurrent(idx);
      }

      if (counterRef.current) {
        counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }

      const r = stageEl.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height * 0.47;
      const rx = Math.min(r.width * 0.36, 640);
      const ry = rx * 0.42;

      const aCur = (idx / N) * TAU + Math.PI / (2 * N) - p * TAU;
      const frontFocus = Math.pow(Math.max(0, Math.cos(aCur)), 2);

      const w = works[idx];
      const landscape = w.ratio && w.ratio.w / w.ratio.h >= 1.4;
      const short = durationToSeconds(w.duration) <= AUTOPLAY_MAX_SECONDS;
      const playable = (w.bilibili || w.video) && landscape && short;
      const atCenter = frontFocus > AUTOPLAY_CENTER_FOCUS;

      // 切到别的作品时，停掉上一件正在播放的
      if (playingIdRef.current && playingIdRef.current !== w.id) {
        playingIdRef.current = null;
        setPlaying(null);
      }

      if (playable && atCenter && endedRef.current !== w.id) {
        if (armRef.current.idx !== idx) {
          armRef.current = { idx, since: performance.now() };
        } else if (
          !playingIdRef.current &&
          performance.now() - armRef.current.since >= AUTOPLAY_DELAY_MS
        ) {
          playingIdRef.current = w.id;
          setMuted(true);
          setPlaying(w.id);
        }
      } else {
        armRef.current = { idx: -1, since: 0 };
        if (playingIdRef.current === w.id) {
          playingIdRef.current = null;
          setPlaying(null);
        }
        // 离开中央后解除“已播完”锁定，下次再滚到中央可以重新播放
        if (!atCenter && endedRef.current === w.id) endedRef.current = null;
      }

      cards.forEach((card, i) => {
        const a = (i / N) * TAU + Math.PI / (2 * N) - p * TAU;
        const focus = Math.pow(Math.max(0, Math.cos(a)), 2);
        let x = Math.cos(a) * rx;
        let y = Math.sin(a) * ry;
        const tx = x * Math.cos(tilt) - y * Math.sin(tilt);
        const ty = x * Math.sin(tilt) + y * Math.cos(tilt);
        const inward = 1 - 0.94 * focus;
        const px = cx + tx * inward;
        const py = cy + ty * inward;
        const scale = 0.3 + 0.7 * smoothstep(0.35, 0.85, focus);
        const opacity = 0.05 + 0.95 * smoothstep(0.15, 0.8, focus);
        const rotY = Math.sin(a) * 16;

        card.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)}) rotateY(${rotY.toFixed(1)}deg)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(10 + Math.round(focus * 90));
      });
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !runningRef.current) {
          runningRef.current = true;
          raf = requestAnimationFrame(update);
        } else if (!entry.isIntersecting && runningRef.current) {
          runningRef.current = false;
          cancelAnimationFrame(raf);
          // 离开视口立即停止播放，避免后台继续缓冲消耗流量
          setPlaying(null);
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(section);
    runningRef.current = true;
    raf = requestAnimationFrame(update);
    return () => {
      runningRef.current = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [stage, cat, N]);

  const switchCat = (id) => {
    if (id === cat) return;
    setCat(id);
    setPlaying(null);
    requestAnimationFrame(() => {
      document.getElementById("allworks")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleCardClick = (i, w) => {
    if (i === current) {
      setActive(w);
      return;
    }
    const section = sectionRef.current;
    if (!section) return;
    const total = section.getBoundingClientRect().height - window.innerHeight;
    const targetP = i / N + 1 / (4 * N);
    const y = section.getBoundingClientRect().top + window.scrollY + total * targetP;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="allworks"
      className="allworks"
      ref={sectionRef}
      style={{ height: `${N * 70}vh` }}
    >
      <div className="allworks-stage" ref={stageRef}>
        <span className="allworks-bgword" aria-hidden="true">
          ALL WORKS
        </span>

        <div className="allworks-head">
          <div>
            <p className="kicker mono">02 / ALL WORKS</p>
            <h2>
              全部作品<span className="head-dot">.</span>
            </h2>
            <p className="allworks-head-sub mono">{catInfo.label}</p>
          </div>
          <p className="allworks-hint mono">
            SCROLL TO EXPLORE <ArrowUpRight />
          </p>
        </div>

        <svg
          className="allworks-path"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <ellipse cx="50" cy="50" rx="49.5" ry="49.5" />
        </svg>
        <svg
          className="allworks-path allworks-path--inner"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <ellipse cx="50" cy="50" rx="49.5" ry="49.5" />
        </svg>

        <div className="allworks-ring">
          {works.map((w, i) => (
            <article
              className={`allworks-card ${i === current ? "is-active" : ""} ${
                w.video ? "allworks-card--video" : ""
              }`}
              key={w.id}
              onClick={() => handleCardClick(i, w)}
            >
              <div
                className="allworks-card-inner"
                style={{
                  width: `min(46vw, 720px, ${((w.ratio.w / w.ratio.h) * 72).toFixed(2)}svh)`,
                  aspectRatio: `${w.ratio.w} / ${w.ratio.h}`,
                  backgroundImage: `url(${lqipUrl(w.image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {playing === w.id && w.bilibili ? (
                  <iframe
                    className="allworks-card-frame"
                    src={`${w.bilibili}&autoplay=1`}
                    title={w.title}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : playing === w.id && w.video ? (
                  <video
                    className="allworks-card-video"
                    src={w.video}
                    poster={w.image}
                    preload="metadata"
                    autoPlay
                    muted={muted}
                    playsInline
                    onEnded={() => {
                      endedRef.current = w.id;
                      playingIdRef.current = null;
                      setPlaying(null);
                    }}
                  />
                ) : w.image ? (
                  <img
                    className="allworks-card-img"
                    src={assetUrl(w.image)}
                    alt={w.title}
                    loading="lazy"
                    decoding="async"
                    data-fallback={w.image}
                    onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                    onError={(e) => {
                      const t = e.currentTarget;
                      if (t.dataset.fallback && t.src !== t.dataset.fallback) {
                        t.src = t.dataset.fallback;
                      }
                    }}
                  />
                ) : (
                  <Art kind={w.art} />
                )}
                {(w.bilibili || w.video) && (
                  <>
                    {playing !== w.id && (
                      <span className="allworks-play" aria-hidden="true">
                        ▶
                      </span>
                    )}
                    {playing === w.id && w.video && (
                      <button
                        className="allworks-sound mono"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMuted(!muted);
                        }}
                      >
                        {muted ? "UNMUTE" : "MUTE"}
                      </button>
                    )}
                  </>
                )}
                <span className="allworks-card-index mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="allworks-desc">
          {works.map((w, i) => (
            <div
              className={`allworks-desc-item ${i === current ? "is-active" : ""}`}
              key={w.id}
            >
              <p className="mono allworks-desc-meta">
                {w.category} <i /> {w.role}
                {w.duration && (
                  <>
                    <i /> {w.duration}
                  </>
                )}
              </p>
              <h3>{w.title}</h3>
              <p className="allworks-desc-sub">{w.subtitle}</p>
              <div className="allworks-desc-tags mono">
                {w.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
                {getWorkIcons(w).map((ic) => (
                  <img
                    className="allworks-desc-icon"
                    key={ic}
                    src={iconSrc(ic)}
                    alt={ic}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="allworks-cats">
          {workCategories.map((c) => (
            <button
              key={c.id}
              className={`allworks-cat mono ${c.id === cat ? "is-active" : ""}`}
              onClick={() => switchCat(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="allworks-footer">
          <span className="mono allworks-counter" ref={counterRef}>
            01 / {String(N).padStart(2, "0")}
          </span>
          <div className="allworks-bar">
            <i ref={barRef} />
          </div>
          <span className="mono allworks-scrollhint">SCROLL</span>
        </div>

        <a className="allworks-more mono" href="#works">
          MORE WORKS <ArrowUpRight />
        </a>
      </div>

      <div className="allworks-list">
        <div className="container">
          <p className="kicker mono">02 / ALL WORKS</p>
          <h2 className="allworks-list-title">
            全部作品<span className="head-dot">.</span>
          </h2>
          <div className="allworks-cats">
            {workCategories.map((c) => (
              <button
                key={c.id}
                className={`allworks-cat mono ${c.id === cat ? "is-active" : ""}`}
                onClick={() => switchCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
          {works.map((w, i) => (
            <article
              className={`allworks-list-item ${
                w.video ? "allworks-list-item--video" : ""
              }`}
              key={w.id}
              onClick={() => setActive(w)}
            >
              <div className="allworks-list-media">
                {w.image ? (
                  <img
                    className="allworks-card-img"
                    src={assetUrl(w.image)}
                    alt={w.title}
                    loading="lazy"
                    decoding="async"
                    data-fallback={w.image}
                    onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                    onError={(e) => {
                      const t = e.currentTarget;
                      if (t.dataset.fallback && t.src !== t.dataset.fallback) {
                        t.src = t.dataset.fallback;
                      }
                    }}
                  />
                ) : (
                  <Art kind={w.art} />
                )}
                {(w.bilibili || w.video) && (
                  <span className="allworks-play" aria-hidden="true">
                    ▶
                  </span>
                )}
                <span className="mono allworks-list-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="allworks-list-info">
                <h3>{w.title}</h3>
                <p>{w.subtitle}</p>
                <div className="allworks-desc-tags mono">
                  {w.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                  {getWorkIcons(w).map((ic) => (
                    <img
                      className="allworks-desc-icon"
                      key={ic}
                      src={iconSrc(ic)}
                      alt={ic}
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {active && <MediaModal work={active} onClose={() => setActive(null)} />}
    </section>
  );
}
