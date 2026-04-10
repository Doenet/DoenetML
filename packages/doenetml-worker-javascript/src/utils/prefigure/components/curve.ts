import me from "math-expressions";
import { find_effective_domains_piecewise_children } from "@doenet/utils";
import { escapeXml, pushWarning } from "../common";
import { labelMarkup } from "../label";
import type { ConverterArgs, CurveFunctionDefinition } from "../types";

/** A parsed formula with its variable and expression in string form. */
interface ParsedFormulaDefinition {
    variableName: string;
    expression: string;
}

/** An interval with explicit open/closed endpoint flags. */
interface IntervalPiece {
    min: number;
    max: number;
    openMin: boolean;
    openMax: boolean;
}

/** A single piece of a piecewise function: the parsed formula and its valid interval. */
interface ParsedFormulaPiece {
    parsed: ParsedFormulaDefinition;
    interval: IntervalPiece;
}

/** Result of parsing a function definition into pieces. */
interface ParsedFormulaPiecesResult {
    sourceType: string;
    hasOpenEndpoints: boolean;
    pieces: ParsedFormulaPiece[];
}

/**
 * Get the label string (if any) for a curve definition type.
 * Returns a string representation of the functionType field.
 *
 * @param definition - The function definition (may be null)
 * @returns Type label string (e.g., "formula", "piecewise") or "unknown"
 */
function definitionTypeLabel(
    definition: CurveFunctionDefinition | null,
): string {
    if (!definition || definition.functionType === undefined) {
        return "unknown";
    }
    return `${definition.functionType}`;
}

/**
 * Generate a unique handle for a curve piece in the PreFigure output.
 * The first piece (index 0) uses the base handle as-is; subsequent pieces
 * append an underscore and index number to ensure uniqueness.
 *
 * @param baseHandle - The base identifier for the curve element
 * @param index - The piece index (0 for first, 1 for second, etc.)
 * @returns The formatted handle string
 */
function makePieceHandle(baseHandle: string, index: number): string {
    return index === 0 ? baseHandle : `${baseHandle}_${index}`;
}

/**
 * Extract a function definition at a given index from the fDefinitions object.
 * Handles both array-based and object-based storage formats for definitions,
 * accommodating the flexible internal representation of curve function data.
 *
 * @param fDefinitions - The function definitions (may be array, object, or single definition)
 * @param index - The index to retrieve
 * @returns The definition at the index, or null if not found or invalid
 */
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

/**
 * Convert a math-expressions AST to a string representation.
 * Safely handles invalid ASTs by catching exceptions.
 *
 * @param ast - The abstract syntax tree from math-expressions
 * @returns String representation of the expression, or null if conversion fails
 */
