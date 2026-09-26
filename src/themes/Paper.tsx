import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";

export default function Paper(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="paper-presentation">
      <header className="paper-heading">
        <span className="badge">Notes from the workbench</span>
        <h1>{home ? site.headline : "The project sketchbook."}</h1>
        <p>
          {home
            ? site.intro
            : "A few ideas worth putting on paper. Find a project and take a closer look."}
        </p>
        {home && (
          <button onClick={() => p.navigate("projects")}>
            Open the sketchbook
          </button>
        )}
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <h2 className="paper-section-title">A few pages to start with</h2>
        ) : (
          <div className="gallery-controls">
            <input
              aria-label="Search projects"
              placeholder="Search the sketchbook…"
              value={p.query}
              onChange={(e) => p.setQuery(e.target.value)}
            />
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((category) => (
                <button
                  key={category}
                  className={
                    p.category === category ? "btn-primary" : "btn-small"
                  }
                  aria-pressed={p.category === category}
                  onClick={() => p.setCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="paper-grid">
          {(home ? p.projects.slice(0, 3) : p.projects).map((project) => (
            <article className="card border" id={project.id} key={project.id}>
              <Artwork project={project} />
              <div className="card-body">
                <div className="card-meta">
                  <span className="badge">{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h2 className="card-title">{project.name}</h2>
                <p className="card-text">{project.description}</p>
                <button onClick={() => p.openProject(project)}>
                  Explore {project.name}
                </button>
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
