import CountingBaseListOperator from "./abstract/CountingBaseListOperator";
import {
    comparableValueFromRaw,
    compareExtractedValues,
} from "../utils/listValues";
import { codedDiagnostic } from "../utils/diagnostics";

/**
 * Operators that answer *how many*: `<tally>` counts exact matches per
 * category, `<binCounts>` counts values falling between cut points.
 *
 * They are two tags rather than one with two modes because they are two
 * functions in every array language that has them — NumPy `bincount` versus
 * `histogram`, R `table()` versus `cut()` — and because a single tag whose
 * meaning switches on which attribute you wrote is a tag with two meanings.
 *
 * See `CountingBaseListOperator` for the shared machinery.
 */

/** A label an author can read back, recovered from a comparable value. */
function labelForValue(value, numeric) {
    return numeric ? value.numericalValue : value.textValue;
}

/**
 * The distinct values of `values`, in sorted order — the categories `<tally>`
 * uses when the author names none.
 *
 * Sorted rather than first-seen so that the result does not depend on the order
 * the data happens to arrive in: a tally of the same multiset always reads the
 * same way, which is what makes it comparable across a resample.
 *
 * Each is tagged with `isNumeric` so that the counting pass compares against it
 * exactly as this pass did when deciding it was distinct. An extracted value
 * carries no `isNumeric` of its own — the list as a whole decides, which is what
 * `numeric` is — and without the tag the counting pass falls back to comparing
 * text, disagreeing with the pass that chose the categories: in
 * `<tally type="math">2/2 1 1</tally>` the three values are one category, but
 * the two written `1` would then match nothing and go uncounted.
 *
 * A malformed number is no category. It reaches the list because
 * `allAreNumeric` asks each child whether it is a number by *type*, and a
 * `<number>` whose content does not parse still says yes — and since a `NaN`
 * equals nothing, not even another `NaN`, each one would otherwise become a
 * category of its own, labeled `NaN` and counted zero times. So they are left
 * out here and go uncounted, exactly as `<binCounts>` leaves them out of every
 * bin.
 *
 * The test is per value rather than per list. Gating it on the list being
 * compared numerically would let a malformed number through the moment any
 * text was mixed in, where it would survive as the text `NaN`, form a category
 * of that name, and match a declared category spelled `NaN`. And it cannot be
 * done by inspecting the text either: a `<text>NaN</text>` is genuine data an
 * author may have written, and compares identically. `numericByType` is what
 * separates them.
 */
/**
 * Both passes here are O(n·k) in the number of values and the number of
 * categories: this one scans the distinct values found so far, and `tallyValues`
 * scans the categories once per value. An all-distinct list is therefore
 * quadratic.
 *
 * Left that way deliberately. Equality is `compareExtractedValues`, so that what
 * `<tally>` calls "the same value" is exactly what `<sort>` calls equal — the
 * stated goal of the family, and the reason this shares `utils/listValues`
 * rather than comparing for itself. A `Map` or a hash would need a canonical
 * string per value, which is a *second* definition of equality free to drift
 * from the comparator. Sorting once and grouping adjacent equals would keep the
 * property and is the route to take if this ever matters.
 *
 * It has not mattered so far because k is also the number of replacement
 * components produced: k ≈ n is a `<tally>` emitting one category per value,
 * each counted once, which is a degenerate output whose replacements cost more
 * than the comparisons. The shape this exists for — thousands of samples across
 * a handful of categories — is linear.
 */

/** A value that is a number by type but does not parse to one. */
function isMalformedNumber(value) {
    return value.numericByType === true && Number.isNaN(value.numericalValue);
}

function distinctValues(values, numeric) {
    const distinct = [];
    for (const value of values) {
        if (isMalformedNumber(value)) {
            continue;
        }
        if (
            !distinct.some(
                (seen) => compareExtractedValues(seen, value, numeric) === 0,
            )
        ) {
            distinct.push({ ...value, isNumeric: numeric });
        }
    }
    distinct.sort((a, b) => compareExtractedValues(a, b, numeric));
    return distinct;
}

export class Tally extends CountingBaseListOperator {
    static componentType = "tally";

    static typeAlsoReads = "categories";

