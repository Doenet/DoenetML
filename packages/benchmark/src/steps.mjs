// The glossary of the trace layer: what each step of a load does and where
// its code is, in the order a load runs them. A step's name is its path in
// the trace (`parse/lezerToDast`); the core's own spans sit under
// `core/new Core` (`cells_core::trace`), and those named in `CORE_STEPS`
// appear under several parents (a build's stages run inside the compile's
// check as well as in a later build pass), so they are explained by their
// last segment. Names here must match the ones the viewer
// (`packages/cells-viewer/src/trace.ts` and its callers) and the core
// (`packages/cells-core/crates/cells-core/src/trace.rs` and its callers)
// record; `npm run render` lists any step it finds without an entry.

const V = "packages/cells-viewer";
const C = "packages/cells-core/crates/cells-core/src";

/** Steps by full path: [what it does, where]. */
export const STEPS = {
    boot: [
        "From navigation until the page's own code starts: the HTML, then downloading, parsing, compiling and running every eagerly loaded script (React, JSXGraph, CodeMirror with the language server's source, the viewer). Nothing about the document has happened yet. Much of a script's compiling happens on a background thread while it downloads (streaming), which is why the main thread can sit idle during boot.",
        `${V}/dev/main.tsx (top of the module)`,
    ],
    app: [
        "React's first render of the page around the document: the toolbar and the editor beside an empty viewer, until its effects have run.",
        `${V}/dev/main.tsx (App)`,
    ],
    editor: [
        "The editor's first mount (CodeMirror), part of `app`.",
        `${V}/src/EditorViewer.tsx`,
    ],
    fetch: [
        "The DoenetML text requested from its URL, until the page handles the response. The network part is in the file lane; the rest is waiting for the main thread.",
        `${V}/dev/main.tsx (?src=)`,
    ],
    parse: ["DoenetML text to the bytes the core reads.", `${V}/src/parse.ts`],
    "parse/import": [
        "The parser's code (@doenet/parser), a separate chunk loaded the first time a page parses.",
        `${V}/src/parse.ts`,
    ],
    "parse/lezerToDast": [
        "The text parsed by the Lezer grammar into a syntax tree, then converted to a DAST (the document as a tree of elements, text and references).",
        "packages/parser/src/lezer-to-dast",
    ],
    "parse/normalize": [
        "The DAST put in the shape the core expects: one <document> root, comments and XML-only nodes removed, component sugar expanded.",
        "packages/parser/src/dast-normalize/normalize-dast.ts",
    ],
    "parse/encode": [
        "The DAST encoded in the core's binary wire format (ADR 0002).",
        "packages/cells-core/scripts/cdast-encode.mjs",
    ],
    core: [
        "The bytes to a loaded core whose cells the renderer can read.",
        `${V}/src/core.ts (loadDocument)`,
    ],
    "core/wasm init": [
        "The core's wasm fetched, compiled and instantiated: once per page, on its first load. The wasm is compiled lazily, function by function, the first time each runs, so much of its compiling lands in `core/new Core`.",
        `${V}/src/core.ts`,
    ],
    "core/new Core": [
        "The call into the core: its bytes are copied into wasm memory, then the load below runs. Time here and not in `load` is the copy and the call.",
        "packages/cells-core/crates/cells-wasm/src/lib.rs (Core::new)",
    ],
    "core/new Core/load": [
        "The core's load: compile once, then build until the structure settles (ADR 0015).",
        `${C}/document/load.rs`,
    ],
    "core/new Core/load/deserialize": [
        "The wire format read into the core's DAST, in flat columns.",
        `${C}/dast/`,
    ],
    "core/new Core/load/compile": [
        "Everything that depends only on the source, done once: plan, check, lint (ADR 0015).",
        `${C}/compile/check.rs`,
    ],
    "core/new Core/load/compile/plan": [
        "Every element planned by its type's planner into templates: where each prop's value comes from, every reference, every choice. Math text is parsed into expression trees here, once.",
        `${C}/compile/mod.rs, compile/planner.rs`,
    ],
    "core/new Core/load/compile/probe": [
        "Only with a repeat or a select: one build through the probe, which stands for every iteration count and every pick, to find every cycle and error the document can have. Discarded afterwards (ADR 0012, ADR 0014).",
        `${C}/build/probe.rs`,
    ],
    "core/new Core/load/compile/first build": [
        "Without a repeat or a select: the document's one build, which is also its check (the probe's loop check runs in it). The load keeps it instead of building again.",
        `${C}/build/mod.rs (first_build)`,
    ],
    "core/new Core/load/compile/lint": [
        "The accessibility rules, one walk over the DAST.",
        `${C}/compile/lint.rs`,
    ],
    "core/new Core/load/build": [
        "A further build pass, when a repeat's count, computed by the pass before, differs from the count it was stamped with.",
        `${C}/build/mod.rs (build)`,
    ],
    "core/new Core/load/schedule": [
        "The instructions sorted so each runs after the cells it reads.",
        `${C}/program/mod.rs (Program::schedule)`,
    ],
    "core/new Core/load/compute": [
        "Every derived cell computed once: the document's first state.",
        `${C}/document/mod.rs (recompute), program/`,
    ],
    "core/new Core/load/attributes": [
        "The source's literal attributes kept for the renderer (sizes, styles, text it shows as written).",
        `${C}/dast/attrs.rs`,
    ],
    "core/component table": [
        "Views over wasm memory through which the renderer reads components and their cells without copying.",
        `${V}/src/components.ts`,
    ],
    render: [
        "From handing the loaded core to React until the first commit and every board drawn: the first render.",
        `${V}/src/document.ts (openDocument)`,
    ],
    "render/react commit": [
        "React renders the component tree and commits it to the DOM.",
        `${V}/src/renderers/`,
    ],
    "render/board init": [
        "One JSXGraph board created (axes, grid, navigation bar).",
        `${V}/src/renderers/jsxgraph/Board.tsx`,
    ],
    "render/boards": [
        "From the commit to the boards' last redraw: a board's elements are created a commit after the board and drawn together.",
        `${V}/src/renderers/jsxgraph/`,
    ],
};

