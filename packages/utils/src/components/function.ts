import me, { dopri } from "math-expressions";
import type { mod as ModType } from "mathjs";
const { mod } = me.math as { mod: ModType };
import {
    convertValueToMathExpression,
    normalizeMathExpression,
    vectorOperators,
} from "../math/mathexpressions";
import { find_effective_domain } from "./domain";

type NumericalFunction = (...args: any[]) => number;
type SymbolicFunction = (...args: any[]) => any;
type VariableFunction = (...args: any[]) => any;

export function createFunctionFromDefinition(
    fDefinition: any,
): NumericalFunction | SymbolicFunction {
    if (fDefinition.functionType === "formula") {
        return returnNumericalFunctionFromFormula({
            formula: me.fromAst(fDefinition.formula),
            numInputs: fDefinition.numInputs,
            variables: fDefinition.variables.map((x: any) => me.fromAst(x)),
            domain: fDefinition.domain
                ? fDefinition.domain.map((x: any) => me.fromAst(x))
                : null,
            component: fDefinition.component,
        });
    } else if (fDefinition.functionType === "reevaluatedFormula") {
        let evaluateChildrenToReevaluate: any = {};
        for (let code in fDefinition.evaluateChildrenToReevaluate) {
            // These are compiled numeric evaluators, not expression builders —
            // numbers in, number out — so they serve as both routes here.
            const inputFs = fDefinition.evaluateChildrenToReevaluate[
                code
            ].inputMaths.map((x: any) =>
                me.fromAst(x).subscripts_to_strings().f(),
            );
            evaluateChildrenToReevaluate[code] = {
                fReevaluate: createFunctionFromDefinition(
                    fDefinition.evaluateChildrenToReevaluate[code]
                        .fReevaluateDefinition,
                ),
                inputMathFs: inputFs,
                inputNumericFs: inputFs,
            };
        }

        return returnNumericalFunctionFromReevaluatedFormula({
            formulaExpressionWithCodes: me.fromAst(
                fDefinition.formulaExpressionWithCodes,
            ),
            evaluateChildrenToReevaluate,
            numInputs: fDefinition.numInputs,
            variables: fDefinition.variables.map((x: any) => me.fromAst(x)),
            domain: fDefinition.domain
                ? fDefinition.domain.map((x: any) => me.fromAst(x))
                : null,
            component: fDefinition.component,
        });
    } else if (fDefinition.functionType === "numericForEvaluate") {
        return returnNumericFunctionForEvaluate({
            numInputs: fDefinition.numInputs,
            numericalfs: fDefinition.fDefinitions.map((fdef: any) =>
                createFunctionFromDefinition(fdef),
            ),
        });
    } else if (fDefinition.functionType === "bezier") {
        return returnBezierFunctions({
            numThroughPoints: fDefinition.numThroughPoints,
            numericalThroughPoints: fDefinition.numericalThroughPoints,
            splineCoeffs: fDefinition.splineCoeffs,
            extrapolateForward: fDefinition.extrapolateForward,
            extrapolateForwardCoeffs: fDefinition.extrapolateForwardCoeffs,
            extrapolateBackward: fDefinition.extrapolateBackward,
            extrapolateBackwardCoeffs: fDefinition.extrapolateBackwardCoeffs,
            component: fDefinition.component,
        });
    } else if (fDefinition.functionType === "interpolated") {
        return returnInterpolatedFunction({
            xs: fDefinition.xs,
            coeffs: fDefinition.coeffs,
            interpolationPoints: fDefinition.interpolationPoints,
            domain: fDefinition.domain
                ? fDefinition.domain.map((x: any) => me.fromAst(x))
                : null,
        });
    } else if (fDefinition.functionType === "functionOperator") {
        return returnFunctionOperatorFunction({
            componentType: fDefinition.componentType,
            functionOperatorArguments: fDefinition.functionOperatorArguments,
            operatorComposesWithOriginal:
                fDefinition.operatorComposesWithOriginal,
            originalFDefinition: fDefinition.originalFDefinition,
            numOutputs: fDefinition.numOutputs,
            component: fDefinition.component,
        });
    } else if (fDefinition.functionType === "ODESolution") {
        return returnODESolutionFunction({
            numDimensions: fDefinition.numDimensions,
            t0: fDefinition.t0,
            x0s: fDefinition.x0s,
            chunkSize: fDefinition.chunkSize,
            tolerance: fDefinition.tolerance,
            numericalRHSfDefinitions: fDefinition.numericalRHSfDefinitions,
            maxIterations: fDefinition.maxIterations,
            component: fDefinition.component,
        });
    } else if (fDefinition.functionType === "piecewise") {
        return returnPiecewiseNumericalFunctionFromChildren({
            numericalFsOfChildren: fDefinition.fDefinitionsOfChildren.map(
                (fDef: any) => createFunctionFromDefinition(fDef),
            ),
            numericalDomainsOfChildren: fDefinition.numericalDomainsOfChildren,
            domain: fDefinition.domain
                ? fDefinition.domain.map((x: any) => me.fromAst(x))
                : null,
            component: fDefinition.component,
        });
    } else {
        // otherwise, return the NaN function
        return () => NaN;
    }
}

