import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import type { PartArtKind } from "@/lib/types";

/**
 * Original line illustrations of part types, drawn for this site (no third-party artwork). Used for a
 * product that has no photo of the item and no photo that actually shows its part type, so a brake
 * pad always looks like a brake pad. All geometry is static or uses SVG transforms, so server and
 * browser render identical markup.
 */

const A = "var(--color-brand-bright)";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const glyphs: Record<PartArtKind, ReactNode> = {
  "brake-pad": (
    <>
      {[0, 66].map((dx) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          <rect x="14" y="34" width="58" height="50" rx="11" />
          <circle cx="62" cy="44" r="3.5" />
          <path d="M22 54 h42 v16 a12 12 0 0 1 -12 12 h-18 a12 12 0 0 1 -12 -12z" stroke={A} />
          <path d="M43 56 v24" stroke={A} strokeWidth="1.5" />
        </g>
      ))}
    </>
  ),
  "brake-shoe": (
    <>
      <path d="M38 56 A42 42 0 0 1 122 56 L113 56 A33 33 0 0 0 47 56 Z" />
      <path d="M38 64 A42 42 0 0 0 122 64 L113 64 A33 33 0 0 1 47 64 Z" />
      <path d="M41 50 A39 39 0 0 1 119 50" stroke={A} strokeWidth="4" />
      <path d="M41 70 A39 39 0 0 0 119 70" stroke={A} strokeWidth="4" />
      <path d="M44 56 l-3 2 6 2 -6 2 3 2" />
      <path d="M116 56 l3 2 -6 2 6 2 -3 2" />
      <circle cx="80" cy="60" r="6" />
    </>
  ),
  lever: (
    <>
      <path d="M26 50 h24 l78 10 a7 7 0 0 1 0 14 l-78 -4 h-24 a9 9 0 0 1 -9 -9 v-2 a9 9 0 0 1 9 -9z" />
      <circle cx="36" cy="60" r="4.5" />
      <circle cx="132" cy="67" r="4" stroke={A} />
      <path d="M52 56 l70 8" stroke={A} strokeWidth="1.5" />
    </>
  ),
  hose: (
    <>
      <path d="M38 82 C 74 82, 70 40, 106 40" strokeWidth="7" />
      <path d="M38 82 C 74 82, 70 40, 106 40" stroke={A} strokeWidth="1.5" strokeDasharray="2 4" />
      <circle cx="28" cy="82" r="10" />
      <circle cx="28" cy="82" r="3.5" />
      <circle cx="116" cy="40" r="10" />
      <circle cx="116" cy="40" r="3.5" />
    </>
  ),
  switch: (
    <>
      <rect x="36" y="34" width="68" height="48" rx="12" />
      <rect x="48" y="44" width="18" height="10" rx="2" stroke={A} />
      <rect x="72" y="44" width="20" height="10" rx="5" />
      <circle cx="57" cy="68" r="5" />
      <rect x="72" y="64" width="20" height="8" rx="4" stroke={A} />
      <path d="M104 64 C 120 64, 124 86, 142 90" />
    </>
  ),
  fastener: (
    <>
      <rect x="20" y="40" width="18" height="40" rx="2" />
      <path d="M20 53 h18 M20 67 h18" strokeWidth="1.5" />
      <rect x="38" y="51" width="68" height="18" rx="2" />
      {range(7).map((i) => (
        <path key={i} d={`M${60 + i * 7} 51 l-4 18`} stroke={A} strokeWidth="1.5" />
      ))}
      <path d="M132 44 l14 8 v16 l-14 8 l-14 -8 v-16z" />
      <circle cx="132" cy="60" r="6" stroke={A} />
    </>
  ),
  panel: (
    <>
      <path d="M26 80 C 34 50, 70 34, 122 36 C 136 36, 142 46, 134 58 L 112 86 C 107 92, 99 94, 90 94 L 38 94 C 28 94, 23 88, 26 80 Z" />
      <path d="M42 84 C 58 60, 92 50, 124 48" stroke={A} strokeWidth="3" />
      <circle cx="58" cy="80" r="3" />
      <circle cx="116" cy="58" r="3" />
    </>
  ),
  seal: (
    <>
      <circle cx="80" cy="60" r="36" />
      <circle cx="80" cy="60" r="20" />
      <circle cx="80" cy="60" r="28" stroke={A} strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="80" cy="60" r="16" strokeWidth="1.5" />
    </>
  ),
  piston: (
    <>
      <rect x="46" y="22" width="68" height="74" rx="8" />
      <path d="M46 34 h68 M46 42 h68" stroke={A} strokeWidth="3" />
      <path d="M46 50 h68" strokeWidth="1.5" />
      <circle cx="80" cy="72" r="9" />
      <circle cx="80" cy="72" r="4" />
      <path d="M52 96 q28 -12 56 0" strokeWidth="1.5" />
    </>
  ),
  gasket: (
    <>
      <rect x="24" y="26" width="112" height="68" rx="16" />
      <circle cx="74" cy="60" r="22" stroke={A} />
      {[[38, 38], [122, 38], [38, 82], [122, 82]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" />
      ))}
      <rect x="106" y="50" width="12" height="20" rx="4" />
    </>
  ),
  valve: (
    <>
      <path d="M80 20 v62" strokeWidth="4" />
      <path d="M58 92 Q 80 76 102 92 Z" />
      <path d="M56 92 h48" />
      <path d="M74 26 h12 M74 31 h12" strokeWidth="1.5" />
      <path d="M68 38 l24 4 l-24 4 l24 4 l-24 4 l24 4 l-24 4 l24 4" stroke={A} strokeWidth="2" />
    </>
  ),
  gear: (
    <>
      <circle cx="80" cy="60" r="32" />
      {range(14).map((i) => (
        <rect key={i} x="75" y="20" width="10" height="10" rx="1.5" transform={`rotate(${(i * 360) / 14} 80 60)`} />
      ))}
      <circle cx="80" cy="60" r="13" stroke={A} />
      <circle cx="80" cy="60" r="5" />
    </>
  ),
  "clutch-plate": (
    <>
      <circle cx="80" cy="60" r="40" />
      <circle cx="80" cy="60" r="24" />
      {range(12).map((i) => (
        <rect key={i} x="75" y="24" width="10" height="10" rx="1.5" stroke={A} transform={`rotate(${i * 30} 80 60)`} />
      ))}
      {range(6).map((i) => (
        <rect key={i} x="77" y="36" width="6" height="6" rx="1" transform={`rotate(${i * 60 + 15} 80 60)`} />
      ))}
    </>
  ),
  battery: (
    <>
      <rect x="32" y="40" width="96" height="54" rx="5" />
      <rect x="44" y="31" width="14" height="9" rx="1.5" />
      <rect x="102" y="31" width="14" height="9" rx="1.5" />
      <path d="M44 62 h14 M51 55 v14" stroke={A} strokeWidth="3" />
      <path d="M102 62 h14" stroke={A} strokeWidth="3" />
      <path d="M32 52 h96" strokeWidth="1.5" />
    </>
  ),
  module: (
    <>
      <rect x="34" y="34" width="76" height="52" rx="5" />
      {range(7).map((i) => (
        <path key={i} d={`M${44 + i * 9} 42 v36`} strokeWidth="1.5" />
      ))}
      <rect x="110" y="48" width="16" height="24" rx="2" stroke={A} />
      <path d="M126 54 h14 M126 60 h18 M126 66 h14" stroke={A} strokeWidth="1.5" />
      <circle cx="40" cy="40" r="2" />
    </>
  ),
  coil: (
    <>
      <rect x="28" y="40" width="64" height="40" rx="9" />
      {range(8).map((i) => (
        <path key={i} d={`M${38 + i * 6} 40 v40`} stroke={A} strokeWidth="1.5" />
      ))}
      <rect x="20" y="52" width="8" height="16" rx="2" />
      <path d="M92 60 C 112 60, 112 40, 128 40" strokeWidth="3" />
      <rect x="126" y="31" width="20" height="18" rx="5" />
    </>
  ),
  bulb: (
    <>
      <path d="M64 24 C 64 14, 96 14, 96 24 L 99 62 C 99 72, 61 72, 61 62 Z" />
      <path d="M72 44 l4 -5 4 5 4 -5 4 5" stroke={A} strokeWidth="2" />
      <path d="M74 44 v18 M86 44 v18" strokeWidth="1.5" />
      <rect x="52" y="70" width="56" height="8" rx="2" />
      <rect x="64" y="78" width="32" height="14" rx="2" />
      <path d="M70 92 v10 M80 92 v10 M90 92 v10" />
    </>
  ),
  cable: (
    <>
      <path d="M22 86 C 44 86, 42 44, 70 44 C 100 44, 104 78, 82 80 C 60 82, 64 34, 104 34 L 128 34" strokeWidth="3.5" />
      <path d="M128 34 h12" stroke={A} strokeWidth="1.5" />
      <rect x="140" y="29" width="8" height="10" rx="2" stroke={A} />
      <rect x="10" y="80" width="14" height="12" rx="2" />
    </>
  ),
  meter: (
    <>
      <rect x="22" y="28" width="116" height="66" rx="16" />
      <circle cx="62" cy="64" r="24" />
      {range(7).map((i) => (
        <path key={i} d="M62 44 v5" strokeWidth="2" transform={`rotate(${i * 30 - 90} 62 64)`} />
      ))}
      <path d="M62 64 v-18" stroke={A} strokeWidth="3" transform="rotate(35 62 64)" />
      <circle cx="62" cy="64" r="3" />
      <rect x="96" y="52" width="32" height="18" rx="3" stroke={A} />
    </>
  ),
  injector: (
    <>
      <rect x="64" y="16" width="32" height="16" rx="3" />
      <path d="M62 32 h36 v38 l-9 9 h-18 l-9 -9 z" />
      <path d="M62 42 h36 M62 64 h36" stroke={A} strokeWidth="3" />
      <rect x="75" y="79" width="10" height="14" rx="2" />
      <path d="M80 97 v8 M76 96 l-5 7 M84 96 l5 7" stroke={A} strokeWidth="1.5" strokeDasharray="2 2" />
    </>
  ),
  bottle: (
    <>
      <path d="M44 42 h62 a8 8 0 0 1 8 8 v40 a6 6 0 0 1 -6 6 h-66 a6 6 0 0 1 -6 -6 v-40 a8 8 0 0 1 8 -8z" />
      <path d="M84 42 v-10 a6 6 0 0 1 6 -6 h10 a6 6 0 0 1 6 6 v12" />
      <rect x="50" y="30" width="16" height="12" rx="2" stroke={A} />
      <rect x="50" y="58" width="44" height="26" rx="3" stroke={A} />
      <path d="M58 68 h28 M58 75 h18" strokeWidth="1.5" />
    </>
  ),
  spray: (
    <>
      <rect x="58" y="44" width="38" height="56" rx="6" />
      <path d="M58 50 Q 77 32 96 50" />
      <rect x="71" y="28" width="12" height="9" rx="2" />
      <rect x="58" y="62" width="38" height="20" stroke={A} />
      {[[100, 30], [108, 25], [114, 32], [107, 37], [118, 24], [121, 34]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" stroke={A} />
      ))}
    </>
  ),
  lamp: (
    <>
      <circle cx="80" cy="54" r="30" />
      <circle cx="80" cy="54" r="21" stroke={A} />
      {[[71, 47], [89, 47], [71, 61], [89, 61], [80, 54]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" />
      ))}
      <path d="M80 84 v12 M64 96 h32" />
    </>
  ),
  stand: (
    <>
      <path d="M40 30 L 112 88" strokeWidth="7" />
      <circle cx="40" cy="30" r="9" />
      <circle cx="40" cy="30" r="3" />
      <path d="M100 84 h30 l4 10 h-38 z" />
      <path d="M56 32 l4 9 l5 -7 l4 9 l5 -7 l4 9 l5 -7 l4 9" stroke={A} strokeWidth="2" />
    </>
  ),
  spring: (
    <>
      <path d={`M10 60 ${range(5).map(() => "q 7 -26 14 0 q 7 26 14 0").join(" ")}`} strokeWidth="3" />
      <path d={`M17 60 ${range(5).map(() => "q 7 -20 14 0 q 7 20 14 0").join(" ")}`} stroke={A} strokeWidth="1.5" strokeDasharray="3 3" />
      <path d="M10 46 v28 M150 46 v28" />
    </>
  ),
  chain: (
    <>
      <rect x="22" y="30" width="116" height="60" rx="30" strokeWidth="3" />
      <rect x="32" y="40" width="96" height="40" rx="20" />
      {range(6).map((i) => (
        <g key={i}>
          <circle cx={50 + i * 12} cy="35" r="2.5" stroke={A} />
          <circle cx={50 + i * 12} cy="85" r="2.5" stroke={A} />
        </g>
      ))}
    </>
  ),
  belt: (
    <>
      <path d="M44 34 L124 46 A14 14 0 0 1 124 74 L44 86 A26 26 0 0 1 44 34 Z" strokeWidth="4" />
      <circle cx="44" cy="60" r="20" />
      <circle cx="44" cy="60" r="8" stroke={A} />
      <circle cx="124" cy="60" r="9" />
      <circle cx="124" cy="60" r="4" stroke={A} />
    </>
  ),
  motor: (
    <>
      <rect x="32" y="38" width="76" height="44" rx="6" />
      <rect x="108" y="44" width="14" height="32" rx="3" />
      <path d="M44 38 v44 M96 38 v44" strokeWidth="1.5" />
      <rect x="16" y="53" width="16" height="14" rx="2" stroke={A} />
      <path d="M20 53 v14 M25 53 v14" stroke={A} strokeWidth="1.5" />
      <rect x="60" y="28" width="12" height="10" rx="2" />
      <path d="M122 60 h18" />
    </>
  ),
  stator: (
    <>
      <circle cx="80" cy="60" r="16" />
      <circle cx="80" cy="60" r="6" />
      {range(12).map((i) => (
        <rect key={i} x="75" y="20" width="10" height="22" rx="2" stroke={A} transform={`rotate(${i * 30} 80 60)`} />
      ))}
    </>
  ),
  tube: (
    <>
      <circle cx="80" cy="56" r="40" strokeWidth="3" />
      <circle cx="80" cy="56" r="28" />
      <circle cx="80" cy="56" r="34" stroke={A} strokeWidth="1.5" strokeDasharray="3 4" />
      <rect x="77" y="80" width="6" height="18" rx="1.5" stroke={A} />
    </>
  ),
  horn: (
    <>
      <circle cx="74" cy="62" r="32" />
      <circle cx="74" cy="62" r="20" stroke={A} />
      <circle cx="74" cy="62" r="6" />
      <path d="M106 62 h18 v-24" />
      <circle cx="124" cy="32" r="5" />
      <path d="M54 92 v10 M66 94 v10" />
    </>
  ),
  fuse: (
    <>
      <rect x="48" y="30" width="64" height="44" rx="6" stroke={A} />
      <rect x="58" y="40" width="44" height="16" rx="2" />
      <path d="M62 48 h10 l4 -5 l8 10 l4 -5 h10" strokeWidth="2" />
      <rect x="58" y="74" width="12" height="26" rx="2" />
      <rect x="90" y="74" width="12" height="26" rx="2" />
    </>
  ),
  guard: (
    <>
      <path d="M28 30 C 28 104, 132 104, 132 30" strokeWidth="7" />
      <path d="M46 30 C 46 84, 114 84, 114 30" strokeWidth="4" />
      <rect x="18" y="20" width="20" height="12" rx="3" stroke={A} />
      <rect x="122" y="20" width="20" height="12" rx="3" stroke={A} />
    </>
  ),
  peg: (
    <>
      <rect x="20" y="42" width="30" height="36" rx="5" />
      <circle cx="30" cy="52" r="3" />
      <circle cx="30" cy="68" r="3" />
      <rect x="50" y="51" width="92" height="18" rx="9" />
      {range(8).map((i) => (
        <path key={i} d={`M${62 + i * 10} 54 v12`} stroke={A} strokeWidth="2" />
      ))}
    </>
  ),
  shaft: (
    <>
      <path d="M14 60 h132" strokeWidth="7" />
      {[26, 78, 132].map((cx) => (
        <circle key={cx} cx={cx} cy="60" r="10" />
      ))}
      <ellipse cx="52" cy="58" rx="11" ry="18" stroke={A} />
      <ellipse cx="104" cy="62" rx="11" ry="18" stroke={A} />
    </>
  ),
  tap: (
    <>
      <rect x="56" y="34" width="48" height="36" rx="6" />
      <rect x="68" y="20" width="24" height="14" rx="2" />
      <rect x="74" y="70" width="12" height="24" rx="2" />
      <path d="M80 52 l34 -22" strokeWidth="5" stroke={A} />
      <circle cx="118" cy="27" r="6" stroke={A} />
    </>
  ),
  "plug-cap": (
    <>
      <path d="M40 38 h44 a18 18 0 0 1 18 18 v42 h-24 v-30 a8 8 0 0 0 -8 -8 h-30 z" />
      <path d="M40 49 h-26" strokeWidth="5" />
      <path d="M78 98 h24" stroke={A} strokeWidth="3" />
      <path d="M58 38 v22" strokeWidth="1.5" />
    </>
  ),
  jets: (
    <>
      <path d="M20 46 l8 -6 h8 l8 6 v28 l-8 6 h-8 l-8 -6 z" />
      <rect x="44" y="54" width="28" height="12" rx="2" />
      {range(4).map((i) => (
        <path key={i} d={`M${50 + i * 6} 54 l-3 12`} stroke={A} strokeWidth="1.5" />
      ))}
      <path d="M86 44 h32" strokeWidth="4" />
      <path d="M118 38 l16 6 l-16 6 z" stroke={A} />
      <circle cx="104" cy="82" r="11" />
      <circle cx="104" cy="82" r="5" stroke={A} />
    </>
  ),
  "throttle-body": (
    <>
      <rect x="34" y="28" width="66" height="64" rx="8" />
      <circle cx="67" cy="60" r="22" />
      <path d="M52 74 L82 46" stroke={A} strokeWidth="4" />
      <path d="M24 60 h86" strokeWidth="1.5" />
      <rect x="100" y="42" width="26" height="36" rx="3" />
      <rect x="126" y="52" width="12" height="16" rx="2" stroke={A} />
    </>
  ),
  bush: (
    <>
      <ellipse cx="80" cy="36" rx="28" ry="10" />
      <ellipse cx="80" cy="36" rx="16" ry="5" stroke={A} />
      <path d="M52 36 v48 M108 36 v48" />
      <path d="M52 84 A28 10 0 0 0 108 84" />
      <path d="M64 40 v40" stroke={A} strokeWidth="1.5" strokeDasharray="3 3" />
    </>
  ),
  charger: (
    <>
      <rect x="46" y="26" width="64" height="64" rx="12" />
      <rect x="58" y="42" width="40" height="11" rx="2" stroke={A} />
      <rect x="58" y="62" width="40" height="11" rx="2" stroke={A} />
      <circle cx="100" cy="34" r="2.5" />
      <path d="M68 90 v16 M88 90 v16" />
    </>
  ),
  grip: (
    <>
      <rect x="18" y="40" width="12" height="40" rx="3" />
      <rect x="30" y="44" width="110" height="32" rx="16" />
      {range(9).map((i) => (
        <path key={i} d={`M${44 + i * 10} 48 v24`} stroke={A} strokeWidth="2" />
      ))}
    </>
  ),
  "inline-filter": (
    <>
      <rect x="48" y="42" width="64" height="36" rx="18" />
      {range(5).map((i) => (
        <path key={i} d={`M${62 + i * 8} 46 l-6 28`} stroke={A} strokeWidth="1.5" />
      ))}
      <rect x="32" y="54" width="16" height="12" rx="3" />
      <rect x="112" y="54" width="16" height="12" rx="3" />
      <path d="M32 60 h-16 M128 60 h16" strokeWidth="5" />
    </>
  ),
  reservoir: (
    <>
      <rect x="40" y="32" width="54" height="34" rx="6" />
      <rect x="46" y="24" width="42" height="9" rx="3" stroke={A} />
      <path d="M46 54 h42" stroke={A} strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="48" y="66" width="38" height="20" rx="4" />
      <path d="M86 76 h26" />
      <circle cx="118" cy="76" r="8" />
      <path d="M52 86 l-26 18" strokeWidth="6" />
    </>
  ),
  // Helmets: side view, facing right. Shared shell, then what sets each style apart.
  "helmet-full": (
    <>
      <path d="M46 96 C34 82 31 54 49 36 C66 20 101 16 121 30 C133 39 138 54 138 70 L138 84 C138 91 133 96 125 96 Z" />
      <path d="M86 50 C100 44 121 44 135 51 L136 67 C121 63 101 63 89 68 C85 62 84 56 86 50 Z" stroke={A} />
      <circle cx="78" cy="60" r="5" />
      <path d="M50 89 C72 93 100 93 125 91" strokeWidth="1.5" />
      <path d="M118 79 h13 M120 85 h11" strokeWidth="1.5" />
      <path d="M62 28 C70 24 80 22 90 22" strokeWidth="1.5" />
    </>
  ),
  "helmet-modular": (
    <>
      <path d="M46 96 C34 82 31 54 49 36 C66 20 101 16 121 30 C133 39 138 54 138 70 L138 84 C138 91 133 96 125 96 Z" />
      <path d="M86 50 C100 44 121 44 135 51 L136 67 C121 63 101 63 89 68 C85 62 84 56 86 50 Z" stroke={A} />
      <circle cx="78" cy="60" r="5" stroke={A} />
      <path d="M80 66 C84 78 92 88 104 96" stroke={A} strokeWidth="2" strokeDasharray="4 3" />
      <rect x="120" y="82" width="12" height="7" rx="2" />
      <path d="M50 89 C66 92 82 93 96 93" strokeWidth="1.5" />
    </>
  ),
  "helmet-open": (
    <>
      <path d="M46 94 C34 80 31 54 49 36 C66 20 101 16 121 30 C131 38 135 48 135 58 L127 60 C119 63 113 71 111 81 L108 94 Z" />
      <path d="M128 50 C138 60 140 78 133 94" stroke={A} strokeDasharray="5 3" />
      <circle cx="76" cy="58" r="5" />
      <path d="M86 84 C96 80 104 82 110 86" strokeWidth="1.5" />
      <path d="M50 88 C66 91 86 92 106 90" strokeWidth="1.5" />
      <path d="M62 28 C70 24 80 22 90 22" strokeWidth="1.5" />
    </>
  ),
  "helmet-half": (
    <>
      <path d="M38 80 C36 56 54 34 84 32 C112 30 130 46 133 64 L134 72 C120 70 106 72 96 76 L38 80 Z" />
      <path d="M96 76 C110 72 124 72 136 76" stroke={A} strokeWidth="3" />
      <path d="M66 79 C68 94 86 101 102 93" strokeWidth="1.5" />
      <rect x="99" y="88" width="10" height="8" rx="2" stroke={A} />
      <path d="M58 40 C66 36 76 34 86 34" strokeWidth="1.5" />
    </>
  ),
  "helmet-offroad": (
    <>
      <path d="M46 96 C34 82 31 54 49 36 C64 22 96 17 114 26 L126 33 C133 41 136 52 136 62 L147 84 C147 91 141 96 133 96 Z" />
      <path d="M94 26 L146 30 L139 41 L110 38 Z" stroke={A} />
      <path d="M88 51 C101 46 119 46 132 52 L133 66 C119 62 103 62 91 66 C87 61 86 56 88 51 Z" />
      <path d="M135 76 h8 M133 83 h11" strokeWidth="1.5" />
      <circle cx="78" cy="61" r="4" />
      <path d="M50 89 C72 93 100 93 128 91" strokeWidth="1.5" />
    </>
  ),
};

export function PartArt({ kind, className, title }: { kind: PartArtKind; className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={cx("h-auto", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {glyphs[kind]}
    </svg>
  );
}
