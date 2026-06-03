export type DiscoverySectionId =
  | "attention"
  | "missed"
  | "uncertainty"
  | "decision"
  | "next";

export interface DiscoverySection {
  id: DiscoverySectionId;
  emoji: string;
  title: string;
  tagline: string;
}

export const DISCOVERY_SECTIONS: DiscoverySection[] = [
  {
    id: "attention",
    emoji: "👀",
    title: "What Caught Our Attention",
    tagline: "The first signals that started this investigation",
  },
  {
    id: "missed",
    emoji: "🔍",
    title: "Signals We Almost Missed",
    tagline: "Evidence hiding behind the obvious story",
  },
  {
    id: "uncertainty",
    emoji: "⚠️",
    title: "Biggest Uncertainty",
    tagline: "What still gives us pause",
  },
  {
    id: "decision",
    emoji: "🧠",
    title: "How The Decision Was Made",
    tagline: "What changed our mind along the way",
  },
  {
    id: "next",
    emoji: "🚀",
    title: "What Happens Next",
    tagline: "Your move—explore or connect",
  },
];
