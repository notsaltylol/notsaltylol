import type { Project } from "../content/site";
export function Artwork({ project }: { project: Project }) {
  return (
    <div
      className="artwork"
      style={{ background: project.color }}
      aria-hidden="true"
    >
      <span className="art-orbit" />
      <span className="art-symbol">{project.symbol}</span>
      <span className="art-name">{project.name}</span>
    </div>
  );
}
