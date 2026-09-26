import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";
export default function Tailwind(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="custom-presentation">
      <header className="custom-hero">
        <p className="custom-kicker">A personal collection of ideas</p>
        <h1>{home ? site.headline : "The project gallery."}</h1>
        <p>
          {home
            ? site.intro
            : "Products, practical tools, and experiments. Browse the collection or find something specific."}
        </p>
        {home && (
          <button
            className="custom-button"
            onClick={() => p.navigate("projects")}
          >
            Explore the collection
          </button>
        )}
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <div className="section-heading">
            <h2>Selected projects</h2>
            <span>Made with curiosity</span>
          </div>
        ) : (
          <div className="gallery-controls">
            <input
              className="custom-search"
              aria-label="Search projects"
              placeholder="Search projects…"
              value={p.query}
              onChange={(e) => p.setQuery(e.target.value)}
            />
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((c) => (
                <button
                  className="custom-filter"
                  key={c}
                  aria-pressed={p.category === c}
                  onClick={() => p.setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(home ? p.projects.slice(0, 3) : p.projects).map((project) => (
            <button
              className="custom-card text-left"
              key={project.id}
              onClick={() => p.openProject(project)}
            >
              <Artwork project={project} />
              <div className="p-6">
                <div className="card-meta">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h2 className="mt-5 mb-3 text-2xl font-bold">{project.name}</h2>
                <p className="leading-relaxed">{project.description}</p>
              </div>
            </button>
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
