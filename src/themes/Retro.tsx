import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";

export default function Retro(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="retro-presentation retro-surface">
      <header className="window retro-heading">
        <div className="title-bar">
          <div className="title-bar-text">
            {home ? "Welcome.exe" : "Project Explorer"}
          </div>
        </div>
        <div className="window-body">
          <p>Leon's workshop — Personal Edition</p>
          <h1>{home ? site.headline : "Project Explorer"}</h1>
          <p>
            {home
              ? site.intro
              : "Browse the collection, search for an idea, or open a project to see more."}
          </p>
          {home && (
            <button onClick={() => p.navigate("projects")}>
              Browse projects
            </button>
          )}
        </div>
        <div className="status-bar">
          <p className="status-bar-field">Ready</p>
          <p className="status-bar-field">{p.projects.length} projects</p>
        </div>
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <h2 className="retro-section-title">Selected projects</h2>
        ) : (
          <div className="window gallery-controls retro-controls">
            <label className="field-row">
              Find:{" "}
              <input
                type="text"
                aria-label="Search projects"
                placeholder="Search projects…"
                value={p.query}
                onChange={(e) => p.setQuery(e.target.value)}
              />
            </label>
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((category) => (
                <button
                  key={category}
                  aria-pressed={p.category === category}
                  onClick={() => p.setCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="retro-grid">
          {(home ? p.projects.slice(0, 3) : p.projects).map((project) => (
            <article className="window" key={project.id} id={project.id}>
              <div className="title-bar">
                <h2 className="title-bar-text">{project.name}</h2>
              </div>
              <Artwork project={project} />
              <div className="window-body">
                <p>{project.description}</p>
                <button onClick={() => p.openProject(project)}>
                  Explore {project.name}
                </button>
              </div>
              <div className="status-bar">
                <span className="status-bar-field">{project.category}</span>
                <span className="status-bar-field">{project.year}</span>
              </div>
            </article>
          ))}
        </div>
        {p.projects.length === 0 && (
          <p className="empty-state">
            No projects match. Try another search or category.
          </p>
        )}
      </section>
    </div>
  );
}