export function returnNumericalFunctionFromFormula({
    formula,
    numInputs,
    variables,
    domain = null,
    component = 0,
}: {
    formula: any;
    numInputs: number;
    variables: any[];
    domain?: any[] | null;
    component?: number;
}): NumericalFunction {
    component = Number(component);

    let formulaIsVectorValued =
        Array.isArray(formula.tree) &&
        vectorOperators.includes(formula.tree[0]);

    if (formulaIsVectorValued) {
        try {
            formula = formula.get_component(component);
        } catch (e) {
            return () => NaN;
        }
    } else if (component !== 0) {
        return () => NaN;
    }

    let formula_f;
    try {
        formula_f = formula.subscripts_to_strings().f();
    } catch (e) {
        return () => NaN;
    }

    if (numInputs === 1) {
        let varString = variables[0].subscripts_to_strings().tree;

        let minx = -Infinity,
            maxx = Infinity;
        let openMin = false,
            openMax = false;
        if (domain) {
            let domain0 = domain[0];
            if (domain0 !== undefined) {
                minx = me
                    .fromAst(domain0.tree[1][1])
                    .evaluate_to_constant() as number;
                if (typeof minx !== "number" || Number.isNaN(minx)) {
                    minx = -Infinity;
                } else {
                    openMin = !domain0.tree[2][1];
                }
                maxx = me
                    .fromAst(domain0.tree[1][2])
                    .evaluate_to_constant() as number;
                if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                    maxx = Infinity;
                } else {
                    openMax = !domain0.tree[2][2];
                }
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }
        }

        return function (x: number, overrideDomain = false): number {
            if (overrideDomain) {
                if (isNaN(x)) {
                    return NaN;
                }
            } else if (
                !(x >= minx) ||
                !(x <= maxx) ||
                (openMin && x === minx) ||
                (openMax && x === maxx)
            ) {
                return NaN;
            }
            try {
                return formula_f({ [varString]: x });
            } catch (e) {
                return NaN;
            }
        } as any;
    }

    let varStrings = [];
    for (let i = 0; i < numInputs; i++) {
        varStrings.push(variables[i].subscripts_to_strings().tree);
    }

    let haveDomain = false;
    let domainIntervals: [number, number][] = [];
    let domainOpens: [boolean, boolean][] = [];

    if (domain !== null) {
        haveDomain = true;

        for (let i = 0; i < numInputs; i++) {
            let thisDomain = domain[i];
            if (!thisDomain) {
                haveDomain = false;
                break;
            }

            let minx = -Infinity,
                maxx = Infinity;
            let openMin = false,
                openMax = false;

            minx = me
                .fromAst(thisDomain.tree[1][1])
                .evaluate_to_constant() as number;
            if (typeof minx !== "number" || Number.isNaN(minx)) {
                minx = -Infinity;
            } else {
                openMin = !thisDomain.tree[2][1];
            }
            maxx = me
                .fromAst(thisDomain.tree[1][2])
                .evaluate_to_constant() as number;
            if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                maxx = Infinity;
            } else {
                openMax = !thisDomain.tree[2][2];
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }

            domainIntervals.push([minx, maxx]);
            domainOpens.push([openMin, openMax]);
        }
    }

    return function (...xs: any[]): number {
        let fArgs: any = {};
        for (let i = 0; i < numInputs; i++) {
            let x = xs[i];
            if (isNaN(x)) {
                return NaN;
            } else if (haveDomain) {
                let [minx, maxx] = domainIntervals[i];
                let [openMin, openMax] = domainOpens[i];
                if (
                    !(x >= minx) ||
                    !(x <= maxx) ||
                    (openMin && x === minx) ||
                    (openMax && x === maxx)
                ) {
                    return NaN;
                }
            }
            fArgs[varStrings[i]] = x;
        }

        try {
            return formula_f(fArgs);
        } catch (e) {
            return NaN;
        }
    };
}

export function returnNumericalFunctionFromReevaluatedFormula({
    formulaExpressionWithCodes,
    evaluateChildrenToReevaluate,
    numInputs,
    variables,
    domain = null,
    component = 0,
}: {
    formulaExpressionWithCodes: any;
    evaluateChildrenToReevaluate: any;
    numInputs: number;
    variables: any[];
    domain?: any[] | null;
    component?: number;
}): NumericalFunction {
    component = Number(component);

    let formulaIsVectorValued =
        Array.isArray(formulaExpressionWithCodes.tree) &&
        vectorOperators.includes(formulaExpressionWithCodes.tree[0]);

    if (formulaIsVectorValued) {
        try {
            formulaExpressionWithCodes =
                formulaExpressionWithCodes.get_component(Number(component));
        } catch (e) {
            return () => NaN;
        }
    } else if (component !== 0) {
        return () => NaN;
    }

    let formula_f;
    try {
        formula_f = formulaExpressionWithCodes.subscripts_to_strings().f();
    } catch (e) {
        return () => NaN;
    }

    if (numInputs === 1) {
        let varString = variables[0].subscripts_to_strings().tree;

        let minx = -Infinity,
            maxx = Infinity;
        let openMin = false,
            openMax = false;
        if (domain !== null) {
            let domain0 = domain[0];
            if (domain0 !== undefined) {
                minx = me
                    .fromAst(domain0.tree[1][1])
                    .evaluate_to_constant() as number;
                if (typeof minx !== "number" || Number.isNaN(minx)) {
                    minx = -Infinity;
                } else {
                    openMin = !domain0.tree[2][1];
                }
                maxx = me
                    .fromAst(domain0.tree[1][2])
                    .evaluate_to_constant() as number;
                if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                    maxx = Infinity;
                } else {
                    openMax = !domain0.tree[2][2];
                }
            }
        }

        // If the domain extends to +/- infinity, then consider the domain closed
        // so that we can evaluate the function at +/- infinity
        if (minx === -Infinity) {
            openMin = false;
        }
        if (maxx === Infinity) {
            openMax = false;
        }

        return function (x: number, overrideDomain = false): number {
            if (overrideDomain) {
                if (isNaN(x)) {
                    return NaN;
                }
            } else if (
                !(x >= minx) ||
                !(x <= maxx) ||
                (openMin && x === minx) ||
                (openMax && x === maxx)
            ) {
                return NaN;
            }

            let argsForInputs: any = { [varString]: x };
            let fArgs: any = { [varString]: x };

            for (let code in evaluateChildrenToReevaluate) {
                try {
                    fArgs[code] = evaluateChildToNumber(
                        evaluateChildrenToReevaluate[code],
                        argsForInputs,
                    );
                } catch (e) {
                    return NaN;
                }
            }

            try {
                return formula_f(fArgs);
            } catch (e) {
                return NaN;
            }
        };
    }

    let varStrings = [];
    for (let i = 0; i < numInputs; i++) {
        varStrings.push(variables[i].subscripts_to_strings().tree);
    }

    let haveDomain = false;
    let domainIntervals: [number, number][] = [];
    let domainOpens: [boolean, boolean][] = [];

    if (domain !== null) {
        haveDomain = true;

        for (let i = 0; i < numInputs; i++) {
            let thisDomain = domain[i];
            if (!thisDomain) {
                haveDomain = false;
                break;
            }

            let minx = -Infinity,
                maxx = Infinity;
            let openMin = false,
                openMax = false;

            minx = me
                .fromAst(thisDomain.tree[1][1])
                .evaluate_to_constant() as number;
            if (typeof minx !== "number" || Number.isNaN(minx)) {
                minx = -Infinity;
            } else {
                openMin = !thisDomain.tree[2][1];
            }
            maxx = me
                .fromAst(thisDomain.tree[1][2])
                .evaluate_to_constant() as number;
            if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                maxx = Infinity;
            } else {
                openMax = !thisDomain.tree[2][2];
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }

            domainIntervals.push([minx, maxx]);
            domainOpens.push([openMin, openMax]);
        }
    }

    return function (...xs: any[]): number {
        let fArgs: any = {};
        for (let i = 0; i < numInputs; i++) {
            let x = xs[i];
            if (typeof x !== "number" || isNaN(x)) {
                return NaN;
            } else if (haveDomain) {
                let [minx, maxx] = domainIntervals[i];
                let [openMin, openMax] = domainOpens[i];
                if (
                    !(x >= minx) ||
                    !(x <= maxx) ||
                    (openMin && x === minx) ||
                    (openMax && x === maxx)
                ) {
                    return NaN;
                }
            }
            fArgs[varStrings[i]] = x;
        }

        let argsForInputs: any = { ...fArgs };
        for (let code in evaluateChildrenToReevaluate) {
            try {
                fArgs[code] = evaluateChildToNumber(
                    evaluateChildrenToReevaluate[code],
                    argsForInputs,
                );
            } catch (e) {
                return NaN;
            }
        }

        try {
            return formula_f(fArgs);
        } catch (e) {
            return NaN;
        }
    };
}

