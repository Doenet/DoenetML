import {
    groupCompositeRanges,
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

function isBlankStringChild(child: FlatDastElementContent) {
    return typeof child === "string" && child.trim() === "";
}

/**
 * The prototype's `<asList>` renderer treats each FlatDast child as a list item.
 * Whitespace-only strings in the JS child-instruction stream are separators
 * around authored inline replacements, not their own list items, so keep leading
 * and trailing blanks outside the wrapper when possible and remove inter-item
 * blanks from the wrapper's child list.
 */
function trimAsListBlankChildren(children: FlatDastElementContent[]): {
    leadingBlankChildren: FlatDastElementContent[];
    listChildren: FlatDastElementContent[];
    trailingBlankChildren: FlatDastElementContent[];
} {
    const firstNonBlankInd = children.findIndex((c) => !isBlankStringChild(c));

    if (firstNonBlankInd === -1) {
        return {
            leadingBlankChildren: children,
            listChildren: [],
            trailingBlankChildren: [],
        };
    }

    let lastNonBlankInd = children.length - 1;
    while (
        lastNonBlankInd > firstNonBlankInd &&
        isBlankStringChild(children[lastNonBlankInd])
    ) {
        lastNonBlankInd--;
    }

    return {
        leadingBlankChildren: children.slice(0, firstNonBlankInd),
        listChildren: children
            .slice(firstNonBlankInd, lastNonBlankInd + 1)
            .filter((c) => !isBlankStringChild(c)),
        trailingBlankChildren: children.slice(lastNonBlankInd + 1),
    };
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
 * - A list group always becomes an `<asList>` wrapper (it has more than one
 *   non-blank item).
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
            const rawChildren = materializeGroups(
                group.items,
                true,
                wrapperElements,
            );
            const {
                leadingBlankChildren,
                listChildren,
                trailingBlankChildren,
            } = trimAsListBlankChildren(rawChildren);

            if (!contextIsList) {
                out.push(...leadingBlankChildren);
            }
            wrapperElements.push(
                makeWrapperElement(
                    group.range.compositeIdx,
                    "asList",
                    listChildren,
                ),
            );
            out.push({ id: group.range.compositeIdx, annotation: "original" });
            if (!contextIsList) {
                out.push(...trailingBlankChildren);
            }
            continue;
        }

        const children = materializeGroups(group.items, false, wrapperElements);
        if (children.length === 0) {
            continue;
        }
        if (children.length === 1) {
            // Already a single unit; no wrapper needed.
            out.push(children[0]);
        } else if (contextIsList) {
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
            // Not inside a list: splice inline, adding no structure.
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
 * The grouping itself — which children came from which composite, and which of
 * those composites are lists — is `groupCompositeRanges`, shared with the
 * renderers and with the `text` state variable, so the three cannot drift apart.
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
        isBlank: (child) => child !== null && isBlankStringChild(child),
    });

    const wrapperElements: FlatDastElement[] = [];
    const children = materializeGroups(groups, false, wrapperElements);

    return { children, wrapperElements };
}
