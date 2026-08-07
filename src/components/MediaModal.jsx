import { useEffect } from "react";
import { getVideoSrc } from "../lib/video";

export default function MediaModal({ work, onClose }) {
  const src = work.video ? getVideoSrc(work) : null;

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

  return (
    <div className="video-modal" onClick={onClose} role="dialog" aria-modal="true">
      <div className="video-modal-inner" onClick={(e) => e.stopPropagation()}>
        {work.video ? (
          <video
            src={src}
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