function astToExpressionString(ast: unknown): string | null {
    try {
        return me.fromAst(ast as any).toString();
    } catch (_e) {
        return null;
    }
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Rewrite the variable symbol used in an expression string.
 *
 * This is used for parametric curves where x and y definitions may be authored
 * with different variable names (for example, u and v), while PreFigure expects
 * a single parameter in the emitted function signature.
 */
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

/**
 * Parse a simple formula-based curve function definition.
 * Extracts the expression and variable name; returns null if definition
 * is not a formula type or expression conversion fails.
 *
 * @param definition - The curve function definition
 * @param fallbackVariableName - Variable name to use if not specified (e.g., "x" or "t")
 * @returns Parsed definition with variable and expression, or null
 */
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

/**
 * Extract a domain interval from a curve function definition's domain property.
 * Parses various domain formats (tree, array-based endpoints, etc.).
 * Returns the first component of compound domains (intervals, sets, unions).
 *
 * @param domain - The domain property from a function definition
 * @returns Parsed interval with open/closed flags, or null if invalid
 */
function intervalFromCurveDefinitionDomain(
    domain: unknown,
): IntervalPiece | null {
    if (!Array.isArray(domain) || domain.length === 0) {
        return null;
    }

    const firstDomain = domain[0] as any;

    if (firstDomain?.tree !== undefined) {
        const pieces = intervalPiecesFromMathTree(firstDomain.tree);
        return pieces[0] ?? null;
    }

    if (
        Array.isArray(firstDomain) &&
        firstDomain.length >= 2 &&
        Array.isArray(firstDomain[0]) &&
        Array.isArray(firstDomain[1])
    ) {
        const endpoints = firstDomain[0];
        const closedFlags = firstDomain[1];

        const min = Number(endpoints[0]);
        const max = Number(endpoints[1]);
        if (
            (!Number.isFinite(min) && min !== -Infinity) ||
            (!Number.isFinite(max) && max !== Infinity)
        ) {
            return null;
        }
        if (min > max) {
            return null;
        }

        return {
            min,
            max,
            openMin: !Boolean(closedFlags[0]),
            openMax: !Boolean(closedFlags[1]),
        };
    }

    return null;
}

/**
 * Parse interpolated cubic spline pieces from a function definition.
 * Decodes the coefficients array (cubic polynomial pieces) and extrapolation,
 * then clips all pieces to specified curve bounds.
 *
 * @param params - Object containing definition, variable name, and bounds
 * @returns Parsed pieces with interpolated cubic expressions, or null if invalid
 */
function parsedInterpolatedDefinitionPieces({
    definition,
    fallbackVariableName,
    curveBounds,
}: {
    definition: CurveFunctionDefinition;
    fallbackVariableName: string;
    curveBounds: { min: number; max: number };
}): ParsedFormulaPiecesResult | null {
    const xs = Array.isArray(definition.xs)
        ? definition.xs.map((x) => Number(x))
        : null;
    const coeffs = Array.isArray(definition.coeffs) ? definition.coeffs : null;

    if (
        !xs ||
        !coeffs ||
        xs.length < 2 ||
        coeffs.length < 1 ||
        coeffs.length !== xs.length - 1 ||
        xs.some((x) => !Number.isFinite(x)) ||
        coeffs.some(
            (c) =>
                !Array.isArray(c) ||
                c.length < 4 ||
                c.slice(0, 4).some((v) => !Number.isFinite(v)),
        )
    ) {
        return null;
    }

    const parsedVariable = Array.isArray(definition.variables)
        ? astToExpressionString(definition.variables[0])
        : null;
    const variableName = parsedVariable || fallbackVariableName;

    const domainInterval = intervalFromCurveDefinitionDomain(
        definition.domain,
    ) ?? {
        min: -Infinity,
        max: Infinity,
        openMin: false,
        openMax: false,
    };

    const makeExpression = (coeff: number[], baseX: number): string => {
        const shiftedVar = `(${variableName}-(${baseX}))`;
        return `(${coeff[0]}+(${coeff[1]})*${shiftedVar}+(${coeff[2]})*${shiftedVar}^2+(${coeff[3]})*${shiftedVar}^3)`;
    };

    const rawPieces: ParsedFormulaPiece[] = [];

    // Left extrapolation: x <= xs[0]
    rawPieces.push({
        parsed: {
            variableName,
            expression: makeExpression(coeffs[0], xs[0]),
        },
        interval: {
            min: -Infinity,
            max: xs[0],
            openMin: true,
            openMax: false,
        },
    });

    // Interior interpolation segments.
    for (let i = 0; i < coeffs.length; i += 1) {
        rawPieces.push({
            parsed: {
                variableName,
                expression: makeExpression(coeffs[i], xs[i]),
            },
            interval: {
                min: xs[i],
                max: xs[i + 1],
                openMin: false,
                openMax: false,
            },
        });
    }

    // Right extrapolation: x >= xs[last]
    rawPieces.push({
        parsed: {
            variableName,
            expression: makeExpression(
                coeffs[coeffs.length - 1],
                xs[xs.length - 2],
            ),
        },
        interval: {
            min: xs[xs.length - 1],
            max: Infinity,
            openMin: false,
            openMax: true,
        },
    });

    const pieces: ParsedFormulaPiece[] = [];
    let hasOpenEndpoints = false;

    for (const piece of rawPieces) {
        const withDefinitionDomain = intersectIntervals(
            piece.interval,
            domainInterval,
        );
        if (!withDefinitionDomain) {
            continue;
        }

        const clipped = intersectIntervalWithBounds(
            withDefinitionDomain,
            curveBounds,
        );
        if (!clipped) {
            continue;
        }

        if (clipped.openMin || clipped.openMax) {
            hasOpenEndpoints = true;
        }

        pieces.push({
            parsed: piece.parsed,
            interval: clipped,
        });
    }

    return {
        sourceType: "interpolated",
        hasOpenEndpoints,
        pieces,
    };
}

/**
 * Parse bezier curve definitions into explicit cubic pieces in the curve
 * parameter. This mirrors Doenet's bezier evaluator: each segment is a cubic
 * in local parameter (t-i), with optional quadratic extrapolation on each end.
 */
function parsedBezierDefinitionPieces({
    definition,
    fallbackVariableName,
    curveBounds,
}: {
    definition: CurveFunctionDefinition;
    fallbackVariableName: string;
    curveBounds: { min: number; max: number };
}): ParsedFormulaPiecesResult | null {
    const parsedVariable = Array.isArray(definition.variables)
        ? astToExpressionString(definition.variables[0])
        : null;
    const variableName = parsedVariable || fallbackVariableName;

    const numThroughPoints = Number(definition.numThroughPoints);
    if (!Number.isInteger(numThroughPoints) || numThroughPoints < 1) {
        return null;
    }

    const segmentCount = numThroughPoints - 1;
    const component = Number.isInteger(definition.component)
        ? Number(definition.component)
        : 0;

    const rawSplineCoeffs = Array.isArray(definition.splineCoeffs)
        ? definition.splineCoeffs
        : null;
    if (!rawSplineCoeffs || rawSplineCoeffs.length !== segmentCount) {
        return null;
    }

    const splineCoeffs = rawSplineCoeffs.map((segment) => {
        if (!Array.isArray(segment) || !Array.isArray(segment[component])) {
            return null;
        }
        const coeffs = segment[component]
            .slice(0, 4)
            .map((v: unknown) => Number(v));
        if (coeffs.length < 4 || coeffs.some((v) => !Number.isFinite(v))) {
            return null;
        }
        return coeffs;
    });

    if (splineCoeffs.some((x) => x === null)) {
        return null;
    }

    const forwardExtrapolation = Boolean(definition.extrapolateForward);
    const backwardExtrapolation = Boolean(definition.extrapolateBackward);

    const getExtrapolationCoeffs = (
        coeffsByComponent: unknown,
    ): number[] | null => {
        if (!Array.isArray(coeffsByComponent)) {
            return null;
        }
        const componentCoeffs = coeffsByComponent[component];
        if (!Array.isArray(componentCoeffs)) {
            return null;
        }
        const coeffs = componentCoeffs
            .slice(0, 3)
            .map((v: unknown) => Number(v));
        if (coeffs.length < 3 || coeffs.some((v) => !Number.isFinite(v))) {
            return null;
        }
        return coeffs;
    };

    const backwardCoeffs = backwardExtrapolation
        ? getExtrapolationCoeffs(definition.extrapolateBackwardCoeffs)
        : null;
    if (backwardExtrapolation && !backwardCoeffs) {
        return null;
    }

    const forwardCoeffs = forwardExtrapolation
        ? getExtrapolationCoeffs(definition.extrapolateForwardCoeffs)
        : null;
    if (forwardExtrapolation && !forwardCoeffs) {
        return null;
    }

    const rawPieces: ParsedFormulaPiece[] = [];

    if (backwardCoeffs) {
        rawPieces.push({
            parsed: {
                variableName,
                expression: `(${backwardCoeffs[0]}+(${backwardCoeffs[1]})*(${variableName})+(${backwardCoeffs[2]})*(${variableName})^2)`,
            },
            interval: {
                min: -Infinity,
                max: 0,
                openMin: true,
                openMax: false,
            },
        });
    }

    for (let i = 0; i < segmentCount; i += 1) {
        const coeffs = splineCoeffs[i] as number[];
        const shiftedVar = `(${variableName}-(${i}))`;
        rawPieces.push({
            parsed: {
                variableName,
                expression: `(${coeffs[0]}+(${coeffs[1]})*${shiftedVar}+(${coeffs[2]})*${shiftedVar}^2+(${coeffs[3]})*${shiftedVar}^3)`,
            },
            interval: {
                min: i,
                max: i + 1,
                openMin: false,
                openMax: false,
            },
        });
    }

    if (forwardCoeffs) {
        const len = segmentCount;
        const shiftedVar = `(${variableName}-(${len}))`;
        rawPieces.push({
            parsed: {
                variableName,
                expression: `(${forwardCoeffs[0]}+(${forwardCoeffs[1]})*${shiftedVar}+(${forwardCoeffs[2]})*${shiftedVar}^2)`,
            },
            interval: {
                min: len,
                max: Infinity,
                openMin: false,
                openMax: true,
            },
        });
    }

    const pieces: ParsedFormulaPiece[] = [];
    let hasOpenEndpoints = false;

    for (const piece of rawPieces) {
        const clipped = intersectIntervalWithBounds(
            piece.interval,
            curveBounds,
        );
        if (!clipped) {
            continue;
        }

        if (clipped.openMin || clipped.openMax) {
            hasOpenEndpoints = true;
        }

        pieces.push({
            parsed: piece.parsed,
            interval: clipped,
        });
    }

    return {
        sourceType: "bezier",
        hasOpenEndpoints,
        pieces,
    };
}

/**
 * Format a domain bound value for PreFigure output.
 * Converts JavaScript infinities to "inf"/"-inf" strings and finite numbers
 * to their string representation. Non-numeric or NaN values return null.
 *
 * @param value - The boundary value to format (number, Infinity, etc.)
 * @returns Formatted string ("inf", "-inf", number string) or null if invalid
 */
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

/**
 * Extract and validate a numeric boundary value from curve state.
 * Handles infinity and finite values; returns null for non-numeric inputs.
 * Used to normalize parMin/parMax properties into validated numbers.
 *
 * @param value - The state value (may be unknown type)
 * @param defaultInf - Default infinity value (unused, for semantic clarity)
 * @returns Numeric bound (including infinities) or null if invalid
 */
function numericBoundFromStateValue(
    value: unknown,
    defaultInf: number,
): number | null {
    if (value === -Infinity || value === Infinity) {
        return value as number;
    }
    return Number.isFinite(value) ? Number(value) : null;
}

/**
 * Validate and extract numeric curve bounds from Doenet state values.
 * Ensures parMin and parMax are valid numbers (including infinities)
 * and that min ≤ max.
 *
 * @param params - Object with parMin and parMax
 * @returns Object with numeric min/max fields, or null if validation fails
 */
function domainBoundsFromStateValues({
    parMin,
    parMax,
}: {
    parMin: unknown;
    parMax: unknown;
}): { min: number; max: number } | null {
    const min = numericBoundFromStateValue(parMin, -Infinity);
    const max = numericBoundFromStateValue(parMax, Infinity);

    if (min === null || max === null || min > max) {
        return null;
    }

    return { min, max };
}

/**
 * Parse interval definitions from a math-expressions tree structure.
 * Supports interval notation (e.g., [-2, 2)), single-point sets, and unions
 * of intervals. Returns an array of normalized interval pieces.
 *
 * @param tree - The math-expressions tree (operator + operands array)
 * @returns Array of parsed interval pieces (empty if tree is invalid/empty)
 */
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

/**
 * Determine which interval's open/closed endpoint flags should be used for
 * the result of an interval intersection operation.
 *
 * When two intervals are intersected, the resulting endpoints may come from
 * either interval depending on which bounds the result. This function applies
 * the logical rules: if an endpoint moves from one interval, it becomes closed;
 * if both intervals share the same endpoint, the result inherits the combined
 * openness (open if either is open).
 *
 * @param interval1 - First interval with endpoint flags
 * @param interval2 - Second interval with endpoint flags
 * @param resultMin - The minimum endpoint of the intersection result
 * @param resultMax - The maximum endpoint of the intersection result
 * @returns Object with computed openMin and openMax flags
 */
function computeOpenEndpoints(
    interval1: { min: number; max: number; openMin: boolean; openMax: boolean },
    interval2: { min: number; max: number; openMin: boolean; openMax: boolean },
    resultMin: number,
    resultMax: number,
): { openMin: boolean; openMax: boolean } {
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

    return { openMin, openMax };
}

/**
 * Clip an interval to fit within specified bounds.
 * Preserves open/closed endpoint semantics: endpoints moving due to bounds
 * become closed; others retain their original openness.
 *
 * @param interval - The interval to clip
 * @param bounds - The bounding box (closed on both sides)
 * @returns Clipped interval, or null if the result is empty
 */
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

/**
 * Convert an interval piece to a PreFigure domain string format.
 * Output format: "(min,max)" with "inf" and "-inf" for infinities.
 *
 * @param interval - The interval to format
 * @returns PreFigure domain string (e.g., "(-2,3)" or "(-inf,inf)")
 */
function domainFromIntervalPiece(interval: IntervalPiece): string {
    const min = formatDomainBound(interval.min) ?? "-inf";
    const max = formatDomainBound(interval.max) ?? "inf";
    return `(${min},${max})`;
}

/**
 * Find the intersection of two intervals, preserving open/closed semantics.
 * When both intervals share an endpoint, that endpoint inherits both openness
 * flags (open if either is open). Otherwise, the endpoint's openness comes
 * from whichever interval contributed that boundary.
 *
 * @param interval1 - First interval
 * @param interval2 - Second interval
 * @returns The intersection interval, or null if empty or invalid
 */
function intersectIntervals(
    interval1: IntervalPiece,
    interval2: IntervalPiece,
): IntervalPiece | null {
    const min = Math.max(interval1.min, interval2.min);
    const max = Math.min(interval1.max, interval2.max);

    if (min > max) {
        return null;
    }

    const { openMin, openMax } = computeOpenEndpoints(
        interval1,
        interval2,
        min,
        max,
    );

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

/**
 * Recursively parse formula pieces from a function definition.
 * Handles formulas, interpolated functions, and piecewise definitions.
 * For piecewise definitions, recursively processes children and intersects
 * their intervals with effective domains computed from the parent.
 *
 * @param params - Object containing:
 *   - definition: The function definition to parse
 *   - fallbackVariableName: Default variable name ("x", "t", etc.)
 *   - curveBounds: Valid parameter bounds for clipping results
 *   - diagnostics: Warning collector
 *   - warningPrefix: Prefix for diagnostic messages
 *   - warningPosition: Source position for diagnostics
 *   - pieceRole: Role descriptor for nested errors (e.g., "x component")
 * @returns Parsed pieces with open endpoint tracking, or null if definition is invalid
 */
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

    if (definition.functionType === "interpolated") {
        return parsedInterpolatedDefinitionPieces({
            definition,
            fallbackVariableName,
            curveBounds,
        });
    }

    if (definition.functionType === "bezier") {
        return parsedBezierDefinitionPieces({
            definition,
            fallbackVariableName,
            curveBounds,
        });
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
        const childPiecesResult = parsedFormulaPiecesFromDefinition({
            definition: childDefinition,
            fallbackVariableName,
            curveBounds,
            diagnostics,
            warningPrefix,
            warningPosition,
            pieceRole: `${pieceRole} piecewise child`,
        });

        if (!childPiecesResult || childPiecesResult.pieces.length === 0) {
            pushWarning({
                diagnostics,
                message: `${warningPrefix}: ${pieceRole} piecewise child ${i + 1} has unsupported function definition type '${definitionTypeLabel(childDefinition)}'; child skipped.`,
                position: warningPosition,
            });
            continue;
        }

        if (childPiecesResult.hasOpenEndpoints) {
            hasOpenEndpoints = true;
        }

        const domainTree =
            effectiveDomains?.[i]?.toMathExpression?.()?.tree ?? null;

        for (const interval of intervalPiecesFromMathTree(domainTree)) {
            const effectiveInterval = intersectIntervalWithBounds(
                interval,
                curveBounds,
            );
            if (!effectiveInterval) {
                continue;
            }

            if (effectiveInterval.openMin || effectiveInterval.openMax) {
                hasOpenEndpoints = true;
            }

            for (const childPiece of childPiecesResult.pieces) {
                const overlap = intersectIntervals(
                    childPiece.interval,
                    effectiveInterval,
                );
                if (!overlap) {
                    continue;
                }
                if (overlap.openMin || overlap.openMax) {
                    hasOpenEndpoints = true;
                }
                pieces.push({
                    parsed: childPiece.parsed,
                    interval: overlap,
                });
            }
        }
    }

    return {
        sourceType: "piecewise",
        hasOpenEndpoints,
        pieces,
    };
}

/**
 * Emit a diagnostic warning that curve labels are not supported in PreFigure.
 * Only warns if the curve actually has a label defined.
 *
 * @param params - Object containing label/labelHasLatex, diagnostics, and position
 */
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

/**
 * Validate that a parsed formula pieces result has content.
 * Emits a warning diagnostic if the result is missing or empty.
 * Used to consolidate validation logic across multiple converter functions.
 *
 * @param result - The pieces result to validate
 * @param diagnostics - Diagnostic collector for warning messages
 * @param warningPrefix - Prefix for warning messages (e.g., curve handle)
 * @param warningPosition - Source position for LSP diagnostics
 * @param definitionTypeLabel - Label for the definition type in error messages
 * @returns True if result is valid and non-empty; false otherwise
 */
function validatePiecesResult(
    result: ParsedFormulaPiecesResult | null,
    diagnostics: ConverterArgs["diagnostics"],
    warningPrefix: string,
    warningPosition: ConverterArgs["warningPosition"],
    definitionTypeLabel: string,
): boolean {
    if (!result || result.pieces.length === 0) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: unsupported curve function definition type '${definitionTypeLabel}'; descendant skipped.`,
            position: warningPosition,
        });
        return false;
    }
    return true;
}

/**
 * Generate a PreFigure XML element for a curve piece.
 * Unifies emission of both <graph> (Cartesian) and <parametric-curve> elements
 * by abstracting the tag type and function definition format.
 *
 * @param params - Object containing:
 *   - handle: Unique identifier for this curve piece
 *   - styleAttrs: Array of style attribute strings (stroke, thickness, etc.)
 *   - parsed: Variable name and expression definition
 *   - domain: Optional domain string; omitted for parametric curves
 *   - isParametric: True for parametric curves, false for Cartesian functions
 * @returns Complete XML element string (self-closing)
 */
function emitCurveElement({
    handle,
    styleAttrs,
    parsed,
    domain,
    isParametric,
}: {
    handle: string;
    styleAttrs: string[];
    parsed: ParsedFormulaDefinition;
    domain: string | null;
    isParametric: boolean;
}): string {
    const tagName = isParametric ? "parametric-curve" : "graph";
    const prefix = isParametric ? "r" : "f";
    const functionDefinition = isParametric
        ? `${handle}_${prefix}(${parsed.variableName})=(${parsed.expression},${parsed.variableName})`
        : `${handle}_${prefix}(${parsed.variableName})=${parsed.expression}`;

    const attrs = [
        `at="${escapeXml(handle)}"`,
        `function="${escapeXml(functionDefinition)}"`,
        ...(domain ? [`domain="${escapeXml(domain)}"`] : []),
        ...styleAttrs,
    ];

    return `<${tagName} ${attrs.join(" ")} />`;
}

/**
 * Convert a Doenet function curve to PreFigure <graph> or <parametric-curve>.
 * Handles formula, interpolated, and piecewise function definitions.
 * Optionally flips the function (swaps x and y) for inverted rendering.
 *
 * @param args - Standard converter arguments
 * @returns PreFigure XML element(s) or null if conversion fails
 */
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

    if (
        !validatePiecesResult(
            result,
            diagnostics,
            warningPrefix,
            warningPosition,
            definitionTypeLabel(definition),
        )
    ) {
        return null;
    }

    // After validation check, result is guaranteed to be non-null
    const validResult = result as ParsedFormulaPiecesResult;

    return validResult.pieces
        .map(({ parsed, interval }, i) =>
            emitCurveElement({
                handle: makePieceHandle(handle, i),
                styleAttrs,
                parsed,
                domain: domainFromIntervalPiece(interval),
                isParametric: Boolean(sv.flipFunction),
            }),
        )
        .join("");
}

/**
 * Convert a Doenet parameterized (2D parametric) curve to PreFigure.
 * Processes two function definitions (x and y) as separate dimensions.
 * Generates one <parametric-curve> element for each distinct piece region
 * where both x and y have valid definitions.
 *
 * @param args - Standard converter arguments
 * @returns PreFigure XML element(s) or null if conversion fails
 */
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
        !validatePiecesResult(
            xPiecesResult,
            diagnostics,
            warningPrefix,
            warningPosition,
            `${definitionTypeLabel(xDefinition)}, ${definitionTypeLabel(yDefinition)}`,
        ) ||
        !validatePiecesResult(
            yPiecesResult,
            diagnostics,
            warningPrefix,
            warningPosition,
            `${definitionTypeLabel(xDefinition)}, ${definitionTypeLabel(yDefinition)}`,
        )
    ) {
        return null;
    }

    // After validation checks, results are guaranteed to be non-null
    const validXPiecesResult = xPiecesResult as ParsedFormulaPiecesResult;
    const validYPiecesResult = yPiecesResult as ParsedFormulaPiecesResult;

    const pieceXml: string[] = [];
    let pieceCounter = 0;

    for (const xPiece of validXPiecesResult.pieces) {
        for (const yPiece of validYPiecesResult.pieces) {
            const overlap = intersectIntervals(
                xPiece.interval,
                yPiece.interval,
            );
            if (!overlap) {
                continue;
            }

            if (overlap.min === overlap.max) {
                continue;
            }

            const pieceHandle = makePieceHandle(handle, pieceCounter);
            const parameterVariable = xPiece.parsed.variableName;
            const xExpression = rewriteExpressionVariable({
                expression: xPiece.parsed.expression,
                fromVariable: xPiece.parsed.variableName,
                toVariable: parameterVariable,
            });
            const yExpression = rewriteExpressionVariable({
                expression: yPiece.parsed.expression,
                fromVariable: yPiece.parsed.variableName,
                toVariable: parameterVariable,
            });
            const functionDefinition = `${pieceHandle}_r(${parameterVariable})=(${xExpression},${yExpression})`;
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

/**
 * Convert a Doenet Bezier curve using the same explicit parametric function
 * definitions used by the Doenet renderer. This yields cubic piece geometry
 * parity with Doenet rather than relying on a renderer-side spline fit.
 *
 * @param args - Standard converter arguments
 * @returns PreFigure <parametric-curve> element(s) or null if conversion fails
 */
function convertBezierCurve(args: ConverterArgs): string | null {
    return convertParametricCurve(args);
}

/**
 * Converts Doenet curve descendants into native PreFigure curve-family tags.
 *
 * Routes curve conversion based on curve type:
 * - "function" → <graph> or <parametric-curve> (if flipped)
 * - "parameterization" → <parametric-curve> (2D parametric)
 * - "bezier" → <parametric-curve> piece(s) from explicit cubic definitions
 *
 * Also handles warnings for unsupported labels and diagnostics for incomplete
 * geometry (non-finite domains, invalid data).
 *
 * @param args - Converter arguments containing state values, diagnostics, etc.
 * @returns PreFigure XML element(s) or null if the curve cannot be converted
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
