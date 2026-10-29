// Installed into the prototype viewer's page (rust-viewer/) after it loads,
// on the Rust core or, as the bench's `cells-prototype` core, the cells core
// behind its bridge (`?core=cells`): the same `window.__bench` protocol as
// js.html, over the page's `window.__rust` hook. Actions go through the
// viewer's store, as its renderers send them, under the prototype's action
// names (a point's `move`, a text input's `updateImmediateValue`, a math
// input's `updateValue`); the Rust core has no math input and no answer, so
// typing into one or submitting one is a gap there.
(() => {
    function nextPaint() {
        return new Promise((ok) =>
            requestAnimationFrame(() => setTimeout(ok, 0)),
        );
    }
    function nextFrame() {
        return new Promise((ok) =>
            requestAnimationFrame(() => ok(performance.now())),
        );
    }
    function board() {
        return Object.values(window.JXG?.boards ?? {})[0] ?? null;
    }
    /** Whether the page runs the cells core; read once the page's hook is
     * there, which may be after this adapter is installed. */
    function cells() {
        return window.__rust?.coreType === "cells";
    }
    window.__bench = {
        ready: false,
        get core() {
            return cells() ? "cells-prototype" : "rust";
        },
        /** Text to first render: the core's first flat DAST, then the board or the document on the page. */
        async load(text, waitFor = {}) {
            while (!window.__rust)
                await new Promise((ok) => setTimeout(ok, 20));
            const t0 = performance.now();
            await window.__rust.loadSource(text);
            // The prototype does not give elements their name paths as ids,
            // so a fixture without a board waits for the rendered document.
            const present = () =>
                waitFor.board
                    ? (board()?.objectsList?.length ?? 0) > 0
                    : document.querySelector("#root .doenet-document") !== null;
            while (!present()) {
                if (window.__rust.renderError)
                    throw new Error(
                        "viewer error: " + window.__rust.renderError,
                    );
                await nextPaint();
            }
            await nextPaint();
            this.ready = true;
            return performance.now() - t0;
        },
        /**
         * Client coordinates of a named point, from the coordinates the core
         * last returned (the viewer's flat DAST). The prototype lets JSXGraph
         * move a dragged point before the core answers, so the JSXGraph
         * element's own position would time JSXGraph alone; the JS viewer
         * drags a hidden shadow point and moves the visible one only on the
         * core's answer, which is what this measures for the Rust core.
         * Each located point is kept by name for `position`.
         */
        async locate(name) {
            const b = board();
            if (!b) return null;
            const idx = await window.__rust.resolve(name);
            if (idx === -1 || !window.__rust.pointCoords(idx)) return null;
            (this._pts ??= new Map()).set(name, { board: b, idx });
            return this.position(name);
        },
        position(name) {
            const p = this._pts?.get(name);
            const xy = p && window.__rust.pointCoords(p.idx);
            if (!xy) return null;
            p.board.containerObj.scrollIntoView({ block: "center" });
            const r = p.board.containerObj.getBoundingClientRect();
            const c = new window.JXG.Coords(
                window.JXG.COORDS_BY_USER,
                xy,
                p.board,
            ).scrCoords;
            return [r.left + c[1], r.top + c[2]];
        },
        async act(step) {
            const componentIdx = await window.__rust.resolve(step.target);
            if (componentIdx === -1)
                throw new Error(`target ${step.target} did not resolve`);
            const component = window.__rust.componentType(componentIdx);
            const call = (actionName, args) =>
                window.__rust.dispatch({
                    component,
                    actionName,
                    componentIdx,
                    ...(args ? { args } : {}),
                });
            switch (step.action) {
                case "movePoint":
                    return call("move", { x: step.x, y: step.y });
                case "updateValue":
                    if (component === "textInput") {
                        await call("updateImmediateValue", {
                            text: step.value,
                        });
                        return call("updateValue");
                    }
                    if (cells() && component === "mathInput")
                        return call("updateValue", { text: step.value });
                    throw new Error(
                        `unsupported: typing into a ${component} (the Rust core has no mathInput)`,
                    );
                case "submitAnswer":
                    if (cells()) return call("submitAnswer");
                    throw new Error("unsupported: the Rust core has no answer");
                default:
                    throw new Error(
                        `unsupported action ${step.action} in the ${this.core} core`,
                    );
            }
        },
        /** Where the load's time went in the worker (the cells core
         * only), else null. */
        loadBreakdown() {
            return cells() ? window.__rust.loadTimings() : null;
        },
        /** Each tick since the last call, split into core, bridge, worker
         * hop, React and redraw (the cells core only). */
        breakdown() {
            return cells() ? window.__rust.tickSamples() : [];
        },
        async clearSamples() {
            if (cells()) await window.__rust.tickSamples();
        },
        nextFrame,
        nextPaint,
    };
})();
