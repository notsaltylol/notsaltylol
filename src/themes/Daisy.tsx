import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";
export default function Daisy(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="daisy-presentation">
      {home ? (
        <section className="daisy-hero">
          <div>
            <span className="badge badge-outline">
              An independent maker's notebook
            </span>
            <h1>{site.headline}</h1>
            <p>{site.intro}</p>
            <button
              className="btn btn-primary"
              onClick={() => p.navigate("projects")}
            >
              Explore my projects <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="featured-stack">
            <div className="stack-back" />
            <button
              className="featured-card card bg-base-100"
              onClick={() => p.openProject(p.projects[0])}
            >
              <Artwork project={p.projects[0]} />
              <div className="card-body">
                <span className="badge badge-soft badge-secondary">
                  Latest exploration
                </span>
                <h2 className="card-title">{p.projects[0].name}</h2>
                <p>{p.projects[0].description}</p>
              </div>
            </button>
          </div>
        </section>
      ) : (
        <header className="gallery-heading">
          <span className="badge badge-soft badge-primary">The collection</span>
          <h1>Project gallery</h1>
          <p>
            A few things made out of curiosity. Find something that catches
            yours.
          </p>
        </header>
      )}
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <div className="section-heading">
            <h2>Selected projects</h2>
            <button
              className="btn btn-ghost"
              onClick={() => p.navigate("projects")}
            >
              View all six
            </button>
          </div>
        ) : (
          <div className="gallery-controls">
            <label className="input-bordered search-field input">
              <span aria-hidden="true">⌕</span>
              <input
                aria-label="Search projects"
                placeholder="Search the collection"
                value={p.query}
                onChange={(e) => p.setQuery(e.target.value)}
              />
            </label>
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((c) => (
                <button
                  key={c}
                  className={`btn btn-sm ${p.category === c ? "btn-primary" : "btn-ghost"}`}
                  aria-pressed={p.category === c}
                  onClick={() => p.setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="daisy-grid">
          {(home ? p.projects.slice(1, 4) : p.projects).map((project) => (
            <button
              key={project.id}
              id={project.id}
              className="project-card card bg-base-100"
              onClick={() => p.openProject(project)}
            >
              <Artwork project={project} />
              <div className="card-body">
                <div className="card-meta">
                  <span className="badge badge-outline">
                    {project.category}
                  </span>
                  <span>{project.year}</span>
                </div>
                <h2 className="card-title">{project.name}</h2>
                <p>{project.description}</p>
              </div>
            </button>
          ))}
        </div>
        {!home && p.projects.length === 0 && (
          <p className="empty-state">
            No projects match. Try another search or category.
          </p>
        )}
      </section>
    </div>
  );
}
