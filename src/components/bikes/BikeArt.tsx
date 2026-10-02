import type { ReactNode } from "react";
import type { BikeClass } from "@/lib/types";

/**
 * Original side-view line drawings, one per body style. Used for brands and models so the
 * site never shows a photo of the wrong bike. They are deliberately generic: a "street"
 * drawing stands for the type of motorcycle, not a specific model.
 *
 * Coordinates: 480 × 270 viewBox, ground line at y = 248, bike faces right.
 */

const ACCENT = "var(--bike-accent, #f26b21)";

/** Round computed coordinates so server and browser trig results serialise identically. */
const r2 = (n: number) => Math.round(n * 100) / 100;

function Wheel({
  cx,
  cy,
  r,
  disc = false,
  knobby = false,
}: {
  cx: number;
  cy: number;
  r: number;
  disc?: boolean;
  knobby?: boolean;
}) {
  const rim = r - 10;
  const spokes = [0, 72, 144, 216, 288].map((deg) => {
    const a = (deg * Math.PI) / 180;
    return {
      x1: r2(cx + Math.cos(a) * 8),
      y1: r2(cy + Math.sin(a) * 8),
      x2: r2(cx + Math.cos(a) * rim),
      y2: r2(cy + Math.sin(a) * rim),
    };
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} strokeWidth={knobby ? 6 : 4.5} strokeDasharray={knobby ? "3.2 2.6" : undefined} />
      <circle cx={cx} cy={cy} r={r - 6} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={rim} strokeWidth={1} opacity={0.55} />
      {spokes.map((s, i) => (
        <line key={i} {...s} strokeWidth={2} opacity={0.75} />
      ))}
      {disc ? (
        <circle cx={cx} cy={cy} r={r * 0.52} strokeWidth={1.4} strokeDasharray="1.6 3.2" stroke={ACCENT} />
      ) : (
        <circle cx={cx} cy={cy} r={r * 0.3} strokeWidth={1.2} opacity={0.7} />
      )}
      <circle cx={cx} cy={cy} r={6} strokeWidth={1.6} />
      <circle cx={cx} cy={cy} r={1.8} fill="currentColor" stroke="none" />
    </g>
  );
}

const panel = { fill: "currentColor", fillOpacity: 0.09 } as const;
const seat = { fill: "currentColor", fillOpacity: 0.2 } as const;

interface Drawing {
  rear: { cx: number; cy: number; r: number };
  front: { cx: number; cy: number; r: number };
  body: ReactNode;
  wheels?: { rearDisc?: boolean; frontDisc?: boolean; knobby?: boolean };
}

