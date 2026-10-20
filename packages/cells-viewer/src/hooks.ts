import { createContext, useContext, useSyncExternalStore } from "react";
import type { CellStore } from "./core";

/** The store plus its structure version: the version changes when a tick
 * rebuilt the document, so every consumer re-renders and re-reads the new
 * component table and cell indices. */
export const StoreContext = createContext<{
    store: CellStore;
    version: number;
} | null>(null);

/** The store alone, which a rebuild does not replace: what a component
 * reads that rebinds itself on a rebuild (`renderers/prims.tsx`) instead
 * of re-rendering with the whole tree. */
export const StableStoreContext = createContext<CellStore | null>(null);

export function useStableStore(): CellStore {
    const s = useContext(StableStoreContext);
    if (!s) throw new Error("no store");
    return s;
}

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
