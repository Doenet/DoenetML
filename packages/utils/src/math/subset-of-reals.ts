/*
  Based on subsets-of-reals, version 0.0.1
  by Jim Fowler <fowler@math.osu.edu> (http://kisonecat.com/)
  github.com/kisonecat/subsets-of-reals

  Redistributed and modified under the terms of GPL-3.0

*/

//@ts-ignore
import me from "math-expressions";
import { deepCompare } from "../copy/deepFunctions";

export type SubsetMethods = {
    union: (that: Subset) => Subset;
    intersectWithOpenInterval: (that: OpenInterval) => Subset;
    setMinus: (that: Subset) => Subset;
    symmetricDifference: (that: Subset) => Subset;
    complement: () => Subset;
    intersect: (that: Subset) => Subset;
    containsSubset: (that: Subset) => boolean;
    isSubsetOf: (that: Subset) => boolean;
    equals: (that: Subset) => boolean;
    containsElement: (element: number) => boolean;
    isEmpty: () => boolean;
    isValid: () => boolean;
    toJSON: () => any;
    toMathExpression: () => any;
    copy: () => Subset;
};

type InvalidSet = { type: "invalid" } & SubsetMethods;
type EmptySet = { type: "empty" } & SubsetMethods;
type RealLine = { type: "realLine" } & SubsetMethods;
type Singleton = { type: "singleton"; element: number } & SubsetMethods;
type OpenInterval = {
    type: "openInterval";
    left: number;
    right: number;
} & SubsetMethods;
type Union = {
    type: "union";
    subsets: (Singleton | OpenInterval)[];
} & SubsetMethods;
type Subset =
    | InvalidSet
    | EmptySet
    | RealLine
    | Singleton
    | OpenInterval
    | Union;

function isSubset(obj: unknown) {
    return (
        obj instanceof InvalidSetClass ||
        obj instanceof EmptySetClass ||
        obj instanceof RealLineClass ||
        obj instanceof SingletonClass ||
        obj instanceof OpenIntervalClass ||
        obj instanceof UnionClass
    );
}

function union(A: Subset, B: Subset) {
    return A.complement().intersect(B.complement()).complement();
}

function intersectWithOpenInterval(A: Subset, B: OpenInterval): Subset {
    return A.intersect(B);
}

function setMinus(A: Subset, B: Subset): Subset {
    return A.intersect(B.complement());
}

function symmetricDifference(A: Subset, B: Subset): Subset {
    return A.setMinus(B).union(B.setMinus(A));
}

function containsSubset(A: Subset, B: Subset) {
    return A.intersect(B).equals(B);
}

function isSubsetOf(A: Subset, B: Subset) {
    return containsSubset(B, A);
}

function equals(A: Subset, B: Subset) {
    return A.symmetricDifference(B).isEmpty();
}

function subsetReviver(key: any, value: unknown): any {
    if (
        typeof value === "object" &&
        value !== null &&
        "objectType" in value &&
        value.objectType === "subset" &&
        "subsetType" in value &&
        value.subsetType !== undefined
    ) {
        if (value.subsetType === "emptySet") {
            return EmptySet();
        } else if (value.subsetType === "realLine") {
            return RealLine();
        } else if (value.subsetType === "singleton") {
            if (
                "data" in value &&
                value.data !== null &&
                typeof value.data == "object" &&
                value.data !== null &&
                "element" in value.data &&
                typeof value.data.element === "number"
            ) {
                return Singleton(value.data.element);
            }
        } else if (value.subsetType === "union") {
            if (
                "data" in value &&
                value.data !== null &&
                typeof value.data == "object" &&
                value.data !== null &&
                "subsets" in value.data &&
                Array.isArray(value.data.subsets) &&
                value.data.subsets.every(
                    (s) =>
                        s instanceof SingletonClass ||
                        s instanceof OpenIntervalClass,
                )
            ) {
                return Union(value.data.subsets);
            }
        } else if (value.subsetType === "openInterval") {
            if (
                "data" in value &&
                value.data !== null &&
                typeof value.data == "object" &&
                value.data !== null &&
                "left" in value.data &&
                typeof value.data.left === "number" &&
                "right" in value.data &&
                typeof value.data.right === "number"
            ) {
                return OpenInterval(value.data.left, value.data.right);
            }
        }
    }

    return value;
}

class EmptySetClass implements EmptySet {
    type = "empty" as const;

