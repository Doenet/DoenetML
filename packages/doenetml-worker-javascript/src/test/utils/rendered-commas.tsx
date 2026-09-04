import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { addCommasForCompositeRanges } from "../../../../doenetml/src/Viewer/renderers/utils/composites";
import { PublicDoenetMLCore } from "../../CoreWorker";

/**
 * Automatic commas between the replacements of a composite are produced twice,
 * from the same core data:
 *
 * - the renderers, via `addCommasForCompositeRanges`
 *   (`doenetml/src/Viewer/renderers/utils/composites.tsx`), insert `", "`
 *   between React children; and
 * - the `text` state variable, via `textFromChildren`
 *   (`doenetml-worker-javascript/src/utils/text.ts`), joins strings.
 *
 * Both read the same input: the parent's `compositeReplacementActiveRange`,
 * built in `CompositeExpander.replaceCompositeChildren` and handed to the
 * renderers as the `_compositeReplacementActiveRange` renderer state value.
 * Both group it with `groupCompositeRanges` (`@doenet/utils`); what each does
 * with a group once it has one is its own, and is what a test compares.
 *
 * `renderedText` below runs the *real* renderer implementation over the *real*
 * renderer state of a live core, so a test can compare the two pathways without
 * a browser. It stands in for the individual child renderers — each rendered
 * component child becomes a `<span>` holding that component's own text — but
 * everything above that, the comma insertion itself, is the shipped code. The
 * comma code never looks inside a child element (it trims and drops only string
 * children), so the `<span>` is as faithful as a real `<DoenetRenderer>`.
 */

/** A renderer-state entry, as `RendererInstructionBuilder` records it. */
type RendererStateEntry = {
    stateValues?: Record<string, any>;
    childrenInstructions?: (Record<string, any> | string | null)[];
};

/** The map `core.returnAllStateVariables()` returns. */
export type AllStateVariables = Record<number, { stateValues: any }>;

function rendererStateOf(core: PublicDoenetMLCore) {
    return (core as any).core.rendererInstructionBuilder
        .rendererState as Record<number, RendererStateEntry>;
}

/**
 * The text a component's own renderer would show, standing in for whatever
 * markup that renderer actually produces — the same `text` state variable the
 * `text` pathway reads, so the two pathways are compared on the commas alone.
 */
function ownText(stateVariables: AllStateVariables, componentIdx: number) {
    const stateValues = stateVariables[componentIdx]?.stateValues;
    if (typeof stateValues?.text === "string") {
        return stateValues.text;
    }
    // `textFromComponent` gives a component without a text a single space.
    return " ";
}

/**
 * Build the React children a renderer would receive for `componentIdx`, then
 * run `addCommasForCompositeRanges` over them exactly as `p.tsx` (and every
 * other container renderer) does.
 */
function childrenWithCommas(
    core: PublicDoenetMLCore,
    stateVariables: AllStateVariables,
    componentIdx: number,
): React.ReactNode[] {
    const rendererState = rendererStateOf(core);
    const entry = rendererState[componentIdx];

    if (!entry) {
        throw Error(`Component ${componentIdx} is not rendered.`);
    }

    let children: React.ReactNode[] = (entry.childrenInstructions ?? []).map(
        (childInstruction, ind) => {
            if (childInstruction === null) {
                return null;
            }
            if (typeof childInstruction === "string") {
                return childInstruction;
            }
            const childIdx = childInstruction.componentIdx;
            const grandchildren = rendererState[childIdx]?.childrenInstructions;
            // A rendered child that has rendered children of its own is a
            // container in its own right (an `<em>`, a nested `<p>`); recurse so
            // its own commas are added before this level groups it.
            const inner =
                grandchildren && grandchildren.length > 0
                    ? childrenWithCommas(core, stateVariables, childIdx)
                    : ownText(stateVariables, childIdx);
            return <span key={ind}>{inner}</span>;
        },
    );

    const ranges = entry.stateValues?._compositeReplacementActiveRange;
    if (ranges) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange: ranges,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    return children;
}

/**
 * The text the renderers would show for the component at `componentIdx`,
 * including the commas `addCommasForCompositeRanges` inserts.
 */
export function renderedText(
    core: PublicDoenetMLCore,
    stateVariables: AllStateVariables,
    componentIdx: number,
): string {
    const markup = renderToStaticMarkup(
        <>{childrenWithCommas(core, stateVariables, componentIdx)}</>,
    );
    return markup.replace(/<[^>]*>/g, "");
}

/**
 * A readable rendering of a component's `compositeReplacementActiveRange`: one
 * line per composite range, indented by nesting, as
 * `name [first-last] asList=…`. Nesting is implicit in the array (an outer
 * range comes before the ranges of the composites it produced), so spelling it
 * out is what makes a regression in the range data legible.
 *
 * A composite that produced nothing is recorded as `lastInd === firstInd - 1`
 * and is left out: it contributes no children, so where it sits in the nesting
 * cannot be read off the indices, and it makes no difference to the commas.
 */
export function describeCompositeRanges(
    core: PublicDoenetMLCore,
    componentIdx: number,
): string {
    const ranges =
        rendererStateOf(core)[componentIdx]?.stateValues
            ?._compositeReplacementActiveRange ?? [];

    const lines: string[] = [];
    const openRanges: { firstInd: number; lastInd: number }[] = [];

    for (const range of ranges) {
        if (range.lastInd < range.firstInd) {
            continue;
        }
        while (
            openRanges.length > 0 &&
            !(
                range.firstInd >= openRanges[openRanges.length - 1].firstInd &&
                range.lastInd <= openRanges[openRanges.length - 1].lastInd
            )
        ) {
            openRanges.pop();
        }
        const indent = "  ".repeat(openRanges.length);
        const name = range.compositeName ?? `_id_${range.compositeIdx}`;
        lines.push(
            `${indent}${name} [${range.firstInd}-${range.lastInd}] asList=${range.asList}`,
        );
        openRanges.push({ firstInd: range.firstInd, lastInd: range.lastInd });
    }

    return lines.join("\n");
}
