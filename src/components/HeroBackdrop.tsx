// ---------------------------------------------------------------------------
// The field behind the hero: a dot grid and a sparse scatter of square nodes,
// a few of which breathe. Pure SVG and CSS, laid out in a 1440 x 900 space
// and cropped to cover the section.
// Kept to the margins of the layout so it never competes with the copy.
// ---------------------------------------------------------------------------

const NODES: [number, number][] = [
  [96, 132], //  0
  [272, 56], //  1
  [168, 336], //  2
  [56, 528], //  3
  [312, 640], //  4
  [128, 792], //  5
  [624, 40], //  6
  [776, 120], //  7
  [992, 64], //  8
  [1184, 32], //  9
  [1368, 128], // 10
  [1312, 344], // 11
  [1408, 536], // 12
  [1248, 712], // 13
  [1392, 840], // 14
  [1024, 864], // 15
  [728, 832], // 16
  [472, 872], // 17
];

/** Nodes that breathe. The rest sit still, so the field never feels busy. */
const LIVE = new Set([2, 7, 11, 13, 16]);

export default function HeroBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1" className="fill-paper" opacity="0.13" />
        </pattern>
      </defs>

      <rect width="1440" height="900" fill="url(#hero-grid)" />

      {NODES.map(([x, y], i) => (
        <g key={`node-${i}`}>
          {LIVE.has(i) ? (
            <rect
              x={x - 9}
              y={y - 9}
              width="18"
              height="18"
              className="hero-node-ring stroke-paper"
              strokeWidth="1"
              style={{ animationDelay: `${(i * 0.7) % 4}s` }}
            />
          ) : null}
          <rect
            x={x - 3}
            y={y - 3}
            width="6"
            height="6"
            className="fill-paper"
            opacity={LIVE.has(i) ? 0.85 : 0.4}
          />
        </g>
      ))}
    </svg>
  );
}
