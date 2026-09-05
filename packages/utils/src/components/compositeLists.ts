/**
 * Grouping the children a parent received from composites, so that the
 * replacements of a composite that asks to be shown as a list can be separated
 * by commas.
 *
 * The core records, for each composite that contributed children to a parent,
 * the range of children it produced (`compositeReplacementActiveRange`, built
 * in `CompositeExpander.replaceCompositeChildren`). Four places turn that into
 * output — the renderers, the `text` state variable, the string a `<math>`
 * parses, and the FlatDast the prototype renderers read — and they differ only
 * in what they do with a group once they have one. {@link groupCompositeRanges}
 * is the part they share: it turns the flat array of ranges into a tree, and
 * decides which nodes of that tree are lists. {@link listCommaPositions} then
 * says where the commas go among a list's items, and {@link joinListText}
 * joins the text of those items for the pathways that produce a string.
 */

/**
 * One entry of a parent's `compositeReplacementActiveRange`.
 *
 * `firstInd`/`lastInd` are inclusive indices into the parent's children. A
 * composite that produced nothing is recorded as `lastInd === firstInd - 1`.
 * `potentialListComponents[i]` says whether the child at `firstInd + i` is
 * eligible to be an item of a list: a string is, an inline component is unless
 * its class sets `canBeInList` to `false`, and any other component is only if
 * its class sets `canBeInList` to `true`.
 */
export type CompositeRange = {
    compositeIdx: number;
    compositeName?: string;
    firstInd: number;
    lastInd: number;
    asList?: boolean;
    hidden?: boolean;
    potentialListComponents?: boolean[];
};

/**
 * A child of the parent, or the children one composite produced. `asList` says
 * whether this composite's items are to be separated by commas — the question
 * every caller is really asking. The items of a list are already as the commas
 * will separate them (see `isBlank` and `trimEnd` in
 * {@link GroupCompositeRangesOptions}); {@link listCommaPositions} says where
 * among them the commas go.
 */
export type CompositeGroup<T> =
    | { kind: "child"; value: T; index: number }
    | {
          kind: "composite";
          range: CompositeRange;
          asList: boolean;
          items: CompositeGroup<T>[];
      };

export type GroupCompositeRangesOptions<T> = {
    /** The parent's children, in the index space the ranges refer to. */
    children: T[];
    /** The parent's `compositeReplacementActiveRange`, or nothing. */
    ranges: CompositeRange[] | undefined;
    /**
     * A child that is not there — a `null` where a child instruction would be
     * for a child that is not rendered. Such a child is left out of the tree
     * and does not count towards the item that would make a list.
     */
    isAbsent?: (value: T) => boolean;
    /**
     * A whitespace-only child. Authored whitespace around a composite's
     * replacements separates them rather than being one of them: it is never
     * an item, and in a list it stays only where no comma takes its place,
     * before the first item and after the last. Between two items it goes, as
     * does the whitespace at the end of an item a comma will follow.
     */
    isBlank?: (value: T) => boolean;
    /**
     * A composite to leave out along with everything it produced — how the
     * `text` pathway drops a hidden composite.
     */
    skipRange?: (range: CompositeRange) => boolean;
    /**
     * Take the trailing whitespace off a child, for the child that ends an item
     * a comma will follow. Whitespace-only children at the end of such an item
     * are dropped whether or not this is given; this is for a child that ends
     * with whitespace without being only whitespace.
     */
    trimEnd?: (value: T) => T;
    /** First child to group; defaults to the first. */
    startInd?: number;
    /** Last child to group, inclusive; defaults to the last. */
    endInd?: number;
    /**
     * The index of a child the caller removed from `children` before calling —
     * `section.tsx` takes the `<title>` out of the array it renders. Ranges are
     * shifted to match, and a range that ended on that child is dropped.
     */
    removedInd?: number | null;
};

/**
 * Group `children` by the composites that produced them.
 *
 * Nesting is implicit in `ranges`: a composite whose replacements are
 * themselves composites comes first, and the ranges after it whose indices lie
 * inside its own are its replacements'. The tree makes that explicit.
 */
