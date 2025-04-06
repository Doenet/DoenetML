//@ts-ignore
import me from "math-expressions";
import { deepCompare } from "../copy/deepFunctions";

import {
    ClosedInterval,
    ClosedOpenInterval,
    EmptySet,
    Interfaces,
    InvalidSet,
    OpenClosedInterval,
    OpenInterval,
    RealLine,
    Singleton,
    Union,
} from "./subset-of-reals";

type ClosedIntervalData = {
    type: "closedInterval";
    left: number;
    right: number;
};
type OpenClosedIntervalData = {
    type: "openClosedInterval";
    left: number;
    right: number;
};
type ClosedOpenIntervalData = {
    type: "closedOpenInterval";
    left: number;
    right: number;
};
type IntervalData =
    | Interfaces.OpenInterval
    | ClosedIntervalData
    | OpenClosedIntervalData
    | ClosedOpenIntervalData;

type ExtendedSubsetData =
    | Interfaces.Subset
    | ClosedIntervalData
    | OpenClosedIntervalData
    | ClosedOpenIntervalData;

/**
 * A function that builds a subset of reals object from the math-expressions object
 * with ast `tree` using, where `tree` has already by processed by `.to_intervals()`,
 * meaning 2-tuples have become open intervals and 2-arrays have become closed intervals.
 */
