// 作品对应的软件图标（按分类 + 特殊作品映射）
export function getWorkIcons(w) {
  if (w.id === "vector-breakthrough") return ["blender", "ae", "ps"];
  if (w.id === "zhongmodi-ae") return ["ae", "blender"];
  if (w.category === "AE") return ["ae"];
  if (w.category === "平面设计") return ["ps"];
  if (w.category === "拍摄与剪辑") return ["pr"];
  return [];
}

export function iconSrc(key) {
  return `/works/icons/${key}.png`;
}
