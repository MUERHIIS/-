import { useState } from "react";
import Reveal from "./Reveal";
import Art from "./Art";
import { ArrowUpRight } from "./Icons";
import { works, allWorks } from "../data";
import MediaModal from "./MediaModal";
import BorderGlow from "./BorderGlow";
import { getWorkIcons, iconSrc } from "../lib/icons";

function WorkCard({ work, featured = false, onOpen }) {
  return (
    <article className={`work-card ${featured ? "work-card--featured" : ""}`}>
      <Reveal>
        <div
          className={`work-media ${onOpen ? "work-media--clickable" : ""}`}
          onClick={onOpen}
          role={onOpen ? "button" : undefined}
          tabIndex={onOpen ? 0 : undefined}
          onKeyDown={(e) => {
            if (onOpen && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onOpen();
            }
          }}
        >
          {work.image ? (
            <img
              className="work-img"
              src={work.image}
              alt={work.title}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Art kind={work.art} />
          )}
          {(work.bilibili || work.video) && (
            <span className="work-play" aria-hidden="true">
              ▶
            </span>
          )}
          <div className="work-shade" aria-hidden="true" />
          <div className="work-meta mono">
            <span>{work.index}</span>
            <span>{work.year}</span>
            <span>{work.role}</span>
          </div>
          <div className="work-arrow" aria-hidden="true">
            <ArrowUpRight />
          </div>
        </div>
        <div className="work-info">
          <div className="work-title">
            <h3>{work.title}</h3>
            <p>{work.subtitle}</p>
          </div>
          <p className="work-desc">{work.desc}</p>
          <div className="work-bottom">
            <div className="work-metrics mono">
              {work.metrics.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className="work-tags mono">
              {work.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
              {getWorkIcons(work).map((ic) => (
                <img
                  className="work-icon"
                  key={ic}
                  src={iconSrc(ic)}
                  alt={ic}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </article>
  );
}

export default function Works() {
  const [active, setActive] = useState(null);
  const [featured, ...rest] = works;
  return (
    <section id="works" className="section section--works">
      <div className="container">
        <Reveal>
          <header className="sec-head">
            <div>
              <p className="kicker mono">03 / FEATURED</p>
              <h2>
                精选项目<span className="head-dot">.</span>
              </h2>
            </div>
            <p className="sec-head-note">
              每一件作品，都从真实的生产环境里长出来
              <br />
              并经过数据与观众的检验。
            </p>
          </header>
        </Reveal>

        <WorkCard
          work={featured}
          featured
          onOpen={() => setActive(featured)}
        />

        <div className="works-grid">
          {rest.map((w, i) => (
            <WorkCard
              work={w}
              key={w.id}
              onOpen={() => setActive(w)}
            />
          ))}
          <Reveal className="works-more">
            <BorderGlow className="works-more-glow">
              <div className="works-more-inner">
                <span className="mono">MORE</span>
                <h3>
                  还有 {allWorks.length - works.length} 件
                  <br />
                  其他作品
                </h3>
                <p>从 AE 动效到平面设计、拍摄与剪辑，查看完整作品集。</p>
                <a className="btn btn-ghost btn-sm" href="#allworks">
                  查看全部作品 <ArrowUpRight />
                </a>
              </div>
            </BorderGlow>
          </Reveal>
        </div>
      </div>

      {active && <MediaModal work={active} onClose={() => setActive(null)} />}
    </section>
  );
}
