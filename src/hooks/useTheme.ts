import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();
let current: Theme = "dark";

function readInitial(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

if (typeof document !== "undefined") {
  current = readInitial();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setTheme(theme: Theme) {
  current = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("rs-theme", theme);
  } catch {
    // ignore
  }
  listeners.forEach((cb) => cb());
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => "dark" as Theme,
  );
  return { theme, isDark: theme === "dark", toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
