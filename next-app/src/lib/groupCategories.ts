import {
  Trophy,
  HeartPulse,
  Palette,
  GraduationCap,
  Coffee,
  Mountain,
} from "lucide-react";

export const groupCategories = [
  {
    id: "sports",
    name: "Sports",
    description: "Find your team. Make your next game happen.",
    icon: Trophy,
    color: "mint",
    examples: "Football · Cricket · Badminton",
  },
  {
    id: "wellbeing",
    name: "Wellbeing",
    description: "Small habits. A healthier, happier you.",
    icon: HeartPulse,
    color: "rose",
    examples: "Yoga · Mindfulness · Fitness",
  },
  {
    id: "arts",
    name: "Arts & culture",
    description: "A little inspiration goes a long way.",
    icon: Palette,
    color: "lilac",
    examples: "Music · Movies · Photography",
  },
  {
    id: "learning",
    name: "Learning & growth",
    description: "Trade ideas and grow together.",
    icon: GraduationCap,
    color: "sky",
    examples: "Study circles · Tech · Careers",
  },
  {
    id: "social",
    name: "Social & food",
    description: "Good conversations start here.",
    icon: Coffee,
    color: "peach",
    examples: "Coffee · Cooking · Board games",
  },
  {
    id: "outdoors",
    name: "Outdoors",
    description: "Fresh air. New places. Great company.",
    icon: Mountain,
    color: "sand",
    examples: "Hiking · Travel · Cycling",
  },
] as const;
export type CategoryId = (typeof groupCategories)[number]["id"];
export function getCategory(id?: string) {
  return groupCategories.find((c) => c.id === id) ?? groupCategories[4];
}
