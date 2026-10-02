/** Sprocket-style ring used as a quiet ornament behind icons and headings. */
export function GearRing({ teeth = 24, className }: { teeth?: number; className?: string }) {
  const outer = 48;
  const inner = 42;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = ((i + 0.35) / teeth) * Math.PI * 2;
    const a2 = ((i + 0.65) / teeth) * Math.PI * 2;
    const a3 = ((i + 1) / teeth) * Math.PI * 2;
    const p = (r: number, a: number) => `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
    pts.push(p(inner, a0), p(outer, a1), p(outer, a2), p(inner, a3));
  }
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <polygon points={pts.join(" ")} strokeWidth={1.2} strokeLinejoin="round" />
      <circle cx={50} cy={50} r={30} strokeWidth={1} strokeDasharray="2 3" />
      <circle cx={50} cy={50} r={8} strokeWidth={1.2} />
    </svg>
  );
}

/** Round computed coordinates so server and browser trig results serialise identically. */
const r2 = (n: number) => Math.round(n * 100) / 100;

/** Speedometer-style arc with tick marks; purely decorative. */
export function GaugeArc({ className, needle = 0.68 }: { className?: string; needle?: number }) {
  const ticks = Array.from({ length: 21 }, (_, i) => {
    const a = Math.PI * (1 - i / 20);
    const r1 = i % 5 === 0 ? 38 : 42;
    return {
      x1: r2(50 + r1 * Math.cos(a)),
      y1: r2(54 - r1 * Math.sin(a)),
      x2: r2(50 + 46 * Math.cos(a)),
      y2: r2(54 - 46 * Math.sin(a)),
      major: i % 5 === 0,
    };
  });
  const na = Math.PI * (1 - needle);
  return (
    <svg viewBox="0 0 100 60" className={className} fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4 54 A46 46 0 0 1 96 54" strokeWidth={0.8} opacity={0.5} />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={t.major ? 1.6 : 0.8} opacity={t.major ? 0.9 : 0.5} />
      ))}
      <line x1={50} y1={54} x2={r2(50 + 34 * Math.cos(na))} y2={r2(54 - 34 * Math.sin(na))} strokeWidth={1.8} stroke="var(--color-brand-bright)" />
      <circle cx={50} cy={54} r={3} fill="currentColor" stroke="none" />
    </svg>
  );
}
