function FilmArt() {
  return (
    <div className="art art-film">
      <div className="art-beam art-beam--a" />
      <div className="art-beam art-beam--b" />
      <div className="film-screen">
        <div className="film-screen-glow" />
        <span className="film-caption mono">AIGC · FILM / 001</span>
      </div>
      <div className="film-strip" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
      <span className="art-index mono">MZ/01</span>
    </div>
  );
}

function MoutaiArt() {
  return (
    <div className="art art-maotai">
      <div className="maotai-halo" />
      <div className="maotai-bottle">
        <i className="maotai-label" />
        <i className="maotai-shine" />
      </div>
      <div className="maotai-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span className="maotai-spark maotai-spark--1">+</span>
      <span className="maotai-spark maotai-spark--2">+</span>
      <span className="maotai-spark maotai-spark--3">·</span>
      <span className="art-index mono">MZ/02</span>
    </div>
  );
}

function VillageArt() {
  return (
    <div className="art art-village">
      <div className="village-moon" />
      <div className="village-star village-star--1" />
      <div className="village-star village-star--2" />
      <div className="village-star village-star--3" />
      <div className="village-hill village-hill--far" />
      <div className="village-hill village-hill--mid" />
      <div className="village-hill village-hill--near" />
      <div className="village-homes">
        {Array.from({ length: 14 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>
      <span className="art-index mono">MZ/03</span>
    </div>
  );
}

function ScrollArt() {
  return (
    <div className="art art-scroll">
      <div className="scroll-glow" />
      <div className="scroll-body">
        <i className="scroll-roller scroll-roller--top" />
        <i className="scroll-roller scroll-roller--bottom" />
        <div className="scroll-ink">
          <svg viewBox="0 0 120 180" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M22 34 C 40 18, 66 22, 78 30 C 96 42, 100 60, 88 72 C 76 84, 58 80, 48 90 C 34 104, 40 124, 62 128 C 84 132, 100 120, 98 104"
              fill="none"
              stroke="rgba(235,232,226,0.16)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M30 150 C 48 138, 78 142, 92 150"
              fill="none"
              stroke="rgba(235,232,226,0.1)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="scroll-seal" aria-hidden="true">
            胤秋
          </div>
        </div>
      </div>
      <span className="art-index mono">MZ/04</span>
    </div>
  );
}

export default function Art({ kind }) {
  switch (kind) {
    case "film":
      return <FilmArt />;
    case "maotai":
      return <MoutaiArt />;
    case "village":
      return <VillageArt />;
    case "scroll":
      return <ScrollArt />;
    default:
      return <FilmArt />;
  }
}