export function returnPiecewiseNumericalFunctionFromChildren({
    numericalFsOfChildren,
    numericalDomainsOfChildren,
    domain = null,
    component = 0,
}: {
    numericalFsOfChildren: NumericalFunction[];
    numericalDomainsOfChildren: any[];
    domain?: any[] | null;
    component?: number;
}): NumericalFunction {
    component = Number(component);

    if (component !== 0) {
        return () => NaN;
    }

    let { minx, maxx, openMin, openMax } = find_effective_domain({
        domain: domain ?? null,
    });

    return function (x: number, overrideDomain = false): number {
        if (overrideDomain) {
            if (isNaN(x)) {
                return NaN;
            }
        } else if (
            !(x >= minx) ||
            !(x <= maxx) ||
            (openMin && x === minx) ||
            (openMax && x === maxx)
        ) {
            return NaN;
        }

        for (let [ind, childDomain] of numericalDomainsOfChildren.entries()) {
            let childMinX = childDomain[0][0];
            let childMaxX = childDomain[0][1];
            let childMinXClosed = childDomain[1][0];
            let childMaxXClosed = childDomain[1][1];
            if (
                (x > childMinX || (childMinXClosed && x === childMinX)) &&
                (x < childMaxX || (childMaxXClosed && x === childMaxX))
            ) {
                return numericalFsOfChildren[ind](x);
            }
        }

        return NaN;
    };
}

/**
 * Is this what `evaluate_to_constant()` returns for an input that has a place
 * on the number line? `null` (no value), `NaN`, and a complex `{re, im}` are
 * all "no" — and each of them, left to JavaScript's relational operators, would
 * silently answer a domain question instead: `null >= -3` is `true`.
 *
 * `±Infinity` is a "yes": it is not finite, but it *is* ordered, which is all a
 * domain check needs. (This is the same predicate as
 * `doenetml-worker-javascript`'s `isNumericConstant`, duplicated because the
 * dependency runs the other way — that package imports this one.)
 */
function isNumericConstant(v: unknown): v is number {
    return typeof v === "number" && !Number.isNaN(v);
}

