import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects, site, type Project } from "../content/site";
import Daisy from "../themes/Daisy";
import Hyper from "../themes/Hyper";
import Tailwind from "../themes/Tailwind";
import Starwind from "../themes/Starwind";
import ColorModeSwitch from "./ColorModeSwitch";
import type { Page, ThemeId } from "./types";
type ColorMode = "light" | "dark";
const themes: { id: ThemeId; label: string }[] = [
  { id: "glass", label: "Glass" },
  { id: "gothic", label: "Gothic" },
  { id: "minimal", label: "Minimal" },
  { id: "daisy", label: "daisyUI" },
  { id: "hyper", label: "HyperUI" },
  { id: "starwind", label: "Starwind" },
];
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const href = (page: Page) =>
  `${base}/${page === "projects" ? "projects/" : ""}`;
export default function Website({ initialPage }: { initialPage: Page }) {
  const [mode, setMode] = useState<ColorMode | null>(null);
  const [theme, setTheme] = useState<ThemeId>("glass");
  const [page, setPage] = useState<Page>(initialPage);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("portfolio-mode");
    } catch {
      /* Use light mode when storage is unavailable. */
    }
    setMode(saved === "dark" ? "dark" : "light");
  }, []);
  useEffect(() => {
    if (!mode) return;
    document.documentElement.dataset.mode = mode;
  }, [mode]);
  function changeMode(next: ColorMode) {
    setMode(next);
    try {
      localStorage.setItem("portfolio-mode", next);
    } catch {
      /* The current visit still works without persistent storage. */
    }
  }
  useEffect(() => {
    const styles = themes.map(({ id }) => id);
    let previousStyle = "glass";
    try {
      previousStyle = localStorage.getItem("portfolio-style") ?? "glass";
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
    const choices = styles.filter((candidate) => candidate !== previousStyle);
    const nextStyle = choices[Math.floor(Math.random() * choices.length)];
    setTheme(nextStyle);
    try {
      localStorage.setItem("portfolio-style", nextStyle);
    } catch {
      /* The current visit still works without persistent storage. */
    }
    const back = () => {
      setPage(
        location.pathname.replace(/\/$/, "") === `${base}/projects`
          ? "projects"
          : "home",
      );
      setSelected(null);
    };
    window.addEventListener("popstate", back);
    return () => window.removeEventListener("popstate", back);
  }, []);
  useEffect(() => {
    document.title = `${page === "home" ? "Home" : "Projects"} | ${site.name}`;
  }, [page]);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  function navigate(next: Page) {
    if (next === page) return;
    setPage(next);
    setSelected(null);
    history.pushState({}, "", href(next));
    window.scrollTo({ top: 0 });
  }
  function changeTheme(next: ThemeId) {
    setTheme(next);
    try {
      localStorage.setItem("portfolio-style", next);
    } catch {
      /* Randomization still works for this visit without storage. */
    }
  }
  const visible = projects.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  const Presentation =
    theme === "daisy"
      ? Daisy
      : theme === "hyper"
        ? Hyper
        : theme === "starwind"
          ? Starwind
          : Tailwind;
  return (
    <div
      className={`website theme-${theme}`}
      data-theme={theme === "daisy" ? "workshop" : "light"}
    >
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href={href("home")}
          onClick={(e) => {
            e.preventDefault();
            navigate("home");
          }}
        >
          <span className="brand-mark" aria-hidden="true">
            lk
          </span>
          {site.name}
        </a>
        <nav aria-label="Main navigation">
          {(["home", "projects"] as Page[]).map((item) => (
            <a
              key={item}
              href={href(item)}
              aria-current={page === item ? "page" : undefined}
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                  e.preventDefault();
                  navigate(item);
                }
              }}
            >
              {item === "home" ? "Home" : "Projects"}
            </a>
          ))}
        </nav>
        <div className="theme-picker">
          <div className="style-buttons" role="group" aria-label="Visual style">
            {themes.map(({ id, label }) => (
              <button
                key={id}
                aria-pressed={theme === id}
                onClick={() => changeTheme(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <ColorModeSwitch
            theme={theme}
            dark={mode === "dark"}
            onChange={(dark) => changeMode(dark ? "dark" : "light")}
          />
        </div>
      </header>
      <main id="main">
        <Presentation
          page={page}
          projects={page === "home" ? projects : visible}
          query={query}
          category={category}
          setQuery={setQuery}
          setCategory={setCategory}
          openProject={setSelected}
          navigate={navigate}
        />
      </main>
      <footer>
        <span>{site.note}</span>
        <span>Same ideas. Another perspective.</span>
      </footer>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="project-title"
        onCancel={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        <div className="dialog-content">
          <button
            className="dialog-close"
            aria-label="Close project details"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          {selected && (
            <>
              <span
                className="detail-symbol bg-project-art"
                style={{ "--project-color": selected.color } as CSSProperties}
                aria-hidden="true"
              >
                {selected.symbol}
              </span>
              <p>
                {selected.category} / {selected.year} / Sample project
              </p>
              <h2 id="project-title">{selected.name}</h2>
              <p>{selected.detail}</p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