function buildSubsetFromIntervals(
    tree: any,
    variable: string,
): Interfaces.Subset {
    if (!Array.isArray(tree)) {
        if (Number.isFinite(tree)) {
            return Singleton(tree);
        } else if (tree === "R") {
            return RealLine();
        } else if (tree === "emptyset") {
            return EmptySet();
        } else {
            return InvalidSet();
        }
    }

    let operator = tree[0];

    if (operator === "interval") {
        // open, closed, or partially open intervals with (potentially infinite) numerical endpoints
        let endpoints = tree[1];
        let closed = tree[2];

        let left = endpoints[1];
        if (!Number.isFinite(left)) {
            left = me.fromAst(left).evaluate_to_constant();
            if (
                !(
                    Number.isFinite(left) ||
                    left === Infinity ||
                    left === -Infinity
                )
            ) {
                return InvalidSet();
            }
        }

        let right = endpoints[2];
        if (!Number.isFinite(right)) {
            right = me.fromAst(right).evaluate_to_constant();
            if (
                !(
                    Number.isFinite(right) ||
                    right === Infinity ||
                    right === -Infinity
                )
            ) {
                return InvalidSet();
            }
        }

        if (closed[1]) {
            if (closed[2]) {
                return ClosedInterval(left, right);
            } else {
                return ClosedOpenInterval(left, right);
            }
        } else {
            if (closed[2]) {
                return OpenClosedInterval(left, right);
            } else {
                return OpenInterval(left, right);
            }
        }
    } else if (
        operator === "union" ||
        operator === "or" ||
        operator === "set" ||
        operator === "list"
    ) {
        // Treat "union", "or", "set", and "list" the same way,
        // turning them into a union of their operands.
        let pieces = tree
            .slice(1)
            .map((x) => buildSubsetFromIntervals(x, variable))
            .filter((x) => x);

        if (pieces.length === 0) {
            return EmptySet();
        } else if (pieces.length === 1) {
            return pieces[0];
        } else {
            return Union(pieces);
        }
    } else if (operator === "intersect" || operator === "and") {
        // Treat "intersect" and "and" the same way,
        // turning them into an intersection of their operands.
        let pieces = tree
            .slice(1)
            .map((x) => buildSubsetFromIntervals(x, variable))
            .filter((x) => x);

        if (pieces.length === 0) {
            return RealLine();
        } else {
            return pieces.reduce((a, c) => a.intersect(c));
        }
    } else if (["<", "le", ">", "ge", "=", "ne"].includes(operator)) {
        // turn expressions involving these operators into a subset of reals
        // only if one side is `variable` and the other side is a (possibly infinite) number.
        let left = tree[1];
        let varAtLeft = false;
        if (!Number.isFinite(left)) {
            if (deepCompare(left, variable)) {
                varAtLeft = true;
            } else {
                left = me.fromAst(left).evaluate_to_constant();
                if (
                    !(
                        Number.isFinite(left) ||
                        left === Infinity ||
                        left === -Infinity
                    )
                ) {
                    return InvalidSet();
                }
            }
        }

        let right = tree[2];
        let varAtRight = false;
        if (!Number.isFinite(right)) {
            if (deepCompare(right, variable)) {
                varAtRight = true;
            } else {
                right = me.fromAst(right).evaluate_to_constant();
                if (
                    !(
                        Number.isFinite(right) ||
                        right === Infinity ||
                        right === -Infinity
                    )
                ) {
                    return InvalidSet();
                }
            }
        }

        if (varAtLeft) {
            if (varAtRight) {
                return InvalidSet();
            } else {
                if (operator === "<") {
                    return OpenInterval(-Infinity, right);
                } else if (operator === "le") {
                    return OpenClosedInterval(-Infinity, right);
                } else if (operator === ">") {
                    return OpenInterval(right, Infinity);
                } else if (operator === "ge") {
                    return ClosedOpenInterval(right, Infinity);
                } else if (operator === "=") {
                    if (Number.isFinite(right)) {
                        return Singleton(right);
                    } else {
                        return EmptySet();
                    }
                } else {
                    // operator === "ne"
                    if (Number.isFinite(right)) {
                        return Union([
                            OpenInterval(-Infinity, right),
                            OpenInterval(right, Infinity),
                        ]);
                    } else {
                        // var != Infinity or -Infinity is whole real line
                        return RealLine();
                    }
                }
            }
        } else {
            if (varAtRight) {
                if (operator === "<") {
                    return OpenInterval(left, Infinity);
                } else if (operator === "le") {
                    return ClosedOpenInterval(left, Infinity);
                } else if (operator === ">") {
                    return OpenInterval(-Infinity, left);
                } else if (operator === "ge") {
                    return OpenClosedInterval(-Infinity, left);
                } else if (operator === "=") {
                    if (Number.isFinite(left)) {
                        return Singleton(left);
                    } else {
                        return EmptySet();
                    }
                } else {
                    // operator === "ne"
                    if (Number.isFinite(left)) {
                        return Union([
                            OpenInterval(-Infinity, left),
                            OpenInterval(left, Infinity),
                        ]);
                    } else {
                        // var != Infinity or -Infinity is whole real line
                        return RealLine();
                    }
                }
            } else {
                return InvalidSet();
            }
        }
    } else if (["lts", "gts"].includes(operator)) {
        // turn these extended inequalities to a subset of real
        // only if there are three operands, with the middle being 'variable'
        // and outer operands being (possibly infinite) numbers
        let vals = tree[1].slice(1);
        let strict = tree[2].slice(1);

        if (vals.length !== 3 || !deepCompare(vals[1], variable)) {
            return InvalidSet();
        }

        if (operator === "gts") {
            vals.reverse();
            strict.reverse();
        }

        let left = vals[0];
        if (!Number.isFinite(left)) {
            left = me.fromAst(left).evaluate_to_constant();
            if (
                !(
                    Number.isFinite(left) ||
                    left === Infinity ||
                    left === -Infinity
                )
            ) {
                return InvalidSet();
            }
        }

        let right = vals[2];
        if (!Number.isFinite(right)) {
            right = me.fromAst(right).evaluate_to_constant();
            if (
                !(
                    Number.isFinite(right) ||
                    right === Infinity ||
                    right === -Infinity
                )
            ) {
                return InvalidSet();
            }
        }

        if (strict[0]) {
            if (strict[1]) {
                return OpenInterval(left, right);
            } else {
                return OpenClosedInterval(left, right);
            }
        } else {
            if (strict[1]) {
                return ClosedOpenInterval(left, right);
            } else {
                return ClosedInterval(left, right);
            }
        }
    } else if (operator === "|") {
        // treat as set builder notation: {x | condition},
        // where `x` does not have to match `variable`,
        // but instead `variable` is set to `x` when evaluating `condition`.
        let x = tree[1];
        return buildSubsetFromIntervals(tree[2], x);
    } else if (operator === "^" && (tree[2] === "C" || tree[2] === "c")) {
        // A^C and A^c are recognized as the complement of A
        let orig = buildSubsetFromIntervals(tree[1], variable);
        return orig.complement();
    } else if (operator === "in") {
        // If the first operand matches `variable`, the return the subset from the second operand
        if (deepCompare(tree[1], variable)) {
            return buildSubsetFromIntervals(tree[2], variable);
        } else {
            return InvalidSet();
        }
    } else if (operator === "ni") {
        // If the second operand matches `variable`, the return the subset from the first operand
        if (deepCompare(tree[2], variable)) {
            return buildSubsetFromIntervals(tree[1], variable);
        } else {
            return InvalidSet();
        }
    } else if (operator === "notin") {
        // If the first operand matches `variable`, the return the subset
        // from the complement of the second operand
        if (deepCompare(tree[1], variable)) {
            let orig = buildSubsetFromIntervals(tree[2], variable);
            return orig.complement();
        }
        return InvalidSet();
    } else if (operator === "notni") {
        // If the second operand matches `variable`, the return the subset
        // from the complement of the first operand
        if (deepCompare(tree[2], variable)) {
            let orig = buildSubsetFromIntervals(tree[1], variable);
            return orig.complement();
        }
        return InvalidSet();
    } else {
        // if `tree` is a finite number, return a singleton
        let num = me.fromAst(tree).evaluate_to_constant();

        if (Number.isFinite(num)) {
            return Singleton(num);
        } else {
            return InvalidSet();
        }
    }
}

