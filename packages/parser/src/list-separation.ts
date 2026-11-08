/**
 * The one rule for separating the entries of a list written as text
 * (Doenet/DoenetML#2492), shared by the sugar of the parser (`<select>`,
 * `<repeat for>`) and of the worker (value lists, list attributes, the math,
 * boolean and list operators).
 *
 * - **Which separator.** If the written text has a comma outside brackets,
 *   entries are separated by commas only, and the spaces around each entry
 *   are trimmed. Otherwise entries are separated by spaces outside brackets,
 *   and a run of spaces counts as one.
 * - **Only written text counts.** Anything else among the items (a
 *   reference, a component) is opaque: a comma it holds or its value gives
 *   doesn't choose commas.
 * - **Brackets.** `(`, `[` and `{` open and `)`, `]` and `}` close, any
 *   closer closing any opener (one depth count, so `(1, 2]` is one group).
 *   No separator inside brackets separates entries. If the brackets of the
 *   text don't balance, they are ignored for the whole list, and the caller
 *   reports it (`unmatchedBrackets`).
 * - **Empty entries.** With commas, every comma separates two entries, so a
 *   leading or trailing comma, or two commas in a row, give an empty entry.
 *   Spaces never make one.
 */

/** Which character separates the entries of a list. */
export type ListSeparator = "comma" | "space";

/** How the text of a list is split. */
export interface ListSplitting {
    separator: ListSeparator;
    /** Whether what is inside brackets is kept in one entry. */
    bracketsGroup: boolean;
}

/**
 * A part of an entry: a slice `[start, end)` of the string at `item` among
 * the items split, or, with no `start`, the whole of a non-string item.
 */
export type ListEntryPart =
    | { item: number; start: number; end: number }
    | { item: number; start?: undefined; end?: undefined };

/** What splitting the items of a list gives. */
export interface ListSplitResult {
    /** Each entry, as its parts in order. An empty entry has none. */
    entries: ListEntryPart[][];
    /** How the items were split. */
    splitting: ListSplitting;
    /**
     * Whether the brackets of the text didn't balance, so were ignored.
     * Only when the splitting was decided here, not given.
     */
    unmatchedBrackets: boolean;
}

const OPENERS = "([{";
const CLOSERS = ")]}";

function isWhitespace(char: string) {
    return /\s/.test(char);
}

/**
 * Whether the brackets of `texts`, read one after another, balance: no
 * closer with nothing open, and nothing open at the end.
 */
export function bracketsBalance(texts: string[]): boolean {
    let depth = 0;
    for (const text of texts) {
        for (const char of text) {
            if (OPENERS.includes(char)) {
                depth++;
            } else if (CLOSERS.includes(char)) {
                if (depth === 0) {
                    return false;
                }
                depth--;
            }
        }
    }
    return depth === 0;
}

/**
 * How the written text `texts` of a list is split (see the top of this
 * file), and whether its brackets were ignored for not balancing.
 */
export function listSplittingOf(texts: string[]): {
    splitting: ListSplitting;
    unmatchedBrackets: boolean;
} {
    const bracketsGroup = bracketsBalance(texts);
    let depth = 0;
    let separator: ListSeparator = "space";
    outer: for (const text of texts) {
        for (const char of text) {
            if (bracketsGroup && OPENERS.includes(char)) {
                depth++;
            } else if (bracketsGroup && CLOSERS.includes(char)) {
                depth--;
            } else if (char === "," && depth === 0) {
                separator = "comma";
                break outer;
            }
        }
    }
    return {
        splitting: { separator, bracketsGroup },
        unmatchedBrackets: !bracketsGroup,
    };
}

/**
 * Split `items`, the children of a list, into its entries. Strings are its
 * written text; any other item is opaque, and joins the entry it is written
 * in (`$a + 1`), unless `isBoundary` says it is an entry of its own (a
 * component written as a child), which ends the entry before it.
 *
 * `splitting` is how to split, when it was decided already (by sugar that
 * split the whole of the text this is part of); otherwise it is decided
 * from the strings among `items` (`listSplittingOf`).
 */