/** The stages of a build, under whichever step ran the build. */
export const CORE_STEPS = {
    expand: [
        "Each template stamped into components, once per scope (each repeat iteration is a scope).",
        `${C}/build/expand/`,
    ],
    resolve: [
        "Every reference resolved to the slot it names.",
        `${C}/build/expand/mod.rs (resolve_all)`,
    ],
    "loop check": [
        "The probe's checks that no dependency loop closes, at any count.",
        `${C}/build/probe.rs`,
    ],
    emit: [
        "Aliased slots merged into cells, cells numbered (essential, fixed, derived), operators bound into instructions.",
        `${C}/build/emit.rs`,
    ],
};

/** What a step is, or null if the glossary lacks it. */
export function explain(name) {
    if (STEPS[name]) return STEPS[name];
    const last = name.split("/").pop();
    if (name.startsWith("core/new Core/") && CORE_STEPS[last])
        return CORE_STEPS[last];
    return null;
}

/** The kinds of main-thread work in the browser lane (`src/chrome-trace.mjs`). */
export const KIND_TEXT = {
    html: "parsing the HTML",
    "script compile":
        "V8 parsing and compiling JavaScript (including lazy compiles of functions on their first call)",
    "script run":
        "running JavaScript: the page's code, React, the parser, JSXGraph",
    "wasm compile":
        "compiling WebAssembly (eager validation, and lazy compiles of functions on their first call)",
    gc: "garbage collection",
    "style & layout": "computing styles and laying out the page",
    paint: "painting and handing the frame to the compositor",
    other: "the browser's own task handling and work of no kind above (loading, messages)",
};