export function returnSymbolicFunctionFromFormula({
    formula,
    simplify,
    expand,
    domain = null,
    numInputs,
    variables,
    component = 0,
}: {
    formula: any;
    simplify?: string;
    expand?: boolean;
    domain?: any[] | null;
    numInputs: number;
    variables: any[];
    component?: number;
}): SymbolicFunction {
    component = Number(component);

    let formulaIsVectorValued =
        Array.isArray(formula.tree) &&
        vectorOperators.includes(formula.tree[0]);

    if (formulaIsVectorValued) {
        try {
            formula = formula.get_component(component);
        } catch (e) {
            return () => me.fromAst("\uff3f");
        }
    } else if (component !== 0) {
        return () => me.fromAst("\uff3f");
    }

    let formula_transformed = formula.subscripts_to_strings();

    if (numInputs === 1) {
        let varString = variables[0].subscripts_to_strings().tree;

        let minx = -Infinity,
            maxx = Infinity;
        let openMin = false,
            openMax = false;
        if (domain !== null) {
            let domain0 = domain[0];
            if (domain0 !== undefined) {
                minx = me
                    .fromAst(domain0.tree[1][1])
                    .evaluate_to_constant() as number;
                if (typeof minx !== "number" || Number.isNaN(minx)) {
                    minx = -Infinity;
                } else {
                    openMin = !domain0.tree[2][1];
                }
                maxx = me
                    .fromAst(domain0.tree[1][2])
                    .evaluate_to_constant() as number;
                if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                    maxx = Infinity;
                } else {
                    openMax = !domain0.tree[2][2];
                }
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }
        }

        return function (x: any, overrideDomain = false): any {
            if (!overrideDomain) {
                let xNum = x.evaluate_to_constant();

                // Only a *number* can be outside the domain. An input that has
                // no numeric value — `10y`, or anything else still symbolic —
                // cannot be placed, so the domain has nothing to say about it
                // and the substitution goes ahead. The engine reports "no
                // value" as `null`, and `null` compares as `0` in `>=`/`<=`,
                // so a bare `Number.isNaN` check let a symbolic input be judged
                // against the interval as if it were the origin.
                if (
                    isNumericConstant(xNum) &&
                    (!(xNum >= minx) ||
                        !(xNum <= maxx) ||
                        (openMin && xNum === minx) ||
                        (openMax && xNum === maxx))
                ) {
                    return me.fromAst("\uff3f");
                }
            }

            return normalizeMathExpression({
                value: formula_transformed
                    .substitute({ [varString]: x })
                    .strings_to_subscripts(),
                simplify,
                expand,
            });
        };
    }

    let varStrings = [];
    for (let i = 0; i < numInputs; i++) {
        varStrings.push(variables[i].subscripts_to_strings().tree);
    }

    let haveDomain = false;
    let domainIntervals: [number, number][] = [];
    let domainOpens: [boolean, boolean][] = [];

    if (domain !== null) {
        haveDomain = true;

        for (let i = 0; i < numInputs; i++) {
            let thisDomain = domain[i];
            if (!thisDomain) {
                haveDomain = false;
                break;
            }

            let minx = -Infinity,
                maxx = Infinity;
            let openMin = false,
                openMax = false;

            minx = me
                .fromAst(thisDomain.tree[1][1])
                .evaluate_to_constant() as number;
            if (typeof minx !== "number" || Number.isNaN(minx)) {
                minx = -Infinity;
            } else {
                openMin = !thisDomain.tree[2][1];
            }
            maxx = me
                .fromAst(thisDomain.tree[1][2])
                .evaluate_to_constant() as number;
            if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                maxx = Infinity;
            } else {
                openMax = !thisDomain.tree[2][2];
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }

            domainIntervals.push([minx, maxx]);
            domainOpens.push([openMin, openMax]);
        }

        if (
            haveDomain &&
            domainIntervals.every(
                (v) => v[0] === -Infinity && v[1] === Infinity,
            )
        ) {
            haveDomain = false;
        }
    }

    return function (...xs: any[]): any {
        let subArgs: any = {};
        let foundOutsideDomain = false;
        let allNumeric = true;

        for (let i = 0; i < numInputs; i++) {
            let x = xs[i];

            if (haveDomain && allNumeric) {
                let xNum = x.evaluate_to_constant();
                // See the note in the single-input case: "not a number" is how
                // a symbolic input arrives, and it must switch off the domain
                // check for the whole call rather than be compared as `0`.
                if (!isNumericConstant(xNum)) {
                    allNumeric = false;
                } else {
                    let [minx, maxx] = domainIntervals[i];
                    let [openMin, openMax] = domainOpens[i];

                    if (
                        !(xNum >= minx) ||
                        !(xNum <= maxx) ||
                        (openMin && xNum === minx) ||
                        (openMax && xNum === maxx)
                    ) {
                        foundOutsideDomain = true;
                    }
                }
            }
            subArgs[varStrings[i]] = x;
        }

        if (allNumeric && foundOutsideDomain) {
            return me.fromAst("\uff3f");
        }

        return normalizeMathExpression({
            value: formula_transformed
                // Simultaneously: an argument may mention another variable's
                // name — `f(x,y) = sin(x+y)` evaluated at `(10y, -π)` — and a
                // left-to-right pass would substitute into its own output and
                // answer `sin(-11π)`. `substitute` is simultaneous too now
                // (math-expressions #84 restored the legacy contract); this
                // stays as the spelling that says so at the call site, and
                // these arguments are already `Expression`s, which is the one
                // thing the two still differ about.
                .substitute_all(subArgs)
                .strings_to_subscripts(),
            simplify,
            expand,
        });
    };
}