export function groupCompositeRanges<T>({
    children,
    ranges,
    isAbsent = () => false,
    isBlank = () => false,
    skipRange = () => false,
    trimEnd = (value) => value,
    startInd = 0,
    endInd = children.length - 1,
    removedInd = null,
}: GroupCompositeRangesOptions<T>): CompositeGroup<T>[] {
    const { items } = groupRange({
        children,
        ranges: ranges ?? [],
        startInd,
        endInd,
        eligibility: null,
        isAbsent,
        isBlank,
        skipRange,
        trimEnd,
        removedInd,
    });

    return items;
}

/**
 * The items of one range, together with whether each is eligible to be an item
 * of the list the enclosing composite might form. Eligibility is only asked for
 * inside a range, since only a composite forms a list.
 */
function groupRange<T>({
    children,
    ranges,
    startInd,
    endInd,
    eligibility,
    isAbsent,
    isBlank,
    skipRange,
    trimEnd,
    removedInd,
}: {
    children: T[];
    ranges: CompositeRange[];
    startInd: number;
    endInd: number;
    eligibility: boolean[] | null;
    isAbsent: (value: T) => boolean;
    isBlank: (value: T) => boolean;
    skipRange: (range: CompositeRange) => boolean;
    trimEnd: (value: T) => T;
    removedInd: number | null;
}): { items: CompositeGroup<T>[]; eligible: boolean[] } {
    const items: CompositeGroup<T>[] = [];
    const eligible: boolean[] = [];

    // The first child not yet placed in the tree.
    let nextInd = startInd;

    /** Place the children before `upTo` that no composite produced. */
    function addPlainChildren(upTo: number) {
        for (; nextInd < upTo; nextInd++) {
            const value = children[nextInd];
            if (isAbsent(value)) {
                continue;
            }
            items.push({ kind: "child", value, index: nextInd });
            if (eligibility) {
                eligible.push(eligibility[nextInd - startInd] ?? false);
            }
        }
    }

    for (let rangeInd = 0; rangeInd < ranges.length; rangeInd++) {
        const range = ranges[rangeInd];
        const shifted = shiftForRemovedChild(range, removedInd);
        if (!shifted) {
            continue;
        }
        const { firstInd, lastInd } = shifted;

        if (firstInd < nextInd || lastInd > endInd) {
            // Not one of this range's own composites: either already accounted
            // for, or reaching past the children being grouped.
            continue;
        }

        addPlainChildren(firstInd);
        // Past the composite's children — of which a composite that produced
        // nothing, recorded with `lastInd === firstInd - 1`, has none.
        nextInd = lastInd + 1;

        if (skipRange(range)) {
            continue;
        }

        // The composite comes before the composites it produced, so its own are
        // exactly the ranges after it.
        const { items: rangeItems, eligible: rangeEligible } = groupRange({
            children,
            ranges: ranges.slice(rangeInd + 1),
            startInd: firstInd,
            endInd: lastInd,
            eligibility: range.potentialListComponents ?? null,
            isAbsent,
            isBlank,
            skipRange,
            trimEnd,
            removedInd,
        });

        if (rangeItems.length === 0) {
            continue;
        }

        const listItems = rangeItems.filter(
            (item) => !isBlankGroup(item, isBlank),
        );
        const allEligible = rangeEligible.every(
            (value, ind) => value || isBlankGroup(rangeItems[ind], isBlank),
        );
        const asList =
            Boolean(range.asList) && allEligible && listItems.length > 1;

        items.push({
            kind: "composite",
            range,
            asList,
            items: asList
                ? prepareListItems(rangeItems, isBlank, trimEnd)
                : rangeItems,
        });
        if (eligibility) {
            eligible.push(allEligible);
        }
    }

    addPlainChildren(endInd + 1);

    return { items, eligible };
}

/**
 * Where the caller removed a child before grouping, move a range to match.
 * Returns nothing for a range that ended on the removed child, which is no
 * longer a range of the children being grouped.
 */
