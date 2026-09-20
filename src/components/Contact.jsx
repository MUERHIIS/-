import Reveal from "./Reveal";
import { ArrowUpRight, ArrowUp, Mail, Phone, Chat, MapPin } from "./Icons";
import { profile } from "../data";

const rows = [
  { icon: Mail, label: "EMAIL", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "TEL / WECHAT", value: `${profile.phone}（微信同号）`, href: `tel:${profile.phone}` },
  { icon: MapPin, label: "BASE", value: `${profile.city} · ${profile.availability}`, href: null },
];

export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="contact-bg" aria-hidden="true">
        LET'S TALK
      </div>

      <div className="container contact-inner">
        <Reveal>
          <p className="kicker mono">06 / CONTACT</p>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="contact-title">
            一起，
            <br />
            做出<span className="contact-accent">好内容</span>。
          </h2>
        </Reveal>

        <Reveal delay={220}>
          <p className="contact-sub">
            正在寻找后期制作 / AIGC / 视觉设计方向的实习与秋招机会，
            <br />
            期待与你的团队一起做出好内容。
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="contact-rows">
            {rows.map((r) => {
              const Wrapper = r.href ? "a" : "div";
              return (
                <Wrapper className="contact-row" key={r.label} {...(r.href ? { href: r.href } : {})}>
                  <span className="contact-row-icon">
                    <r.icon />
                  </span>
                  <span className="mono contact-row-label">{r.label}</span>
                  <strong>{r.value}</strong>
                  {r.href && <ArrowUpRight />}
                </Wrapper>
              );
            })}
          </div>
        </Reveal>

      </div>

      <footer className="contact-footer">
        <div className="container contact-footer-inner">
          <span>© 2026 {profile.name} · 视觉设计 / 后期制作</span>
          <span className="mono">BUILT WITH REACT + VITE</span>
          <a className="contact-top mono" href="#top">
            回到顶部 <ArrowUp />
          </a>
        </div>
        <div className="container contact-beian">
          <a
            className="beian-item"
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/works/icons/beian.png" alt="" aria-hidden="true" />
            <span>浙ICP备2026069374号-1</span>
          </a>
          <a
            className="beian-item"
            href="https://beian.mps.gov.cn/#/query/webSearch?code=33019202003279"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/works/icons/beian.png" alt="" aria-hidden="true" />
            <span>浙公网安备33019202003279号</span>
          </a>
        </div>
      </footer>
    </section>
  );
}
