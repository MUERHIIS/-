// 图片 CDN 配置：留空表示使用本站资源；
// 若想加速大陆访问，可填国内可达的 CDN 前缀，例如：
//   jsDelivr（需公开 GitHub 仓库）："https://cdn.jsdelivr.net/gh/MUERHIIS/portfolio@main/public/works"
//   腾讯云 COS / 阿里云 OSS + CDN（需备案）："https://cdn.example.com/works"
const CDN_BASE = "";

export function assetUrl(p) {
  return CDN_BASE ? `${CDN_BASE}${p}` : p;
}

export function lqipUrl(p) {
  return p
    .replace("/works/opt/", "/works/lqip/")
    .replace(/\.webp$/, "-lqip.webp");
}
