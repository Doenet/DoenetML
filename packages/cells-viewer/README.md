# @doenet/cells-viewer

A viewer for the cells core: React for the document tree, JSXGraph with
Doenet's look for graphs (ADR 0010), the core on the main thread, cells
read straight from wasm memory (ADR 0001).

## Running locally

From the repository root, after `npm install`:

```bash
npm run dev -w @doenet/cells-viewer
```

`dev` is a wireit service: it first builds `@doenet/parser` (the DoenetML
parser the viewer runs in the browser) and `@doenet/cells-core` (the core
compiled to wasm in `packages/cells-core/pkg`) if their sources changed,
then serves the viewer at http://localhost:5173. The page opens on the
`sir` document with its DoenetML in an editable box; edit it and press
"Load document" (Ctrl+Enter) to rebuild. After changing Rust, restart
`dev` (or run `npm run build -w @doenet/cells-core` beside it) and reload.

Query parameters: `?doc=<spec>` picks a generated fixture (after
`npm run fixtures -w @doenet/cells-core`) or `sir`, `?fmt=json|cdast` the
wire format, `?eval=full|dirty-closure` the evaluator.

The browser measurements are in `packages/benchmark` (`npm run browser`
there), which drives this viewer through its `window.__cells` hook.

`src/renderers/jsxgraph/doenet.ts` and the CSS in `index.html` are copied
from `packages/doenetml`'s renderers, with the upstream files named in their
headers; those utilities are not exported from that package yet.
