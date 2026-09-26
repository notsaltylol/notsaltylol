import Button from "../components/starwind-react/button/Button";
import Card from "../components/starwind-react/card/Card";
import Badge from "../components/starwind-react/badge/Badge";
import Input from "../components/starwind-react/input/Input";
import { site } from "../content/site";
import type { PresentationProps } from "../experience/types";
import { Artwork } from "./shared";
export default function Starwind(p: PresentationProps) {
  const home = p.page === "home";
  return (
    <div className="starwind-presentation">
      <header className="starwind-heading">
        <div>
          <Badge variant="secondary">The workshop</Badge>
          <h1>{home ? site.headline : "Projects & experiments"}</h1>
          <p>
            {home
              ? site.intro
              : "A growing collection of small tools, product concepts, and things made for the joy of it."}
          </p>
          {home && (
            <Button onClick={() => p.navigate("projects")}>
              Browse projects
            </Button>
          )}
        </div>
        <aside>
          <span aria-hidden="true">✧</span>
          <p>
            Make something.
            <br />
            Learn something.
            <br />
            Make it better.
          </p>
        </aside>
      </header>
      <section aria-label={home ? "Selected projects" : "All projects"}>
        {home ? (
          <div className="section-heading">
            <h2>From the workbench</h2>
            <Badge variant="outline">Three highlights</Badge>
          </div>
        ) : (
          <div className="gallery-controls">
            <div className="w-full sm:w-80">
              <Input
                aria-label="Search projects"
                placeholder="Search projects…"
                value={p.query}
                onValueChange={(value) => p.setQuery(value)}
              />
            </div>
            <div className="filter-group" aria-label="Filter projects">
              {["All", "Product", "Tool", "Experiment"].map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={p.category === c ? "default" : "ghost"}
                  aria-pressed={p.category === c}
                  onClick={() => p.setCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="starwind-grid">
          {(home ? p.projects.slice(0, 3) : p.projects).map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden border border-border p-0 gap-0"
            >
              <Artwork project={project} />
              <div className="p-6">
                <div className="card-meta">
                  <Badge variant="outline">{project.category}</Badge>
                  <span>{project.year}</span>
                </div>
                <h2 className="mt-5 mb-3 text-2xl font-semibold">
                  {project.name}
                </h2>
                <p className="mb-6 leading-relaxed">{project.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => p.openProject(project)}
                >
                  Explore {project.name}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {p.projects.length === 0 && (
          <p className="empty-state">
            No matching projects. Try another search or category.
          </p>
        )}
      </section>
    </div>
  );
}
