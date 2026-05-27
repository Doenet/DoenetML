import { doenetSchema } from "@doenet/static-assets/schema";

/**
 * Layout classification of DoenetML elements for the pretty-printer.
 *
 * The base layout (`"inline"` vs `"block"`) comes from each component's
 * inheritance chain (`InlineComponent` → `"inline"`, `BlockComponent` →
 * `"block"`, otherwise `"other"`), emitted into the schema by
 * `packages/static-assets/scripts/get-schema.ts`.
 *
 * Two small hand-curated overrides cover the cases where inheritance and
 * formatting convention disagree:
 *
 * - `BLOCK_OVERRIDES`: inline-by-inheritance elements that should still
 *   format as block (`<title>` in a `<section>`, `<choice>` in a
 *   `<choiceInput>`, …).
 * - `OTHER_BLOCK_NAMES`: schema-`"other"` elements that should format as
 *   block (list/table structural — `<li>`, `<row>`, `<cell>`; case-like
 *   branches — `<case>`, `<else>`, `<award>`, `<option>`; top-level
 *   structural — `<module>`, `<setup>`, `<document>`; graph children —
 *   `<point>`, `<line>`, `<vector>`, …).
 *
 * Schema-`"other"` elements not listed above default to **inline** (flow
 * with surrounding prose). This matches author expectations for most
 * composites and list-data elements (`<repeat>`, `<select>`, `<textList>`,
 * `<mathList>`, …): they expand into inline content and should not force
 * their containing `<p>` to break.
 */

type SchemaElementLike = {
    name: string;
    layoutCategory?: "inline" | "block" | "other";
};

const elements = doenetSchema.elements as readonly SchemaElementLike[];

/**
 * Inline-by-inheritance elements that should nevertheless format as block.
 * `<title>` and `<choice>` extend `InlineComponent` at runtime but render
 * like headings / list items and conventionally sit on their own line.
 */
const BLOCK_OVERRIDES: ReadonlySet<string> = new Set([
    "title",
    "pubtitle",
    "h",
    "choice",
]);

/**
 * Schema-`"other"` element names that should format as block. Anything
 * `"other"` and *not* in this set defaults to inline.
 */
const OTHER_BLOCK_NAMES: ReadonlySet<string> = new Set([
    // List / tabular structural
    "li",
    "row",
    "cell",
    "cellBlock",
    "column",
    // Case-like / answer-like branches
    "case",
    "else",
    "award",
    "option",
    // Top-level structural
    "document",
    "module",
    "moduleAttributes",
    "setup",
    // Top-level config / definition blocks
    "feedbackDefinition",
    "styleDefinition",
    "variantControl",
    "considerAsResponses",
    // Conditional container
    "conditionalContent",
    // Graph legend
    "legend",
    // Graph children — each on its own line inside <graph>
    "point",
    "line",
    "lineSegment",
    "ray",
    "vector",
    "curve",
    "polygon",
    "polyline",
    "regularPolygon",
    "circle",
    "parabola",
    "rectangle",
    "angle",
    "triangle",
    "endpoint",
    "controlVectors",
    "pegboard",
    "stickyGroup",
    "bestFitLine",
    "cobwebPolyline",
    "equilibriumCurve",
    "equilibriumLine",
    "equilibriumPoint",
    "regionBetweenCurveXAxis",
    "regionBetweenCurves",
    "regionHalfPlane",
]);

/**
 * Element-name lookups in the DAST preserve source casing while the
 * schema and override lists use canonical camelCase. Normalize both
 * sides to lowercase so `<BlockQuote>`, `<blockquote>`, and
 * `<blockQuote>` all classify the same.
 */
const BLOCK_ELEMENTS_LOWER: ReadonlySet<string> = new Set(
    [
        ...elements
            .filter(
                (e) =>
                    e.layoutCategory === "block" ||
                    (e.layoutCategory === "other" &&
                        OTHER_BLOCK_NAMES.has(e.name)),
            )
            .map((e) => e.name),
        ...BLOCK_OVERRIDES,
    ].map((n) => n.toLowerCase()),
);

export const BLOCK_ELEMENTS: ReadonlySet<string> = new Set([
    ...elements
        .filter(
            (e) =>
                e.layoutCategory === "block" ||
                (e.layoutCategory === "other" && OTHER_BLOCK_NAMES.has(e.name)),
        )
        .map((e) => e.name),
    ...BLOCK_OVERRIDES,
]);

/**
 * Elements that always render their content in block layout even when
 * their children are entirely inline — preserves visual separation for
 * top-level structural containers (`<section>foo</section>` → 3 lines,
 * not 1).
 *
 * Matching is case-insensitive against the lowercased version of these
 * names. See `ALWAYS_BREAK_PARENTS_LOWER` below.
 */
const _ALWAYS_BREAK_PARENTS_SOURCE: readonly string[] = [
    "document",
    "module",
    "section",
    "subsection",
    "subsubsection",
    "problem",
    "exercise",
    "exercises",
    "problems",
    "ol",
    "ul",
    "dl",
    "graph",
    "table",
    "tabular",
    "figure",
    "spreadsheet",
    "codeEditor",
    "paragraphs",
    "setup",
];

export const ALWAYS_BREAK_PARENTS: ReadonlySet<string> = new Set(
    _ALWAYS_BREAK_PARENTS_SOURCE,
);
const ALWAYS_BREAK_PARENTS_LOWER: ReadonlySet<string> = new Set(
    _ALWAYS_BREAK_PARENTS_SOURCE.map((n) => n.toLowerCase()),
);

/**
 * Whether an element name should be treated as a block by the formatter
 * (own line, force parent to break). Unknown / unrecognized names default
 * to inline — see the file header for why. Matching is case-insensitive.
 */
export function isBlock(name: string): boolean {
    return BLOCK_ELEMENTS_LOWER.has(name.toLowerCase());
}

/**
 * Whether the named element should always render its content as block
 * even when all children are inline.
 */
export function isAlwaysBreakParent(name: string): boolean {
    return ALWAYS_BREAK_PARENTS_LOWER.has(name.toLowerCase());
}

/**
 * Whether an element name should be treated as inline by the formatter
 * (flow with surrounding prose). Matching is case-insensitive.
 */
export function isInline(name: string): boolean {
    return !BLOCK_ELEMENTS_LOWER.has(name.toLowerCase());
}