    union(that: Subset) {
        return that;
    }
    intersectWithOpenInterval(that: OpenInterval) {
        return intersectWithOpenInterval(this, that);
    }
    setMinus(that: Subset) {
        return setMinus(this, that);
    }
    symmetricDifference(that: Subset) {
        return symmetricDifference(this, that);
    }
    containsSubset(that: Subset) {
        return containsSubset(this, that);
    }
    isSubsetOf(that: Subset) {
        return isSubsetOf(this, that);
    }
    equals(that: Subset) {
        return equals(this, that);
    }

    intersect(/* subset */) {
        return EmptySet();
    }

    containsElement(/* element */) {
        return false;
    }

    isEmpty() {
        return true;
    }

    complement() {
        return RealLine();
    }

    isValid() {
        return true;
    }

    toString() {
        return "∅";
    }

    toMathExpression() {
        return me.fromAst("emptyset");
    }

    toJSON() {
        return {
            objectType: "subset",
            data: { type: "empty" },
        };
    }

    copy() {
        return subsetReviver(null, this.toJSON());
    }
}

function EmptySet(): Subset {
    return new EmptySetClass();
}

class InvalidSetClass implements InvalidSet {
    type = "invalid" as const;

    intersectWithOpenInterval(that: OpenInterval) {
        return intersectWithOpenInterval(this, that);
    }
    setMinus(that: Subset) {
        return setMinus(this, that);
    }
    symmetricDifference(that: Subset) {
        return symmetricDifference(this, that);
    }
    containsSubset(that: Subset) {
        return containsSubset(this, that);
    }
    isSubsetOf(that: Subset) {
        return isSubsetOf(this, that);
    }
    equals(that: Subset) {
        return equals(this, that);
    }

    union(/* subset */) {
        return InvalidSet();
    }

    intersect(/* subset */) {
        return InvalidSet();
    }

    containsElement(/* element */) {
        return false;
    }

    isEmpty() {
        return true;
    }

    complement() {
        return InvalidSet();
    }

    isValid() {
        return false;
    }

    toString() {
        return "\uff3f";
    }

    toMathExpression() {
        return me.fromAst("\uff3f");
    }

    toJSON() {
        return {
            objectType: "subset",
            data: { type: "invalid" },
        };
    }

    copy() {
        return subsetReviver(null, this.toJSON());
    }
}

function InvalidSet(): Subset {
    return new InvalidSetClass();
}

class RealLineClass implements RealLine {
    type = "realLine" as const;

    intersectWithOpenInterval(that: OpenInterval) {
        return intersectWithOpenInterval(this, that);
    }
    setMinus(that: Subset) {
        return setMinus(this, that);
    }
    symmetricDifference(that: Subset) {
        return symmetricDifference(this, that);
    }
    containsSubset(that: Subset) {
        return containsSubset(this, that);
    }
    isSubsetOf(that: Subset) {
        return isSubsetOf(this, that);
    }
    equals(that: Subset) {
        return equals(this, that);
    }

    isValid() {
        return true;
    }

    union(/* that */): Subset {
        return RealLine();
    }

    intersect(that: Subset) {
        return that;
    }

    containsElement(/* element */) {
        return true;
    }

    complement(): Subset {
        return EmptySet();
    }

    isEmpty() {
        return false;
    }

    toString() {
        return "ℝ";
    }

    toMathExpression() {
        return me.fromAst("R");
    }

    toJSON() {
        return {
            objectType: "subset",
            data: { type: "realLine" },
        };
    }

    copy() {
        return subsetReviver(null, this.toJSON());
    }
}

function RealLine(): Subset {
    return new RealLineClass();
}

class SingletonClass implements Singleton {
    type = "singleton" as const;
    element: number;

    constructor(element: number) {
        this.element = element;
    }

    intersectWithOpenInterval(that: OpenInterval) {
        return intersectWithOpenInterval(this, that);
    }
    setMinus(that: Subset) {
        return setMinus(this, that);
    }
    symmetricDifference(that: Subset) {
        return symmetricDifference(this, that);
    }
    containsSubset(that: Subset) {
        return containsSubset(this, that);
    }
    isSubsetOf(that: Subset) {
        return isSubsetOf(this, that);
    }
    equals(that: Subset) {
        return equals(this, that);
    }

    isValid() {
        return true;
    }

    union(that: Subset) {
        if (that.containsElement(this.element)) {
            return that;
        } else {
            return Union([that, this]);
        }
    }

    intersect(subset: Subset): Subset {
        if (subset.containsElement(this.element)) {
            return Singleton(this.element);
        } else {
            return EmptySet();
        }
    }

    isEmpty() {
        return false;
    }

