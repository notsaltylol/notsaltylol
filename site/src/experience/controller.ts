import { navigate } from "astro:transitions/client";
import { createSwitch } from "@starwind-ui/runtime/switch";
import { projects } from "../content/site";
import { themes } from "./themes";

let query = "";
let category = "All";
const activePanel = () =>
  document.querySelector<HTMLElement>(
    `[data-presentation="${document.documentElement.dataset.style}"]`,
  );
const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences still work for this visit. */
  }
};
function syncControls() {
  const dark = document.documentElement.dataset.mode === "dark";
  document
    .querySelectorAll<HTMLInputElement>("input[data-mode-switch]")
    .forEach((input) => {
      input.checked = dark;
      if (input.classList.contains("nes-checkbox"))
        input.classList.toggle("is-dark", dark);
    });
  document
    .querySelectorAll<HTMLElement>("[data-sw-switch][data-mode-switch]")
    .forEach((root) => createSwitch(root).setChecked(dark, { emit: false }));
}
function filterProjects() {
  document
    .querySelectorAll<HTMLInputElement>("[data-search]")
    .forEach((input) => {
      input.value = query;
    });
  document
    .querySelectorAll<HTMLElement>("[data-category]")
    .forEach((button) => {
      const selected = button.dataset.category === category;
      button.setAttribute("aria-pressed", String(selected));
      button.classList.toggle("active", selected);
      if (button.closest(".theme-daisy")) {
        button.classList.toggle("btn-primary", selected);
        button.classList.toggle("btn-ghost", !selected);
      }
      if (button.closest(".theme-nes"))
        button.classList.toggle("is-primary", selected);
      if (button.closest(".theme-paper"))
        button.classList.toggle("btn-primary", selected);
    });
  document
    .querySelectorAll<HTMLElement>('[data-presentation][data-page="projects"]')
    .forEach((panel) => {
      let count = 0;
      panel
        .querySelectorAll<HTMLElement>("[data-project-card]")
        .forEach((card) => {
          const project = projects.find(
            (project) => project.id === card.dataset.projectCard,
          );
          const match =
            !!project &&
            (category === "All" || project.category === category) &&
            `${project.name} ${project.description}`
              .toLowerCase()
              .includes(query.toLowerCase());
          card.hidden = !match;
          if (match) count++;
        });
      panel.querySelectorAll<HTMLElement>("[data-empty]").forEach((empty) => {
        empty.hidden = count > 0;
      });
    });
}
function openProject(id: string, trigger?: HTMLElement) {
  const project = projects.find((project) => project.id === id);
  const panel = activePanel();
  const dialog = panel?.querySelector<HTMLDialogElement>("dialog");
  if (!project || !dialog) return;
  const text = (selector: string, value: string) => {
    dialog.querySelector(selector)!.textContent = value;
  };
  text("[data-detail-title]", project.name);
  text(
    "[data-detail-meta]",
    `${project.category} / ${project.year} / Sample project`,
  );
  text("[data-detail-text]", project.detail);
  text("[data-detail-symbol]", project.symbol);
  dialog
    .querySelector<HTMLElement>("[data-detail-symbol]")!
    .style.setProperty("--project-color", project.color);
  dialog.showModal();
  dialog.addEventListener("close", () => trigger?.focus(), { once: true });
}
function setMode(dark: boolean) {
  document.documentElement.dataset.mode = dark ? "dark" : "light";
  save("portfolio-mode", dark ? "dark" : "light");
  syncControls();
}
document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest<HTMLElement>(
    "button[data-style], [data-category], [data-open-project], [data-close-dialog], [data-navigate]",
  );
  if (
    button?.dataset.style &&
    themes.some((theme) => theme.id === button.dataset.style)
  ) {
    document
      .querySelectorAll<HTMLDialogElement>("dialog[open]")
      .forEach((dialog) => dialog.close());
    document.documentElement.dataset.style = button.dataset.style;
    save("portfolio-style", button.dataset.style);
    syncControls();
    activePanel()
      ?.querySelector<HTMLElement>(`[data-style="${button.dataset.style}"]`)
      ?.focus({ preventScroll: true });
  } else if (button?.dataset.category) {
    category = button.dataset.category;
    filterProjects();
  } else if (button?.dataset.openProject) {
    openProject(button.dataset.openProject, button);
  } else if (button?.hasAttribute("data-close-dialog")) {
    button.closest<HTMLDialogElement>("dialog")?.close();
  } else if (button?.dataset.navigate) {
    void navigate(button.dataset.navigate);
  } else if (event.target instanceof HTMLDialogElement) {
    const rect = event.target.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      event.target.close();
  }
});
document.addEventListener("input", (event) => {
  if (
    event.target instanceof HTMLInputElement &&
    event.target.matches("[data-search]")
  ) {
    query = event.target.value;
    filterProjects();
  }
});
document.addEventListener("change", (event) => {
  if (
    event.target instanceof HTMLInputElement &&
    event.target.matches("[data-mode-switch]")
  )
    setMode(event.target.checked);
});
document.addEventListener("starwind:checked-change", (event) => {
  if (
    event instanceof CustomEvent &&
    event.target instanceof Element &&
    event.target.matches("[data-mode-switch]")
  )
    setMode(event.detail.checked);
});
document.addEventListener("astro:before-swap", (event) => {
  event.newDocument.documentElement.dataset.style =
    document.documentElement.dataset.style;
  event.newDocument.documentElement.dataset.mode =
    document.documentElement.dataset.mode;
});
function setup() {
  syncControls();
  filterProjects();
  if (location.hash) openProject(decodeURIComponent(location.hash.slice(1)));
}
document.addEventListener("astro:page-load", setup);
setup();
