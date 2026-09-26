import type { Project } from "../content/site";
export type ThemeId =
  "glass" | "gothic" | "minimal" | "daisy" | "hyper" | "starwind";
export type Page = "home" | "projects";
export interface PresentationProps {
  page: Page;
  projects: Project[];
  query: string;
  category: string;
  setQuery: (value: string) => void;
  setCategory: (value: string) => void;
  openProject: (project: Project) => void;
  navigate: (page: Page) => void;
}