    containsElement(element: number) {
        return element === this.element;
    }

    complement(): Subset {
        return Union([
            OpenInterval(-Infinity, this.element),
            OpenInterval(this.element, Infinity),
        ]);
    }

    toString() {
        return `{${this.element}}`;
    }

    toMathExpression() {
        return me.fromAst(["set", this.element]);
    }

    toJSON() {
        return {
            objectType: "subset",
            data: { type: "singleton", element: this.element },
        };
    }

    copy() {
        return subsetReviver(null, this.toJSON());
    }
}

function Singleton(element: number): Subset {
    if (!Number.isFinite(element)) {
        return EmptySet();
    }
    return new SingletonClass(element);
}

class OpenIntervalClass implements OpenInterval {
    type = "openInterval" as const;
    left: number;
    right: number;

    constructor(left: number, right: number) {
        this.left = left;
        this.right = right;
    }

    union(that: Subset) {
        return union(this, that);
    }

    setMinus(that: Subset) {
        return setMinus(this, that);
    }
    symmetricDifference(that: Subset) {
        return symmetricDifference(this, that);
    }
    containsSubset(that: Subset) {
        return containsSubset(this, that);
    }
    isSubsetOf(that: Subset) {
        return isSubsetOf(this, that);
    }
    equals(that: Subset) {
        return equals(this, that);
    }

    isValid() {
        return true;
    }

    intersect(subset: Subset) {
        return subset.intersectWithOpenInterval(this);
    }

    intersectWithOpenInterval(that: OpenInterval) {
        return OpenInterval(
            Math.max(this.left, that.left),
            Math.min(this.right, that.right),
        );
    }

    complement(): Subset {
        return Union([
            OpenClosedInterval(-Infinity, this.left),
            ClosedOpenInterval(this.right, Infinity),
        ]);
    }

    isEmpty() {
        return this.left >= this.right;
    }

    containsElement(element: number) {
        return element > this.left && element < this.right;
    }

    toString() {
        return `(${this.left.toString()},${this.right.toString()})`;
    }

    toMathExpression() {
        return me.fromAst([
            "interval",
            ["tuple", this.left, this.right],
            ["tuple", false, false],
        ]);
    }

    toJSON() {
        return {
            objectType: "subset",
            data: { type: "openInterval", left: this.left, right: this.right },
        };
    }

    copy() {
        return subsetReviver(null, this.toJSON());
    }
}

function OpenInterval(left: number, right: number) {
    if (!(left < right)) {
        return EmptySet();
    } else if (left === -Infinity && right === Infinity) {
        return RealLine();
    } else {
        return new OpenIntervalClass(left, right);
    }
}

class UnionClass implements Union {
    type = "union" as const;
    subsets: (Singleton | OpenInterval)[];

    constructor(subsets: (Singleton | OpenInterval)[]) {
        this.subsets = subsets;
    }

    union(that: Subset) {
        return union(this, that);
    }

    setMinus(that: Subset) {
        return setMinus(this, that);
    }
    symmetricDifference(that: Subset) {
        return symmetricDifference(this, that);
    }
    containsSubset(that: Subset) {
        return containsSubset(this, that);
    }
    isSubsetOf(that: Subset) {
        return isSubsetOf(this, that);
    }
    equals(that: Subset) {
        return equals(this, that);
    }

    isValid() {
        return true;
    }

    intersectWithOpenInterval(that: OpenInterval) {
        return this.intersect(that);
    }

    containsElement(element: number) {
        return this.subsets.some((s) => s.containsElement(element));
    }

    isEmpty() {
        return this.subsets.every((s) => s.isEmpty());
    }

    complement() {
        return this.subsets
            .map((s) => s.complement())
            .reduce((a, b) => a.intersect(b));
    }

    intersect(subset: Subset) {
        return Union(this.subsets.map((s) => subset.intersect(s)));
    }

    toString() {
        return this.subsets.map((s) => s.toString()).join(" U ");
    }

    toMathExpression() {
        return me.fromAst([
            "union",
            ...this.subsets.map((s) => s.toMathExpression().tree),
        ]);
    }

    toJSON() {
        return {
            objectType: "subset",
            data: {
                type: "union",
                subsets: this.subsets.map((s) => s.toJSON()),
            },
        };
    }

    copy() {
        return subsetReviver(null, this.toJSON());
    }
}

