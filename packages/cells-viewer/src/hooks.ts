import { createContext, useContext, useSyncExternalStore } from "react";
import type { CellStore } from "./core";

/** The store plus its structure version: the version changes when a tick
 * rebuilt the document, so every consumer re-renders and re-reads the new
 * component table and cell indices. */
export const StoreContext = createContext<{
    store: CellStore;
    version: number;
} | null>(null);

export function useStore(): CellStore {
    const s = useContext(StoreContext);
    if (!s) throw new Error("no store");
    return s.store;
}

/**
 * `useSyncExternalStore` for a value read from the store. The store is
 * the same object on a server rendering the document to HTML
 * (`renderToString`) as in the browser, so the server's snapshot is the
 * browser's getter; React throws on the server without one.
 */
export function useStoreSnapshot<T>(
    subscribe: (fn: () => void) => () => void,
    getSnapshot: () => T,
): T {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** Subscribe one component to one cell index. */
export function useCell(cell: number): number {
    const store = useStore();
    return useStoreSnapshot(
        (fn) => store.subscribe(cell, fn),
        () => store.get(cell),
    );
}
