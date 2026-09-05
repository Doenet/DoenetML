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
     * shifted to match, and a range that began or ended on that child is
     * dropped.
     */
    removedInd?: number | null;
};

/**
 * Group `children` by the composites that produced them.
 *
 * A composite's range is recorded before its replacements' ranges, and each of
 * those lies inside it. Ordered by where they start, the wider first where two
 * start together, every range comes right before the ranges of the composites
 * inside it, however the ranges of one composite's replacements were
 * interleaved with its siblings'. Two ranges with the same span — a composite
 * whose only replacement is a composite — keep their recorded order, the outer
 * first, since the sort is stable. One pass over them, with a stack of the
 * composites still open, then builds the tree.
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
    const ordered = (ranges ?? [])
        .flatMap((range) => {
            const span = shiftForRemovedChild(range, removedInd);
            return span && span.firstInd >= startInd && span.lastInd <= endInd
                ? [{ range, ...span }]
                : [];
        })
        .sort((a, b) => a.firstInd - b.firstInd || b.lastInd - a.lastInd);

    const root: OpenComposite<T> = {
        range: null,
        firstInd: startInd,
        lastInd: endInd,
        nextInd: startInd,
        eligibility: null,
        items: [],
        eligible: [],
    };
    const open: OpenComposite<T>[] = [root];

    /** Place the children before `upTo` that no composite produced. */
    function addPlainChildren(node: OpenComposite<T>, upTo: number) {
        for (; node.nextInd < upTo; node.nextInd++) {
            const value = children[node.nextInd];
            if (isAbsent(value)) {
                continue;
            }
            node.items.push({ kind: "child", value, index: node.nextInd });
            if (node.eligibility) {
                node.eligible.push(
                    node.eligibility[node.nextInd - node.firstInd] ?? false,
                );
            }
        }
    }

    /**
     * Leave the innermost open composite: place the last of its children,
     * decide whether it is a list, and put its group into the composite around
     * it. A composite that produced nothing leaves nothing behind.
     */
    function closeInnermost() {
        const node = open.pop()!;
        addPlainChildren(node, node.lastInd + 1);
        if (node.items.length === 0) {
            return;
        }
        const parent = open[open.length - 1];
        const listItems = node.items.filter(
            (item) => !isBlankGroup(item, isBlank),
        );
        const allEligible = node.eligible.every(
            (value, ind) => value || isBlankGroup(node.items[ind], isBlank),
        );
        const asList =
            Boolean(node.range!.asList) && allEligible && listItems.length > 1;

        parent.items.push({
            kind: "composite",
            range: node.range!,
            asList,
            items: asList
                ? prepareListItems(node.items, isBlank, trimEnd)
                : node.items,
        });
        if (parent.eligibility) {
            parent.eligible.push(allEligible);
        }
    }

    for (const { range, firstInd, lastInd } of ordered) {
        // Leave every composite this range does not lie inside.
        while (open.length > 1 && lastInd > open[open.length - 1].lastInd) {
            closeInnermost();
        }
        const parent = open[open.length - 1];
        if (firstInd < parent.nextInd) {
            // The replacement of a composite the caller asked to skip: its
            // children were passed over above without opening it, so this
            // range goes with it.
            continue;
        }

        addPlainChildren(parent, firstInd);
        // Past the composite's children, of which one that produced nothing,
        // recorded with `lastInd === firstInd - 1`, has none.
        parent.nextInd = lastInd + 1;

        if (skipRange(range)) {
            continue;
        }
        open.push({
            range,
            firstInd,
            lastInd,
            nextInd: firstInd,
            eligibility: range.potentialListComponents ?? null,
            items: [],
            eligible: [],
        });
    }
    while (open.length > 1) {
        closeInnermost();
    }
    addPlainChildren(root, endInd + 1);

    return root.items;
}

/**
 * A composite whose range has been entered and not yet left: what it holds so
 * far, and whether each of those items is eligible to be an item of the list
 * it might form. The root stands for the children being grouped as a whole;
 * their eligibility is never asked for, since only a composite forms a list.
 */
type OpenComposite<T> = {
    range: CompositeRange | null;
    firstInd: number;
    lastInd: number;
    /** The first of its children not yet placed in the tree. */
    nextInd: number;
    eligibility: boolean[] | null;
    items: CompositeGroup<T>[];
    eligible: boolean[];
};

/**
 * Where the caller removed a child before grouping, move a range to match.
 * Returns nothing for a range that began or ended on the removed child — the
 * composite that produced the `<title>` — whose other children, if it had any,
 * are then grouped as if no composite had produced them.
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
    const commaBefore: boolean[] = new Array(blank.length);
    // Walking from the right, whether an item is at this position or after it.
    let itemAtOrAfter = false;
    for (let ind = blank.length - 1; ind >= 0; ind--) {
        itemAtOrAfter ||= !blank[ind];
        commaBefore[ind] = ind > 0 && !blank[ind - 1] && itemAtOrAfter;
    }
    return commaBefore;
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
 * it. Between two items, a composite that produced only whitespace stays as
 * well, emptied of that whitespace, so that the renderers can still anchor its
 * name to its place.
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
            prepared.push(withoutBlankChildren(item));
        }
    }
    return prepared;
}

/**
 * A composite that produced only whitespace, with that whitespace taken out
 * and only the composites inside it left, each emptied the same way.
 */
function withoutBlankChildren<T>(
    group: CompositeGroup<T> & { kind: "composite" },
): CompositeGroup<T> {
    return {
        ...group,
        items: group.items.flatMap((item) =>
            item.kind === "composite" ? [withoutBlankChildren(item)] : [],
        ),
    };
}

/**
 * Take the whitespace off the end of an item a comma will follow: the
 * whitespace-only children it ends with go, the composites among them stay
 * for their anchors but emptied of their whitespace, and the child left at its
 * end loses its trailing whitespace. `item` is not itself blank, so a composite
 * always has such a child.
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
    const emptiedComposites = item.items
        .slice(end)
        .flatMap((sub) =>
            sub.kind === "composite" ? [withoutBlankChildren(sub)] : [],
        );

    return {
        ...item,
        items: [
            ...item.items.slice(0, end - 1),
            trimItemEnd(item.items[end - 1], isBlank, trimEnd),
            ...emptiedComposites,
        ],
    };
}
