import { codedDiagnostic } from "./diagnostics";
import { comparableValueFromRaw } from "./listValues";

/**
 * Pieces shared by the two shapes of index-returning operator.
 *
 * `<argMin>` and `<argMax>` report a single position and stay `<math>`
 * components (`abstract/ListIndexBaseOperator`). `<indexOf>` and
 * `<searchSorted>` report one position per target and so are composites
 * (`abstract/ListIndexBaseListOperator`). The two bases have different
 * superclasses and cannot share code by inheritance, so what they genuinely
 * have in common lives here — the same arrangement `utils/mathOperatorChildren`
 * uses for `MathBaseOperator` and `MathBaseListOperator`.
 */

/**
 * The `type` attribute both bases declare: which component type bare string
 * children are read as.
 *
 * `readsTarget` adds the second half of the story, and only the operators that
 * have a `target` may pass it: their target has no type of its own, so it is
 * read as this `type` too. Saying that on `<argMin>`, which takes no target,
 * would point the author at an attribute the component does not have.
 */
export function returnListTypeAttribute({ readsTarget = false } = {}) {
    return {
        createPrimitiveOfType: "string",
        description: readsTarget
            ? "Component type to interpret bare string children as. Also decides how a `target` is read, since it has no type of its own."
            : "Component type to interpret bare string children as.",
        highlighted: true,
        validValues: [
            {
                value: "number",
                description: "Read bare strings as numbers, ordered by value.",
            },
            {
                value: "math",
                description:
                    "Read bare strings as math expressions, ordered by value.",
            },
            {
                value: "text",
                description:
                    "Read bare strings as text, ordered alphabetically.",
            },
            {
                value: "boolean",
                description:
                    "Read bare strings as booleans, ordered with false before true.",
            },
        ],
    };
}

/**
 * The reasons an index operator can come back with 0 — no position at all —
 * that are worth telling the author about, and the diagnostic each one gets.
 *
 * Not every 0 belongs here. `<indexOf>` answering 0 for a target that is not in
 * the list is its documented result, not a problem, and reporting it would fire
 * on ordinary correct documents — once per distinct value a student or author
 * types into an input bound to `target`. The diagnostics queue is append-only
 * and deduplicates by message, so anything that varies with a transient value
 * accumulates permanently; only reasons that stay true of a settled document
 * are reported.
 *
 * Omitting `target` is one such: nothing about that document can ever produce
 * an answer, so it is a warning. Having no values at all is the other, and is
 * only info, since a list driven by an input can legitimately be empty for a
 * while.
 *
 * An empty *list* of targets is a third case, and gets no message at all: it
 * produces no indices rather than a 0, so there is no misleading result to
 * explain, and a list driven by an input is empty on the way to being filled.
 */
export function diagnosticsForNoIndex(reason, componentType) {
    switch (reason) {
        case "noTarget":
            return [
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0134",
                    args: { component: componentType },
                }),
            ];
        case "noValues":
            return [
                codedDiagnostic({
                    type: "info",
                    code: "doenet-i0049",
                    args: { component: componentType },
                }),
            ];
        default:
            return [];
    }
}

/**
 * Collapse the per-target diagnostics of a whole run into one set.
 *
 * The reasons are properties of the document, not of individual targets — an
 * absent `target` attribute or an empty list is the same fact however many
 * targets there are — so reporting one diagnostic per target would say the
 * same thing N times. `codedDiagnostic` dedupes by message downstream, but
 * building N of them to throw N-1 away is wasteful when N is the sample size.
 */
export function diagnosticsForNoIndices(results, componentType) {
    const reasons = new Set();
    for (const result of results) {
        if (result?.reason) {
            reasons.add(result.reason);
        }
    }

    return [...reasons].flatMap((reason) =>
        diagnosticsForNoIndex(reason, componentType),
    );
}

/**
 * The `target` attribute of `<indexOf>` and `<searchSorted>`.
 *
 * It is a `_componentListWithSelectableType`, so it follows the component's own
 * `type` attribute (`<indexOf type="text" target="Carol">` compares text) and
 * accepts either one value or a list of them. One target in, one index out;
 * a hundred targets in, a hundred indices out.
 */
export function returnTargetAttribute(description) {
    return {
        createComponentOfType: "_componentListWithSelectableType",
        description,
        highlighted: true,
    };
}

/**
 * `comparableTargets` — the target attribute's values in the same comparable
 * form `utils/listValues` puts the list's own children into, so the comparison
 * between a target and a list entry is the one `<sort>` would make.
 *
 * `null` (rather than an empty array) means the attribute was not given at all,
 * which is the case that earns a warning; an empty array means it was given and
 * is currently empty, which does not.
 */
export function returnComparableTargetsStateVariableDefinition() {
    return {
        comparableTargets: {
            returnDependencies: () => ({
                targetAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "target",
                    variableNames: ["values"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.targetAttr === null) {
                    return { setValue: { comparableTargets: null } };
                }

                return {
                    setValue: {
                        comparableTargets:
                            dependencyValues.targetAttr.stateValues.values.map(
                                comparableValueFromRaw,
                            ),
                    },
                };
            },
        },
    };
}

/**
 * Run `locate` once per target, supplying the two guards both target-taking
 * operators need: nothing to look for means no answer, so the result is 0; and
 * the comparison is numeric only when the target is numeric as well as the
 * list, so that `<indexOf target="b">a b c</indexOf>` compares as text.
 *
 * The three arities are distinct. No `target` attribute at all (`null`) is one
 * unanswerable question, so it gets one 0 and one warning — the same result the
 * operator gave before `target` became a list. An empty list of targets asks
 * nothing and gets nothing: no indices, and no message. Otherwise there is one
 * result per target, whether or not each target turns out to be in the list.
 */
export function locateEachTarget({ values, targets, numeric, locate }) {
    if (targets === null) {
        return [{ index: 0, reason: "noTarget" }];
    }

    return targets.map((target) => {
        // A target whose value came to nothing — a reference that resolved to
        // no component — is nothing to look for, so it reads as a missing
        // target rather than as a value absent from the list.
        if (target === null) {
            return { index: 0, reason: "noTarget" };
        }
        if (values.length === 0) {
            return { index: 0, reason: "noValues" };
        }
        return locate({
            values,
            target,
            numeric: numeric && target.isNumeric,
        });
    });
}
