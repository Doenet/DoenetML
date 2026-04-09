import me from "math-expressions";
import { escapeXml, formatPoint, pushWarning } from "../common";
import { labelMarkup } from "../label";
import type { ConverterArgs, CurveFunctionDefinition } from "../types";

interface ParsedFormulaDefinition {
    variableName: string;
    expression: string;
}

function definitionTypeLabel(
    definition: CurveFunctionDefinition | null,
): string {
    if (!definition || definition.functionType === undefined) {
        return "unknown";
    }
    return `${definition.functionType}`;
}

function curveDefinitionAtIndex(
    fDefinitions: unknown,
    index: number,
): CurveFunctionDefinition | null {
    if (Array.isArray(fDefinitions)) {
        const candidate = fDefinitions[index];
        return candidate && typeof candidate === "object"
            ? (candidate as CurveFunctionDefinition)
            : null;
    }

    if (fDefinitions && typeof fDefinitions === "object") {
        if ("functionType" in (fDefinitions as Record<string, unknown>)) {
            return fDefinitions as CurveFunctionDefinition;
        }

        const byNumericKey = (fDefinitions as Record<string, unknown>)[
            `${index}`
        ];
        if (byNumericKey && typeof byNumericKey === "object") {
            return byNumericKey as CurveFunctionDefinition;
        }
    }

    return null;
}

function astToExpressionString(ast: unknown): string | null {
    try {
        return me.fromAst(ast as any).toString();
    } catch (_e) {
        return null;
    }
}

function parseFormulaDefinition(
    definition: CurveFunctionDefinition | null,
    fallbackVariableName: string,
): ParsedFormulaDefinition | null {
    if (!definition || definition.functionType !== "formula") {
        return null;
    }

    const expression = astToExpressionString(definition.formula);
    if (!expression) {
        return null;
    }

    const variables = Array.isArray(definition.variables)
        ? definition.variables
        : [];
    const variableExpression = variables.length
        ? astToExpressionString(variables[0])
        : null;

    return {
        variableName: variableExpression || fallbackVariableName,
        expression,
    };
}

function formatDomainBound(value: unknown): string | null {
    if (value === Infinity) {
        return "inf";
    }
    if (value === -Infinity) {
        return "-inf";
    }
    if (!Number.isFinite(value)) {
        return null;
    }
    return `${Number(value)}`;
}

function prefigureDomainFromStateValues({
    parMin,
    parMax,
}: {
    parMin: unknown;
    parMax: unknown;
}): string | null {
    const min = formatDomainBound(parMin);
    const max = formatDomainBound(parMax);
    if (min === null || max === null) {
        return null;
    }
    return `(${min},${max})`;
}

