import me from "math-expressions";
import { find_effective_domains_piecewise_children } from "@doenet/utils";
import { escapeXml, formatPoint, pushWarning } from "../common";
import { labelMarkup } from "../label";
import type { ConverterArgs, CurveFunctionDefinition } from "../types";

interface ParsedFormulaDefinition {
    variableName: string;
    expression: string;
}

interface IntervalPiece {
    min: number;
    max: number;
    openMin: boolean;
    openMax: boolean;
}

interface ParsedFormulaPiece {
    parsed: ParsedFormulaDefinition;
    interval: IntervalPiece;
}

interface ParsedFormulaPiecesResult {
    sourceType: string;
    hasOpenEndpoints: boolean;
    pieces: ParsedFormulaPiece[];
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

function domainBoundsFromStateValues({
    parMin,
    parMax,
}: {
    parMin: unknown;
    parMax: unknown;
}): { min: number; max: number } | null {
    const min =
        parMin === -Infinity
            ? -Infinity
            : Number.isFinite(parMin)
              ? Number(parMin)
              : null;
    const max =
        parMax === Infinity
            ? Infinity
            : Number.isFinite(parMax)
              ? Number(parMax)
              : null;

    if (min === null || max === null || min > max) {
        return null;
    }

    return { min, max };
}

function intervalPiecesFromMathTree(tree: unknown): IntervalPiece[] {
    if (!Array.isArray(tree) || tree.length === 0) {
        return [];
    }

    const operator = tree[0];
    if (operator === "interval") {
        const endpoints = tree[1];
        const closedFlags = tree[2];
        if (
            !Array.isArray(endpoints) ||
            !Array.isArray(closedFlags) ||
            endpoints.length < 3 ||
            closedFlags.length < 3
        ) {
            return [];
        }

        const min = Number(endpoints[1]);
        const max = Number(endpoints[2]);
        const minClosed = Boolean(closedFlags[1]);
        const maxClosed = Boolean(closedFlags[2]);

        if (
            (!Number.isFinite(min) && min !== -Infinity) ||
            (!Number.isFinite(max) && max !== Infinity)
        ) {
            return [];
        }

        if (min > max || (min === max && (!minClosed || !maxClosed))) {
            return [];
        }

        return [
            {
                min,
                max,
                openMin: !minClosed,
                openMax: !maxClosed,
            },
        ];
    }

    if (operator === "set") {
        if (tree.length < 2) {
            return [];
        }
        const value = Number(tree[1]);
        if (!Number.isFinite(value)) {
            return [];
        }

        return [
            {
                min: value,
                max: value,
                openMin: false,
                openMax: false,
            },
        ];
    }

    if (operator === "union") {
        return tree
            .slice(1)
            .flatMap((piece) => intervalPiecesFromMathTree(piece));
    }

    return [];
}

function intersectIntervalWithBounds(
    interval: IntervalPiece,
    bounds: { min: number; max: number },
): IntervalPiece | null {
    const min = Math.max(interval.min, bounds.min);
    const max = Math.min(interval.max, bounds.max);

    if (min > max) {
        return null;
    }

    let openMin = interval.openMin;
    if (min === bounds.min && interval.min < bounds.min) {
        openMin = false;
    }

    let openMax = interval.openMax;
    if (max === bounds.max && interval.max > bounds.max) {
        openMax = false;
    }

    if (min === max && (openMin || openMax)) {
        return null;
    }

    return {
        min,
        max,
        openMin,
        openMax,
    };
}

function domainFromIntervalPiece(interval: IntervalPiece): string {
    const min = formatDomainBound(interval.min) ?? "-inf";
    const max = formatDomainBound(interval.max) ?? "inf";
    return `(${min},${max})`;
}

function intersectIntervals(
    interval1: IntervalPiece,
    interval2: IntervalPiece,
): IntervalPiece | null {
    const min = Math.max(interval1.min, interval2.min);
    const max = Math.min(interval1.max, interval2.max);

    if (min > max) {
        return null;
    }

    let openMin: boolean;
    if (interval1.min > interval2.min) {
        openMin = interval1.openMin;
    } else if (interval1.min < interval2.min) {
        openMin = interval2.openMin;
    } else {
        openMin = interval1.openMin || interval2.openMin;
    }

    let openMax: boolean;
    if (interval1.max < interval2.max) {
        openMax = interval1.openMax;
    } else if (interval1.max > interval2.max) {
        openMax = interval2.openMax;
    } else {
        openMax = interval1.openMax || interval2.openMax;
    }

    if (min === max && (openMin || openMax)) {
        return null;
    }

    return {
        min,
        max,
        openMin,
        openMax,
    };
}

function parsedFormulaPiecesFromDefinition({
    definition,
    fallbackVariableName,
    curveBounds,
    diagnostics,
    warningPrefix,
    warningPosition,
    pieceRole,
}: {
    definition: CurveFunctionDefinition | null;
    fallbackVariableName: string;
    curveBounds: { min: number; max: number };
    diagnostics: ConverterArgs["diagnostics"];
    warningPrefix: string;
    warningPosition?: ConverterArgs["warningPosition"];
    pieceRole: string;
}): ParsedFormulaPiecesResult | null {
    if (!definition) {
        return null;
    }

    if (definition.functionType === "formula") {
        const parsed = parseFormulaDefinition(definition, fallbackVariableName);
        if (!parsed) {
            return null;
        }

        return {
            sourceType: "formula",
            hasOpenEndpoints: false,
            pieces: [
                {
                    parsed,
                    interval: {
                        min: curveBounds.min,
                        max: curveBounds.max,
                        openMin: false,
                        openMax: false,
                    },
                },
            ],
        };
    }

    if (definition.functionType !== "piecewise") {
        return null;
    }

    const childDefinitions = Array.isArray(definition.fDefinitionsOfChildren)
        ? definition.fDefinitionsOfChildren
        : null;
    const numericalDomainsOfChildren = Array.isArray(
        definition.numericalDomainsOfChildren,
    )
        ? definition.numericalDomainsOfChildren
        : null;

    if (!childDefinitions || !numericalDomainsOfChildren) {
        return null;
    }

    const effectiveDomains = find_effective_domains_piecewise_children({
        domain: definition.domain,
        numericalDomainsOfChildren,
    });

    const pieces: ParsedFormulaPiece[] = [];
    let hasOpenEndpoints = false;

    for (let i = 0; i < childDefinitions.length; i += 1) {
        const childDefinition = childDefinitions[i] as CurveFunctionDefinition;
        const parsed = parseFormulaDefinition(
            childDefinition,
            fallbackVariableName,
        );
        if (!parsed) {
            pushWarning({
                diagnostics,
                message: `${warningPrefix}: ${pieceRole} piecewise child ${i + 1} has unsupported function definition type '${definitionTypeLabel(childDefinition)}'; child skipped.`,
                position: warningPosition,
            });
            continue;
        }

        const domainTree =
            effectiveDomains?.[i]?.toMathExpression?.()?.tree ?? null;

        for (const interval of intervalPiecesFromMathTree(domainTree)) {
            const clipped = intersectIntervalWithBounds(interval, curveBounds);
            if (!clipped) {
                continue;
            }

            if (clipped.openMin || clipped.openMax) {
                hasOpenEndpoints = true;
            }

            pieces.push({ parsed, interval: clipped });
        }
    }

    return {
        sourceType: "piecewise",
        hasOpenEndpoints,
        pieces,
    };
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

    const curveBounds = domainBoundsFromStateValues({
        parMin: sv.parMin,
        parMax: sv.parMax,
    });
    if (!curveBounds) {
        return null;
    }

    const result = parsedFormulaPiecesFromDefinition({
        definition,
        fallbackVariableName: "x",
        curveBounds,
        diagnostics,
        warningPrefix,
        warningPosition,
        pieceRole: "function",
    });

    if (!result || result.pieces.length === 0) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: unsupported curve function definition type '${definitionTypeLabel(definition)}'; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    if (result.sourceType === "piecewise" && result.hasOpenEndpoints) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: piecewise open/closed endpoint semantics are approximated in prefigure output.`,
            position: warningPosition,
        });
    }

    if (sv.flipFunction) {
        return result.pieces
            .map(({ parsed, interval }, i) =>
                emitFunctionAsParametric({
                    handle: i === 0 ? handle : `${handle}_${i}`,
                    styleAttrs,
                    parsed,
                    domain: domainFromIntervalPiece(interval),
                }),
            )
            .join("");
    }

    return result.pieces
        .map(({ parsed, interval }, i) =>
            emitFunctionGraph({
                handle: i === 0 ? handle : `${handle}_${i}`,
                styleAttrs,
                parsed,
                domain: domainFromIntervalPiece(interval),
            }),
        )
        .join("");
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

    const curveBounds = domainBoundsFromStateValues({
        parMin: sv.parMin,
        parMax: sv.parMax,
    });
    if (!curveBounds) {
        return null;
    }

    const xPiecesResult = parsedFormulaPiecesFromDefinition({
        definition: xDefinition,
        fallbackVariableName: "t",
        curveBounds,
        diagnostics,
        warningPrefix,
        warningPosition,
        pieceRole: "x",
    });
    const yPiecesResult = parsedFormulaPiecesFromDefinition({
        definition: yDefinition,
        fallbackVariableName:
            xPiecesResult?.pieces?.[0]?.parsed.variableName ?? "t",
        curveBounds,
        diagnostics,
        warningPrefix,
        warningPosition,
        pieceRole: "y",
    });

    if (
        !xPiecesResult ||
        !yPiecesResult ||
        xPiecesResult.pieces.length === 0 ||
        yPiecesResult.pieces.length === 0
    ) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: unsupported parametric curve function definition types ('${definitionTypeLabel(xDefinition)}', '${definitionTypeLabel(yDefinition)}'); descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    if (xPiecesResult.hasOpenEndpoints || yPiecesResult.hasOpenEndpoints) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: piecewise open/closed endpoint semantics are approximated in prefigure output.`,
            position: warningPosition,
        });
    }

    const pieceXml: string[] = [];
    let pieceCounter = 0;

    for (const xPiece of xPiecesResult.pieces) {
        for (const yPiece of yPiecesResult.pieces) {
            const overlap = intersectIntervals(
                xPiece.interval,
                yPiece.interval,
            );
            if (!overlap) {
                continue;
            }

            const pieceHandle =
                pieceCounter === 0 ? handle : `${handle}_${pieceCounter}`;
            const functionDefinition = `${pieceHandle}_r(${xPiece.parsed.variableName})=(${xPiece.parsed.expression},${yPiece.parsed.expression})`;
            const attrs = [
                `at="${escapeXml(pieceHandle)}"`,
                `function="${escapeXml(functionDefinition)}"`,
                `domain="${escapeXml(domainFromIntervalPiece(overlap))}"`,
                ...styleAttrs,
            ];

            pieceXml.push(`<parametric-curve ${attrs.join(" ")} />`);
            pieceCounter += 1;
        }
    }

    if (pieceXml.length === 0) {
        return null;
    }

    return pieceXml.join("");
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
