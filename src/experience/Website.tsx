import { useEffect, useRef, useState } from "react";
import { projects, site, type Project } from "../content/site";
import Daisy from "../themes/Daisy";
import Hyper from "../themes/Hyper";
import Tailwind from "../themes/Tailwind";
import Starwind from "../themes/Starwind";
import type { Page, ThemeId } from "./types";
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const href = (page: Page) =>
  `${base}/${page === "projects" ? "projects/" : ""}`;
export default function Website({ initialPage }: { initialPage: Page }) {
  const [theme, setTheme] = useState<ThemeId>("tailwind");
  const [style, setStyle] = useState("glass");
  const [page, setPage] = useState<Page>(initialPage);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-theme");
      if (
        saved === "hyper" ||
        saved === "daisy" ||
        saved === "tailwind" ||
        saved === "starwind"
      )
        setTheme(saved);
      const savedStyle = localStorage.getItem("portfolio-style");
      if (savedStyle && ["glass", "brutalist", "minimal"].includes(savedStyle))
        setStyle(savedStyle);
    } catch {}
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
      localStorage.setItem("portfolio-theme", next);
    } catch {}
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
      className={`website theme-${theme} style-${style}`}
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
          <span id="theme-label">Try a different look</span>
          <div role="group" aria-labelledby="theme-label">
            {(["tailwind", "daisy", "hyper", "starwind"] as ThemeId[]).map(
              (id) => (
                <button
                  key={id}
                  aria-pressed={theme === id}
                  onClick={() => changeTheme(id)}
                >
                  {id === "daisy"
                    ? "daisyUI"
                    : id === "hyper"
                      ? "HyperUI"
                      : id === "starwind"
                        ? "Starwind"
                        : "Tailwind"}
                </button>
              ),
            )}
          </div>
          {theme === "tailwind" && (
            <label className="style-picker">
              Style{" "}
              <select
                aria-label="Tailwind style"
                value={style}
                onChange={(e) => {
                  setStyle(e.target.value);
                  try {
                    localStorage.setItem("portfolio-style", e.target.value);
                  } catch {}
                }}
              >
                <option value="glass">Glass</option>
                <option value="brutalist">Brutalist</option>
                <option value="minimal">Minimal</option>
              </select>
            </label>
          )}
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
                className="detail-symbol"
                style={{ background: selected.color }}
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
