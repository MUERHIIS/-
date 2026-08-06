# 马正阳 · 个人作品集网站

暗色系、克制、有科技感的个人作品集。基于 **React + Vite** 构建，面向 PC 端展示，版心约 1700px。

## 本地运行

```bash
pnpm install
pnpm dev
```

浏览器打开 http://localhost:5173 即可预览。

## 目录结构

```
src/
  data.js            # 简历数据（经历 / 项目 / 技能，改内容优先改这里）
  components/
    IntroLoader.jsx  # 开场动画：线条汇聚成 M + 进度条 + MAZHENGYANG 字标
    Navbar.jsx       # 顶部导航 + 滚动进度
    Hero.jsx         # 全屏 Hero（动态背景）
    HeroCanvas.jsx   # 生成式动态背景（Canvas）
    About.jsx        # 个人介绍 / 联系方式 / 教育背景 / 数据速览
    AllWorks.jsx     # 全部作品：滚动驱动的场景切换（作品沿倾斜圆环路径运动）
    Works.jsx        # 精选项目大卡片
    Experience.jsx   # 实习经历时间线 / 项目经历
    Strengths.jsx    # 个人优势卡片
    Contact.jsx      # 整屏联系收尾页
    Art.jsx          # 作品占位视觉（代码绘制）
```

页面顺序：开场动画 → Hero → 个人介绍 → 全部作品（滚动切换）→ 精选项目 → 实习经历 → 个人优势 → 联系。

## 作品素材

真实作品素材位于 `public/works/`：

- `images/` —— 平面设计作品原图
- `posters/` —— 视频作品的封面帧
- `videos/` —— 视频作品（已压缩为网页播放版本，原始文件在 `D:\桌面\作品`）

作品顺序与介绍在 `src/data.js` 的 `allWorks`（全部作品，17 件）、`works`
（精选，5 件）与 `workCategories`（四类分组）中维护。新增作品时：把素材放入
`public/works/` 对应目录，在数组里追加一条记录（视频作品需提供 `image` 封面与
`video` 路径），并按分类把 `id` 加进 `workCategories` 对应分组。

全部作品板块参考 alche.studio 的 WORK 实现：所有作品预览随滚动沿倾斜椭圆路径
连续运动，当前作品从右下角进入画面中央放大聚焦，左下角同步切换描述；视频作品
滚动至中央最大窗口时自动静音播放（可点 UNMUTE 开启声音），点击封面也可全屏
播放。板块底部有四个分类按钮（主要作品 / 平面设计作品 / AE 作品 / 拍摄与剪辑
作品），点击即切换到对应分组。

预览交互：卡片保持作品原始画幅比例（不再裁切）；鼠标悬停时预览微微弹性放大；
点击当前作品（图片或视频）会打开全屏查看；点击轨道上排在后方的作品会平滑跳转
到该作品。移动端（< 900px）自动切换为普通纵向列表。

## 部署到 Cloudflare Pages

- 构建命令：`CI=true pnpm install && CI=true pnpm build`
- 输出目录：`dist`
- Node 版本：18 及以上（如 Cloudflare 报 Node 版本过低，在环境变量里设置
  `NODE_VERSION=20` 或 22）

注意：Cloudflare Pages 单文件上限为 25 MiB。`public/works/` 里的视频已按此限制
压缩，任何新增视频请控制在该范围内（或改用外部视频托管）。`public/_redirects`
已配置 SPA 回退，直接访问子路径也会正常渲染首页。

## 如何替换成真实素材

### 作品图
精选项目目前使用代码绘制的占位视觉。拿到真实截图后，把图片放入 `public/works/`，
在 `src/data.js` 的 `works` 数组里给对应项目加一行 `image: "/works/xxx.jpg"`，
`Works.jsx` 会自动优先渲染真实图片。

### Hero 视频背景
当前 Hero 使用 Canvas 生成式动画作为动态背景。若想换成真实视频，把视频放入
`public/hero.mp4` 并在 `HeroCanvas.jsx` 同级新建 `HeroVideo.jsx`（或直接修改
`Hero.jsx`），使用 `<video autoPlay muted loop playsInline>` 渲染。

## 设计说明

- 主色：近黑底 `#07070b` + 象牙白文字 + 克制的水青色点缀 `#7de6d8`
- 字体：中文使用系统字体栈，标签/数字使用等宽字体，营造工程感
- 动效：滚动渐显、Hero 鼠标视差、作品卡 hover 微动效
