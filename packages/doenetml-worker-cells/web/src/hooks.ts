import { createContext, useContext, useSyncExternalStore } from "react";
import type { CellStore } from "./core";

/** The store plus its structure version: the version changes when a tick
 * rebuilt the document, so every consumer re-renders and re-reads the new
 * component table and cell indices. */
export const StoreContext = createContext<{ store: CellStore; version: number } | null>(null);

export function useStore(): CellStore {
  const s = useContext(StoreContext);
  if (!s) throw new Error("no store");
  return s.store;
}

/** Subscribe one component to one cell index. */
export function useCell(cell: number): number {
  const store = useStore();
  return useSyncExternalStore(
    (fn) => store.subscribe(cell, fn),
    () => store.get(cell),
  );
}