export function returnSymbolicFunctionFromReevaluatedFormula({
    formulaExpressionWithCodes,
    evaluateChildrenToReevaluate,
    simplify,
    expand,
    numInputs,
    variables,
    domain = null,
    component = 0,
}: {
    formulaExpressionWithCodes: any;
    evaluateChildrenToReevaluate: any;
    simplify?: string;
    expand?: boolean;
    numInputs: number;
    variables: any[];
    domain?: any[] | null;
    component?: number;
}): SymbolicFunction {
    component = Number(component);

    let formulaIsVectorValued =
        Array.isArray(formulaExpressionWithCodes.tree) &&
        vectorOperators.includes(formulaExpressionWithCodes.tree[0]);

    if (formulaIsVectorValued) {
        try {
            formulaExpressionWithCodes =
                formulaExpressionWithCodes.get_component(component);
        } catch (e) {
            return () => me.fromAst("\uff3f");
        }
    } else if (component !== 0) {
        return () => me.fromAst("\uff3f");
    }

    let formula_transformed =
        formulaExpressionWithCodes.subscripts_to_strings();

    if (numInputs === 1) {
        let varString = variables[0].subscripts_to_strings().tree;

        let minx = -Infinity,
            maxx = Infinity;
        let openMin = false,
            openMax = false;
        if (domain !== null) {
            let domain0 = domain[0];
            if (domain0 !== undefined) {
                minx = me
                    .fromAst(domain0.tree[1][1])
                    .evaluate_to_constant() as number;
                if (typeof minx !== "number" || Number.isNaN(minx)) {
                    minx = -Infinity;
                } else {
                    openMin = !domain0.tree[2][1];
                }
                maxx = me
                    .fromAst(domain0.tree[1][2])
                    .evaluate_to_constant() as number;
                if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                    maxx = Infinity;
                } else {
                    openMax = !domain0.tree[2][2];
                }

                // If the domain extends to +/- infinity, then consider the domain closed
                // so that we can evaluate the function at +/- infinity
                if (minx === -Infinity) {
                    openMin = false;
                }
                if (maxx === Infinity) {
                    openMax = false;
                }
            }
        }

        return function (x: any, overrideDomain = false): any {
            if (!overrideDomain) {
                let xNum = x.evaluate_to_constant();

                // Only a *number* can be outside the domain. An input that has
                // no numeric value — `10y`, or anything else still symbolic —
                // cannot be placed, so the domain has nothing to say about it
                // and the substitution goes ahead. The engine reports "no
                // value" as `null`, and `null` compares as `0` in `>=`/`<=`,
                // so a bare `Number.isNaN` check let a symbolic input be judged
                // against the interval as if it were the origin.
                if (
                    isNumericConstant(xNum) &&
                    (!(xNum >= minx) ||
                        !(xNum <= maxx) ||
                        (openMin && xNum === minx) ||
                        (openMax && xNum === maxx))
                ) {
                    return me.fromAst("\uff3f");
                }
            }

            let argsForInputs: any = { [varString]: x.tree };
            let fArgs: any = { [varString]: x };

            for (let code in evaluateChildrenToReevaluate) {
                let childF = evaluateChildrenToReevaluate[code].fReevaluate;
                let inputFs = evaluateChildrenToReevaluate[code].inputMathFs;
                try {
                    const input = inputFs.map((f: any) =>
                        asExpression(f(argsForInputs)),
                    );
                    fArgs[code] = childF(input);
                } catch (e) {
                    return me.fromAst("\uff3f");
                }
            }

            return normalizeMathExpression({
                value: formula_transformed
                    .substitute(fArgs)
                    .strings_to_subscripts(),
                simplify,
                expand,
            });
        };
    }

    let varStrings = [];
    for (let i = 0; i < numInputs; i++) {
        varStrings.push(variables[i].subscripts_to_strings().tree);
    }

    let haveDomain = false;
    let domainIntervals: [number, number][] = [];
    let domainOpens: [boolean, boolean][] = [];

    if (domain !== null) {
        haveDomain = true;

        for (let i = 0; i < numInputs; i++) {
            let thisDomain = domain[i];
            if (!thisDomain) {
                haveDomain = false;
                break;
            }

            let minx = -Infinity,
                maxx = Infinity;
            let openMin = false,
                openMax = false;

            minx = me
                .fromAst(thisDomain.tree[1][1])
                .evaluate_to_constant() as number;
            if (typeof minx !== "number" || Number.isNaN(minx)) {
                minx = -Infinity;
            } else {
                openMin = !thisDomain.tree[2][1];
            }
            maxx = me
                .fromAst(thisDomain.tree[1][2])
                .evaluate_to_constant() as number;
            if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                maxx = Infinity;
            } else {
                openMax = !thisDomain.tree[2][2];
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }

            domainIntervals.push([minx, maxx]);
            domainOpens.push([openMin, openMax]);
        }
    }

    return function (...xs: any[]): any {
        let subArgs: any = {};
        let argsForInputs: any = {};
        let foundOutsideDomain = false;
        let allNumeric = true;

        for (let i = 0; i < numInputs; i++) {
            let x = xs[i];

            if (haveDomain && allNumeric) {
                let xNum = x.evaluate_to_constant();
                // See the note in the single-input case: "not a number" is how
                // a symbolic input arrives, and it must switch off the domain
                // check for the whole call rather than be compared as `0`.
                if (!isNumericConstant(xNum)) {
                    allNumeric = false;
                } else {
                    let [minx, maxx] = domainIntervals[i];
                    let [openMin, openMax] = domainOpens[i];

                    if (
                        !(xNum >= minx) ||
                        !(xNum <= maxx) ||
                        (openMin && xNum === minx) ||
                        (openMax && xNum === maxx)
                    ) {
                        foundOutsideDomain = true;
                    }
                }
            }
            subArgs[varStrings[i]] = x;
            argsForInputs[varStrings[i]] = x.tree;
        }

        if (allNumeric && foundOutsideDomain) {
            return me.fromAst("\uff3f");
        }

        for (let code in evaluateChildrenToReevaluate) {
            let childF = evaluateChildrenToReevaluate[code].fReevaluate;
            let inputFs = evaluateChildrenToReevaluate[code].inputMathFs;
            try {
                let input = inputFs.map((f: any) =>
                    asExpression(f(argsForInputs)),
                );
                subArgs[code] = childF(input);
            } catch (e) {
                return NaN;
            }
        }

        return normalizeMathExpression({
            value: formula_transformed
                // Simultaneously: an argument may mention another variable's
                // name — `f(x,y) = sin(x+y)` evaluated at `(10y, -π)` — and a
                // left-to-right pass would substitute into its own output and
                // answer `sin(-11π)`. `substitute` is simultaneous too now
                // (math-expressions #84 restored the legacy contract); this
                // stays as the spelling that says so at the call site, and
                // these arguments are already `Expression`s, which is the one
                // thing the two still differ about.
                .substitute_all(subArgs)
                .strings_to_subscripts(),
            simplify,
            expand,
        });
    };
}

/**
 * A value that is already an `Expression` passed through untouched, anything
 * else wrapped.
 *
 * `me.fromAst` accepts an `Expression` and quietly round-trips it — serialize
 * to JSON, parse back — producing an equal but distinct object. That is one
 * wasted crossing per input per sample in the evaluation loops below, which is
 * where it stopped being affordable.
 */
function asExpression(value: any): any {
    return value instanceof me.class ? value : me.fromAst(value);
}

/**
 * Bind one `<evaluate>` child to a number, for callers that are themselves
 * numeric.
 *
 * The expression route is the general one: it can spread a vector input across
 * a multi-input function, and it keeps a symbolic function symbolic. The
 * numeric route can do neither, so where it cannot answer it declines rather
 * than guess, and we fall through — a wrong number is worse than a slow one.
 *
 * Taking the numeric route where it applies is the point of the split. A
 * spline-backed function has no symbolic form at all, yet routing it through
 * the expression route built an expression for each input, unwrapped it to a
 * float, evaluated the spline, and wrapped the float back up — six crossings of
 * the wasm boundary per sample to carry a number that never became symbolic.
 * Extrema searches call this tens of thousands of times.
 */
function evaluateChildToNumber(child: any, argsForInputs: any): number {
    const childF = child.fReevaluate;

    if (childF.numeric && child.inputNumericFs) {
        try {
            const value = childF.numeric(
                child.inputNumericFs.map((f: any) => f(argsForInputs)),
            );
            if (value !== undefined) {
                return value;
            }
        } catch (e) {
            // Fall through to the expression route below. It is not a *better*
            // route for the two throws you would expect here — a vector input
            // throws earlier, when `.f()` is constructed, and an unbound symbol
            // throws again below, from the same argument functions — so this
            // catch only buys resilience against an unforeseen throw out of the
            // compiled evaluator.
        }
    }

    const input = child.inputMathFs.map((f: any) =>
        asExpression(f(argsForInputs)),
    );
    // A child that lands outside its own domain evaluates to a blank, which
    // `evaluate_to_constant()` declines with `null` — note that a child which
    // is genuinely NaN comes back as NaN, so `null` really does mean "no value".
    //
    // Left as `null`, it reaches the compiled formula, where mathjs rejects it
    // for every operator — caught upstream, so the answer is NaN by way of an
    // exception. The exception is the formula that is *just* this code, as
    // `<function>$$f(x)</function>` is: nothing operates on the value, so the
    // `null` is handed back as the function's number, and downstream JS reads it
    // as zero. NaN is the answer in both cases, and it costs no throw.
    return childF(input).evaluate_to_constant() ?? NaN;
}

