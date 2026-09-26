import type { Project } from "../content/site";
export type ThemeId = "daisy" | "hyper" | "tailwind" | "starwind";
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
