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

/**
 * Internal shape a `componentSize` default value carries in the schema — the
 * runtime's own `{ size, isAbsolute }` pair, where `isAbsolute` picks between
 * pixels and a percentage. It is not a value an author can write: nobody types
 * `height="{"size":120,"isAbsolute":true}"`. Renderers detect it with
 * `isComponentSizeValue` and print it with `formatComponentSize`, which gives
 * back exactly the text an author would put in the attribute.
 *
 * `size` is a number or a string of digits: the worker's component classes
 * declare these defaults by hand, and a few write the number as a string
 * (`<codeEditor>`'s `width` is `{ size: "100", isAbsolute: false }`). Both
 * spellings mean the same size, so both are recognized — a guard that took
 * only numbers would leave those attributes printing their raw JSON.
 */
export type ComponentSizeValue = {
    size: number | string;
    isAbsolute: boolean;
};

export function isComponentSizeValue(val: unknown): val is ComponentSizeValue {
    if (
        typeof val !== "object" ||
        val === null ||
        typeof (val as { isAbsolute?: unknown }).isAbsolute !== "boolean"
    ) {
        return false;
    }
    const size = (val as { size?: unknown }).size;
    return (
        typeof size === "number" ||
        (typeof size === "string" && size.trim() !== "" && !isNaN(Number(size)))
    );
}

/**
 * Render a `componentSize` as an author would write it: `120px` or `50%`.
 */
export function formatComponentSize(value: ComponentSizeValue): string {
    return `${value.size}${value.isAbsolute ? "px" : "%"}`;
}

/**
 * Per-dimension entry shape emitted by `get-schema.ts:singlePropFromDescription`
 * for each slot of an array property — the public mirror of the generator's
 * local `ArrayElementDescription`. `type` is optional for the same reason as
 * `SchemaProperty.type`: an unwrapped array slot whose parent state variable
 * lacks `createComponentOfType` has no type.
 */
export type ArrayElementDescription = {
    type?: string;
    isArray: boolean;
    numDimensions?: number;
};

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
    indexedArrayDescription?: ArrayElementDescription[];
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