export function returnSymbolicFunctionForEvaluate({
    symbolicfs,
    numInputs,
}: {
    symbolicfs: SymbolicFunction[];
    numInputs: number;
}): VariableFunction {
    const f = function (input: any[]): any {
        // if have a single input, check if it is a vector
        if (input.length === 1) {
            let inputTree = input[0].tree;
            if (
                Array.isArray(inputTree) &&
                vectorOperators.includes(inputTree[0])
            ) {
                input = inputTree.slice(1).map((x: any) => me.fromAst(x));
            }
        }

        if (input.length !== numInputs) {
            return me.fromAst("\uFF3F");
        }

        const results = symbolicfs.map((f) => f(...input));

        // One component is the overwhelmingly common case, and it is already
        // the expression we want: taking `.tree` and handing it straight back
        // to `fromAst` is a full JSON round-trip through wasm that cannot
        // change the value. This runs once per sample inside the extrema
        // search, so the round-trip was costing hundreds of thousands of
        // serializations on a single interpolated function.
        if (results.length === 1) {
            return results[0];
        }

        return me.fromAst(["vector", ...results.map((r) => r.tree)]);
    };

    // Some "symbolic" functions have no symbolic form to preserve — an
    // interpolated function is a spline, and its symbolic entry is the numeric
    // one wrapped in an unwrap/rewrap pair. Where every component says so by
    // naming its `numericalCounterpart`, a numeric caller can have the float
    // directly. This is not an approximation of the symbolic route: it is the
    // same function with the two wrappings removed.
    const counterparts = symbolicfs.map(
        (component: any) => component.numericalCounterpart,
    );
    if (counterparts.every((c: any) => typeof c === "function")) {
        (f as any).numeric = function (input: number[]): number | undefined {
            if (input.length !== numInputs || counterparts.length !== 1) {
                return undefined;
            }
            const value = counterparts[0](...input);
            return typeof value === "number" ? value : NaN;
        };
    }

    return f;
}

export function returnNumericFunctionForEvaluate({
    numericalfs,
    numInputs,
}: {
    numericalfs: NumericalFunction[];
    numInputs: number;
}): VariableFunction {
    const f = function (input: any[]): any {
        // if have a single input, check if it is a vector
        if (input.length === 1) {
            let inputTree = input[0].tree;
            if (
                Array.isArray(inputTree) &&
                vectorOperators.includes(inputTree[0])
            ) {
                input = inputTree.slice(1).map((x: any) => me.fromAst(x));
            }
        }

        if (input.length !== numInputs) {
            return me.fromAst("\uFF3F");
        }

        // An input with no numeric value is `NaN` here, never `null`: the
        // engine reports "no value" as `null`, and `null` is `0` to every
        // arithmetic operator downstream — so evaluating `$$f(x)` with `x`
        // still symbolic silently returned *f(0)* and passed it off as the
        // value of the call.
        let numericInput = input.map((x: any) => {
            const v = x.evaluate_to_constant();
            return typeof v === "number" ? v : NaN;
        });

        // A numerical function fed a non-numeric input can hand back `null`
        // (or `undefined`), which `fromAst` rejects outright — a thrown error
        // out of a state-variable definition takes the whole document down.
        // "Could not evaluate numerically" is NaN, which the tree can hold and
        // every downstream finiteness check already handles.
        let components = numericalfs
            .map((f) => f(...numericInput))
            .map((c: any) => (typeof c === "number" ? c : NaN));

        let value;
        if (components.length === 1) {
            value = me.fromAst(components[0]);
        } else {
            value = me.fromAst(["vector", ...components]);
        }

        return value;
    };

    // Numbers in, number out — the same evaluation with no expression built at
    // either end, for numeric callers (see `evaluateChildToNumber`).
    //
    // `undefined` means "I can't answer this one, use the general route": a
    // vector-valued function has no single number to return, and an arity
    // mismatch is the vector-spread case, which needs the input's tree.
    (f as any).numeric = function (input: number[]): number | undefined {
        if (input.length !== numInputs || numericalfs.length !== 1) {
            return undefined;
        }
        const value = numericalfs[0](...input);
        return typeof value === "number" ? value : NaN;
    };

    return f;
}

export function returnBezierFunctions({
    numThroughPoints,
    numericalThroughPoints,
    splineCoeffs,
    extrapolateForward,
    extrapolateForwardCoeffs,
    extrapolateBackward,
    extrapolateBackwardCoeffs,
    component,
}: {
    numThroughPoints: number;
    numericalThroughPoints: any[];
    splineCoeffs: any[];
    extrapolateForward: boolean;
    extrapolateForwardCoeffs: any[];
    extrapolateBackward: boolean;
    extrapolateBackwardCoeffs: any[];
    component?: number;
}): NumericalFunction {
    if (numThroughPoints < 1) {
        return () => NaN;
    }

    let len = numThroughPoints - 1;

    // let firstPointX = numericalThroughPoints[0][component];
    let lastPointX = numericalThroughPoints[len][component!];

    let cs = splineCoeffs.map((x: any) => x[component!]);
    let cB: any;
    if (extrapolateBackward) {
        cB = extrapolateBackwardCoeffs[component!];
    }
    let cF: any;
    if (extrapolateForward) {
        cF = extrapolateForwardCoeffs[component!];
    }

    return function (t: number): number {
        if (isNaN(t)) {
            return NaN;
        }

        if (t < 0) {
            if (extrapolateBackward) {
                return (cB[2] * t + cB[1]) * t + cB[0];
            } else {
                return NaN;
            }
        }

        if (t >= len) {
            if (extrapolateForward) {
                t -= len;
                return (cF[2] * t + cF[1]) * t + cF[0];
            } else if (t === len) {
                return lastPointX;
            } else {
                return NaN;
            }
        }

        let z = Math.floor(t);
        t -= z;
        let c = cs[z];
        return ((c[3] * t + c[2]) * t + c[1]) * t + c[0];
    };
}

