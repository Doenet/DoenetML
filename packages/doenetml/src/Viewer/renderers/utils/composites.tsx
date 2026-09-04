import React from "react";
import {
    groupCompositeRanges,
    type CompositeGroup,
    type CompositeRange,
} from "@doenet/utils";

// If consecutive children are from a composite with asList set,
// then display those children separated by commas.
// compositeReplacementActiveRange is an array for each composite that
// contributed to the active children of the component.

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

    return renderGroups(groups);
}

function isBlankStringChild(child: React.ReactNode) {
    return typeof child === "string" && child.trim() === "";
}

function isBlankGroup(group: CompositeGroup<React.ReactNode>): boolean {
    if (group.kind === "child") {
        return isBlankStringChild(group.value);
    }
    return group.items.every(isBlankGroup);
}

function renderGroups(
    groups: CompositeGroup<React.ReactNode>[],
): React.ReactNode[] {
    const rendered: React.ReactNode[] = [];

    for (const group of groups) {
        if (group.kind === "child") {
            rendered.push(group.value);
            continue;
        }

        const items = group.asList
            ? separateWithCommas(group.items)
            : renderGroups(group.items);

        // Whether or not we added commas, we still add a span with the id of
        // the composite so that links to the composite name will scroll to the
        // right location.
        rendered.push(
            <React.Fragment key={group.range.compositeName}>
                <span id={group.range.compositeName}>{items}</span>
            </React.Fragment>,
        );
    }

    return rendered;
}

/**
 * Put `", "` between the items of a composite shown as a list. The whitespace
 * an author wrote around the replacements is not an item: no comma is placed
 * next to it, and the comma goes in front of it rather than after, so nothing
 * puts a space before a comma.
 */
function separateWithCommas(
    items: CompositeGroup<React.ReactNode>[],
): React.ReactNode[] {
    const blank = items.map(isBlankGroup);
    const separated: React.ReactNode[] = [];

    for (const [ind, item] of items.entries()) {
        if (
            ind > 0 &&
            !blank[ind - 1] &&
            blank.slice(ind).some((isBlank) => !isBlank)
        ) {
            // The item before this one is not whitespace and some item still to
            // come is not either, so the two are separated by a comma.
            separated.push(", ");
        }
        separated.push(...renderGroups([item]));
    }

    return separated;
}