function Union(subsets: Subset[]): Subset {
    if (subsets.some((s) => s.type === "invalid")) {
        return InvalidSet();
    }

    // flatten
    const flattenedSubsets = (subsets as Exclude<Subset, InvalidSet>[]).reduce<
        Exclude<Subset, Union | InvalidSet>[]
    >(
        (acc, val) =>
            val.type === "union" ? [...acc, ...val.subsets] : [...acc, val],
        [],
    );

    const filtered: (Singleton | OpenInterval)[] = [];

    for (const sub of flattenedSubsets) {
        if (sub.type === "realLine") {
            return RealLine();
        } else if (sub.type !== "empty" && !sub.isEmpty()) {
            filtered.push(sub);
        }
    }

    if (filtered.length === 0) {
        return EmptySet();
    }

    const newSubsets: (OpenInterval | Singleton)[] = [];

    for (let ind1 = 0; ind1 < filtered.length; ind1++) {
        let sub1 = filtered[ind1];
        let addSub1 = true;

        if (sub1.type === "openInterval") {
            let left = sub1.left;
            let right = sub1.right;

            for (let ind2 = ind1 + 1; ind2 < filtered.length; ind2++) {
                let sub2 = filtered[ind2];
                if (sub2.type === "openInterval") {
                    // two open intervals
                    if (left < sub2.right && sub2.left < right) {
                        // intervals overlap
                        left = Math.min(left, sub2.left);
                        right = Math.max(right, sub2.right);
                        filtered.splice(ind2, 1);
                        ind2--;

                        // stop processing sub2s and
                        // keep sub1 in the queue to be processed
                        // so that will catch passed singletons or intervals
                        // that overlap with the extension of sub1
                        addSub1 = false;
                        ind1--;
                        break;
                    } else if (left === sub2.right || right === sub2.left) {
                        // intervals just touch.  Check if there is a singleton
                        // to fill in the gap

                        let gap = left === sub2.right ? left : right;

                        // first check if already passed a singleton that fits the gap
                        let foundSingleton = false;
                        for (let ind3 = 0; ind3 < newSubsets.length; ind3++) {
                            let sub3 = newSubsets[ind3];
                            if (
                                sub3.type === "singleton" &&
                                sub3.element === gap
                            ) {
                                newSubsets.splice(ind3, 1);
                                foundSingleton = true;
                                break;
                            }
                        }

                        // then check if a future singleton fits the gap
                        if (!foundSingleton) {
                            for (
                                let ind3 = ind1 + 1;
                                ind3 < filtered.length;
                                ind3++
                            ) {
                                let sub3 = filtered[ind3];
                                if (
                                    sub3.type === "singleton" &&
                                    sub3.element === gap
                                ) {
                                    filtered.splice(ind3, 1);
                                    foundSingleton = true;
                                    if (ind3 < ind2) {
                                        // have to shift ind2 as splice an entry in front of it
                                        ind2--;
                                    }
                                    break;
                                }
                            }
                        }

                        if (foundSingleton) {
                            // merge intervals
                            left = Math.min(left, sub2.left);
                            right = Math.max(right, sub2.right);
                            filtered.splice(ind2, 1);
                            ind2--;

                            // stop processing sub2s and
                            // keep sub1 in the queue to be processed
                            // so that will catch passed singletons or intervals
                            // that overlap with the extension of sub1
                            addSub1 = false;
                            ind1--;
                            break;
                        }
                    }
                } else {
                    // open interval and singleton
                    if (sub2.element > left && sub2.element < right) {
                        // singleton is inside interval, delete it
                        filtered.splice(ind2, 1);
                        ind2--;
                    }
                }
            }

            sub1.left = left;
            sub1.right = right;

            if (sub1.left === -Infinity && sub1.right === Infinity) {
                return RealLine();
            }
        } else {
            // have singleton
            let val = sub1.element;

            for (let ind2 = ind1 + 1; ind2 < filtered.length; ind2++) {
                let sub2 = filtered[ind2];
                if (sub2.type === "openInterval") {
                    if (val > sub2.left && val < sub2.right) {
                        // point is inside interval, delete point
                        filtered.splice(ind1, 1);
                        ind1--;
                        addSub1 = false;
                        break;
                    }
                } else if (sub2.element === val) {
                    // duplicate point, delete duplicate
                    filtered.splice(ind2, 1);
                    ind2--;
                }
            }
        }

        if (addSub1) {
            newSubsets.push(sub1);
        }
    }

    if (newSubsets.length === 1) {
        return newSubsets[0];
    }

    return new UnionClass(newSubsets);
}

