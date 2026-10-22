import { asFiniteNumber, escapeXml, formatPoint } from "../common";
import {
    labelMarkup,
    prefigureAlignmentForAnchorPosition,
    THEME_AWARE_LABEL_COLOR_ATTR,
} from "../label";
import type { Converter, PrefigureStateValues, SelectedStyle } from "../types";

/**
 * The graph children drawn as free-standing text, and the state variable(s)
 * that hold what each one shows. These are the text-like members of the
 * graph's `graphical` child group, read the way their Doenet renderers read
 * them: `text` for `<text>` and `<number>`, `latex` for the math components,
 * and `value` (with `\(...\)` math) for `<label>`.
 */
export const GRAPH_TEXT_CONTENT_VARIABLES: Record<string, string[]> = {
    text: ["text"],
    number: ["text"],
    math: ["latex"],
    m: ["latex"],
    md: ["latex"],
    label: ["value", "hasLatex"],
};

/** The Doenet renderers of the types in `GRAPH_TEXT_CONTENT_VARIABLES`. */
const GRAPH_TEXT_RENDERER_TYPES = new Set(["text", "number", "math", "label"]);

/**
 * The entry of `GRAPH_TEXT_CONTENT_VARIABLES` a graph child is drawn as: its
 * own type, or the one it inherits from, so `<integer>` is drawn as a
 * `<number>`, `<mdn>` as an `<md>`, and `<evaluate>` as a `<math>`. Null for
 * a child that is none of them, or that does not display as text in a Doenet
 * graph, such as `<periodicSet>`, which inherits from `<math>` but has no
 * renderer.
 */
export function graphTextType(
    componentType: string,
    componentInfoObjects: {
        allComponentClasses: Record<string, { rendererType?: string }>;
        isInheritedComponentType: (args: {
            inheritedComponentType: string;
            baseComponentType: string;
        }) => boolean;
    },
): string | null {
    const rendererType =
        componentInfoObjects.allComponentClasses[componentType]?.rendererType;
    if (!rendererType || !GRAPH_TEXT_RENDERER_TYPES.has(rendererType)) {
        return null;
    }
    if (componentType in GRAPH_TEXT_CONTENT_VARIABLES) {
        return componentType;
    }
    return (
        Object.keys(GRAPH_TEXT_CONTENT_VARIABLES).find((baseComponentType) =>
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: componentType,
                baseComponentType,
            }),
        ) ?? null
    );
}

/** State variables every graph text needs besides its content. */
export const GRAPH_TEXT_COMMON_VARIABLES = [
    "anchor",
    "positionFromAnchor",
    "selectedStyle",
    "hidden",
];

/**
 * Returns the PreFigure label markup for a graph text, or null when it would
 * show nothing (an empty text is skipped, as the Doenet renderer draws it
 * invisibly).
 */
export function graphTextMarkup(
    componentType: string,
    sv: PrefigureStateValues,
): string | null {
    switch (componentType) {
        case "text":
        case "number":
            return labelMarkup({ label: sv.text, labelHasLatex: false });
        case "math":
        case "m":
            return mathMarkup(sv.latex);
        case "md": {
            // An `<md>` is displayed in an `align` environment, with `\notag`
            // on each row to keep it unnumbered, or `\tag{n}` on a numbered
            // row. Inside a label, which MathJax typesets inline, `aligned` is
            // the form that keeps its rows, and it allows neither, so a
            // numbered row is drawn without its number.
            if (typeof sv.latex !== "string") {
                return null;
            }
            const rows = sv.latex
                .replace(/\\(notag|nonumber)\b\s*/g, "")
                .replace(/\\tag\{[^{}]*\}\s*/g, "")
                .trim();
            return rows
                ? `<m>\\begin{aligned}${escapeXml(rows)}\\end{aligned}</m>`
                : null;
        }
        case "label":
            return labelMarkup({ label: sv.value, labelHasLatex: sv.hasLatex });
        default:
            return null;
    }
}

function mathMarkup(latex: unknown): string | null {
    if (typeof latex !== "string" || !latex.trim()) {
        return null;
    }
    return `<m>${escapeXml(latex.trim())}</m>`;
}

/**
 * Evaluates a text's `anchor`, a math-expressions tuple, to graph coordinates.
 *
 * A coordinate that does not evaluate to a number is placed at 0, as the
 * Doenet renderer does, so the text is still drawn.
 */
function anchorCoordinates(anchor: unknown): [number, number] {
    const coords: [number, number] = [0, 0];
    const tuple = anchor as {
        get_component?: (i: number) => { evaluate_to_constant?: () => unknown };
    } | null;
    if (typeof tuple?.get_component !== "function") {
        return coords;
    }
    for (const i of [0, 1]) {
        try {
            const value = asFiniteNumber(
                tuple.get_component(i)?.evaluate_to_constant?.(),
            );
            if (value !== null) {
                coords[i] = value;
            }
        } catch (_e) {
            // leave the coordinate at 0
        }
    }
    return coords;
}

/**
 * The `color` for a graph text. Text in the default style color follows the
 * page's light or dark text color (see `THEME_AWARE_LABEL_COLOR_ATTR`); any
 * other color the author chose is written out, already resolved for the theme.
 */
function textColorAttr(selectedStyle: SelectedStyle | undefined): string {
    const color = selectedStyle?.textColor;
    if (typeof color !== "string" || /^(black|white)$/i.test(color.trim())) {
        return THEME_AWARE_LABEL_COLOR_ATTR;
    }
    return `color="${escapeXml(color)}"`;
}

/**
 * Returns a converter that draws a text-like graph child of the given type as
 * a PreFigure `<label>` at its anchor.
 */
export function graphTextConverter(componentType: string): Converter {
    return function convertGraphTextToPrefigure({ sv, handle }) {
        const markup = graphTextMarkup(componentType, sv);
        const anchor = formatPoint(anchorCoordinates(sv.anchor));
        if (markup === null || anchor === null) {
            return null;
        }

        const attrs = [
            `at="${escapeXml(handle)}"`,
            `anchor="${escapeXml(anchor)}"`,
            `alignment="${escapeXml(
                prefigureAlignmentForAnchorPosition(sv.positionFromAnchor),
            )}"`,
            textColorAttr(sv.selectedStyle),
        ];

        return `<label ${attrs.join(" ")}>${markup}</label>`;
    };
}
