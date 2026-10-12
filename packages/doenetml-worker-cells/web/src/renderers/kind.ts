// Which renderer draws graphs (plan 7), chosen by `?renderer=`:
//  - svg:             hand-drawn SVG, React re-renders each graph child
//  - jsxgraph:        JSXGraph with Doenet's look, children bypass React
//  - jsxgraph-canvas: the same on JSXGraph's canvas renderer
export type RendererKind = "svg" | "jsxgraph" | "jsxgraph-canvas";

const params = new URLSearchParams(location.search);

export const RENDERER: RendererKind =
    (["svg", "jsxgraph", "jsxgraph-canvas"] as const).find(
        (k) => k === params.get("renderer"),
    ) ?? "jsxgraph";

/** How JSXGraph elements redraw: "tick" (one board redraw per tick) or
 * "element" (Doenet's pattern, a board redraw per changed element). */
export const JSX_UPDATE: "tick" | "element" =
    params.get("jsxupdate") === "element" ? "element" : "tick";
