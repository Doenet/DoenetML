import me from "math-expressions";
import { asFiniteNumber, escapeXml, pushWarning } from "../common";
import type { ConverterArgs, CurveFunctionDefinition } from "../types";

interface ParsedFormula {
    variableName: string;
    expression: string;
}

function astToExpressionString(ast: unknown): string | null {
    try {
        return me
            .fromAst(ast as any)
            .toString({ explicitMultiplicationSymbols: true });
    } catch (_e) {
        return null;
    }
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteExpressionVariable({
    expression,
    fromVariable,
    toVariable,
}: {
    expression: string;
    fromVariable: string;
    toVariable: string;
}): string {
    if (!fromVariable || fromVariable === toVariable) {
        return expression;
    }

    const escaped = escapeRegex(fromVariable);
    const symbolPattern = new RegExp(
        `(^|[^A-Za-z0-9_])(${escaped})(?=$|[^A-Za-z0-9_])`,
        "g",
    );

    return expression.replace(symbolPattern, `$1${toVariable}`);
}

function parseFunctionFormula(definition: unknown): ParsedFormula | null {
    if (!definition || typeof definition !== "object") {
        return null;
    }
    const def = definition as CurveFunctionDefinition;
    if (def.functionType !== "formula") {
        return null;
    }

    const expression = astToExpressionString(def.formula);
    if (!expression) {
        return null;
    }

    const variables = Array.isArray(def.variables) ? def.variables : [];
    const variableExpression = variables.length
        ? astToExpressionString(variables[0])
        : null;

    return {
        variableName: variableExpression || "x",
        expression,
    };
}

/**
 * Converts a `<regionBetweenCurves>` to a pair of PreFigure `<definition>`
 * elements plus an `<area-between-curves>` element.
 *
 * Only formula-typed child functions are supported. Other function types
 * (piecewise, interpolated, bezier, etc.) and the `flipFunctions` attribute
 * are not yet supported and produce a warning.
 */
export function convertRegionBetweenCurvesToPrefigure({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    if (!sv.haveFunctions) {
        return null;
    }

    if (!Array.isArray(sv.boundaryValues) || sv.boundaryValues.length !== 2) {
        return null;
    }
    const bv0 = asFiniteNumber(sv.boundaryValues[0]);
    const bv1 = asFiniteNumber(sv.boundaryValues[1]);
    if (bv0 === null || bv1 === null) {
        return null;
    }
    const [boundMin, boundMax] = bv0 <= bv1 ? [bv0, bv1] : [bv1, bv0];

    if (sv.flipFunctions) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: flipFunctions is not supported in the PreFigure renderer; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    const fDefinitions = sv.fDefinitions;
    if (!Array.isArray(fDefinitions) || fDefinitions.length < 2) {
        return null;
    }

    const f1 = parseFunctionFormula(fDefinitions[0]);
    const f2 = parseFunctionFormula(fDefinitions[1]);

    if (!f1 || !f2) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: only formula-typed child functions are supported in the PreFigure renderer; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    const fName1 = `${handle}_f1`;
    const fName2 = `${handle}_f2`;

    const def1Expr = rewriteExpressionVariable({
        expression: f1.expression,
        fromVariable: f1.variableName,
        toVariable: "x",
    });
    const def2Expr = rewriteExpressionVariable({
        expression: f2.expression,
        fromVariable: f2.variableName,
        toVariable: "x",
    });

    const def1 = `<definition>${escapeXml(`${fName1}(x)=${def1Expr}`)}</definition>`;
    const def2 = `<definition>${escapeXml(`${fName2}(x)=${def2Expr}`)}</definition>`;

    const areaAttrs = [
        `at="${escapeXml(handle)}"`,
        `function1="${escapeXml(fName1)}"`,
        `function2="${escapeXml(fName2)}"`,
        `domain="${escapeXml(`(${boundMin},${boundMax})`)}"`,
        ...styleAttrs,
    ];

    return `${def1}${def2}<area-between-curves ${areaAttrs.join(" ")} />`;
}