/**
 * Attempt to convert math-expression `expr` into a subset of reals,
 * where operators involving `variable` are allowed.
 *
 * Expressions recognized include:
 * - (6,2)^c union {6}
 * - -5 < x < 7  (assuming `variable` is "x")
 * - y in (9, Infinity)   (assuming `variable` is "y")
 * - {z | z > -5}  (independent of the value of `variable`)
 *
 * The algorithm is more permissive that standard notation,
 * allowing expressions that mix types of notation and treating numbers as sets if needed.
 */
export function buildSubsetFromMathExpression(expr: any, variable: any) {
    return buildSubsetFromIntervals(expr.to_intervals().tree, variable?.tree);
}

/** Convert the subset of reals `subsetValue` into a math expression.
 *
 * Two display modes are supported:
 * - intervals: display the result as a union of intervals and singletons
 * - inequalities: display the result as inequalities in terms of `variable`
 */
export function mathExpressionFromSubsetValue({
    subsetValue,
    variable,
    displayMode = "intervals",
}: {
    subsetValue: Interfaces.Subset;
    variable: string;
    displayMode: "intervals" | "inequalities";
}) {
    // displayMode is either "intervals" or "inequalities"

    function subsetToMath(subset: ExtendedSubsetData) {
        if (subset === null) {
            return "\uff3f";
        }

        if (displayMode === "intervals") {
            if (subset.type === "closedInterval") {
                return [
                    "interval",
                    ["tuple", subset.left, subset.right],
                    ["tuple", true, true],
                ];
            } else if (subset.type === "openClosedInterval") {
                return [
                    "interval",
                    ["tuple", subset.left, subset.right],
                    ["tuple", false, true],
                ];
            } else if (subset.type === "closedOpenInterval") {
                return [
                    "interval",
                    ["tuple", subset.left, subset.right],
                    ["tuple", true, false],
                ];
            } else {
                return subset.toMathExpression().tree;
            }
        } else {
            if (subset.type === "closedInterval") {
                return [
                    "lts",
                    ["tuple", subset.left, variable, subset.right],
                    ["tuple", false, false],
                ];
            } else if (subset.type === "openClosedInterval") {
                if (subset.left === -Infinity) {
                    return ["le", variable, subset.right];
                } else {
                    return [
                        "lts",
                        ["tuple", subset.left, variable, subset.right],
                        ["tuple", true, false],
                    ];
                }
            } else if (subset.type === "closedOpenInterval") {
                if (subset.right === Infinity) {
                    return ["ge", variable, subset.left];
                } else {
                    return [
                        "lts",
                        ["tuple", subset.left, variable, subset.right],
                        ["tuple", false, true],
                    ];
                }
            } else if (subset.type === "openInterval") {
                if (subset.left === -Infinity) {
                    return ["<", variable, subset.right];
                } else if (subset.right === Infinity) {
                    return [">", variable, subset.left];
                } else {
                    return [
                        "lts",
                        ["tuple", subset.left, variable, subset.right],
                        ["tuple", true, true],
                    ];
                }
            } else if (subset.type === "singleton") {
                return ["=", variable, subset.element];
            } else if (!subset.isValid()) {
                return "\uff3f";
            } else if (subset.isEmpty()) {
                return ["in", variable, "emptyset"];
            } else if (subset.type === "realLine") {
                return ["in", variable, "R"];
            } else {
                return "\uff3f";
            }
        }
    }

    let expression;

    let mathSubsets = mergeIntervals(subsetValue).map((x) => subsetToMath(x));

    if (mathSubsets.length > 1) {
        if (displayMode === "intervals") {
            expression = me.fromAst(["union", ...mathSubsets]);
        } else {
            expression = me.fromAst(["or", ...mathSubsets]);
        }
    } else {
        expression = me.fromAst(mathSubsets[0]);
    }

    return expression;
}

