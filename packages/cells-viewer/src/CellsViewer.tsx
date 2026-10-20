import { useMemo, useSyncExternalStore } from "react";
import type { CellStore } from "./core";
import { StableStoreContext, StoreContext } from "./hooks";
import { CommitReporter, Component } from "./renderers";
import "./viewer.css";

/** The rendered document of a loaded store. Re-renders the whole tree when
 * a tick rebuilt the document; children are keyed by stable identity, so
 * this is an update pass over surviving components, not a remount
 * (ADR 0004). */
export function CellsViewer({ store }: { store: CellStore }) {
    const version = useSyncExternalStore(
        (fn) => store.subscribeStructure(fn),
        () => store.structureVersion,
    );
    const value = useMemo(() => ({ store, version }), [store, version]);
    return (
        <StableStoreContext.Provider value={store}>
            <StoreContext.Provider value={value}>
                <CommitReporter />
                <Component idx={store.comps.root} inGraph={false} />
            </StoreContext.Provider>
        </StableStoreContext.Provider>
    );
}