const drawings: Record<BikeClass, Drawing> = {
  street: {
    rear: { cx: 120, cy: 192, r: 56 },
    front: { cx: 366, cy: 192, r: 56 },
    wheels: { frontDisc: true, rearDisc: true },
    body: (
      <>
        <path d="M120 186 L214 168 L218 180 L122 198 Z" {...panel} />
        <circle cx={120} cy={192} r={20} strokeDasharray="2 2" strokeWidth={1} />
        <path d="M120 172 L222 168 M120 212 L222 184" strokeWidth={1} opacity={0.7} />
        <circle cx={222} cy={176} r={8} strokeWidth={1.2} />
        <path d="M196 172 L208 132" strokeWidth={3.5} />
        <path d="M210 166 L286 164 Q300 166 300 182 L296 204 Q292 214 280 214 L222 214 Q208 212 206 198 Z" {...panel} />
        <path d="M252 166 L280 124 L304 134 L288 170 Z" {...panel} />
        <path d="M262 154 L292 162 M267 146 L296 154 M272 138 L299 146 M277 131 L302 138" strokeWidth={1} opacity={0.6} />
        <path d="M298 150 C314 168 306 200 284 216 L230 220" strokeWidth={3} fill="none" />
        <path d="M228 212 L178 208 Q166 208 166 216 L168 224 Q170 230 182 230 L232 228 Z" {...panel} />
        <path d="M318 98 L232 124 L214 168 M318 104 L298 150 M232 124 L148 118" strokeWidth={2} stroke={ACCENT} />
        <path d="M228 120 C232 98 262 86 296 88 L320 96 L318 112 C300 122 262 128 228 124 Z" {...panel} strokeWidth={2} />
        <path d="M300 104 L332 116 L326 146 L304 140 L298 120 Z" {...panel} />
        <path d="M228 120 L186 117 Q176 117 176 125 L226 128 Z" {...seat} />
        <path d="M176 117 L140 111 L138 120 L176 125 Z" {...seat} />
        <path d="M140 111 L104 99 L98 103 L108 114 L140 121 Z" {...panel} />
        <path d="M98 103 L108 99" stroke={ACCENT} strokeWidth={3} />
        <path d="M316 92 L324 90 L372 186 L364 190 Z" {...panel} strokeWidth={1.6} />
        <path d="M318 88 L302 79 L289 81 M318 88 L322 94" strokeWidth={2.6} />
        <path d="M306 79 L300 60" strokeWidth={1.4} />
        <ellipse cx={298} cy={56} rx={8} ry={5} {...panel} />
        <path d="M324 96 L346 102 L344 120 L330 124 L322 108 Z" {...panel} />
        <path d="M332 104 L343 107" stroke={ACCENT} strokeWidth={2.4} />
        <path d="M340 142 Q366 130 396 142 L392 148 Q366 138 344 148 Z" {...panel} />
        <circle cx={226} cy={196} r={3} />
      </>
    ),
  },

  commuter: {
    rear: { cx: 118, cy: 194, r: 54 },
    front: { cx: 362, cy: 194, r: 54 },
    body: (
      <>
        <path d="M118 190 L210 176 L212 186 L120 200 Z" {...panel} />
        <path d="M110 182 L222 170 L226 181 L114 194 Z" {...panel} />
        <path d="M206 172 L284 170 Q296 172 296 186 L292 206 Q288 214 276 214 L220 214 Q206 212 204 200 Z" {...panel} />
        <path d="M268 172 L300 146 L318 160 L292 184 Z" {...panel} />
        <path d="M278 168 L300 186 M285 162 L306 179 M292 156 L311 172" strokeWidth={1} opacity={0.6} />
        <path d="M314 166 C322 190 300 210 270 222 L206 222" strokeWidth={3} fill="none" />
        <path d="M210 216 L130 206 Q118 206 118 214 L120 220 Q122 227 134 227 L212 230 Z" {...panel} />
        <path d="M316 104 L300 164 M316 108 L240 126 L212 176 M240 126 L140 121" strokeWidth={2} stroke={ACCENT} />
        <path d="M244 122 C250 104 280 96 306 100 L318 108 L314 122 C298 130 266 132 244 128 Z" {...panel} strokeWidth={2} />
        <path d="M246 121 L138 117 Q128 117 128 125 L134 132 L246 134 Z" {...seat} />
        <path d="M176 133 L236 134 L230 156 L184 156 Z" {...panel} />
        <path d="M140 116 L104 112 M110 112 L110 120" strokeWidth={2} />
        <path d="M98 112 L106 114" stroke={ACCENT} strokeWidth={3} />
        <path d="M124 188 L152 128" strokeWidth={6} strokeDasharray="1.6 2.4" opacity={0.85} />
        <path d="M124 188 L152 128" strokeWidth={1.6} />
        <path d="M64 170 Q100 132 152 132" strokeWidth={2} fill="none" />
        <path d="M312 100 L320 98 L366 188 L358 192 Z" {...panel} strokeWidth={1.6} />
        <path d="M330 150 Q362 134 396 150 L392 158 Q362 144 334 158 Z" {...panel} />
        <circle cx={334} cy={112} r={12} {...panel} strokeWidth={1.8} />
        <circle cx={334} cy={112} r={6} stroke={ACCENT} strokeWidth={2} />
        <path d="M322 100 Q338 92 350 104" strokeWidth={1.6} fill="none" />
        <path d="M314 98 L308 80 L290 76" strokeWidth={2.6} />
        <path d="M304 80 L300 58" strokeWidth={1.4} />
        <circle cx={300} cy={54} r={6} {...panel} />
        <path d="M300 160 Q318 150 322 132" strokeWidth={2} opacity={0.55} fill="none" />
        <circle cx={226} cy={198} r={3} />
      </>
    ),
  },

  sport: {
    rear: { cx: 122, cy: 194, r: 54 },
    front: { cx: 366, cy: 194, r: 54 },
    wheels: { frontDisc: true, rearDisc: true },
    body: (
      <>
        <path d="M122 190 L212 174 L216 186 L124 200 Z" {...panel} />
        <circle cx={122} cy={194} r={19} strokeDasharray="2 2" strokeWidth={1} />
        <path d="M200 176 L212 140" strokeWidth={3.5} />
        <path d="M226 206 L174 196 Q162 194 160 202 L162 210 L228 222 Z" {...panel} />
        <path
          d="M402 126 C396 112 380 100 356 90 L336 88 L318 100 L280 112 C262 128 250 160 246 192 L256 214 L322 216 C344 200 360 172 372 150 L402 126 Z"
          {...panel}
          strokeWidth={2}
        />
        <path d="M290 132 L336 142 M282 150 L326 160 M300 188 L340 168" strokeWidth={1} opacity={0.55} />
        <path d="M356 90 L346 66 Q344 61 338 65 L330 88 Z" fill="currentColor" fillOpacity={0.22} />
        <path d="M376 118 L400 125 L386 129 L372 124 Z" fill={ACCENT} stroke={ACCENT} strokeWidth={1} />
        <path d="M260 112 C266 92 294 84 322 90 L334 98 L320 110 C300 118 276 118 260 114 Z" {...panel} strokeWidth={2} />
        <path d="M260 113 L214 108 L210 116 L258 121 Z" {...seat} />
        <path d="M214 108 L120 94 L112 98 L130 108 L210 118 Z" {...panel} />
        <path d="M112 98 L122 95" stroke={ACCENT} strokeWidth={3} />
        <path d="M212 160 L230 172 L214 188 Z" {...panel} />
        <path d="M216 168 L246 150" stroke={ACCENT} strokeWidth={2} />
        <path d="M330 98 L316 103" strokeWidth={2.6} />
        <path d="M352 92 L364 80" strokeWidth={1.4} />
        <ellipse cx={367} cy={77} rx={7} ry={4.5} {...panel} />
        <path d="M338 92 L347 90 L372 186 L363 190 Z" {...panel} strokeWidth={1.6} />
        <path d="M344 144 Q368 134 392 144 L389 150 Q368 141 347 150 Z" {...panel} />
        <circle cx={222} cy={184} r={3} />
      </>
    ),
  },

  cruiser: {
    rear: { cx: 112, cy: 198, r: 50 },
    front: { cx: 380, cy: 194, r: 54 },
    wheels: { frontDisc: true },
    body: (
      <>
        <path d="M112 194 L206 186 L208 196 L114 204 Z" {...panel} />
        <path d="M120 190 L150 142" strokeWidth={6} strokeDasharray="1.6 2.4" opacity={0.85} />
        <path d="M120 190 L150 142" strokeWidth={1.6} />
        <path d="M200 182 L288 178 Q300 180 300 196 L294 214 L210 216 Q198 212 198 200 Z" {...panel} />
        <path d="M236 180 L246 136 L276 138 L272 182 Z" {...panel} />
        <path d="M240 168 L274 170 M242 158 L275 160 M244 148 L276 150" strokeWidth={1} opacity={0.6} />
        <path d="M286 172 C296 196 280 214 250 222 L120 216" strokeWidth={3.5} fill="none" />
        <path d="M172 212 L96 205 L94 218 L172 224 Z" {...panel} />
        <path d="M322 106 L300 176 M322 110 L240 132 L206 186 M240 132 L136 138" strokeWidth={2} stroke={ACCENT} />
        <path d="M236 126 C244 108 286 102 316 110 L322 120 C300 128 262 132 236 132 Z" {...panel} strokeWidth={2} />
        <path d="M236 130 C214 136 186 144 168 138 L150 132 L152 142 C176 154 214 148 234 140 Z" {...seat} />
        <path d="M150 132 L126 128 L128 136 L152 140 Z" {...seat} />
        <path d="M62 178 Q96 140 160 142" strokeWidth={2.4} fill="none" />
        <path d="M64 176 L72 172" stroke={ACCENT} strokeWidth={3} />
        <path d="M320 104 L328 102 L386 186 L378 190 Z" {...panel} strokeWidth={1.6} />
        <path d="M322 100 L316 76 L300 66 L284 70" strokeWidth={2.6} fill="none" />
        <circle cx={344} cy={114} r={13} {...panel} strokeWidth={1.8} />
        <circle cx={344} cy={114} r={7} stroke={ACCENT} strokeWidth={2} />
        <path d="M352 150 Q380 136 410 150 L406 156 Q380 144 356 156 Z" {...panel} />
        <path d="M296 196 L320 196" strokeWidth={3} />
      </>
    ),
  },

  scooter: {
    rear: { cx: 134, cy: 212, r: 36 },
    front: { cx: 352, cy: 212, r: 36 },
    wheels: { frontDisc: true },
    body: (
      <>
        <path d="M150 214 L198 206 L202 218 L154 226 Z" {...panel} />
        <path
          d="M86 184 C88 156 120 136 168 132 L238 130 L244 176 L214 194 L112 196 Q92 196 86 184 Z"
          {...panel}
          strokeWidth={2}
        />
        <path d="M112 132 C132 118 206 114 240 124 L238 132 L120 140 Z" {...seat} />
        <path d="M244 176 L302 176 L308 188 L240 192 Z" {...panel} />
        <path d="M300 178 C298 146 302 116 316 90 L330 90 C352 100 368 128 362 168 L338 180 Z" {...panel} strokeWidth={2} />
        <path d="M306 74 L352 72 L356 86 L312 88 Z" {...panel} />
        <path d="M346 75 L358 77 L356 84 L346 84 Z" fill={ACCENT} stroke={ACCENT} strokeWidth={1} />
        <path d="M312 74 L300 66 M354 72 L362 64" strokeWidth={1.4} />
        <path d="M342 176 L352 208" strokeWidth={4} />
        <path d="M326 196 Q352 180 378 196 L375 202 Q352 188 330 202 Z" {...panel} />
        <path d="M88 178 L96 174" stroke={ACCENT} strokeWidth={3} />
        <path d="M100 150 L84 154" strokeWidth={2} />
        <path d="M150 168 L222 164" strokeWidth={1} opacity={0.5} />
      </>
    ),
  },

  offroad: {
    rear: { cx: 118, cy: 190, r: 56 },
    front: { cx: 374, cy: 184, r: 62 },
    wheels: { knobby: true, frontDisc: true, rearDisc: true },
    body: (
      <>
        <path d="M118 186 L212 164 L216 176 L120 196 Z" {...panel} />
        <path d="M196 168 L208 120" strokeWidth={3.5} />
        <path d="M212 150 L280 148 Q294 150 294 166 L290 188 L220 192 Q206 188 206 176 Z" {...panel} />
        <path d="M250 150 L266 116 L290 122 L280 154 Z" {...panel} />
        <path d="M256 140 L284 146 M260 132 L287 138 M264 124 L289 130" strokeWidth={1} opacity={0.6} />
        <path d="M214 194 L290 190 L296 200 L220 204 Z" {...panel} />
        <path d="M286 136 C300 150 270 166 220 160 L172 140" strokeWidth={3} fill="none" />
        <path d="M176 132 L132 120 L128 132 L172 146 Z" {...panel} />
        <path d="M330 84 L300 150 M330 88 L236 104 L214 160 M236 104 L136 102" strokeWidth={2} stroke={ACCENT} />
        <path d="M236 102 C244 82 286 76 318 84 L332 92 L320 120 L292 128 L252 116 Z" {...panel} strokeWidth={2} />
        <path d="M238 100 L132 96 Q124 96 124 104 L132 108 L236 110 Z" {...seat} />
        <path d="M132 98 L70 92 L72 100 L132 106 Z" {...panel} />
        <path d="M70 92 L80 93" stroke={ACCENT} strokeWidth={3} />
        <path d="M332 82 L340 80 L380 178 L372 182 Z" {...panel} strokeWidth={1.6} />
        <path d="M340 112 L404 122 L398 130 L344 124 Z" {...panel} />
        <path d="M336 78 L358 70 L364 98 L344 108 Z" {...panel} />
        <path d="M344 76 L352 56 L360 70 Z" fill="currentColor" fillOpacity={0.22} />
        <path d="M350 84 L360 86" stroke={ACCENT} strokeWidth={2.4} />
        <path d="M330 80 L318 70 L300 70" strokeWidth={2.6} fill="none" />
        <circle cx={226} cy={180} r={3} />
      </>
    ),
  },
};

