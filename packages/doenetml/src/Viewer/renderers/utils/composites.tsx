import React from "react";
import {
    groupCompositeRanges,
    isBlankGroup,
    listCommaPositions,
    type CompositeGroup,
    type CompositeRange,
} from "@doenet/utils";

/**
 * Put `", "` between the replacements of a composite that asks to be shown as
 * a list, and wrap every composite's replacements in a span carrying its name.
 *
 * `compositeReplacementActiveRange` is the core's record of which of
 * `children` each composite produced. Which of those composites are lists, and
 * where the commas go among a list's items, is decided by the grouping in
 * `@doenet/utils`, shared with the `text` state variable, so both decide the
 * commas the same way.
 */
export function addCommasForCompositeRanges({
    compositeReplacementActiveRange,
    children,
    startInd,
    endInd,
    removedInd = null,
}: {
    compositeReplacementActiveRange: CompositeRange[];
    children: React.ReactNode[];
    startInd: number;
    endInd: number;
    removedInd?: number | null;
}) {
    const groups = groupCompositeRanges<React.ReactNode>({
        children,
        ranges: compositeReplacementActiveRange,
        isAbsent: (child) => child === null,
        isBlank: isBlankStringChild,
        // A string child that ends an item loses its trailing whitespace, so
        // the comma that follows sits right against the item. A rendered
        // component child keeps its own: the renderers only hand React the
        // child and never see what it draws.
        trimEnd: (child) =>
            typeof child === "string" ? child.trimEnd() : child,
        startInd,
        endInd,
        removedInd,
    });

    return groups.map(renderGroup);
}

function isBlankStringChild(child: React.ReactNode) {
    return typeof child === "string" && child.trim() === "";
}

/**
 * A child as it was given, or a composite's items inside a span with the id of
 * the composite, so that a link to the composite's name scrolls to its place —
 * whether or not the composite became a list.
 */
function renderGroup(group: CompositeGroup<React.ReactNode>): React.ReactNode {
    if (group.kind === "child") {
        return group.value;
    }
    const items = group.asList
        ? separateWithCommas(group.items)
        : group.items.map(renderGroup);
    return (
        <span key={group.range.compositeName} id={group.range.compositeName}>
            {items}
        </span>
    );
}

/**
 * Put `", "` between the items of a composite shown as a list. The whitespace
 * an author wrote around the replacements is not an item, and no comma is
 * placed next to it.
 */
function separateWithCommas(
    items: CompositeGroup<React.ReactNode>[],
): React.ReactNode[] {
    const commaBefore = listCommaPositions(
        items.map((item) => isBlankGroup(item, isBlankStringChild)),
    );
    return items.flatMap((item, ind) =>
        commaBefore[ind] ? [", ", renderGroup(item)] : [renderGroup(item)],
    );
}
