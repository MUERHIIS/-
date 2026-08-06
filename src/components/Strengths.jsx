import Reveal from "./Reveal";
import { Spark, Layers, Chart, Users, Eye } from "./Icons";
import { strengths, awards } from "../data";
import BorderGlow from "./BorderGlow";

const iconMap = {
  spark: Spark,
  layers: Layers,
  chart: Chart,
  users: Users,
  eye: Eye,
};

export default function Strengths() {
  return (
    <section id="strengths" className="section">
      <div className="container">
        <Reveal>
          <header className="sec-head">
            <div>
              <p className="kicker mono">05 / EDGE</p>
              <h2>
                个人优势<span className="head-dot">.</span>
              </h2>
            </div>
            <p className="sec-head-note">
              不只是会“做”，更懂“为什么这样做”
              <br />
              五组能力，覆盖从创意到交付的完整链路。
            </p>
          </header>
        </Reveal>

        <div className="strength-grid">
          {strengths.map((s, i) => {
            const Icon = iconMap[s.icon] || Spark;
            return (
              <Reveal
                as="article"
                className={`strength-slot ${s.size === "lg" ? "strength-slot--lg" : ""}`}
                key={s.title}
                delay={(i % 3) * 80}
              >
                <BorderGlow
                  className={`strength-card ${
                    s.size === "lg" ? "strength-card--lg" : ""
                  }`}
                >
                  <div className="strength-top">
                    <span className="strength-icon">
                      <Icon />
                    </span>
                    <span className="strength-index mono">/{s.index}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p className="strength-desc">{s.desc}</p>
                  <div className="strength-tools mono">
                    {s.tools.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <i className="strength-hairline" aria-hidden="true" />
                </BorderGlow>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <BorderGlow className="awards-strip">
            <span className="mono awards-label">HONORS</span>
            <div className="awards-list">
              {awards.map((a, i) => (
                <span key={a}>
                  {a}
                  {i < awards.length - 1 && <i />}
                </span>
              ))}
            </div>
          </BorderGlow>
        </Reveal>
      </div>
    </section>
  );
}
