import HeroCanvas from "./HeroCanvas";
import { ArrowUpRight, ChevronDown } from "./Icons";
import { stats } from "../data";

const letters = "MAZHENGYANG".split("");

export default function Hero({ ready = false }) {
  return (
    <section id="top" className={`hero ${ready ? "is-ready" : ""}`}>
      <HeroCanvas />
      <div className="hero-veil" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker mono hero-fade">
            PORTFOLIO <i /> VISUAL DESIGN <i /> POST-PRODUCTION
          </p>

          <h1 className="hero-name" aria-label="MAZHENGYANG">
            {letters.map((ch, i) => (
              <span key={i}>{ch}</span>
            ))}
          </h1>

          <div className="hero-name-line" aria-hidden="true" />

          <div className="hero-subrow hero-fade">
            <span className="hero-sub-name">马正阳</span>
            <i className="hero-sub-sep" aria-hidden="true" />
            <span className="hero-sub-title">后期制作（动效包装）· 视觉设计</span>
          </div>

          <p className="hero-desc hero-fade">
            把好故事做成好影像
            <br />
            从分镜、生成到合成，让每一次交付都成为可以传播的作品。
          </p>

          <div className="hero-cta hero-fade">
            <a className="btn btn-primary" href="#contact">
              联系我 <ArrowUpRight />
            </a>
            <a className="btn btn-ghost btn-comet" href="#allworks">
              查看作品
            </a>
          </div>

          <div className="hero-stats hero-fade">
            {stats.map((s, i) => (
              <div className="hero-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
                {i < stats.length - 1 && <i className="hero-stat-line" />}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-side mono" aria-hidden="true">
          <span>HANGZHOU/SHANGHAI, CN</span>
          <span>30.28°N · 120.15°E</span>
          <span>EST. 2005</span>
        </div>
      </div>

      <a className="hero-scroll mono" href="#about">
        SCROLL <ChevronDown />
      </a>
    </section>
  );
}
