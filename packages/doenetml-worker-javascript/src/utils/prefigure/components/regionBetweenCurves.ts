import { asFiniteNumber, escapeXml, pushWarning } from "../common";
import {
    parseFormulaDefinition,
    rewriteExpressionVariable,
} from "../formulaUtils";
import type { ConverterArgs, CurveFunctionDefinition } from "../types";

/** Coerce an entry from `fDefinitions` to a typed function definition. */
function asCurveFunctionDefinition(
    definition: unknown,
): CurveFunctionDefinition | null {
    return definition && typeof definition === "object"
        ? (definition as CurveFunctionDefinition)
        : null;
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

    const f1 = parseFormulaDefinition(
        asCurveFunctionDefinition(fDefinitions[0]),
        "x",
    );
    const f2 = parseFormulaDefinition(
        asCurveFunctionDefinition(fDefinitions[1]),
        "x",
    );

    if (!f1 || !f2) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: only formula-typed child functions are supported in the PreFigure renderer; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    // PreFigure's <area-between-curves> references two named functions, each
    // declared via a sibling <definition>. The names live in the same PreFigure
    // namespace, so suffix them with the descendant handle to avoid collisions.
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
