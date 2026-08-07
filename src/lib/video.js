export function getVideoSrc(work) {
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  const conn = navigator.connection;
  const slow =
    conn &&
    (conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "3g");
  return mobile || slow ? work.video.replace(".mp4", "-mobile.mp4") : work.video;
}