const classLabels: Record<BikeClass, string> = {
  commuter: "commuter motorcycle",
  street: "street motorcycle",
  sport: "faired sport motorcycle",
  cruiser: "cruiser motorcycle",
  scooter: "scooter",
  offroad: "dual-sport motorcycle",
};

export function bikeClassLabel(c: BikeClass): string {
  return classLabels[c];
}

export function BikeArt({
  bikeClass,
  className,
  title,
  annotate = false,
}: {
  bikeClass: BikeClass;
  className?: string;
  /** Accessible name; omit when the drawing is decorative. */
  title?: string;
  /** Adds blueprint marks: axle crosshairs, ground line and wheelbase dimension. */
  annotate?: boolean;
}) {
  const d = drawings[bikeClass];
  const { rear, front } = d;
  return (
    <svg
      viewBox="0 0 480 270"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {annotate && (
        <g strokeWidth={1} opacity={0.35}>
          <path d="M40 248 L440 248" />
          <path d={`M${rear.cx} 254 L${rear.cx} 264 M${front.cx} 254 L${front.cx} 264 M${rear.cx} 259 L${front.cx} 259`} />
          <path d={`M${rear.cx + 6} 256 L${rear.cx} 259 L${rear.cx + 6} 262 M${front.cx - 6} 256 L${front.cx} 259 L${front.cx - 6} 262`} />
          {[rear, front].map((w, i) => (
            <path key={i} d={`M${w.cx - w.r - 8} ${w.cy} L${w.cx + w.r + 8} ${w.cy} M${w.cx} ${w.cy - w.r - 8} L${w.cx} ${w.cy + w.r + 4}`} strokeDasharray="4 4" />
          ))}
        </g>
      )}
      <Wheel {...rear} disc={d.wheels?.rearDisc} knobby={d.wheels?.knobby} />
      <Wheel {...front} disc={d.wheels?.frontDisc} knobby={d.wheels?.knobby} />
      <g strokeWidth={1.8}>{d.body}</g>
    </svg>
  );
}
