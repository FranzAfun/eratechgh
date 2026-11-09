import { useEffect, useRef } from "react";

/*
 * Our own "living" PCB (DESIGN-DIRECTION.md §3): a microcontroller, a sensor module and three LEDs
 * joined by traces. Light pulses run along some traces and light the LEDs when they arrive.
 * Decorative: aria-hidden. Animations pause off-screen (IntersectionObserver) and are off with
 * reduced motion (static board, LEDs softly lit). Pure SVG + CSS, no libraries.
 */

// Traces: [id, path]. Pulsed traces get a moving light; the rest are static copper.
const TRACES = [
  ["t1", "M208 176H150V96H96"],
  ["t2", "M208 200H120V150H64"],
  ["t3", "M208 248H132V312H84"],
  ["t4", "M208 272H160V360"],
  ["t5", "M312 168H380V104H424"], // MCU → sensor
  ["t6", "M312 192H404V136H448"], // MCU → sensor
  ["t7", "M312 240H392V292H430"], // MCU → LED 1
  ["t8", "M312 264H372V336H430"], // MCU → LED 2
  ["t9", "M312 288H352V380H430"], // MCU → LED 3
  ["t10", "M240 152V80H300V56"],
  ["t11", "M280 152V112H340"],
  ["t12", "M256 312V392H200"],
];
// Which traces carry pulses, and the LED each one lights (null = none).
const PULSES = [
  { trace: "t5", delay: 0, led: null },
  { trace: "t7", delay: 0.6, led: 0 },
  { trace: "t8", delay: 1.4, led: 1 },
  { trace: "t9", delay: 2.2, led: 2 },
  { trace: "t2", delay: 1.0, led: null },
  { trace: "t12", delay: 2.6, led: null },
];
const LEDS = [
  { x: 446, y: 292 },
  { x: 446, y: 336 },
  { x: 446, y: 380 },
];
const PIN_YS = [168, 176, 192, 200, 216, 232, 240, 248, 264, 272, 288];

export function LivingCircuit({ className = "" }) {
  const ref = useRef(null);

  // Pause every animation while the board is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      el.classList.toggle("is-paused", !entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 440"
      className={`living-circuit ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="lc-board" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#130726" />
          <stop offset="1" stopColor="#090311" />
        </linearGradient>
        <radialGradient id="lc-led-glow">
          <stop offset="0" stopColor="#D0ADFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#D0ADFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Board */}
      <rect
        x="24"
        y="24"
        width="472"
        height="392"
        rx="20"
        fill="url(#lc-board)"
        stroke="rgb(208 173 255 / 0.22)"
      />
      {[
        [48, 48],
        [472, 48],
        [48, 392],
        [472, 392],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="7"
          fill="none"
          stroke="rgb(208 173 255 / 0.35)"
        />
      ))}

      {/* Copper traces */}
      <g fill="none" stroke="rgb(208 173 255 / 0.28)" strokeWidth="2" strokeLinecap="round">
        {TRACES.map(([id, d]) => (
          <path key={id} id={`lc-${id}`} d={d} />
        ))}
      </g>
      {/* Vias at trace ends */}
      <g fill="#090311" stroke="rgb(208 173 255 / 0.5)" strokeWidth="2">
        {[
          [96, 96],
          [64, 150],
          [84, 312],
          [160, 360],
          [300, 56],
          [340, 112],
          [200, 392],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />
        ))}
      </g>

      {/* Light pulses */}
      <g fill="none" stroke="#D0ADFF" strokeWidth="3" strokeLinecap="round" className="lc-pulses">
        {PULSES.map(({ trace, delay }) => (
          <path
            key={trace}
            d={TRACES.find(([id]) => id === trace)[1]}
            pathLength="100"
            className="lc-pulse"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </g>

      {/* Microcontroller */}
      <g>
        <rect
          x="208"
          y="152"
          width="104"
          height="160"
          rx="8"
          fill="#1a0b33"
          stroke="rgb(208 173 255 / 0.55)"
        />
        {PIN_YS.map((y) => (
          <g key={y} fill="rgb(208 173 255 / 0.55)">
            <rect x="198" y={y - 3} width="10" height="6" rx="1" />
            <rect x="312" y={y - 3} width="10" height="6" rx="1" />
          </g>
        ))}
        <circle cx="226" cy="170" r="4" fill="rgb(208 173 255 / 0.6)" />
        <rect x="232" y="214" width="56" height="36" rx="4" fill="rgb(208 173 255 / 0.08)" />
        <path d="M240 232h40M240 240h28" stroke="rgb(208 173 255 / 0.4)" strokeWidth="3" />
      </g>

      {/* Sensor module */}
      <g>
        <rect
          x="424"
          y="80"
          width="56"
          height="72"
          rx="6"
          fill="#1a0b33"
          stroke="rgb(208 173 255 / 0.5)"
        />
        <circle cx="452" cy="108" r="14" fill="none" stroke="rgb(208 173 255 / 0.55)" />
        <circle cx="452" cy="108" r="6" fill="rgb(208 173 255 / 0.35)" />
        <path d="M436 140h32" stroke="rgb(208 173 255 / 0.35)" strokeWidth="3" />
      </g>

      {/* LEDs */}
      {LEDS.map(({ x, y }, i) => (
        <g key={y}>
          <circle
            cx={x}
            cy={y}
            r="22"
            fill="url(#lc-led-glow)"
            className={`lc-glow lc-glow-${i}`}
          />
          <circle
            cx={x}
            cy={y}
            r="8"
            fill="#2a1450"
            stroke="rgb(208 173 255 / 0.6)"
            strokeWidth="2"
          />
          <circle cx={x} cy={y} r="5" fill="#D0ADFF" className={`lc-led lc-led-${i}`} />
        </g>
      ))}

      {/* Resistor and capacitor for detail */}
      <g stroke="rgb(208 173 255 / 0.45)" strokeWidth="2" fill="none">
        <rect x="104" y="226" width="34" height="14" rx="3" />
        <path d="M84 233h20M138 233h20" />
        <rect x="372" y="44" width="12" height="28" rx="3" />
      </g>
    </svg>
  );
}
