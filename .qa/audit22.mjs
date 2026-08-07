import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("C:/Users/MZY/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1720, height: 1100 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(3600);

// AllWorks main: scroll zhongmodi to center -> iframe autoplay
await page.evaluate(() => document.getElementById("allworks").scrollIntoView());
await page.waitForTimeout(500);
await page.evaluate(() => {
  const s = document.querySelector(".allworks");
  const top = s.getBoundingClientRect().top + window.scrollY;
  const total = s.getBoundingClientRect().height - window.innerHeight;
  window.scrollTo(0, top + total * (0.25 / 3));
});
await page.waitForTimeout(2000);
const auto = await page.evaluate(() => {
  const card = document.querySelector(".allworks-card.is-active");
  const frame = card.querySelector("iframe");
  return {
    activeTitle: document.querySelector(".allworks-desc-item.is-active h3")?.textContent,
    hasIframe: !!frame,
    src: frame ? frame.getAttribute("src") : null,
    playBadgeHidden: !card.querySelector(".allworks-play"),
  };
});
console.log("AUTOPLAY-IFRAME:", JSON.stringify(auto));

// film category: portrait zglgj should NOT auto-embed
await page.evaluate(() => {
  const btns = [...document.querySelectorAll(".allworks-cat")];
  btns[3].click();
});
await page.waitForTimeout(1000);
await page.evaluate(() => {
  const s = document.querySelector(".allworks");
  const top = s.getBoundingClientRect().top + window.scrollY;
  const total = s.getBoundingClientRect().height - window.innerHeight;
  window.scrollTo(0, top + total * (0.25 / 5));
});
await page.waitForTimeout(1800);
const portrait = await page.evaluate(() => {
  const card = document.querySelector(".allworks-card.is-active");
  return {
    hasIframe: !!card.querySelector("iframe"),
    hasBadge: !!card.querySelector(".allworks-play"),
    imgPoster: !!card.querySelector(".allworks-card-img"),
  };
});
console.log("PORTRAIT-NO-AUTOPLAY:", JSON.stringify(portrait));

// Works modal: click featured 终末地 -> iframe modal
await page.evaluate(() => document.getElementById("works").scrollIntoView());
await page.waitForTimeout(800);
await page.evaluate(() => {
  const cards = [...document.querySelectorAll(".work-card")];
  cards[0].querySelector(".work-media").click();
});
await page.waitForTimeout(900);
const modal = await page.evaluate(() => {
  const f = document.querySelector(".video-modal iframe");
  return {
    open: !!document.querySelector(".video-modal"),
    iframeSrc: f ? f.getAttribute("src") : null,
  };
});
console.log("WORKS-MODAL:", JSON.stringify(modal));
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// mobile list click -> iframe modal
const mb = await browser.newPage({ viewport: { width: 390, height: 900 } });
await mb.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
await mb.waitForTimeout(2400);
await mb.evaluate(() => document.getElementById("allworks").scrollIntoView());
await mb.waitForTimeout(700);
await mb.evaluate(() => {
  const items = [...document.querySelectorAll(".allworks-list-item")];
  items[0].click();
});
await mb.waitForTimeout(1200);
const mModal = await mb.evaluate(() => {
  const f = document.querySelector(".video-modal iframe");
  return { src: f ? f.getAttribute("src") : null };
});
console.log("MOBILE-MODAL:", JSON.stringify(mModal));
console.log("ERRORS:", errors.length ? errors.join(" | ") : "none");
await browser.close();