export function returnInterpolatedFunction({
    xs,
    coeffs,
    interpolationPoints,
    domain = null,
}: {
    xs: number[] | null;
    coeffs: any[];
    interpolationPoints?: any[];
    domain?: any[] | null;
}): NumericalFunction {
    let interpolationPointYs: any[] = [];
    if (interpolationPoints) {
        interpolationPointYs = interpolationPoints.map((x) => x.y);
    }

    if (xs === null) {
        return () => NaN;
    }

    let minx = -Infinity,
        maxx = Infinity;
    let openMin = false,
        openMax = false;
    if (domain !== null) {
        // Function domains are represented as one interval per input variable.
        // Interpolated functions here are single-input, so domain[0] is the
        // x-domain interval, not the first piece of a union domain.
        let domain0 = domain[0];
        if (domain0 !== undefined) {
            minx = me
                .fromAst(domain0.tree[1][1])
                .evaluate_to_constant() as number;
            if (typeof minx !== "number" || Number.isNaN(minx)) {
                minx = -Infinity;
            } else {
                openMin = !domain0.tree[2][1];
            }
            maxx = me
                .fromAst(domain0.tree[1][2])
                .evaluate_to_constant() as number;
            if (typeof maxx !== "number" || Number.isNaN(maxx)) {
                maxx = Infinity;
            } else {
                openMax = !domain0.tree[2][2];
            }

            // If the domain extends to +/- infinity, then consider the domain closed
            // so that we can evaluate the function at +/- infinity
            if (minx === -Infinity) {
                openMin = false;
            }
            if (maxx === Infinity) {
                openMax = false;
            }
        }
    }

    let x0 = xs[0],
        xL = xs[xs.length - 1];

    return function (x: number, overrideDomain = false): number {
        if (overrideDomain) {
            if (isNaN(x)) {
                return NaN;
            }
        } else if (
            !(x >= minx) ||
            !(x <= maxx) ||
            (openMin && x === minx) ||
            (openMax && x === maxx)
        ) {
            return NaN;
        }

        if (x <= x0) {
            // Extrapolate
            x -= x0;
            let c = coeffs[0];

            if (x === -Infinity) {
                if (c[3] === 0) {
                    if (c[2] === 0) {
                        if (c[1] === 0) {
                            return c[0];
                        } else {
                            return -Math.sign(c[1]) * Infinity;
                        }
                    } else {
                        return Math.sign(c[2]) * Infinity;
                    }
                } else {
                    return -Math.sign(c[3]) * Infinity;
                }
            }

            return ((c[3] * x + c[2]) * x + c[1]) * x + c[0];
        }

        if (x >= xL) {
            let i = xs.length - 2;
            // Extrapolate
            x -= xs[i];
            let c = coeffs[i];

            if (x === Infinity) {
                if (c[3] === 0) {
                    if (c[2] === 0) {
                        if (c[1] === 0) {
                            return c[0];
                        } else {
                            return Math.sign(c[1]) * Infinity;
                        }
                    } else {
                        return Math.sign(c[2]) * Infinity;
                    }
                } else {
                    return Math.sign(c[3]) * Infinity;
                }
            }

            if (x === Infinity && c[1] === 0 && c[2] === 0 && c[3] === 0) {
                return c[0];
            }
            return ((c[3] * x + c[2]) * x + c[1]) * x + c[0];
        }

        // Search for the interval x is in,
        // returning the corresponding y if x is one of the original xs
        let low = 0,
            mid,
            high = xs.length - 1;
        while (low <= high) {
            mid = Math.floor(0.5 * (low + high));
            let xHere = xs[mid];
            if (xHere < x) {
                low = mid + 1;
            } else if (xHere > x) {
                high = mid - 1;
            } else {
                return interpolationPointYs[mid];
            }
        }
        let i = Math.max(0, high);

        // Interpolate
        x -= xs[i];
        let c = coeffs[i];
        return ((c[3] * x + c[2]) * x + c[1]) * x + c[0];
    };
}

export function returnReturnDerivativesOfInterpolatedFunction({
    xs,
    coeffs,
    variables,
}: {
    xs: number[] | null;
    coeffs: any[];
    variables: any[];
}): VariableFunction {
    if (!xs) {
        // return a function that returns a function that returns NaN!
        return () => () => NaN;
    }

    let variable1Trans = variables[0].subscripts_to_strings().tree;

    let x0 = xs[0],
        xL = xs[xs.length - 1];

    return function (derivVariables: any[]): NumericalFunction {
        let derivVariablesTrans = derivVariables.map(
            (x) => x.subscripts_to_strings().tree,
        );

        let order = derivVariablesTrans.length;

        if (
            order > 3 ||
            !derivVariablesTrans.every((x) => x === variable1Trans) ||
            derivVariablesTrans.includes("\uff3f")
        ) {
            return () => 0;
        }

        if (order === 0 || xs === null) {
            return () => NaN;
        }

        return function (x: number): number {
            if (isNaN(x)) {
                return NaN;
            }

            if (x <= x0) {
                // Extrapolate
                x -= x0;
                let c = coeffs[0];
                if (order === 1) {
                    return (3 * c[3] * x + 2 * c[2]) * x + c[1];
                } else if (order === 2) {
                    return 6 * c[3] * x + 2 * c[2];
                } else {
                    return 6 * c[3];
                }
            }

            if (x >= xL) {
                let i = xs.length - 2;
                // Extrapolate
                x -= xs[i];
                let c = coeffs[i];
                if (order === 1) {
                    return (3 * c[3] * x + 2 * c[2]) * x + c[1];
                } else if (order === 2) {
                    return 6 * c[3] * x + 2 * c[2];
                } else {
                    return 6 * c[3];
                }
            }

            // Search for the interval x is in,
            // returning the corresponding y if x is one of the original xs
            let low = 0,
                mid,
                high = xs.length - 1;
            while (low <= high) {
                mid = Math.floor(0.5 * (low + high));
                let xHere = xs[mid];
                if (xHere < x) {
                    low = mid + 1;
                } else if (xHere > x) {
                    high = mid - 1;
                } else {
                    // at a grid point
                    if (order === 1) {
                        return coeffs[mid][1];
                    } else if (order === 2) {
                        return 2 * coeffs[mid][2];
                    } else {
                        return 6 * coeffs[mid][3];
                    }
                }
            }
            let i = Math.max(0, high);

            // Interpolate
            x -= xs[i];
            let c = coeffs[i];
            if (order === 1) {
                return (3 * c[3] * x + 2 * c[2]) * x + c[1];
            } else if (order === 2) {
                return 6 * c[3] * x + 2 * c[2];
            } else {
                return 6 * c[3];
            }
        };
    };
}

