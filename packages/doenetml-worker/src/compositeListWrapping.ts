import {
    groupCompositeRanges,
    isBlankGroup,
    type CompositeGroup,
    type CompositeRange,
} from "@doenet/utils";
import type { FlatDastElement, FlatDastElementContent } from "./CoreWorker";

export type { CompositeRange as CompositeReplacementRange };

/**
 * A child slot, kept aligned with the child-instruction index space so the
 * `firstInd`/`lastInd` of a composite range index directly into it. `null`
 * mirrors an absent child instruction (e.g. an unrendered branch) and is
 * dropped during grouping.
 */
export type ChildContent = FlatDastElementContent | null;

function isBlankChild(child: ChildContent) {
    return typeof child === "string" && child.trim() === "";
}

/**
 * Build a synthetic wrapper FlatDast element for a composite range. The wrapper
 * borrows the composite's own `componentIdx` as its id: composites are replaced
 * by their replacements and so never occupy a slot in the rendered FlatDast,
 * leaving that id free and stable across updates.
 */
function makeWrapperElement(
    compositeIdx: number,
    name: "asList" | "_fragment",
    children: FlatDastElementContent[],
): FlatDastElement {
    return {
        type: "element",
        name,
        attributes: {},
        children,
        data: { id: compositeIdx },
    };
}

/**
 * Turn the grouped children into FlatDast children, emitting the wrapper
 * elements that need to exist in `elements[]`.
 *
 * - A list group becomes an `<asList>` wrapper holding its items; the grouping
 *   has settled that there are at least two. The prototype's `<asList>`
 *   renderer treats every child as an item, so what the grouping keeps in a
 *   list without its being an item cannot go inside the wrapper: the
 *   whitespace at either end of the list goes outside it — or nowhere, when an
 *   enclosing list would take it for an item in turn — and a composite that
 *   produced only whitespace is left out.
 * - A non-list group is materialized as a single unit only when it must be —
 *   i.e. it has more than one child *and* sits inside a list, where the list
 *   would otherwise treat each of its children as a separate item. It is then
 *   wrapped in a passthrough `<_fragment>`. Everywhere else (top level, or a
 *   single child) its children are spliced inline, so non-list composites add
 *   no structure and the comma output matches the renderers exactly.
 */
function materializeGroups(
    groups: CompositeGroup<ChildContent>[],
    contextIsList: boolean,
    wrapperElements: FlatDastElement[],
): FlatDastElementContent[] {
    const out: FlatDastElementContent[] = [];

    for (const group of groups) {
        if (group.kind === "child") {
            if (group.value !== null) {
                out.push(group.value);
            }
            continue;
        }

        if (group.asList) {
            const blank = group.items.map((item) =>
                isBlankGroup(item, isBlankChild),
            );
            const firstItemInd = blank.indexOf(false);
            const lastItemInd = blank.lastIndexOf(false);
            const items = group.items
                .slice(firstItemInd, lastItemInd + 1)
                .filter((_, ind) => !blank[firstItemInd + ind]);

            if (!contextIsList) {
                out.push(
                    ...materializeGroups(
                        group.items.slice(0, firstItemInd),
                        false,
                        wrapperElements,
                    ),
                );
            }
            wrapperElements.push(
                makeWrapperElement(
                    group.range.compositeIdx,
                    "asList",
                    materializeGroups(items, true, wrapperElements),
                ),
            );
            out.push({ id: group.range.compositeIdx, annotation: "original" });
            if (!contextIsList) {
                out.push(
                    ...materializeGroups(
                        group.items.slice(lastItemInd + 1),
                        false,
                        wrapperElements,
                    ),
                );
            }
            continue;
        }

        const children = materializeGroups(group.items, false, wrapperElements);
        if (contextIsList && children.length > 1) {
            // Must be one unit so the enclosing list delimits it correctly.
            wrapperElements.push(
                makeWrapperElement(
                    group.range.compositeIdx,
                    "_fragment",
                    children,
                ),
            );
            out.push({ id: group.range.compositeIdx, annotation: "original" });
        } else {
            // A single child is already one unit, and outside a list the
            // children are spliced inline, adding no structure.
            out.push(...children);
        }
    }

    return out;
}

/**
 * Wrap a parent element's children in synthetic `<asList>` (and, where nesting
 * requires it, `<_fragment>`) parents that reproduce exactly the commas the
 * doenetml renderers add.
 *
 * The grouping itself — which children came from which composite, which of
 * those composites are lists, and what whitespace belongs to a list — is
 * `groupCompositeRanges`, shared with the renderers, the `text` state
 * variable, and the string a `<math>` parses, so the four cannot drift apart.
 *
 * @param childContents The parent's children aligned with the child-instruction
 *   index space (use `null` for absent child instructions) so the range indices
 *   line up.
 * @param compositeReplacementActiveRange The parent's
 *   `_compositeReplacementActiveRange` state value (may be `undefined`/empty).
 * @returns The rewritten children plus any wrapper elements that must be added
 *   to the FlatDast `elements` array.
 */
export function applyCompositeListWrapping(
    childContents: ChildContent[],
    compositeReplacementActiveRange: CompositeRange[] | undefined,
): { children: FlatDastElementContent[]; wrapperElements: FlatDastElement[] } {
    const groups = groupCompositeRanges<ChildContent>({
        children: childContents,
        ranges: compositeReplacementActiveRange,
        isAbsent: (child) => child === null,
        isBlank: isBlankChild,
    });

    const wrapperElements: FlatDastElement[] = [];
    const children = materializeGroups(groups, false, wrapperElements);

    return { children, wrapperElements };
}
