// Installed into the cells viewer's page (served from its own build) after
// it loads: the same `window.__bench` protocol as js.html, over the viewer's
// `window.__cells` hook.
(() => {
    const nextPaint = () =>
        new Promise((ok) => requestAnimationFrame(() => setTimeout(ok, 0)));
    const nextFrame = () =>
        new Promise((ok) => requestAnimationFrame(() => ok(performance.now())));
    const store = () => window.__cells.store;
    const resolve = (name) => {
        const s = store();
        const idx = s.core.resolve_path(name);
        return idx === 0xffffffff ? s.comps.byName(name) : idx;
    };
    window.__bench = {
        ready: false,
        core: "cells",
        async load(text, _waitFor) {
            while (!window.__cells)
                await new Promise((ok) => setTimeout(ok, 20));
            const t0 = performance.now();
            await window.__cells.loadSource(text);
            while (!window.__cells.ready) {
                // The viewer shows a load error instead of flipping ready.
                const err = document.querySelector(".error");
                if (err)
                    throw new Error(
                        "unsupported: " + err.textContent.slice(0, 300),
                    );
                await new Promise((ok) => setTimeout(ok, 5));
            }
            this.ready = true;
            return performance.now() - t0;
        },
        async locate(name) {
            const idx = resolve(name);
            this._idx = idx;
            return idx === null ? null : window.__cells.locate(idx);
        },
        position() {
            return this._idx === null ? null : window.__cells.locate(this._idx);
        },
        async act(step) {
            const s = store();
            const idx = resolve(step.target);
            if (idx === null || idx >= s.comps.length)
                throw new Error(
                    `target ${step.target} did not resolve (${idx})`,
                );
            switch (step.action) {
                case "movePoint":
                    s.requestPoints([
                        [
                            s.comps.cell(idx, "x"),
                            s.comps.cell(idx, "y"),
                            step.x,
                            step.y,
                        ],
                    ]);
                    return;
                case "updateValue":
                    try {
                        s.comps.componentType(idx);
                        s.comps.cell(idx, "expr");
                    } catch (e) {
                        throw new Error(
                            `lookup for ${step.target} (idx ${idx}, type ${s.comps.componentType(idx)}, n ${s.comps.length}): ${e.message}`,
                        );
                    }
                    if (s.comps.componentType(idx) === "textInput")
                        s.requestText(s.comps.cell(idx, "value"), step.value);
                    else
                        s.request([
                            [
                                s.comps.cell(idx, "expr"),
                                s.core.parse_math(step.value),
                            ],
                        ]);
                    return;
                case "submitAnswer":
                    s.submit(idx);
                    return;
                default:
                    throw new Error(`unsupported action ${step.action}`);
            }
        },
        /** The viewer's own per-tick samples (core, commit, frame, paint ms). */
        samples() {
            return store().samples;
        },
        clearSamples() {
            store().samples.length = 0;
        },
        nextFrame,
        nextPaint,
    };
})();
