import type { FlatDastElement, FlatDastElementContent } from "./CoreWorker";

/**
 * A single entry of a component's `_compositeReplacementActiveRange` state
 * value (built in the JS core's `CompositeExpander` and surfaced on the parent
 * component's renderer state by `RendererInstructionBuilder`).
 *
 * `firstInd`/`lastInd` are indices into the parent's children array in the
 * *child-instruction* index space (i.e. the same space as
 * `rendererState.childrenInstructions`, which includes `null` placeholders for
 * absent children). `potentialListComponents[i]` records whether the
 * replacement at `firstInd + i` is eligible to be an element of a list (an
 * inline component, or any component with `canBeInList`).
 */
export type CompositeReplacementRange = {
    compositeIdx: number;
    compositeName?: string;
    firstInd: number;
    lastInd: number;
    asList: boolean;
    potentialListComponents?: boolean[];
};

/**
 * A child slot, kept aligned with the child-instruction index space so the
 * `firstInd`/`lastInd` of a `CompositeReplacementRange` index directly into it.
 * `null` mirrors an absent child instruction (e.g. an unrendered branch); it is
 * preserved during processing — exactly as the renderer's
 * `addCommasForCompositeRanges` keeps `null` React children — and dropped only
 * when materializing the final FlatDast children.
 */
export type ChildContent = FlatDastElementContent | null;

/**
 * Intermediate tree node produced by {@link processCompositeRanges}. A `content`
 * node is a passthrough string/ref (or `null`); a `group` node is a composite
 * range whose children have already been grouped. `isAsList` records whether the
 * renderer's `addCommasForCompositeRanges` would have inserted commas for this
 * range (`asList && allListComponents && groupedChildCount > 1`).
 */
type Item =
    | { kind: "content"; value: ChildContent }
    | { kind: "group"; isAsList: boolean; compositeIdx: number; items: Item[] };

/**
 * Faithful re-implementation of the grouping performed by
 * `addCommasForCompositeRanges` (in
 * `packages/doenetml/src/Viewer/renderers/utils/composites.tsx`), but producing
 * a tree of {@link Item} nodes instead of React nodes.
 *
 * Mirrors `addCommasForCompositeRangesSub`: it walks the ranges in order,
 * recursively groups nested composite ranges (a composite whose replacements are
 * themselves composites — the outer range comes first in the array), and for
 * each range computes `allListComponents` from the (post-grouping) list
 * eligibility of its items. The `removedInd` reconciliation the renderer needs
 * is intentionally omitted: the FlatDast always reflects the current children,
 * so there is no stale-React-child to skip.
 */
function processCompositeRanges(
    contents: ChildContent[],
    ranges: CompositeReplacementRange[],
    startInd: number,
    endInd: number,
    potentialListComponents: boolean[] | null,
): { items: Item[]; eligible: boolean[] } {
    const items: Item[] = [];
    const eligible: boolean[] = [];
    let lastChildInd = startInd - 1;
    let lastChildIndIncludingEmptyComposites = lastChildInd;

    for (let rangeInd = 0; rangeInd < ranges.length; rangeInd++) {
        const range = ranges[rangeInd];
        const rangeFirstInd = range.firstInd;
        const rangeLastInd = range.lastInd;

        if (rangeFirstInd > lastChildInd && rangeLastInd <= endInd) {
            // Plain children sitting between the previous range and this one.
            if (lastChildInd + 1 < rangeFirstInd) {
                for (let i = lastChildInd + 1; i < rangeFirstInd; i++) {
                    items.push({ kind: "content", value: contents[i] });
                }
                if (potentialListComponents) {
                    for (let i = lastChildInd + 1; i < rangeFirstInd; i++) {
                        eligible.push(potentialListComponents[i - startInd]);
                    }
                }
            }

            // The outer composite is first in the array, so its nested
            // composites are exactly the ranges after it. Group them first.
            const subRanges = ranges.slice(rangeInd + 1);
            const { items: rawItems, eligible: rawEligible } =
                processCompositeRanges(
                    contents,
                    subRanges,
                    rangeFirstInd,
                    rangeLastInd,
                    range.potentialListComponents ?? null,
                );

            // Drop null children before deciding list-ness, mirroring
            // `childrenInRange.filter((x) => x !== null)`.
            const itemsInRange = rawItems.filter((it) => !isNullContent(it));
            const eligibleInRange = rawEligible.filter(
                (_, i) => !isNullContent(rawItems[i]),
            );
            const listItemsInRange = itemsInRange.filter(
                (it) => !isBlankStringContent(it),
            );
            const eligibleListItemsInRange = eligibleInRange.filter(
                (_, i) => !isBlankStringContent(itemsInRange[i]),
            );

            const allListComponents = eligibleListItemsInRange.every((x) => x);
            const isAsList =
                Boolean(range.asList) &&
                allListComponents &&
                listItemsInRange.length > 1;

            if (itemsInRange.length > 0) {
                items.push({
                    kind: "group",
                    isAsList,
                    compositeIdx: range.compositeIdx,
                    items: itemsInRange,
                });
                if (potentialListComponents) {
                    eligible.push(allListComponents);
                }
            }

            lastChildInd = rangeLastInd;
            // For an empty composite, `rangeLastInd === rangeFirstInd - 1`; keep
            // the eligibility cursor past the composite so we don't re-add it.
            lastChildIndIncludingEmptyComposites = Math.max(
                rangeFirstInd,
                rangeLastInd,
            );
        }
    }

    // Trailing plain children after the last range.
    if (lastChildInd < endInd) {
        for (let i = lastChildInd + 1; i <= endInd; i++) {
            items.push({ kind: "content", value: contents[i] });
        }
        if (potentialListComponents) {
            for (
                let i = lastChildIndIncludingEmptyComposites + 1;
                i <= endInd;
                i++
            ) {
                eligible.push(potentialListComponents[i - startInd]);
            }
        }
    }

    return { items, eligible };
}

