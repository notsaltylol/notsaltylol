import { Switch } from "@starwind-ui/react/switch";
import type { ThemeId } from "./types";

export default function ColorModeSwitch({
  theme,
  dark,
  onChange,
}: {
  theme: ThemeId;
  dark: boolean;
  onChange: (dark: boolean) => void;
}) {
  if (theme === "nes") {
    return (
      <label className="mode-switch nes-surface">
        <input
          className={`nes-checkbox ${dark ? "is-dark" : ""}`}
          type="checkbox"
          role="switch"
          aria-label="Dark mode"
          checked={dark}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span>Dark mode</span>
      </label>
    );
  }
  if (theme === "retro") {
    return (
      <div className="mode-switch retro-surface">
        <input
          id="retro-dark-mode"
          type="checkbox"
          role="switch"
          aria-label="Dark mode"
          checked={dark}
          onChange={(event) => onChange(event.target.checked)}
        />
        <label htmlFor="retro-dark-mode">Dark mode</label>
      </div>
    );
  }
  return (
    <div className="mode-switch">
      <span>Light</span>
      {theme === "starwind" ? (
        <Switch.Root
          aria-label="Dark mode"
          checked={dark}
          onCheckedChange={onChange}
          className="inline-flex h-6 w-11 cursor-pointer items-center rounded-full border border-border bg-muted p-0.5 data-[checked]:bg-primary"
        >
          <Switch.Thumb className="size-4 rounded-full bg-foreground transition-transform data-[checked]:translate-x-5 data-[checked]:bg-primary-foreground" />
        </Switch.Root>
      ) : (
        <input
          type="checkbox"
          role="switch"
          aria-label="Dark mode"
          checked={dark}
          onChange={(event) => onChange(event.target.checked)}
          className={
            theme === "daisy"
              ? "toggle toggle-primary toggle-sm"
              : "color-switch"
          }
        />
      )}
      <span>Dark</span>
    </div>
  );
}
