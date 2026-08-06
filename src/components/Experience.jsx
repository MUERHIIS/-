import Reveal from "./Reveal";
import { ArrowUpRight } from "./Icons";
import { internships, experiences } from "../data";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <Reveal>
          <header className="sec-head">
            <div>
              <p className="kicker mono">04 / EXPERIENCE</p>
              <h2>
                实习经历<span className="head-dot">.</span>
              </h2>
            </div>
            <p className="sec-head-note">
              多段实习经历，从传统广电到头部 MCN 公司；
              <br />
              多个合作项目，每一次都完整走完从想法到成片。
            </p>
          </header>
        </Reveal>

        <Reveal>
          <p className="block-title mono">
            <i /> 实习经历 / INTERNSHIP
          </p>
        </Reveal>

        <div className="timeline">
          {internships.map((item, i) => (
            <Reveal as="article" className="timeline-item" key={item.company} delay={i * 90}>
              <div className="timeline-rail" aria-hidden="true">
                <i />
              </div>
              <div className="timeline-head">
                <div>
                  <h4>{item.company}</h4>
                  <p>
                    {item.role}
                    <span className="mono timeline-period">{item.period}</span>
                  </p>
                </div>
                <span className="timeline-metric mono">{item.metric}</span>
              </div>
              <ul className="timeline-points">
                {item.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="block-title mono">
            <i /> 项目经历 / PROJECTS
          </p>
        </Reveal>

        <div className="exp-list">
          {experiences.map((p, i) => (
            <Reveal as="article" className="exp-item" key={p.title} delay={i * 80}>
              <span className="exp-index mono">0{i + 1}</span>
              <div className="exp-body">
                <div className="exp-title">
                  <h4>{p.title}</h4>
                  <span className="exp-tag">{p.tag}</span>
                </div>
                <p className="exp-desc">{p.desc}</p>
                <div className="exp-tools mono">
                  {p.tools.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
              <a className="exp-more" href="#works" aria-label={`查看${p.title}`}>
                <ArrowUpRight />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
