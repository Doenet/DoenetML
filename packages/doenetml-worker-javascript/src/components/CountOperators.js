import me from "math-expressions";
import CountingBaseListOperator from "./abstract/CountingBaseListOperator";
import {
    comparableValueFromRaw,
    compareExtractedValues,
    returnBreakStringsIntoTypeSugarInstruction,
} from "../utils/listValues";
import { returnListTypeAttribute } from "../utils/listIndexOperators";
import { returnBreakStringsIntoMathsBySpacesSugarInstruction } from "../utils/mathOperatorChildren";
import { codedDiagnostic } from "../utils/diagnostics";
import { countValuesInBins, cutPointsAscend } from "../utils/binning";

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
 * Whether any declared category appears more than once, compared the same way
 * the counting is. Quadratic in the number of *declared* categories, which the
 * author wrote out, so it is bounded by the size of an attribute.
 */
function hasRepeatedCategory(categories, numeric) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        if (category === null) {
            continue;
        }
        for (let j = i + 1; j < categories.length; j++) {
            const other = categories[j];
            if (
                other !== null &&
                compareExtractedValues(
                    category,
                    other,
                    numeric && category.isNumeric && other.isNumeric,
                ) === 0
            ) {
                return true;
            }
        }
    }
    return false;
}

/** A value that is a number by type but does not parse to one. */
function isMalformedNumber(value) {
    return value.numericByType === true && Number.isNaN(value.numericalValue);
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
 *
 * Both passes over the data are O(n·k) in the number of values and the number
 * of categories: this one scans the distinct values found so far, and
 * `tallyValues` scans the categories once per value. An all-distinct list is
 * therefore quadratic.
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

    static componentDocs = {
        summary: "How many times each category appears in a list",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // A state variable as well as an attribute: `categories` is a
        // `_componentListWithSelectableType`, whose own `type` resolves
        // through a `parentStateVariable` of this name.
        //
        // It defaults to `text`, not to the `number` that type would otherwise
        // fall back to, because a category is only ever compared against the
        // values and text is the reading that survives that comparison whatever
        // they are: a word stays itself, and a number written as a category is
        // recovered by `comparableCategory` when the values are numbers. Read
        // as numbers by default instead, every category of
        // `categories="apple fig"` would be a `NaN`: matching nothing, and
        // then reported as a *repeated* category, since one `NaN` reads like
        // another — all of it silent unless the author knew to write
        // `type="text"`.
        //
        // Bare string children are a separate question with a separate answer:
        // they are read by the sugar below, from the attribute rather than
        // from this state variable, and when it is absent they are read as
        // whatever their content is. Writing `type` overrides that.
        attributes.type = {
            ...returnListTypeAttribute(),
            description:
                "Component type to interpret bare string children as. Omit it and they are read as what they look like: every piece naming a number makes the list numeric, anything else makes it text. Also overrides how `categories` is read, which is otherwise text.",
        };

        attributes.categories = {
            createComponentOfType: "_componentListWithSelectableType",
            // The type reaches the categories twice over, and both routes have
            // to agree: the sugar that wraps the bare strings reads the
            // attribute written here, while the state variable that reads the
            // wrapped values back resolves `type` on the parent. So the
            // default is declared in both places — `text` below, and `text`
            // again on the `type` state variable — and an explicit `type` is
            // copied down here so that it still wins on both routes.
            attributesForCreatedComponent: { type: "text" },
            copyComponentAttributesForCreatedComponent: ["type"],
            description:
                "The categories to count, in the order the counts are reported. Omit to count the distinct values present, in sorted order.",
            highlighted: true,
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoTypeSugarInstruction(this.componentType),
        );

        return sugarInstructions;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // Defined here rather than by `createStateVariable` on the attribute,
        // because the two readers of `type` do not share a default and only one
        // of them may be advertised. `categories` resolves this variable
        // through `parentStateVariable`, and falls back to text — the reading
        // that survives comparison against values of any type. Bare string
        // children resolve the *attribute*, in sugar, and fall back to what
        // their content looks like, so `<tally>1 2 10</tally>` counts three
        // numbers while `<tally>a b</tally>` counts two words, neither of them
        // needing a `type`.
        //
        // Declaring text as the attribute's default would publish it to the
        // schema, and the generated reference would then promise bare children
        // a default they do not take.
        stateVariableDefinitions.type = {
            returnDependencies: () => ({
                typeAttr: {
                    dependencyType: "attributePrimitive",
                    attributeName: "type",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { type: dependencyValues.typeAttr ?? "text" },
                };
            },
        };

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
            : declaredCategories.map((raw) => comparableCategory(raw, numeric));

    const counts = comparableCategories.map(() => 0);
    let anyUncounted = false;

    for (const value of values) {
        // Never a category (see `distinctValues`) and never a match either, so
        // a declared category spelled `NaN` does not catch one.
        if (isMalformedNumber(value)) {
            anyUncounted = true;
            continue;
        }

        // Every matching category is counted, not just the first. An author can
        // declare the same category twice — `categories="$someList"` where the
        // list repeats — and each slot then reports how many values equal *its*
        // category, which is what the slot claims to be. Stopping at the first
        // match would leave the later ones reporting 0 about a category that is
        // plainly present.
        let matched = false;
        comparableCategories.forEach((category, ind) => {
            // A declared category can come to nothing — a reference that
            // resolved to no component — in which case it is a category
            // nothing is equal to rather than a comparison to attempt.
            if (
                category !== null &&
                compareExtractedValues(
                    value,
                    category,
                    numeric && category.isNumeric,
                ) === 0
            ) {
                counts[ind]++;
                matched = true;
            }
        });

        if (!matched) {
            anyUncounted = true;
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

    const diagnostics = [];

    // Reported only for declared categories, which is what the message speaks
    // of. With inferred ones the only value that can go uncounted is a `NaN`
    // that `distinctValues` deliberately made no category for, and calling that
    // a value outside the declared categories would misdescribe it twice over.
    if (anyUncounted && declaredCategories !== null) {
        diagnostics.push(
            codedDiagnostic({ type: "info", code: "doenet-i0050" }),
        );
    }

    // A warning rather than info: unlike a stray *value*, a repeated category
    // is a property of what the author wrote, so it stays true of a settled
    // document. Inferred categories are distinct by construction, so only
    // declared ones can repeat. The message carries no count, so the
    // append-only diagnostics queue holds at most one of it.
    if (
        declaredCategories !== null &&
        hasRepeatedCategory(comparableCategories, numeric)
    ) {
        diagnostics.push(
            codedDiagnostic({ type: "warning", code: "doenet-w0142" }),
        );
    }

    return { counts, labels, diagnostics };
}

/**
 * The comparable form of one declared category.
 *
 * Categories are read as text by default, which keeps a word a word. A number
 * written as text is not a number the values can equal, so when the values are
 * numeric a textual category is read again the way `<number>` reads its own
 * content: `categories="1/2 1"` then names a half rather than a piece of text
 * no number can match. That is what lets `categories="apple fig"` and
 * `categories="1/2 1"` each count what they say with nothing to declare.
 *
 * Only text is reread. A category that arrived as a component —
 * `categories="$someList"` — already is the value it names, and rereading its
 * displayed form would lose the digits the display rounded away.
 */
function comparableCategory(raw, numeric) {
    const value = comparableValueFromRaw(raw);

    if (!numeric || value === null || typeof raw !== "string") {
        return value;
    }

    let numericalValue;
    try {
        numericalValue = me.fromText(raw).evaluate_to_constant();
    } catch (e) {
        return value;
    }

    // An infinity is kept: it is a number `compareExtractedValues` handles —
    // it tests equality before subtracting — so `categories="1/0"` counts what
    // `categories="Infinity"` counts, rather than the two disagreeing over the
    // same value.
    //
    // `NaN` is not the only thing this can come back with, though: a category
    // that evaluates complex — `categories="i"` — yields a complex object, on
    // which every comparison is `NaN` and so never equal, not even to itself.
    // Such a category would match nothing and would not even be reported as
    // repeated. Only a real number is worth comparing numerically; anything
    // else keeps the text it was written as, which at least compares.
    return typeof numericalValue === "number" && !Number.isNaN(numericalValue)
        ? { numericalValue, textValue: raw, isNumeric: true }
        : value;
}

/**
 * The component type `<tally>`'s `categories` property reports.
 *
 * Declared categories report the type they were read as, so
 * `<tally type="boolean" categories="true false">` reads back `true, false`
 * rather than the `1, 0` a numeric reading would give, and a category left to
 * the default reads back as the text it was written as — `categories="1/2 1"`
 * labels its counts `1/2, 1` even though it counted halves. What a category
 * was *compared* as is a separate question, answered by `comparableCategory`.
 * Inferred categories are recovered from the comparable values by
 * `labelForValue`, which yields a number exactly when the list was compared
 * numerically.
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
                "The cut points, each at least as large as the one before it. `n + 1` cut points define `n` bins.",
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
                        "Bins are `[a, b)`, matching NumPy and the usual textbook class interval. The last bin also includes its upper cut point, so a value sitting exactly on it is counted.",
                },
                {
                    value: "right",
                    description:
                        "Bins are `(a, b]`, matching R, pandas and Excel. The first bin also includes its lower cut point, so a value sitting exactly on it is counted.",
                },
            ],
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        // Bare cut points and bare values are read the way `<sum>` reads its
        // children, so `<binCounts bins="0 1 2">0 0.5 1</binCounts>` counts
        // three numbers. There is nothing for a `type` to choose here: a value
        // that is not a number falls in no bin, whatever it was read as.
        sugarInstructions.push(
            returnBreakStringsIntoMathsBySpacesSugarInstruction(),
        );

        return sugarInstructions;
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

        // The cut points, readable back so whatever displays the counts can
        // label them. A chart is given the counts and has no other way to say
        // what interval each one covers.
        stateVariableDefinitions.binEdges = {
            description: "The cut points that define the bins, in order.",
            public: true,
            isArray: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            entryPrefixes: ["binEdge"],
            returnArraySizeDependencies: () => ({
                binsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "bins",
                    variableNames: ["numbers"],
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.binsAttr?.stateValues.numbers.length ?? 0,
                ];
            },
            returnArrayDependenciesByKey: () => ({
                globalDependencies: {
                    binsAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "bins",
                        variableNames: ["numbers"],
                    },
                },
            }),
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                const edges =
                    globalDependencyValues.binsAttr?.stateValues.numbers ?? [];
                const binEdges = {};
                for (const arrayKey of arrayKeys) {
                    binEdges[arrayKey] = edges[arrayKey];
                }
                return { setValue: { binEdges } };
            },
        };

        return stateVariableDefinitions;
    }
}

/**
 * Count how many of `values` fall in each bin defined by `edges`, with a
 * message wherever `bins` does not describe a set of intervals to count
 * between.
 *
 * The counting is `utils/binning.ts`; what is here is everything `<binCounts>`
 * says about a list of cut points that cannot be counted between. A chart
 * binning the same data reaches the same counting through the same function and
 * says something different about the same bad list, having a picture to draw
 * instead.
 */
function countInBins({ values, numeric, edges, closed }) {
    /** `bins` does not describe a set of intervals, so there are no counts. */
    function noBins(diagnostic) {
        return { counts: [], labels: null, diagnostics: [diagnostic] };
    }

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
    // because which order the author meant is exactly what is unclear. A `NaN`
    // cut point fails the same test and is reported the same way; `bins="1 x 5"`
    // produces one, the `x` becoming a `<number>` whose content does not parse.
    if (!cutPointsAscend(edges)) {
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

    // The counting itself is `utils/binning.ts`, shared with
    // `<chart type="histogram">` so that a table of counts and a histogram of
    // the same column cannot disagree on the page. A value that is a number by
    // type but does not parse to one reaches here as a `NaN`, which that
    // function drops.
    const counts = countValuesInBins({
        values: values.map((value) => value.numericalValue),
        edges,
        closed,
    });

    return { counts, labels: null };
}
