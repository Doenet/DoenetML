import doenetSchema from "./generated/doenet-schema.json";

/**
 * A single author-facing entry in an attribute's `validValues` list, paired
 * with a human-readable description that flows into editor autocomplete and
 * the context-sensitive help panel.
 */
export type ValidValueEntry = { value: string; description: string };

/**
 * Sentinel shape produced by `get-schema.ts`'s `encodeDefaultValueForJson`
 * for a `math-expressions` default value (e.g. `<math>`'s `assumptions`
 * attribute, which defaults to `me.fromAst("＿")`). Without this rewrite,
 * the default would round-trip through `JSON.stringify` as the opaque
 * `{ objectType: "math-expression", tree: ... }` shape — readable only to
 * someone who knows the `math-expressions` library. Renderers (docs-nextra
 * `props-display.tsx`, doenetml `ContextHelpPanel.tsx`) detect this
 * sentinel with `isMathDefaultValue` and typeset the `latex` through
 * MathJax. This type and its guard are the contract shared between the
 * producer in this package and the two renderers.
 */
export type MathDefaultValue = { type: "math"; latex: string };

export function isMathDefaultValue(val: unknown): val is MathDefaultValue {
    return (
        typeof val === "object" &&
        val !== null &&
        (val as { type?: unknown }).type === "math" &&
        typeof (val as { latex?: unknown }).latex === "string"
    );
}

export type SchemaProperty = {
    name: string;
    /**
     * Component type the property resolves to. Optional because some public
     * state variables (e.g. unwrapped array slots) have no
     * `createComponentOfType` and the generator omits `type` for them.
     */
    type?: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: unknown[];
    /**
     * Per-dimension alias table for array properties — emitted by
     * `get-schema.ts:singlePropFromDescription` from the runtime's
     * `theStateDef.indexAliases`. Each entry `indexAliases[dim]` lists
     * the alias names that select positions 0..N within that dimension
     * (e.g. `[["x","y","z"]]` for a 1-dim point coordinate;
     * `[[], ["x","y","z"]]` for a 2-dim `points` array whose outer
     * dim is numeric-only). Read by the editor's autocomplete and
     * context-help to chase coordinate chains (`$vector.head.x`,
     * `$line.points[1].x`) without traversing the entry's `type`.
     */
    indexAliases?: readonly (readonly string[])[];
    description: string;
    fromAttribute?: boolean;
};

export { doenetSchema };