/**
 * Merge any singletons with intervals to create partially closed intervals.
 *
 * Returns an array of objects that are no longer guaranteed to include the subset of reals interface,
 * as an object may be a (partially) closed interval.
 */
export function mergeIntervals(subsetValue: Interfaces.Subset) {
    // merge any singletons to create closed intervals
    if (subsetValue.type === "union") {
        let singletons = subsetValue.subsets.filter(
            (x) => x.type === "singleton",
        );

        let intervals: IntervalData[] = subsetValue.subsets.filter(
            (x) => x.type === "openInterval",
        );

        for (let ind1 = 0; ind1 < singletons.length; ind1++) {
            let x = singletons[ind1].element;

            for (let ind2 = 0; ind2 < intervals.length; ind2++) {
                let interval = intervals[ind2];

                if (x === interval.left) {
                    if (interval.type === "openClosedInterval") {
                        interval = {
                            type: "closedInterval",
                            left: interval.left,
                            right: interval.right,
                        };
                    } else {
                        interval = {
                            type: "closedOpenInterval",
                            left: interval.left,
                            right: interval.right,
                        };
                    }
                    intervals.splice(ind2, 1, interval);
                    singletons.splice(ind1, 1);
                    ind1--;
                    // break;
                } else if (x === interval.right) {
                    if (interval.type === "closedOpenInterval") {
                        interval = {
                            type: "closedInterval",
                            left: interval.left,
                            right: interval.right,
                        };
                    } else {
                        interval = {
                            type: "openClosedInterval",
                            left: interval.left,
                            right: interval.right,
                        };
                    }
                    intervals.splice(ind2, 1, interval);
                    singletons.splice(ind1, 1);
                    ind1--;
                    // break;
                }
            }
        }

        return [...intervals, ...singletons].sort(
            (a, b) =>
                (a.type === "singleton" ? a.element : a.left) -
                (b.type === "singleton" ? b.element : b.left),
        );
    } else {
        return [subsetValue];
    }
}
