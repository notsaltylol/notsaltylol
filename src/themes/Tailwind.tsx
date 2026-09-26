import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";
export default function Tailwind(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <>
      <header className="relative max-w-[850px] py-10 sm:py-16 gothic:mx-auto gothic:my-10 gothic:rounded-t-[48%] gothic:border-y gothic:border-line gothic:px-3 gothic:pt-16 gothic:text-center gothic:sm:my-12 gothic:sm:px-9 gothic:sm:pt-20">
        <span
          aria-hidden="true"
          className="absolute top-3 left-1/2 hidden -translate-x-1/2 text-3xl text-action gothic:block"
        >
          ✦
        </span>
        <p className="text-sm text-content-muted">
          A personal collection of ideas
        </p>
        <h1 className="my-6 font-display text-hero font-heading tracking-display text-balance text-heading">
          {home ? site.headline : "The project gallery."}
        </h1>
        <p className="mb-7 max-w-[610px] text-lg leading-relaxed gothic:mx-auto">
          {home
            ? site.intro
            : "Products, practical tools, and experiments. Browse the collection or find something specific."}
        </p>
        {home && (
          <button
            className="rounded-control border-frame border-line bg-action px-6 py-3 font-controls font-semibold text-on-action shadow-action hover:brightness-95"
            onClick={() => p.navigate("projects")}
          >
            Explore the collection
          </button>
        )}
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-title tracking-tight text-heading">
              Selected projects
            </h2>
            <span className="text-sm text-content-muted">
              Made with curiosity
            </span>
          </div>
        ) : (
          <div className="gallery-controls">
            <input
              className="w-full rounded-control border-frame border-line bg-surface px-4 py-3 text-content placeholder:text-content-muted sm:w-80"
              aria-label="Search projects"
              placeholder="Search projects…"
              value={p.query}
              onChange={(e) => p.setQuery(e.target.value)}
            />
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((c) => (
                <button
                  className="rounded-control border-frame border-transparent px-4 py-2 font-controls text-sm hover:bg-surface-hover aria-pressed:border-line aria-pressed:bg-action aria-pressed:text-on-action"
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
              className="overflow-hidden rounded-panel border-frame border-line bg-surface text-left text-content shadow-panel backdrop-blur-surface hover:border-line-hover hover:bg-surface-hover"
              key={project.id}
              id={project.id}
              onClick={() => p.openProject(project)}
            >
              <Artwork project={project} />
              <div className="p-6">
                <div className="flex justify-between gap-3 text-xs text-content-muted">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <h2 className="mt-5 mb-3 font-display text-2xl font-title text-heading">
                  {project.name}
                </h2>
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
    </>
  );
}
