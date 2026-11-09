/*
 * Original, simple line illustrations for the design tiles. Decorative (aria-hidden):
 * each tile is captioned "Illustration — not a client project".
 * Lilac (#D0ADFF) and soft white strokes on the deep band.
 */
const common = {
  viewBox: "0 0 160 100",
  width: "100%",
  height: "100%",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
  focusable: "false",
};

function Pcb() {
  return (
    <svg {...common}>
      <rect x="20" y="14" width="120" height="72" rx="6" />
      <circle cx="30" cy="24" r="3" />
      <circle cx="130" cy="24" r="3" />
      <circle cx="30" cy="76" r="3" />
      <circle cx="130" cy="76" r="3" />
      <rect
        x="66"
        y="36"
        width="28"
        height="28"
        rx="2"
        className="text-accent"
        stroke="currentColor"
      />
      {[42, 50, 58].map((y) => (
        <g key={y}>
          <path d={`M66 ${y}H48V${y - 6}`} />
          <path d={`M94 ${y}H112V${y + 6}`} />
        </g>
      ))}
      <path d="M80 36V24H104" />
      <path d="M80 64V76H56" />
      <circle cx="48" cy="36" r="2" />
      <circle cx="48" cy="44" r="2" />
      <circle cx="48" cy="52" r="2" />
      <circle cx="112" cy="48" r="2" />
      <circle cx="112" cy="56" r="2" />
      <circle cx="112" cy="64" r="2" />
      <circle cx="104" cy="24" r="2" />
      <circle cx="56" cy="76" r="2" />
    </svg>
  );
}

function Cad() {
  return (
    <svg {...common}>
      {/* isometric box with a hidden-edge sketch line and a dimension */}
      <path d="M80 18L118 38V70L80 90L42 70V38Z" />
      <path d="M42 38L80 58L118 38" />
      <path d="M80 58V90" />
      <path d="M80 18V58" strokeDasharray="3 4" opacity="0.5" />
      <path d="M61 48L80 38L99 48L80 58Z" className="text-accent" />
      <path d="M128 38V70" />
      <path d="M125 38H131M125 70H131" />
      <circle cx="80" cy="18" r="2" />
    </svg>
  );
}

function Iot() {
  return (
    <svg {...common}>
      <rect x="64" y="40" width="32" height="40" rx="4" />
      <circle cx="80" cy="70" r="3" />
      <path d="M72 50H88" />
      <path d="M70 30a14 14 0 0 1 20 0" className="text-accent" />
      <path d="M64 24a22 22 0 0 1 32 0" className="text-accent" />
      <path d="M58 18a30 30 0 0 1 44 0" className="text-accent" />
      <circle cx="28" cy="34" r="6" />
      <circle cx="132" cy="34" r="6" />
      <circle cx="28" cy="78" r="6" />
      <circle cx="132" cy="78" r="6" />
      <path d="M34 36L64 52M126 36L96 52M34 76L64 68M126 76L96 68" strokeDasharray="2 4" />
    </svg>
  );
}

function Automation() {
  return (
    <svg {...common}>
      {/* simple two-joint arm on a base, with a gear */}
      <path d="M36 86H84" />
      <path d="M46 86V78H74V86" />
      <circle cx="60" cy="72" r="5" />
      <path d="M62 67L82 38" />
      <circle cx="84" cy="35" r="4" />
      <path d="M88 35H112" />
      <path d="M112 29V41M112 29L120 29M112 41L120 41" className="text-accent" />
      <g transform="translate(126 74)">
        <circle r="8" />
        <circle r="3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d="M0 -8V-12" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}

export const illustrations = { pcb: Pcb, cad: Cad, iot: Iot, automation: Automation };
