"use client";
import { Banknote, Users, Megaphone, Laptop, Headphones, Clapperboard, Volleyball, Leaf, Plane, Utensils, TrendingUp, Flag, Lightbulb, Globe, MessagesSquare, type LucideIcon } from "lucide-react";
const icons: Record<string, LucideIcon> = {
  finance: Banknote, hr: Users, marketing: Megaphone, technology: Laptop,
  music: Headphones, movies: Clapperboard, sports: Volleyball,
  "health-wellness": Leaf, travel: Plane, "food-dining": Utensils,
  "career-growth": TrendingUp, leadership: Flag, innovation: Lightbulb,
  "culture-diversity": Globe, general: MessagesSquare,
};
/** A group's identity follows its topic, never its position in a list. */
export function GroupIcon({ topic, className = "", label }: { topic: string; className?: string; label?: string }) {
  const name = label || `${topic} group icon`;
  if (topic === "cricket") return <svg className={className} viewBox="0 0 120 120" role="img" aria-label={label || "Cricket bat and ball"}>
    <g transform="rotate(35 55 60)"><rect x="45" y="9" width="14" height="38" rx="5" fill="#345541" /><path d="M46 15h12M46 22h12M46 29h12" stroke="#92b798" strokeWidth="2" /><path d="M39 43Q52 37 65 43L68 98Q52 107 36 98Z" fill="#dfb66c" stroke="#89622e" strokeWidth="3" /><path d="M51 47v45" stroke="#f6dfb1" strokeWidth="4" strokeLinecap="round" /></g>
    <circle cx="90" cy="86" r="19" fill="#b84c43" /><path d="M81 69Q76 87 87 104M87 68Q81 86 93 104" fill="none" stroke="#fff1df" strokeWidth="2" strokeDasharray="3 3" />
  </svg>;
  if (topic === "badminton") return <svg className={className} viewBox="0 0 120 120" role="img" aria-label={label || "Badminton racket and shuttlecock"}>
    <g transform="rotate(30 43 65)"><path d="M44 68v38" stroke="#345541" strokeWidth="8" strokeLinecap="round" /><ellipse cx="44" cy="38" rx="25" ry="32" fill="#e5f1ec" stroke="#345541" strokeWidth="5" /><path d="M30 13v49M40 8v60M50 8v60M60 16v45M20 28h48M20 40h49M22 52h42" stroke="#88a89a" strokeWidth="1.5" /></g><path d="M83 86L74 54L88 48L107 59L98 88Z" fill="#fffefa" stroke="#748679" strokeWidth="2" /><path d="M88 50l2 36M101 57l-8 30" stroke="#748679" strokeWidth="2" /><path d="M83 85h15v6a7.5 7.5 0 0 1-15 0Z" fill="#d4ad69" />
  </svg>;
  const Icon = icons[topic] || MessagesSquare;
  return <Icon className={className} role="img" aria-label={name} strokeWidth={1.5} />;
}
