// The prototype viewer, which renders the flat DAST the Rust core produces,
// mounted with the Rust core and driven from `window.__rust`: load a source,
// say when it has rendered, resolve a name, dispatch an action as a renderer
// would. Imports the prototype's sources so the store is the viewer's own.
// The prototype's entry first: its modules import one another in a cycle
// that only resolves in the order the entry sets.
import "../../../doenetml-prototype/src/index";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { MathJaxContext } from "better-react-mathjax";
import { PageViewer } from "../../../doenetml-prototype/src/viewer/page-viewer";
import { store } from "../../../doenetml-prototype/src/state/store";
import { defaultFlags } from "../../../doenetml-prototype/src/DoenetML";
import {
    coreThunks,
    getWorker,
} from "../../../doenetml-prototype/src/state/redux-slices/core/thunks";
import { numberFromSerializedAst } from "../../../doenetml-prototype/src/utils/math/math-expression-utils";

const root = createRoot(document.getElementById("root")!);
const flags = {
    ...defaultFlags,
    allowSaveState: false,
    allowLocalState: false,
};

/** A render that throws ends the load with its message instead of a blank page. */
class Boundary extends React.Component<{ children: React.ReactNode }> {
    state = { failed: false };
    static getDerivedStateFromError() {
        return { failed: true };
    }
    componentDidCatch(e: Error) {
        rust.renderError = e.message;
    }
    render() {
        return this.state.failed ? null : this.props.children;
    }
}

const rust = {
    ready: false,
    renderError: null as string | null,
    /** Render `source`; resolves once the core has returned its first flat DAST. */
    async loadSource(source: string) {
        rust.ready = false;
        rust.renderError = null;
        root.render(
            <Boundary>
                <Provider store={store}>
                    <MathJaxContext>
                        <PageViewer
                            source={source}
                            flags={flags}
                            darkMode="light"
                            coreType="rust"
                        />
                    </MathJaxContext>
                </Provider>
            </Boundary>,
        );
        for (;;) {
            const s = store.getState();
            if (s.core.inErrorState) throw new Error("core start failed");
            if (s.dast.flatDastRoot.elements.length > 0) break;
            await new Promise((ok) => setTimeout(ok, 5));
        }
        rust.ready = true;
    },
    /** Component index of a name path (`p3.mi`, `P[2]`), or -1. */
    async resolve(name: string, origin = 0): Promise<number> {
        const path = name.split(".").map((part) => {
            const m = part.match(/^([\w-]+)((\[\d+\])*)$/);
            if (!m) throw new Error(`Invalid name to resolve: ${name}`);
            const index = [...m[2].matchAll(/\[(\d+)\]/g)].map(([, n]) => ({
                value: [n],
            }));
            return { type: "flatPathPart", name: m[1], index };
        });
        try {
            const r = await getWorker(store.getState())!.resolvePath({
                path: { path } as any,
                origin,
                skipParentSearch: false,
            });
            return r.unresolvedPath === null ? r.nodeIdx : -1;
        } catch {
            return -1;
        }
    },
    componentType(idx: number): string | undefined {
        const el = store.getState().dast.flatDastRoot.elements[idx] as any;
        return el?.name;
    },
    /** A point's coordinates as the viewer holds them. */
    pointCoords(idx: number): [number, number] | null {
        const el = store.getState().dast.flatDastRoot.elements[idx] as any;
        const props = el?.data?.props;
        if (!props?.x) return null;
        return [
            numberFromSerializedAst(props.x.math_object),
            numberFromSerializedAst(props.y.math_object),
        ];
    },
    /** Dispatch through the store, as a renderer does; resolves when the updates are in the store. */
    async dispatch(action: Record<string, unknown>) {
        await store.dispatch(coreThunks.dispatchAction(action as any));
        if (store.getState().core.inErrorState)
            throw new Error(`action ${JSON.stringify(action)} failed`);
    },
};
(window as any).__rust = rust;
