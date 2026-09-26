export const site = {
  name: "Leon's workshop",
  headline: "Small ideas. Useful things.",
  intro:
    "A collection of experiments in making everyday life a little more considered. Built with curiosity, refined by using them.",
  note: "A demo portfolio. These sample projects share one content source across every design.",
};
export const projects = [
  {
    id: "fieldnotes",
    name: "Fieldnotes",
    category: "Product",
    year: "2026",
    color: "#c8dfce",
    symbol: "✳",
    description: "A quiet place to collect the things you notice.",
    detail:
      "An exploration of a personal notebook that connects short observations, saved places, and photographs. Designed around a simple daily writing habit.",
  },
  {
    id: "tempo",
    name: "Tempo",
    category: "Tool",
    year: "2026",
    color: "#cdd8ff",
    symbol: "◷",
    description: "Make room for focus, one session at a time.",
    detail:
      "A focus timer concept with deliberate breaks, a gentle progress indicator, and a history of completed sessions. Fewer controls, more space to think.",
  },
  {
    id: "common-ground",
    name: "Common ground",
    category: "Product",
    year: "2025",
    color: "#ffd0b8",
    symbol: "⌘",
    description: "A neighborhood guide made by its neighbors.",
    detail:
      "A community directory concept for independent shops, small events, and favorite local places. An experiment in useful, human-scale discovery.",
  },
  {
    id: "spectrum",
    name: "Spectrum",
    category: "Experiment",
    year: "2025",
    color: "#e5d0f3",
    symbol: "◒",
    description: "Color combinations worth keeping around.",
    detail:
      "A color collection experiment exploring contrast, unexpected pairings, and how a palette changes the feeling of a familiar interface.",
  },
  {
    id: "shelf",
    name: "Shelf",
    category: "Tool",
    year: "2025",
    color: "#efe1a8",
    symbol: "▤",
    description: "Your next good read, already waiting.",
    detail:
      "A personal reading-list concept that organizes books by mood and curiosity instead of an endless chronological queue.",
  },
  {
    id: "waypoint",
    name: "Waypoint",
    category: "Experiment",
    year: "2024",
    color: "#b8dfeb",
    symbol: "↗",
    description: "Take the interesting way home.",
    detail:
      "A walking-route experiment about making familiar neighborhoods feel new. Collect a few landmarks and build a walk around them.",
  },
];
export type Project = (typeof projects)[number];