function ClosedInterval(left: number, right: number) {
    if (!(left <= right)) {
        return EmptySet();
    } else if (left === -Infinity && right === Infinity) {
        return RealLine();
    } else {
        const pieces = [OpenInterval(left, right)];

        if (Number.isFinite(left)) {
            pieces.push(Singleton(left));
        }
        if (Number.isFinite(right)) {
            pieces.push(Singleton(right));
        }

        return Union(pieces);
    }
}

function OpenClosedInterval(left: number, right: number) {
    if (!(left < right)) {
        return EmptySet();
    } else if (left === -Infinity && right === Infinity) {
        return RealLine();
    } else {
        const pieces = [OpenInterval(left, right)];

        if (Number.isFinite(right)) {
            pieces.push(Singleton(right));
        }

        return Union(pieces);
    }
}

function ClosedOpenInterval(left: number, right: number) {
    if (!(left < right)) {
        return EmptySet();
    } else if (left === -Infinity && right === Infinity) {
        return RealLine();
    } else {
        const pieces = [OpenInterval(left, right)];

        if (Number.isFinite(left)) {
            pieces.push(Singleton(left));
        }

        return Union(pieces);
    }
}

/** **************************************************************/
export const subsets = {
    EmptySet,
    InvalidSet,
    RealLine,
    Singleton,
    Union,
    OpenInterval,
    ClosedInterval,
    OpenClosedInterval,
    ClosedOpenInterval,
    subsetReviver,
    isSubset,
};

/** **************************************************************/

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
    | OpenInterval
    | ClosedIntervalData
    | OpenClosedIntervalData
    | ClosedOpenIntervalData;

type ExtendedSubsetData =
    | Subset
    | ClosedIntervalData
    | OpenClosedIntervalData
    | ClosedOpenIntervalData;

function buildSubsetFromIntervals(tree: any, variable: string): Subset {
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
    } else if (operator === "union" || operator === "or") {
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
        let pieces = tree
            .slice(1)
            .map((x) => buildSubsetFromIntervals(x, variable))
            .filter((x) => x);

        if (pieces.length === 0) {
            return RealLine();
        } else {
            return pieces.reduce((a, c) => a.intersect(c));
        }
    } else if (operator === "set" || operator === "list") {
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
    } else if (["<", "le", ">", "ge", "=", "ne"].includes(operator)) {
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
        let variable = tree[1];
        return buildSubsetFromIntervals(tree[2], variable);
    } else if (operator === "^" && (tree[2] === "C" || tree[2] === "c")) {
        let orig = buildSubsetFromIntervals(tree[1], variable);
        return orig.complement();
    } else if (operator === "in") {
        if (deepCompare(tree[1], variable)) {
            return buildSubsetFromIntervals(tree[2], variable);
        } else {
            return InvalidSet();
        }
    } else if (operator === "ni") {
        if (deepCompare(tree[2], variable)) {
            return buildSubsetFromIntervals(tree[1], variable);
        } else {
            return InvalidSet();
        }
    } else if (operator === "notin") {
        if (deepCompare(tree[1], variable)) {
            let orig = buildSubsetFromIntervals(tree[2], variable);
            return orig.complement();
        }
        return InvalidSet();
    } else if (operator === "notni") {
        if (deepCompare(tree[2], variable)) {
            let orig = buildSubsetFromIntervals(tree[1], variable);
            return orig.complement();
        }
        return InvalidSet();
    } else {
        let num = me.fromAst(tree).evaluate_to_constant();

        if (Number.isFinite(num)) {
            return Singleton(num);
        } else {
            return InvalidSet();
        }
    }
}

export function buildSubsetFromMathExpression(expr: any, variable: any) {
    return buildSubsetFromIntervals(expr.to_intervals().tree, variable?.tree);
}

export function mathExpressionFromSubsetValue({
    subsetValue,
    variable,
    displayMode = "intervals",
}: {
    subsetValue: Subset;
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

export function mergeIntervals(subsetValue: Subset) {
    console.log("merge intervals", subsetValue);
    // merge any singletons to create closed intervals
    if (subsetValue.type === "union") {
        let singletons = subsetValue.subsets.filter(
            (x) => x.type === "singleton",
        );

        let intervals: IntervalData[] = subsetValue.subsets.filter(
            (x) => x.type === "openInterval",
        );

        console.log([...singletons], [...intervals]);

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

        console.log([...singletons], [...intervals]);

        return [...intervals, ...singletons].sort(
            (a, b) =>
                (a.type === "singleton" ? a.element : a.left) -
                (b.type === "singleton" ? b.element : b.left),
        );
    } else {
        return [subsetValue];
    }
}
