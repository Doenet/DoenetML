# @doenet/cells-viewer

A viewer for the cells core: React for the document tree, JSXGraph with
Doenet's look for graphs (ADR 0010), the core on the main thread, cells
read straight from wasm memory (ADR 0001).

`npm run dev` serves it at `:5173`; `?doc=<spec>` picks a generated fixture
(after `npm run fixtures` in `../cells-core`) or `sir`, `?fmt=json|cdast`
the wire format, `?eval=full|dirty-closure` the evaluator. The document
box accepts DoenetML and parses it in the browser.

The browser measurements are in `packages/benchmark` (`npm run browser`
there), which drives this viewer through its `window.__cells` hook.

`src/renderers/jsxgraph/doenet.ts` and the CSS in `index.html` are copied
from `packages/doenetml`'s renderers, with the upstream files named in their
headers; those utilities are not exported from that package yet.