function shiftForRemovedChild(
    range: CompositeRange,
    removedInd: number | null,
): { firstInd: number; lastInd: number } | undefined {
    let { firstInd, lastInd } = range;
    if (removedInd === null) {
        return { firstInd, lastInd };
    }
    if (firstInd === removedInd || lastInd === removedInd) {
        return undefined;
    }
    if (firstInd > removedInd) {
        firstInd -= 1;
    }
    if (lastInd > removedInd) {
        lastInd -= 1;
    }
    return { firstInd, lastInd };
}

/**
 * Whether a node of the tree is only whitespace: a blank child, or a composite
 * that produced nothing but blank children.
 */
export function isBlankGroup<T>(
    group: CompositeGroup<T>,
    isBlank: (value: T) => boolean,
): boolean {
    if (group.kind === "child") {
        return isBlank(group.value);
    }
    return group.items.every((item) => isBlankGroup(item, isBlank));
}

/**
 * Where the commas go among the items of a list, given which items are blank:
 * in front of every item that has an item before it. No comma lands next to
 * the whitespace at either end of the list, and a blank left in the middle, a
 * composite that produced only whitespace, gets one comma rather than two.
 */
export function listCommaPositions(blank: boolean[]): boolean[] {
    return blank.map(
        (_, ind) =>
            ind > 0 &&
            !blank[ind - 1] &&
            blank.slice(ind).some((isBlank) => !isBlank),
    );
}

/**
 * The text of a list, from the text of its items and which of those items are
 * blank. The commas go where {@link listCommaPositions} puts them, and an item
 * a comma will follow loses the whitespace its text ends with, so that nothing
 * puts a space in front of a comma.
 */
export function joinListText(parts: string[], blank: boolean[]): string {
    const commaBefore = listCommaPositions(blank);
    return parts
        .map((part, ind) => (commaBefore[ind + 1] ? part.trimEnd() : part))
        .map((part, ind) => (commaBefore[ind] ? ", " + part : part))
        .join("");
}

/**
 * The items of a list as the commas will separate them. A blank child between
 * two items goes, since the comma takes its place, and so does the whitespace
 * at the end of an item a comma will follow, so that nothing puts a space in
 * front of a comma. The whitespace before the first item and after the last
 * stays: no comma replaces it, and it separates the list from what surrounds
 * it. A composite that produced only whitespace also stays, so that the
 * renderers can still anchor its name to its place.
 */
function prepareListItems<T>(
    items: CompositeGroup<T>[],
    isBlank: (value: T) => boolean,
    trimEnd: (value: T) => T,
): CompositeGroup<T>[] {
    const firstItemInd = items.findIndex(
        (item) => !isBlankGroup(item, isBlank),
    );
    let lastItemInd = items.length - 1;
    while (
        lastItemInd > firstItemInd &&
        isBlankGroup(items[lastItemInd], isBlank)
    ) {
        lastItemInd--;
    }

    const prepared: CompositeGroup<T>[] = [];
    for (const [ind, item] of items.entries()) {
        if (ind < firstItemInd || ind >= lastItemInd) {
            prepared.push(item);
        } else if (!isBlankGroup(item, isBlank)) {
            prepared.push(trimItemEnd(item, isBlank, trimEnd));
        } else if (item.kind === "composite") {
            prepared.push(item);
        }
    }
    return prepared;
}

/**
 * Drop the whitespace-only children an item ends with, and take the trailing
 * whitespace off the child that is left at its end. `item` is not itself
 * blank, so a composite always has such a child.
 */
function trimItemEnd<T>(
    item: CompositeGroup<T>,
    isBlank: (value: T) => boolean,
    trimEnd: (value: T) => T,
): CompositeGroup<T> {
    if (item.kind === "child") {
        const trimmed = trimEnd(item.value);
        return trimmed === item.value ? item : { ...item, value: trimmed };
    }

    let end = item.items.length;
    while (isBlankGroup(item.items[end - 1], isBlank)) {
        end--;
    }

    return {
        ...item,
        items: [
            ...item.items.slice(0, end - 1),
            trimItemEnd(item.items[end - 1], isBlank, trimEnd),
        ],
    };
}