function isNullContent(item: Item | undefined) {
    return item?.kind === "content" && item.value === null;
}

function isBlankStringContent(item: Item | undefined) {
    return (
        item?.kind === "content" &&
        typeof item.value === "string" &&
        item.value.trim() === ""
    );
}

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
 * Convert the {@link Item} tree into FlatDast children, emitting the wrapper
 * elements that need to exist in `elements[]`.
 *
 * - An `asList` group always becomes an `<asList>` wrapper (it has more than
 *   one non-blank list item).
 * - A non-list group is materialized as a single unit only when it must be —
 *   i.e. it has more than one child *and* sits inside an enclosing list, where
 *   the list would otherwise treat each of its children as a separate item. It
 *   is then wrapped in a passthrough `<_fragment>`. Everywhere else (top level,
 *   or a single child) its children are spliced inline, so non-list composites
 *   add no structure and the comma output matches the renderer exactly.
 */
function materializeItems(
    items: Item[],
    contextIsList: boolean,
    wrapperElements: FlatDastElement[],
): FlatDastElementContent[] {
    const out: FlatDastElementContent[] = [];

    for (const item of items) {
        if (item.kind === "content") {
            if (item.value !== null) {
                out.push(item.value);
            }
            continue;
        }

        if (item.isAsList) {
            const rawChildren = materializeItems(
                item.items,
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
                makeWrapperElement(item.compositeIdx, "asList", listChildren),
            );
            out.push({ id: item.compositeIdx, annotation: "original" });
            if (!contextIsList) {
                out.push(...trailingBlankChildren);
            }
            continue;
        }

        // Non-list group.
        const children = materializeItems(item.items, false, wrapperElements);
        if (children.length === 0) {
            continue;
        }
        if (children.length === 1) {
            // Already a single unit; no wrapper needed.
            out.push(children[0]);
        } else if (contextIsList) {
            // Must be one unit so the enclosing list delimits it correctly.
            wrapperElements.push(
                makeWrapperElement(item.compositeIdx, "_fragment", children),
            );
            out.push({ id: item.compositeIdx, annotation: "original" });
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
 * doenetml renderers add via `addCommasForCompositeRanges`.
 *
 * @param childContents The parent's children aligned with the child-instruction
 *   index space (use `null` for absent child instructions) so the range indices
 *   line up.
 * @param compositeReplacementActiveRange The parent's
 *   `_compositeReplacementActiveRange` state value (may be `undefined`/empty).
 * @returns The rewritten children plus any wrapper elements that must be added
 *   to the FlatDast `elements` array. When there are no ranges, `children` is
 *   simply `childContents` with `null`s dropped and `wrapperElements` is empty.
 */
export function applyCompositeListWrapping(
    childContents: ChildContent[],
    compositeReplacementActiveRange: CompositeReplacementRange[] | undefined,
): { children: FlatDastElementContent[]; wrapperElements: FlatDastElement[] } {
    if (
        !compositeReplacementActiveRange ||
        compositeReplacementActiveRange.length === 0
    ) {
        return {
            children: childContents.filter(
                (c): c is FlatDastElementContent => c !== null,
            ),
            wrapperElements: [],
        };
    }

    const { items } = processCompositeRanges(
        childContents,
        compositeReplacementActiveRange,
        0,
        childContents.length - 1,
        null,
    );

    const wrapperElements: FlatDastElement[] = [];
    const children = materializeItems(items, false, wrapperElements);

    return { children, wrapperElements };
}
