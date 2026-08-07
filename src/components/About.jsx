import Reveal from "./Reveal";
import { Mail, Phone, Chat, MapPin, ArrowUpRight } from "./Icons";
import { profile } from "../data";
import BorderGlow from "./BorderGlow";

const contacts = [
  { icon: Mail, label: "EMAIL", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "TEL", value: profile.phone, href: `tel:${profile.phone}` },
  { icon: Chat, label: "WECHAT", value: profile.wechat, href: null },
  { icon: MapPin, label: "BASE", value: profile.city, href: null },
];

export default function About() {
  const facts = [
    { value: "3600W+", label: "单条视频累计播放量" },
    { value: "800W+", label: "单条视频24H峰值播放量" },
    { value: "5 家", label: "头部金融客户" },
    { value: "10+", label: "品牌成片交付" },
    { value: "多段", label: "一线公司实习" },
    { value: "2/52", label: "专业排名" },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <header className="sec-head">
            <div>
              <p className="kicker mono">01 / ABOUT</p>
              <h2>
                个人介绍<span className="head-dot">.</span>
              </h2>
            </div>
            <p className="sec-head-note">
              你好，我是 MUERHIIS。
              <br />
              用技术与审美，把好故事做成好影像。
            </p>
          </header>
        </Reveal>

        <div className="about-grid">
          <div className="about-left">
            <Reveal>
              <h3 className="about-name">
                {profile.name}
                <span className="mono about-en">MUERHIIS · WEB</span>
              </h3>
              <p className="about-title">{profile.title}</p>
              {profile.bio.map((p, i) => (
                <p className="about-bio" key={i}>
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal delay={100}>
              <div className="contact-list">
                {contacts.map((c) => {
                  const Wrapper = c.href ? "a" : "div";
                  return (
                    <Wrapper
                      className="contact-item"
                      key={c.label}
                      {...(c.href ? { href: c.href } : {})}
                    >
                      <c.icon />
                      <span className="mono">{c.label}</span>
                      <strong>{c.value}</strong>
                      {c.href && <ArrowUpRight />}
                    </Wrapper>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={180}>
              <BorderGlow className="edu-card">
                <div className="edu-head">
                  <span className="mono">EDUCATION</span>
                  <span className="mono edu-period">{profile.education.period}</span>
                </div>
                <h4>
                  {profile.education.school} <i /> {profile.education.college}
                </h4>
                <p className="edu-major">{profile.education.major}</p>
                <div className="edu-meta mono">
                  <span>GPA {profile.education.gpa}</span>
                  <span>排名 {profile.education.rank}</span>
                  <span>{profile.education.role}</span>
                </div>
                <div className="edu-chips">
                  {profile.education.chips.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </div>
              </BorderGlow>
            </Reveal>
          </div>

          <div className="about-right">
            <Reveal>
              <p className="block-title mono">
                <i /> QUICK FACTS / 数据速览
              </p>
            </Reveal>

            <div className="facts-grid">
              {facts.map((f, i) => (
                <BorderGlow className="fact-item" key={f.label}>
                  <strong className="mono">{f.value}</strong>
                  <span>{f.label}</span>
                  {i % 2 === 0 && <i className="fact-line" />}
                </BorderGlow>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="about-note">
                <div className="about-note-text">
                  <p>正在寻找后期制作/视觉设计方向的秋招岗位。</p>
                  <p>
                    B站深度用户，对游戏（二游PV、平面设计、二创MAD）、科技（PC、相机）感兴趣，ACG线上线下爱好者。
                  </p>
                </div>
                <a className="about-cta mono" href="#contact">
                  GET IN TOUCH <ArrowUpRight />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