function returnFunctionOperatorFunction({
    componentType,
    functionOperatorArguments,
    operatorComposesWithOriginal,
    originalFDefinition,
    numOutputs,
    component,
}: {
    componentType: string;
    functionOperatorArguments: any[];
    operatorComposesWithOriginal: boolean;
    originalFDefinition: any;
    numOutputs: number;
    component?: number;
}): VariableFunction {
    // TODO: correctly handle numOutputs > 1

    if (operatorComposesWithOriginal) {
        let childFs: any[] = [];
        for (let ind = 0; ind < numOutputs; ind++) {
            childFs.push(createFunctionFromDefinition(originalFDefinition));
        }

        let functionOperator = functionOperatorDefinitions[componentType](
            ...functionOperatorArguments,
        );

        return (...xs: any[]) =>
            functionOperator(...childFs.map((cf) => cf(...xs)));
    } else {
        return functionOperatorDefinitions[componentType](
            ...functionOperatorArguments,
        );
    }
}

export const functionOperatorDefinitions: {
    [key: string]: (...args: any[]) => any;
} = {
    clampFunction: function (
        lowerValue: number,
        upperValue: number,
    ): NumericalFunction {
        return function (x: number): number {
            // if don't have a number, return NaN
            if (!Number.isFinite(x)) {
                return NaN;
            }
            return Math.max(lowerValue, Math.min(upperValue, x));
        };
    },

    wrapFunctionPeriodic: function (
        lowerValue: number,
        upperValue: number,
    ): NumericalFunction {
        return function (x: number): number {
            // if don't have a number, return NaN
            if (!Number.isFinite(x)) {
                return NaN;
            }

            let lower = lowerValue;
            let upper = upperValue;

            // if bounds are the same, clamp to that value
            if (lower === upper) {
                return lower;
            }

            // just in case lower is larger than upper, swap values
            if (lower > upper) {
                [upper, lower] = [lower, upper];
            }

            return lower + mod(x - lower, upper - lower);
        };
    },

    derivative: function (
        derivDefinition: any,
        derivVariables: any[],
    ): VariableFunction {
        if (derivDefinition.derivativeType === "interpolatedFunction") {
            let derivGenerator = returnReturnDerivativesOfInterpolatedFunction({
                xs: derivDefinition.xs,
                coeffs: derivDefinition.coeffs,
                variables: derivDefinition.variables.map(
                    convertValueToMathExpression,
                ),
            });

            let vars = derivVariables.map(convertValueToMathExpression);
            if (derivDefinition.additionalDerivVariables) {
                let additionalVars =
                    derivDefinition.additionalDerivVariables.map(
                        convertValueToMathExpression,
                    );
                vars = [...additionalVars, ...vars];
            }
            if (derivDefinition.variableMappings) {
                for (let variableMapping of derivDefinition.variableMappings) {
                    let mappedDerivVariables = [];

                    for (let dVar of vars) {
                        let mapped =
                            variableMapping[dVar.subscripts_to_strings().tree];
                        if (mapped) {
                            mappedDerivVariables.push(
                                convertValueToMathExpression(mapped),
                            );
                        } else {
                            // have a mapping, but
                            mappedDerivVariables.push(me.fromAst("\uff3f"));
                        }
                    }

                    vars = mappedDerivVariables;
                }
            }
            let deriv = derivGenerator(vars);

            return deriv;
        } else {
            return () => NaN;
        }
    },
};

function returnODESolutionFunction({
    numDimensions,
    t0,
    x0s,
    chunkSize,
    tolerance,
    numericalRHSfDefinitions,
    maxIterations,
    component,
}: {
    numDimensions: number;
    t0: number;
    x0s: number[];
    chunkSize: number;
    tolerance: number;
    numericalRHSfDefinitions: any[];
    maxIterations: number;
    component?: number;
}): NumericalFunction {
    let workspace: {
        calculatedNumericSolutions: any[];
        endingNumericalValues: any[];
        maxPossibleTime?: number;
    } = {
        calculatedNumericSolutions: [],
        endingNumericalValues: [],
        maxPossibleTime: undefined,
    };

    workspace.calculatedNumericSolutions = [];
    workspace.endingNumericalValues = [];
    workspace.maxPossibleTime = undefined;

    let numericalRHSfcomponents = numericalRHSfDefinitions.map((x) =>
        createFunctionFromDefinition(x),
    );

    let numericalRHSf = function (t: number, x: number | number[]): number[] {
        let fargs: any[] = [t];
        if (Array.isArray(x)) {
            fargs.push(...x);
        } else {
            fargs.push(x);
        }
        try {
            return numericalRHSfcomponents.map((f) => f(...fargs));
        } catch (e) {
            return [NaN];
        }
    };

    return function f(t: number): number {
        if (!Number.isFinite(t)) {
            return NaN;
        }
        if (t === t0) {
            return x0s[component!];
        }

        let nChunksCalculated = workspace.calculatedNumericSolutions.length;
        let chunk = Math.ceil((t - t0) / chunkSize) - 1;
        if (chunk < 0) {
            // console.log("Haven't yet implemented integrating ODE backward")
            return NaN;
        }
        if (
            workspace.maxPossibleTime === undefined &&
            chunk >= nChunksCalculated
        ) {
            for (let tind = nChunksCalculated; tind <= chunk; tind++) {
                let x0 = workspace.endingNumericalValues[tind - 1];
                if (x0 === undefined) {
                    x0 = x0s;
                }
                let t0shifted = t0 + tind * chunkSize;
                let result = dopri(
                    t0shifted,
                    t0shifted + chunkSize,
                    x0,
                    numericalRHSf,
                    tolerance,
                    maxIterations,
                );

                workspace.endingNumericalValues.push(
                    result.y[result.y.length - 1],
                );
                workspace.calculatedNumericSolutions.push(
                    result.at.bind(result),
                );

                let endingTime = result.x[result.x.length - 1];
                if (endingTime < (t0shifted + chunkSize) * (1 - 1e-6)) {
                    workspace.maxPossibleTime = endingTime;
                    break;
                }
            }
        }

        if (t > workspace.maxPossibleTime!) {
            return NaN;
        }

        let value = workspace.calculatedNumericSolutions[chunk](t)[component!];

        return value;
    };
}
