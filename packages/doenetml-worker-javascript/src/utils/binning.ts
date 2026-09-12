/**
 * Counting numbers into the bins between a list of cut points.
 *
 * Here rather than in either component that needs it, because `<binCounts>` and
 * `<chart type="histogram">` count the same data into the same bins and a
 * document may show both: a table of counts beside a histogram of the column it
 * counts. Two implementations of "how many fall in this bin" would eventually
 * disagree on the page, and a reader would have no way to tell which was wrong.
 *
 * What is shared is the counting. Which cut points to count between is the
 * caller's question and is answered differently: `<binCounts>` requires them,
 * where a chart chooses them from the data when the author names none.
 */

/** Which end of each bin includes its cut point. */
export type BinClosed = "left" | "right";

/**
 * Whether every cut point is at least the one before it, so that the list
 * describes bins that can be counted.
 *
 * Phrased as "at least the one before it" rather than "none is below it" so
 * that a `NaN` cut point fails the test too — every comparison against a `NaN`
 * is false, so the negated phrasing would let one through, and nothing sorts
 * below a `NaN`, which would make the bin ending at it come out with a negative
 * count. Equal adjacent cut points pass: they name an empty bin, which is a
 * coherent thing to ask for, and NumPy likewise rejects only a decrease.
 */
export function cutPointsAscend(edges: number[]): boolean {
    return edges.every((edge, ind) => ind === 0 || edge >= edges[ind - 1]);
}

/**
 * How many of `values` fall in each bin defined by `edges`: one count per
 * interval, so `n + 1` cut points give `n` counts.
 *
 * `edges` must ascend and hold at least two cut points; the caller checks that,
 * since what to say about a list that does not is the caller's to decide.
 *
 * Implemented by sorting once and then binary-searching for each cut point,
 * rather than testing every value against every bin: the sample is the large
 * input here, so the work is one sort of it plus a cost per bin, not a pass
 * over it per bin. However large the sample, the result is one count per bin —
 * which is the thing a `<repeat>` over the values could not give.
 *
 * Each outermost cut point belongs to its own bin, whichever way `closed`
 * points, so a value sitting exactly on the first or the last of them is
 * counted rather than falling outside every bin — this is NumPy's rule for its
 * last bin and R's `include.lowest` for its first, applied symmetrically. A
 * value beyond the outermost cut points is another matter: it belongs to no
 * bin, and what to say about that is the caller's to decide.
 *
 * `NaN` is dropped before the sort, not merely left uncounted after it: a `NaN`
 * among the sorted values would break the ordering the binary searches assume
 * and so miscount its *neighbors* too. An infinity is kept, being a value the
 * comparisons order correctly and one a bin may legitimately end at.
 */
export function countValuesInBins({
    values,
    edges,
    closed,
}: {
    values: number[];
    edges: number[];
    closed: BinClosed;
}): number[] {
    const sorted = values
        .filter((value) => !Number.isNaN(value))
        .sort((a, b) => a - b);

    /** How many sorted values are strictly less than `x`. */
    function countBelow(x: number) {
        let low = 0,
            high = sorted.length;
        while (low < high) {
            const mid = (low + high) >> 1;
            if (sorted[mid] < x) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    /** How many sorted values are less than or equal to `x`. */
    function countAtMost(x: number) {
        let low = 0,
            high = sorted.length;
        while (low < high) {
            const mid = (low + high) >> 1;
            if (sorted[mid] <= x) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        return low;
    }

    const numBins = edges.length - 1;
    const counts: number[] = [];

    for (let bin = 0; bin < numBins; bin++) {
        const lower = edges[bin];
        const upper = edges[bin + 1];

        if (closed === "right") {
            // `(a, b]`, except the first bin, which also takes its lower edge.
            const below = bin === 0 ? countBelow(lower) : countAtMost(lower);
            counts.push(countAtMost(upper) - below);
        } else {
            // `[a, b)`, except the last bin, which also takes its upper edge.
            const atOrBelow =
                bin === numBins - 1 ? countAtMost(upper) : countBelow(upper);
            counts.push(atOrBelow - countBelow(lower));
        }
    }

    return counts;
}
