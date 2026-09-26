import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";

export default function Nes(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="nes-presentation nes-surface">
      <header className="nes-container with-title nes-heading">
        <p className="title">{home ? "Player one" : "Select a project"}</p>
        <h1>{home ? site.headline : "Project select"}</h1>
        <p>
          {home
            ? site.intro
            : "Tools, experiments, and small adventures. Choose a project to continue."}
        </p>
        {home && (
          <button
            className="nes-btn is-primary"
            onClick={() => p.navigate("projects")}
          >
            Start exploring
          </button>
        )}
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <h2 className="nes-section-title">Choose your next adventure</h2>
        ) : (
          <div className="gallery-controls">
            <input
              className="nes-input"
              type="text"
              aria-label="Search projects"
              placeholder="Find a project"
              value={p.query}
              onChange={(e) => p.setQuery(e.target.value)}
            />
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((category) => (
                <button
                  key={category}
                  className={`nes-btn ${p.category === category ? "is-primary" : ""}`}
                  aria-pressed={p.category === category}
                  onClick={() => p.setCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="nes-project-grid">
          {(home ? p.projects.slice(0, 3) : p.projects).map((project) => (
            <article
              className="nes-container nes-project"
              key={project.id}
              id={project.id}
            >
              <Artwork project={project} />
              <div className="nes-project-copy">
                <p className="card-meta">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </p>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                <button
                  className="nes-btn"
                  onClick={() => p.openProject(project)}
                >
                  Explore {project.name}
                </button>
              </div>
            </article>
          ))}
        </div>
        {p.projects.length === 0 && (
          <p className="empty-state">No projects found. Try another search.</p>
        )}
      </section>
    </div>
  );
}
