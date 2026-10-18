// Installed into the Rust core's page (rust-viewer/, the prototype viewer on
// the Rust core) after it loads: the same `window.__bench` protocol as
// js.html, over the page's `window.__rust` hook. Actions go through the
// viewer's store, as its renderers send them, under the Rust core's action
// names (a point's `move`, a text input's `updateImmediateValue`); it has
// no math input, so typing into one is a gap.
(() => {
    const nextPaint = () =>
        new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 0)));
    const nextFrame = () =>
        new Promise((ok) => requestAnimationFrame(() => ok(performance.now())));
    const board = () => Object.values(window.JXG?.boards ?? {})[0] ?? null;
    window.__bench = {
        ready: false,
        core: "rust",
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
         */
        async locate(name) {
            const b = board();
            if (!b) return null;
            const idx = await window.__rust.resolve(name);
            if (idx === -1 || !window.__rust.pointCoords(idx)) return null;
            this._pt = { board: b, idx };
            return this.position();
        },
        position() {
            const p = this._pt;
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
                    if (component !== "textInput")
                        throw new Error(
                            `unsupported: typing into a ${component} (the Rust core has no mathInput)`,
                        );
                    await call("updateImmediateValue", { text: step.value });
                    return call("updateValue");
                default:
                    throw new Error(
                        `unsupported action ${step.action} in the Rust core`,
                    );
            }
        },
        nextFrame,
        nextPaint,
    };
})();
