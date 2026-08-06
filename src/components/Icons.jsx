const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const ArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export const ArrowUp = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M12 19V5" />
    <path d="m5 12 7-7 7 7" />
  </svg>
);

export const ChevronDown = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Mail = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

export const Phone = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const Chat = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M21 12a8 8 0 0 1-8 8H4l2.3-2.9A8 8 0 1 1 21 12Z" />
  </svg>
);

export const MapPin = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const Spark = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    <circle cx="12" cy="12" r="2.4" />
  </svg>
);

export const Layers = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
    <path d="m3 17 9 5 9-5" opacity="0.45" />
  </svg>
);

export const Chart = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" />
  </svg>
);

export const Users = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 6" />
    <path d="M17.5 15.2A5 5 0 0 1 21 20" />
  </svg>
);

export const Eye = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...base} {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