export function splitListItems<T>(
    items: (string | T)[],
    {
        isBoundary = () => false,
        splitting: givenSplitting,
    }: {
        isBoundary?: (item: T) => boolean;
        splitting?: ListSplitting;
    } = {},
): ListSplitResult {
    let splitting: ListSplitting;
    let unmatchedBrackets = false;
    if (givenSplitting) {
        splitting = givenSplitting;
    } else {
        ({ splitting, unmatchedBrackets } = listSplittingOf(
            items.filter((item): item is string => typeof item === "string"),
        ));
    }
    const byComma = splitting.separator === "comma";
    const { bracketsGroup } = splitting;

    const entries: ListEntryPart[][] = [];
    let current: ListEntryPart[] = [];
    // With commas: whether the stretch since the last comma holds an entry
    // that a boundary item ended, or is that item, so that it gives no
    // empty entry when it ends.
    let stretchHadEntry = false;
    let depth = 0;

    function hasContent(parts: ListEntryPart[]) {
        return parts.some(
            (part) =>
                part.start === undefined ||
                /\S/.test(
                    (items[part.item] as string).slice(part.start, part.end),
                ),
        );
    }

    // The parts of `parts` without the whitespace at either end.
    function trimmed(parts: ListEntryPart[]) {
        const result = parts.map((part) => ({ ...part }));
        while (result.length > 0) {
            const first = result[0];
            if (first.start === undefined) {
                break;
            }
            const text = items[first.item] as string;
            while (first.start < first.end && isWhitespace(text[first.start])) {
                first.start++;
            }
            if (first.start < first.end) {
                break;
            }
            result.shift();
        }
        while (result.length > 0) {
            const last = result[result.length - 1];
            if (last.start === undefined) {
                break;
            }
            const text = items[last.item] as string;
            while (last.end > last.start && isWhitespace(text[last.end - 1])) {
                last.end--;
            }
            if (last.end > last.start) {
                break;
            }
            result.pop();
        }
        return result;
    }

    // Ends the entry being read, which a separator or a boundary item
    // ended. An entry with nothing in it is kept only when a comma ends a
    // stretch with no other entry (`a,,b`).
    function endEntry(byCommaSeparator: boolean) {
        if (hasContent(current)) {
            entries.push(trimmed(current));
            if (!byCommaSeparator) {
                stretchHadEntry = true;
            }
        } else if (byCommaSeparator && !stretchHadEntry) {
            entries.push([]);
        }
        current = [];
        if (byCommaSeparator) {
            stretchHadEntry = false;
        }
    }

    for (const [itemInd, item] of items.entries()) {
        if (typeof item !== "string") {
            if (isBoundary(item)) {
                endEntry(false);
                entries.push([{ item: itemInd }]);
                stretchHadEntry = true;
            } else {
                current.push({ item: itemInd });
            }
            continue;
        }

        let start = 0;
        for (let ind = 0; ind < item.length; ind++) {
            const char = item[ind];
            if (bracketsGroup && OPENERS.includes(char)) {
                depth++;
            } else if (bracketsGroup && CLOSERS.includes(char)) {
                // brackets given as grouping that don't balance here: a
                // closer with nothing open closes nothing
                depth = Math.max(0, depth - 1);
            } else if (depth === 0) {
                const separates = byComma ? char === "," : isWhitespace(char);
                if (separates) {
                    if (ind > start) {
                        current.push({ item: itemInd, start, end: ind });
                    }
                    if (byComma) {
                        endEntry(true);
                    } else if (hasContent(current)) {
                        endEntry(false);
                    }
                    start = ind + 1;
                }
            }
        }
        if (item.length > start) {
            current.push({ item: itemInd, start, end: item.length });
        }
    }

    // The end of the text ends the last entry, as a comma would: a trailing
    // comma leaves an empty one.
    if (byComma) {
        if (hasContent(current) || !stretchHadEntry) {
            // An empty list, or only whitespace, has no entries.
            if (hasContent(current) || entries.length > 0) {
                endEntry(true);
            }
        }
    } else {
        endEntry(false);
    }

    return { entries, splitting, unmatchedBrackets };
}

/**
 * The text of each entry of `text`, a list written as text, split by
 * `splitting` or, if not given, by the rule (`listSplittingOf`).
 */
export function splitListText(
    text: string,
    splitting?: ListSplitting,
): { entries: string[]; splitting: ListSplitting; unmatchedBrackets: boolean } {
    const result = splitListItems([text], { splitting });
    return {
        entries: result.entries.map((parts) =>
            parts
                .map((part) =>
                    part.start === undefined
                        ? ""
                        : text.slice(part.start, part.end),
                )
                .join(""),
        ),
        splitting: result.splitting,
        unmatchedBrackets: result.unmatchedBrackets,
    };
}
