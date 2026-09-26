export type ThemeId =
  | "glass"
  | "gothic"
  | "minimal"
  | "daisy"
  | "hyper"
  | "starwind"
  | "paper"
  | "retro"
  | "nes";
export type Page = "home" | "projects";
export interface PresentationProps {
  page: Page;
  theme: ThemeId;
}
