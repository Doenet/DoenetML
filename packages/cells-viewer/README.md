# @doenet/cells-viewer

A viewer for the cells core: React for the document tree, JSXGraph with
Doenet's look for graphs (ADR 0010), the core on the main thread, cells
read straight from wasm memory (ADR 0001).

## Running locally

From the repository root, after `npm install`:

```bash
npm run build -w @doenet/parser        # the DoenetML parser the viewer runs in the browser
npm run build -w @doenet/cells-core    # compiles the core to wasm in packages/cells-core/pkg
npm run dev -w @doenet/cells-viewer    # serves the viewer at http://localhost:5173
```

The page opens on the `sir` document with its DoenetML in an editable box;
edit it and press "Load document" (Ctrl+Enter) to rebuild. Rebuild the core
(`npm run build -w @doenet/cells-core`) after changing Rust; Vite picks up
the new `pkg/` on reload.

Query parameters: `?doc=<spec>` picks a generated fixture (after
`npm run fixtures -w @doenet/cells-core`) or `sir`, `?fmt=json|cdast` the
wire format, `?eval=full|dirty-closure` the evaluator.

The browser measurements are in `packages/benchmark` (`npm run browser`
there), which drives this viewer through its `window.__cells` hook.

`src/renderers/jsxgraph/doenet.ts` and the CSS in `index.html` are copied
from `packages/doenetml`'s renderers, with the upstream files named in their
headers; those utilities are not exported from that package yet.
