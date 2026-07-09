import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True only after client hydration — safe gate for browser-only UI (e.g. Leaflet maps). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
