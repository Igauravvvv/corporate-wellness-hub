"use client";
import { useId } from "react";

export const mascotNames = ["Slate", "Sage", "Dune", "Ink", "Clay", "Mist"];
const palettes = [
  { background: "#dce1e2", skin: "#bd8b6f", shadow: "#a7735c", hair: "#283638", shirt: "#394c54", accent: "#a8bbc0" },
  { background: "#dce3d7", skin: "#e0b798", shadow: "#c49476", hair: "#414a3d", shirt: "#64755d", accent: "#b3c1a5" },
  { background: "#e9e1d4", skin: "#825846", shadow: "#694335", hair: "#2b2927", shirt: "#a78d6e", accent: "#cec0a8" },
  { background: "#d9dce4", skin: "#d7a98b", shadow: "#b78870", hair: "#272d3b", shirt: "#424958", accent: "#a9afc0" },
  { background: "#eadbd3", skin: "#ac775b", shadow: "#90604b", hair: "#382d29", shirt: "#966e5d", accent: "#ceafa0" },
  { background: "#dde5e2", skin: "#edc8aa", shadow: "#cfa98c", hair: "#666b64", shirt: "#74867f", accent: "#b6c6c0" },
];

/** Editorial portrait avatars. Numeric IDs stay compatible with saved profiles. */
export function Mascot({ variant = 0, className = "", label }: { variant?: number; className?: string; label?: string }) {
  const clipId = useId().replace(/:/g, "");
  const id = Number.isFinite(variant) ? ((Math.trunc(variant) % palettes.length) + palettes.length) % palettes.length : 0;
  const p = palettes[id];
  return <svg viewBox="0 0 200 210" className={className} role="img" aria-label={label || `${mascotNames[id]} portrait avatar`}>
    <defs><clipPath id={clipId}><rect x="8" y="8" width="184" height="194" rx="92" /></clipPath></defs>
    <g clipPath={`url(#${clipId})`}>
      <path d="M0 0h200v210H0z" fill={p.background} />
      <circle cx="166" cy="45" r="68" fill={p.accent} opacity=".32" />
      <path d="M-10 164L202 45" stroke={p.accent} strokeWidth="1" opacity=".7" />
      {(id === 1 || id === 3) && <path d="M59 114V70C59 12 143 14 145 75L151 153H54Z" fill={p.hair} />}
      <path d="M28 211l8-35q7-28 45-33h38q38 5 45 33l8 35" fill={p.shirt} />
      <path d="M85 118v29q15 18 30 0v-29" fill={p.skin} />
      <path d="M85 124q14 13 30 0v11q-13 9-30 1" fill={p.shadow} opacity=".6" />
      <ellipse cx="67" cy="89" rx="7" ry="12" fill={p.skin} /><ellipse cx="134" cy="89" rx="7" ry="12" fill={p.skin} />
      <path d="M67 68q0-36 34-36t33 36v32q-2 35-33 38-31-3-34-38Z" fill={p.skin} />
      <path d="M126 64v37q-1 24-25 37 31-3 33-38V68Z" fill={p.shadow} opacity=".35" />
      {id === 0 && <path d="M65 82l-4-23q-3-29 26-34 27-10 47 13l9 19-15 9-8-16q-14 17-44 12l-4 21Z" fill={p.hair} />}
      {id === 1 && <path d="M63 83V60q8-39 45-30 34 3 31 45l-8 16-5-31q-31 8-41-12-5 19-19 28Z" fill={p.hair} />}
      {id === 2 && <g fill={p.hair}><path d="M64 79V48q35-31 70 0v32l-9-16H74l-4 15Z" /><circle cx="69" cy="48" r="13" /><circle cx="84" cy="36" r="15" /><circle cx="102" cy="32" r="16" /><circle cx="122" cy="39" r="15" /><circle cx="133" cy="54" r="12" /></g>}
      {id === 3 && <path d="M62 89V53q12-29 41-26 31 2 37 36l-8 26-9-37q-27 15-50 11l-6 26Z" fill={p.hair} />}
      {id === 4 && <path d="M63 79V53q3-25 29-26 40-7 47 28l-4 23-9-21q-34 5-49-4l-7 26Z" fill={p.hair} />}
      {id === 5 && <path d="M65 79l-6-27q7-27 30-22l-2-9q41-8 54 30l-8 32-11-26q-25 10-45 1l-6 23Z" fill={p.hair} />}
      <path d="M79 81l13-1M110 80l12 1" stroke={p.hair} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M84 89v2M116 89v2" stroke="#333532" strokeWidth="3" strokeLinecap="round" />
      <path d="M101 91l-3 13h6" fill="none" stroke={p.shadow} strokeWidth="2" strokeLinecap="round" />
      <path d="M91 116q9 4 18-1" fill="none" stroke="#714b40" strokeWidth="2" strokeLinecap="round" />
      {id === 4 && <path d="M72 106q10 13 18 15h21q12-5 18-16l-3 17q-24 32-49 0Z" fill={p.hair} opacity=".85" />}
      {(id === 0 || id === 3) && <g fill="none" stroke={p.hair} strokeWidth="2.8"><rect x="73" y="83" width="24" height="17" rx="6" /><rect x="105" y="83" width="24" height="17" rx="6" /><path d="M97 89h8M67 87h6M129 87h5" /></g>}
      {(id === 1 || id === 5) && <g fill="none" stroke="#b99b5d" strokeWidth="2.5"><circle cx="65" cy="107" r="6" /><circle cx="137" cy="107" r="6" /></g>}
      <path d="M79 145l21 23 22-23" fill="none" stroke={p.background} strokeWidth="3" strokeLinejoin="round" />
      <path d="M53 181v29M147 181v29" stroke={p.accent} strokeWidth="1.5" opacity=".45" />
    </g>
    <rect x="8.5" y="8.5" width="183" height="193" rx="91.5" fill="none" stroke={p.shirt} strokeOpacity=".12" />
  </svg>;
}
