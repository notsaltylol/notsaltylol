import content from "./resume.json";

export const resume = content;
export const resumeVariants = content.variants;
export type ResumeFocus = (typeof resumeVariants)[number]["id"];

/** One source of truth for the page, role filters, and PDF generator. */
export function getResume(focus = "default") {
  const variant = resumeVariants.find((item) => item.id === focus);
  if (!variant) throw new Error(`Unknown résumé focus: ${focus}`);
  const select = <
    T extends { bullets: { id: string; text: string; focus: string[] }[] },
  >(
    entries: T[],
  ) =>
    entries
      .map((entry) => ({
        ...entry,
        bullets: entry.bullets.filter(
          (bullet) => focus === "all" || bullet.focus.includes(focus),
        ),
      }))
      .filter((entry) => entry.bullets.length > 0);
  const experience = select(content.experience);
  const projects = select(content.projects);
  return {
    ...content,
    variant,
    experience,
    projects,
    bulletCount: [...experience, ...projects].reduce(
      (total, entry) => total + entry.bullets.length,
      0,
    ),
  };
}