    static componentDocs = {
        summary: "How many times each category appears in a list",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.categories = {
            createComponentOfType: "_componentListWithSelectableType",
            description:
                "The categories to count, in the order the counts are reported. Omit to count the distinct values present, in sorted order.",
            highlighted: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.countValues = {
            returnDependencies: () => ({
                categoriesAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "categories",
                    // `type` as well as `values`: it is the type the author's
                    // categories were actually read as, and so the type they
                    // have to be reported back as by `.categories`.
                    variableNames: ["values", "type"],
                },
            }),
            definition({ dependencyValues }) {
                const attr = dependencyValues.categoriesAttr;
                const declaredCategories =
                    attr === null ? null : attr.stateValues.values;
                const declaredType =
                    attr === null ? null : attr.stateValues.type;

                return {
                    setValue: {
                        countValues: ({ values, numeric }) =>
                            tallyValues({
                                values,
                                numeric,
                                declaredCategories,
                                declaredType,
                            }),
                    },
                };
            },
        };

        stateVariableDefinitions.categories = {
            description:
                "The categories the counts are counts of, in the same order.",
            public: true,
            isArray: true,
            shadowingInstructions: {
                hasVariableComponentType: true,
            },
            entryPrefixes: ["category"],
            returnArraySizeDependencies: () => ({
                countLabels: {
                    dependencyType: "stateVariable",
                    variableName: "countLabels",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.countLabels?.values.length ?? 0];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    countLabels: {
                        dependencyType: "stateVariable",
                        variableName: "countLabels",
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const labels = globalDependencyValues.countLabels;
                const categories = {};
                for (const arrayKey of arrayKeys) {
                    categories[arrayKey] = labels?.values[arrayKey];
                }
                return {
                    setValue: { categories },
                    setCreateComponentOfType: {
                        categories: labels?.componentType ?? "number",
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * Count how many of `values` equal each category.
 *
 * With no declared categories the categories are the distinct values present,
 * so every value that has a category at all is counted and nothing can be
 * missed. With declared categories a value matching none of them is not
 * counted, which is reported — but only as info, since a list fed by an input
 * legitimately holds non-categories while a student is still typing, and the
 * diagnostics queue is append-only.
 *
 * `declaredType` is the type the declared categories were read as, and is
 * `null` exactly when `declaredCategories` is.
 */
function tallyValues({ values, numeric, declaredCategories, declaredType }) {
    const comparableCategories =
        declaredCategories === null
            ? distinctValues(values, numeric)
            : declaredCategories.map(comparableValueFromRaw);

    const counts = comparableCategories.map(() => 0);
    let anyUncounted = false;

    for (const value of values) {
        // Never a category (above) and never a match either, so a declared
        // category spelled `NaN` does not catch one.
        const ind = isMalformedNumber(value)
            ? -1
            : comparableCategories.findIndex(
                  // A declared category can come to nothing — a reference that
                  // resolved to no component — in which case it is a category
                  // nothing is equal to rather than a comparison to attempt.
                  (category) =>
                      category !== null &&
                      compareExtractedValues(
                          value,
                          category,
                          numeric && category.isNumeric,
                      ) === 0,
              );
        if (ind === -1) {
            anyUncounted = true;
        } else {
            counts[ind]++;
        }
    }

    const labels = {
        values:
            declaredCategories === null
                ? comparableCategories.map((value) =>
                      labelForValue(value, numeric),
                  )
                : declaredCategories,
        componentType: labelComponentType({
            declaredType,
            comparableCategories,
            numeric,
        }),
    };

    // Reported only for declared categories, which is what the message speaks
    // of. With inferred ones the only value that can go uncounted is a `NaN`
    // that `distinctValues` deliberately made no category for, and calling that
    // a value outside the declared categories would misdescribe it twice over.
    const diagnostics =
        anyUncounted && declaredCategories !== null
            ? [
                  codedDiagnostic({
                      type: "info",
                      code: "doenet-i0050",
                  }),
              ]
            : [];

    return { counts, labels, diagnostics };
}

/**
 * The component type `<tally>`'s `categories` property reports.
 *
 * Declared categories report the type they were read as, so
 * `<tally type="boolean" categories="true false">` reads back `true, false`
 * rather than the `1, 0` a numeric reading would give. Inferred categories are
 * recovered from the comparable values by `labelForValue`, which yields a
 * number exactly when the list was compared numerically.
 */
function labelComponentType({ declaredType, comparableCategories, numeric }) {
    if (declaredType !== null) {
        // `letters` is a way of writing text, not a component type.
        return declaredType === "letters" ? "text" : declaredType;
    }
    return numeric && comparableCategories.length > 0 ? "number" : "text";
}

export class BinCounts extends CountingBaseListOperator {
    static componentType = "binCounts";

    static componentDocs = {
        summary: "How many values fall in each interval between cut points",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.bins = {
            createComponentOfType: "numberList",
            description:
                "The cut points, in increasing order. `n + 1` cut points define `n` bins.",
            highlighted: true,
        };

        attributes.closed = {
            createComponentOfType: "text",
            createStateVariable: "closed",
            defaultValue: "left",
            public: true,
            highlighted: true,
            toLowerCase: true,
            description: "Which end of each bin includes its cut point.",
            validValues: [
                {
                    value: "left",
                    description:
                        "Bins are `[a, b)`, matching NumPy and the usual textbook class interval. The last bin also includes its upper cut point, so the largest value is not dropped.",
                },
                {
                    value: "right",
                    description:
                        "Bins are `(a, b]`, matching R, pandas and Excel. The first bin also includes its lower cut point, so the smallest value is not dropped.",
                },
            ],
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.countValues = {
            returnDependencies: () => ({
                binsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "bins",
                    variableNames: ["numbers"],
                },
                closed: {
                    dependencyType: "stateVariable",
                    variableName: "closed",
                },
            }),
            definition({ dependencyValues }) {
                const edges =
                    dependencyValues.binsAttr === null
                        ? null
                        : dependencyValues.binsAttr.stateValues.numbers;

                return {
                    setValue: {
                        countValues: ({ values, numeric }) =>
                            countInBins({
                                values,
                                numeric,
                                edges,
                                closed: dependencyValues.closed,
                            }),
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * Count how many of `values` fall in each bin defined by `edges`.
 *
 * Implemented by sorting once and then binary-searching for each cut point,
 * rather than testing every value against every bin: the sample is the large
 * input here, so the work is one sort of it plus a cost per bin, not a pass
 * over it per bin. However large the sample, the result is one count per bin —
 * which is the thing a `<repeat>` over the values could not give.
 *
 * The outermost cut point is always included, whichever way `closed` points, so
 * neither the smallest nor the largest value is silently dropped — this is
 * NumPy's rule for its last bin and R's `include.lowest` for its first, applied
 * symmetrically.
 */
function countInBins({ values, numeric, edges, closed }) {
    /** `bins` does not describe a set of intervals, so there are no counts. */
    const noBins = (diagnostic) => ({
        counts: [],
        labels: null,
        diagnostics: [diagnostic],
    });

    if (edges === null) {
        return noBins(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0138",
                args: { component: "binCounts" },
            }),
        );
    }

    if (edges.length < 2) {
        return noBins(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0139",
                args: { count: edges.length },
            }),
        );
    }

    // A cut point below the one before it describes a bin running backwards,
    // which counting cannot make sense of: the count of a bin `[a, b)` with
    // `b < a` comes out negative. Reported rather than repaired by sorting,
    // because which order the author meant is exactly what is unclear. Equal
    // adjacent cut points are allowed — they name an empty bin, which is a
    // coherent thing to ask for — matching NumPy, which likewise rejects only
    // a decrease.
    //
    // Phrased as "every cut point is at least the one before it" rather than
    // "none is below it" so that a `NaN` cut point fails the test too — every
    // comparison against a `NaN` is false, so the negated phrasing would let
    // one through. `bins="1 x 5"` produces one: the `x` becomes a `<number>`
    // whose content does not parse. Nothing sorts below a `NaN`, so the
    // searches below would report the bin *ending* at it as a negative count.
    if (!edges.every((edge, ind) => ind === 0 || edge >= edges[ind - 1])) {
        return noBins(
            codedDiagnostic({ type: "warning", code: "doenet-w0141" }),
        );
    }

    if (!numeric) {
        // A zero per bin rather than no counts at all: the bins are as real as
        // ever, so a chart's axis should not collapse because one entry in the
        // list turned out to be a word.
        return {
            counts: edges.slice(1).map(() => 0),
            labels: null,
            diagnostics: [
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0140",
                    args: { component: "binCounts" },
                }),
            ],
        };
    }

    // `NaN` is dropped before the sort, not merely left uncounted after it. A
    // `NaN` among the sorted values would break the ordering the binary
    // searches below assume and so miscount its *neighbors* too. It can get
    // this far because `allAreNumeric` asks each child whether it is a number
    // by type, and a `<number>` whose content does not parse still says yes.
    const sorted = values
        .map((value) => value.numericalValue)
        .filter((value) => !Number.isNaN(value))
        .sort((a, b) => a - b);

    /** How many sorted values are strictly less than `x`. */
    function countBelow(x) {
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
    function countAtMost(x) {
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
    const counts = [];

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

    return { counts, labels: null };
}
