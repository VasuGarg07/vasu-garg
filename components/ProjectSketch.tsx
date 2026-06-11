const INK = "#23303a";
const RUST = "#b3552d";
const stroke = {
  fill: "none",
  stroke: INK,
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const rust = { ...stroke, stroke: RUST };
const thin = { ...stroke, strokeWidth: 1.6 };

function ChatSketch() {
  return (
    <svg viewBox="0 0 200 120" className="nb-sketch" role="img" aria-label="Sketch of an AI chat interface with a price chart">
      <g transform="rotate(-1 100 60)">
        <rect x="22" y="14" width="156" height="92" rx="8" {...stroke} />
        <path d="M22 32 Q100 34 178 32" {...thin} />
        <circle cx="34" cy="23" r="2.6" {...thin} />
        <circle cx="44" cy="23" r="2.6" {...thin} />
        <path d="M34 46 q22 -4 46 0 q3 1 3 6 q0 5 -4 6 q-21 3 -44 0 q-4 -1 -4 -6 q0 -5 3 -6 Z" {...rust} />
        <path d="M40 52 h32" {...thin} stroke={RUST} />
        <path d="M118 64 q20 -3 42 0 q4 1 4 6 q0 5 -4 6 q-20 3 -41 0 q-4 -1 -4 -6 q0 -5 3 -6 Z" {...stroke} />
        <path d="M124 70 h28" {...thin} />
        <path d="M36 78 v16 M32 84 h8 M52 84 v10 M48 88 h8 M68 74 v20 M64 80 h8" {...thin} />
        <path d="M84 92 q6 -10 14 -4" {...thin} stroke={RUST} strokeDasharray="3 4" />
      </g>
      <path d="M152 16 l6 -8 M160 18 l8 -5" {...thin} stroke={RUST} />
    </svg>
  );
}

function IdCardSketch() {
  return (
    <svg viewBox="0 0 200 120" className="nb-sketch" role="img" aria-label="Sketch of an ID card being verified with a stamp">
      <g transform="rotate(-2 95 62)">
        <rect x="26" y="28" width="120" height="70" rx="8" {...stroke} />
        <rect x="36" y="40" width="30" height="34" rx="4" {...thin} />
        <circle cx="51" cy="51" r="6" {...thin} />
        <path d="M41 70 q10 -10 20 0" {...thin} />
        <path d="M76 44 h56 M76 56 h44 M76 68 h52 M76 80 h30" {...thin} />
      </g>
      <g transform="rotate(8 154 44)">
        <circle cx="154" cy="44" r="24" {...rust} strokeDasharray="5 4" />
        <path d="M143 45 l8 8 l16 -18" {...rust} strokeWidth={3} />
      </g>
      <path d="M30 106 q10 4 22 1" {...thin} stroke={RUST} />
    </svg>
  );
}

function VaultSketch() {
  return (
    <svg viewBox="0 0 200 120" className="nb-sketch" role="img" aria-label="Sketch of an encrypted file with a padlock">
      <g transform="rotate(-1.5 86 62)">
        <path d="M40 22 h64 l18 18 v60 h-82 Z" {...stroke} />
        <path d="M104 22 v18 h18" {...thin} />
        <path d="M52 50 h28 M52 62 h22 M52 74 h26" {...thin} />
        <path d="M88 50 h22 M82 62 h28 M86 74 h20" {...thin} stroke={RUST} strokeDasharray="2 5" />
      </g>
      <g transform="rotate(4 150 78)">
        <rect x="132" y="68" width="38" height="30" rx="6" {...rust} />
        <path d="M139 68 v-8 q0 -13 12 -13 q12 0 12 13 v8" {...rust} />
        <circle cx="151" cy="81" r="3.4" {...rust} />
        <path d="M151 84 v7" {...rust} />
      </g>
      <path d="M120 36 l9 -7 M126 44 l10 -4" {...thin} stroke={RUST} />
    </svg>
  );
}

const SKETCHES: Record<string, () => React.ReactElement> = {
  chat: ChatSketch,
  idcard: IdCardSketch,
  vault: VaultSketch,
};

export default function ProjectSketch({ name }: { name: string }) {
  const Sketch = SKETCHES[name];
  return Sketch ? <Sketch /> : null;
}

export const hasSketch = (name?: string) => !!(name && SKETCHES[name]);