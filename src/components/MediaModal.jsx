import { useEffect, useRef } from "react";

export default function MediaModal({ work, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // 切到后台标签页时暂停视频，避免继续缓冲
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && videoRef.current) videoRef.current.pause();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="video-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
        {work.bilibili ? (
          <div className="bilibili-wrap">
            <iframe
              className="bilibili-frame"
              src={work.bilibili}
              title={work.title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : work.video ? (
          <video
            ref={videoRef}
            src={work.video}
            preload="metadata"
            controls
            autoPlay
            playsInline
            poster={work.image}
          />
        ) : (
          <img
            className="media-modal-img"
            src={work.image}
            alt={work.title}
          />
        )}
        <button
          className="video-modal-close mono"
          onClick={onClose}
          aria-label="关闭"
        >
          CLOSE ×
        </button>
        <div className="video-modal-meta">
          <h4>{work.title}</h4>
          <p>
            {work.subtitle} · {work.role}
          </p>
        </div>
      </div>
    </div>
  );
}