function warnCurveLabelOmitted({
    label,
    labelHasLatex,
    diagnostics,
    warningPrefix,
    warningPosition,
}: {
    label: unknown;
    labelHasLatex: unknown;
    diagnostics: ConverterArgs["diagnostics"];
    warningPrefix: string;
    warningPosition?: ConverterArgs["warningPosition"];
}): void {
    if (
        labelMarkup({
            label,
            labelHasLatex,
        })
    ) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: labels are not supported on converted curve elements; label omitted.`,
            position: warningPosition,
        });
    }
}

function emitFunctionGraph({
    handle,
    styleAttrs,
    parsed,
    domain,
}: {
    handle: string;
    styleAttrs: string[];
    parsed: ParsedFormulaDefinition;
    domain: string | null;
}): string {
    const functionDefinition = `${handle}_f(${parsed.variableName})=${parsed.expression}`;
    const attrs = [
        `at="${escapeXml(handle)}"`,
        `function="${escapeXml(functionDefinition)}"`,
        ...(domain ? [`domain="${escapeXml(domain)}"`] : []),
        ...styleAttrs,
    ];

    return `<graph ${attrs.join(" ")} />`;
}

function emitFunctionAsParametric({
    handle,
    styleAttrs,
    parsed,
    domain,
}: {
    handle: string;
    styleAttrs: string[];
    parsed: ParsedFormulaDefinition;
    domain: string;
}): string {
    const functionDefinition = `${handle}_r(${parsed.variableName})=(${parsed.expression},${parsed.variableName})`;
    const attrs = [
        `at="${escapeXml(handle)}"`,
        `function="${escapeXml(functionDefinition)}"`,
        `domain="${escapeXml(domain)}"`,
        ...styleAttrs,
    ];

    return `<parametric-curve ${attrs.join(" ")} />`;
}

function convertFunctionCurve({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const definition = curveDefinitionAtIndex(sv.fDefinitions, 0);
    const parsed = parseFormulaDefinition(definition, "x");
    if (!parsed) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: unsupported curve function definition type '${definitionTypeLabel(definition)}'; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    const domain = prefigureDomainFromStateValues({
        parMin: sv.parMin,
        parMax: sv.parMax,
    });

    if (sv.flipFunction) {
        if (!domain) {
            return null;
        }
        return emitFunctionAsParametric({
            handle,
            styleAttrs,
            parsed,
            domain,
        });
    }

    return emitFunctionGraph({
        handle,
        styleAttrs,
        parsed,
        domain,
    });
}

function convertParametricCurve({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const xDefinition = curveDefinitionAtIndex(sv.fDefinitions, 0);
    const yDefinition = curveDefinitionAtIndex(sv.fDefinitions, 1);
    const xFormula = parseFormulaDefinition(xDefinition, "t");
    const yFormula = parseFormulaDefinition(
        yDefinition,
        xFormula?.variableName || "t",
    );

    if (!xFormula || !yFormula) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: unsupported parametric curve function definition types ('${definitionTypeLabel(xDefinition)}', '${definitionTypeLabel(yDefinition)}'); descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    const domain = prefigureDomainFromStateValues({
        parMin: sv.parMin,
        parMax: sv.parMax,
    });
    if (!domain) {
        return null;
    }

    const functionDefinition = `${handle}_r(${xFormula.variableName})=(${xFormula.expression},${yFormula.expression})`;
    const attrs = [
        `at="${escapeXml(handle)}"`,
        `function="${escapeXml(functionDefinition)}"`,
        `domain="${escapeXml(domain)}"`,
        ...styleAttrs,
    ];

    return `<parametric-curve ${attrs.join(" ")} />`;
}

function pointsFromNumericalThroughPoints(
    numericalThroughPoints: unknown,
): string[] | null {
    if (!Array.isArray(numericalThroughPoints)) {
        return null;
    }

    const points = numericalThroughPoints
        .map((point) => formatPoint(point))
        .filter((point): point is string => point !== null);

    if (points.length < 2 || points.length !== numericalThroughPoints.length) {
        return null;
    }

    return points;
}

function convertBezierCurve({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const points = pointsFromNumericalThroughPoints(sv.numericalThroughPoints);
    if (!points) {
        return null;
    }

    const attrs = [
        `at="${escapeXml(handle)}"`,
        `points="${escapeXml(`(${points.join(",")})`)}"`,
        ...styleAttrs,
    ];

    if (sv.periodic) {
        attrs.push('closed="yes"');
    } else {
        const domain = prefigureDomainFromStateValues({
            parMin: sv.parMin,
            parMax: sv.parMax,
        });

        if (domain) {
            attrs.push(`domain="${escapeXml(domain)}"`);
        } else if (sv.extrapolateBackward || sv.extrapolateForward) {
            pushWarning({
                diagnostics,
                message: `${warningPrefix}: bezier extrapolation requested but parameter domain is non-finite; emitted spline without explicit domain.`,
                position: warningPosition,
            });
        }
    }

    return `<spline ${attrs.join(" ")} />`;
}

/**
 * Converts Doenet curve descendants into native PreFigure curve-family tags.
 */
export function convertCurveToPrefigure(args: ConverterArgs): string | null {
    const { sv } = args;

    warnCurveLabelOmitted({
        label: sv.label,
        labelHasLatex: sv.labelHasLatex,
        diagnostics: args.diagnostics,
        warningPrefix: args.warningPrefix,
        warningPosition: args.warningPosition,
    });

    if (sv.curveType === "function") {
        return convertFunctionCurve(args);
    }

    if (sv.curveType === "parameterization") {
        return convertParametricCurve(args);
    }

    if (sv.curveType === "bezier") {
        return convertBezierCurve(args);
    }

    return null;
}
