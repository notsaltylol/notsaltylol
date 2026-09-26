import type { CSSProperties } from "react";
import type { Project } from "../content/site";
export function Artwork({ project }: { project: Project }) {
  return (
    <div
      className="artwork bg-project-art"
      style={{ "--project-color": project.color } as CSSProperties}
      aria-hidden="true"
    >
      <span className="art-orbit" />
      <span className="art-symbol">{project.symbol}</span>
      <span className="art-name">{project.name}</span>
    </div>
  );
}
