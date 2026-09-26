import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";
// Card structure adapted from HyperUI's bordered/offset marketing cards.
export default function Hyper(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="hyper-presentation">
      <header className="hyper-heading">
        <div>
          <p className="hyper-intro">Independent ideas, out in the world.</p>
          <h1>{home ? site.headline : "Projects in the wild."}</h1>
        </div>
        <div className="hyper-side">
          <span className="big-asterisk" aria-hidden="true">
            ✳
          </span>
          <p>
            {home
              ? site.intro
              : "Tools, products, and experiments. Different questions, different ways of making."}
          </p>
          {home && (
            <button
              className="hyper-button"
              onClick={() => p.navigate("projects")}
            >
              See the collection <span aria-hidden="true">↗</span>
            </button>
          )}
        </div>
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <div className="section-heading">
            <h2>Things I've been making</h2>
            <span>Selected work / 2025–26</span>
          </div>
        ) : (
          <div className="gallery-controls">
            <label className="hyper-search">
              <span className="sr-only">Search projects</span>
              <input
                placeholder="Find a project…"
                value={p.query}
                onChange={(e) => p.setQuery(e.target.value)}
              />
              <span aria-hidden="true">⌕</span>
            </label>
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((c) => (
                <button
                  key={c}
                  className={`hyper-filter ${p.category === c ? "active" : ""}`}
                  aria-pressed={p.category === c}
                  onClick={() => p.setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="hyper-grid">
          {(home ? p.projects.slice(0, 3) : p.projects).map((project) => (
            <button
              key={project.id}
              id={project.id}
              className="group hyper-card relative block text-left"
              onClick={() => p.openProject(project)}
            >
              <span
                className="absolute inset-0 border-2 border-black"
                aria-hidden="true"
              />
              <div className="hyper-card-inner relative h-full border-2 border-black bg-white transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                <Artwork project={project} />
                <div className="hyper-card-copy">
                  <div className="card-meta">
                    <span>{project.category}</span>
                    <span>{project.year}</span>
                  </div>
                  <h2>
                    {project.name}
                    <span aria-hidden="true">↗</span>
                  </h2>
                  <p>{project.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        {!home && p.projects.length === 0 && (
          <p className="empty-state">
            Nothing here yet. Try another search or category.
          </p>
        )}
      </section>
    </div>
  );
}
