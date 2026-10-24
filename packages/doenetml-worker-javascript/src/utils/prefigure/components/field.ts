import me from "math-expressions";
import {
    fieldFunctionFromDefinition,
    find_effective_domain,
    thinnedLatticeLines,
    vectorOperators,
} from "@doenet/utils";
import { asFiniteNumber, emptyGroup, escapeXml, pushWarning } from "../common";
import { snapNumber } from "../chart/scale";
import { wholePixelThickness, wholePixelThicknessAttributes } from "../style";
import {
    astToPythonExpression,
    astToVariableName,
    rewriteExpressionVariables,
} from "../formulaUtils";
import { firstRaisingLatticePoint } from "../pythonRaise";
import { SLOPE_FIELD_DEFAULT_MARK_LENGTH } from "../../field";
import type {
    ConverterArgs,
    ConverterWarningContext,
    CurveFunctionDefinition,
    PrefigureStateValues,
} from "../types";

/**
 * Converters for `<slopeField>` and `<vectorField>`, drawn as PreFigure's own
 * `<slope-field>` and `<vector-field>` so that the field is one element an
 * author's `<annotations>` can describe.
 *
 * Both take a named function from a sibling `<definition>` and a `spacings`
 * attribute giving the lattice as `((x0, dx, x1), (y0, dy, y1))`. The lattice
 * is the one the JSXGraph renderer draws at the graph's bounds — the same
 * `dx`, `dy`, offsets and `maxMarks` coarsening (`thinnedLatticeLines`) —
 * narrowed to the function's domain, outside which the JSXGraph renderer
 * draws nothing either.
 *
 * What PreFigure cannot express is warned about rather than approximated
 * silently: a slope field's `markLength` (PreFigure sizes a slope mark from the
 * spacing), a vector field's `normalize` on unequally scaled axes (PreFigure
 * normalizes in graph units, not pixels), and a dashed or dotted `lineStyle`
 * (PreFigure passes only `stroke` and `thickness` on to the marks).
 */

/** The style attributes PreFigure copies onto each mark of a field. */
const FIELD_STYLE_ATTRIBUTE_NAMES = new Set(["stroke", "thickness"]);

interface DomainInterval {
    minx: number;
    maxx: number;
    openMin: boolean;
    openMax: boolean;
}

/**
 * The domain of each of the definition's `numInputs` inputs, read exactly as
 * `returnNumericalFunctionFromFormula` reads it, so that the lattice points
 * kept here are the ones at which the JSXGraph renderer's function is defined.
 */
function domainIntervals(
    definition: CurveFunctionDefinition,
    numInputs: number,
): DomainInterval[] {
    const domain = Array.isArray(definition.domain) ? definition.domain : [];
    return Array.from({ length: numInputs }, (_, i) =>
        find_effective_domain({
            domain: domain[i] ? [me.fromAst(domain[i])] : null,
        }),
    );
}

function inInterval(x: number, interval: DomainInterval): boolean {
    return !(
        !(x >= interval.minx) ||
        !(x <= interval.maxx) ||
        (interval.openMin && x === interval.minx) ||
        (interval.openMax && x === interval.maxx)
    );
}

/**
 * A number as Python reads a float. `spacings` is evaluated into a numpy
 * array, which is an integer array when every entry is written as an integer,
 * and a lattice coordinate taken from one is then an integer too — on which a
 * negative power such as `x^(-1)` raises rather than giving a number.
 */
function pythonFloat(value: number): string {
    const text = `${value}`;
    return /[.eE]/.test(text) ? text : `${text}.0`;
}

/**
 * The `(start, step, end)` PreFigure walks along one axis to visit `values`,
 * which are equally spaced.
 *
 * PreFigure steps with `while x <= end: ... x += step`, so the end is padded
 * by half a step: rounding in the running sum must not drop the last line, and
 * the padding is too short to add another.
 */
function spacingTriple(values: number[], step: number): string {
    const start = Math.min(...values);
    const end = Math.max(...values);
    return `(${pythonFloat(start)},${pythonFloat(step)},${pythonFloat(end + step / 2)})`;
}

/**
 * Whether PreFigure's `while x <= end: ... x += step` walks `values` in about
 * one step per lattice line. Far enough from 0, a step is lost in rounding —
 * at 1e17, `x + 1` is `x` — and the loop never ends, hanging the whole
 * diagram. Requiring the step to be at least 2^-40 of the largest coordinate
 * leaves it exact to about 12 bits in every addition, so the walk ends, and
 * on any realistic graph keeps its line count; only near the threshold, with
 * tens of thousands of lines on one axis, can it gain or lose a line or two.
 * A lattice that fails is one the JSXGraph renderer cannot place either: its
 * points round onto one another.
 */
function advancesRunningSum(values: number[], step: number): boolean {
    const largest = Math.max(
        ...values.map((value) => Math.abs(value)),
        Math.abs(Math.max(...values) + step),
    );
    return step >= largest * 2 ** -40;
}

/**
 * Whether a value of the field's function is undefined: `NaN`, or not a real
 * number at all, such as the complex number math-expressions gives for the
 * square root of a negative. An infinity is not undefined here: PreFigure
 * draws an infinite slope as a vertical mark.
 */
function isUndefinedValue(value: unknown): boolean {
    return typeof value !== "number" || Number.isNaN(value);
}

/**
 * The AST of the output a definition selects: the `component`-th entry of a
 * vector-valued formula, as the numerical function evaluates it, or the
 * formula itself. Undefined if there is no such entry.
 */
function selectedOutputAst(definition: CurveFunctionDefinition): unknown {
    const formula = definition.formula;
    const component = Number(definition.component ?? 0);
    if (Array.isArray(formula) && vectorOperators.includes(formula[0])) {
        return formula[component + 1];
    }
    return component === 0 ? formula : undefined;
}

/** The definition's variable names, as its numerical function binds them. */
function variableNamesOf(definition: CurveFunctionDefinition): string[] {
    const variables = Array.isArray(definition.variables)
        ? definition.variables
        : [];
    return variables.map((variable) =>
        String(me.fromAst(variable).subscripts_to_strings().tree),
    );
}

/**
 * The lattice to sample and to give PreFigure: the graph's lattice, coarsened
 * to `maxMarks`, without the lines that lie outside the function's domain.
 */
interface FieldLattice {
    xs: number[];
    ys: number[];
    /** `spacings`, or null when no lattice point is left to draw. */
    spacings: string | null;
    /**
     * The spacing and offset the lattice's coordinates are computed from, and
     * the stride `maxMarks` thinned it by: the points kept are those whose
     * index is a multiple of the stride.
     */
    grid: {
        dx: number;
        dy: number;
        xoffset: number;
        yoffset: number;
        stride: number;
    };
}

function fieldLattice(
    sv: PrefigureStateValues,
    definition: CurveFunctionDefinition,
    numInputs: number,
): FieldLattice {
    const [xMin, yMin, xMax, yMax] = sv.graphBounds ?? [-10, -10, 10, 10];
    const spacing = {
        dx: Number(sv.dx),
        dy: Number(sv.dy),
        xoffset: Number(sv.xoffset),
        yoffset: Number(sv.yoffset),
    };
    const lines = thinnedLatticeLines(
        { xMin, xMax, yMin, yMax },
        spacing,
        Number(sv.maxMarks),
    );
    const grid = { ...spacing, stride: lines.stride };

    // The domain is a box, one interval per input, so the lines inside it are
    // a contiguous run of the lattice's and still evenly spaced. A one-input
    // function constrains only x.
    const [xDomain, yDomain] = domainIntervals(definition, numInputs);
    const xs = lines.xs.filter((x) => inInterval(x, xDomain));
    const ys = yDomain
        ? lines.ys.filter((y) => inInterval(y, yDomain))
        : lines.ys;

    if (xs.length === 0 || ys.length === 0) {
        return { xs, ys, spacings: null, grid };
    }

    const xStep = Math.abs(grid.dx * lines.stride);
    const yStep = Math.abs(grid.dy * lines.stride);
    if (!advancesRunningSum(xs, xStep) || !advancesRunningSum(ys, yStep)) {
        return { xs: [], ys: [], spacings: null, grid };
    }
    return {
        xs,
        ys,
        spacings: `(${spacingTriple(xs, xStep)},${spacingTriple(ys, yStep)})`,
        grid,
    };
}

/**
 * The PreFigure `<definition>`s of the field's function, as `name(x,y)=...`,
 * with the author's variables renamed to `x` and `y`. A function of one input
 * is still defined of both, since PreFigure calls a field's function with two.
 *
 * Each output is the component its definition selects, as the numerical
 * function does: a vector-valued formula contributes its `component`-th entry,
 * so a one-output `<function>` written as `(x, y)` is the slope `x`.
 *
 * PreFigure walks the lattice by adding the step to a running sum, which
 * drifts from the coordinates the lattice was checked at: a tenth added twenty
 * times is `2.0000000000000004`, past a closed domain endpoint at 2 where
 * `sqrt(2 - x)` raises, and a sum meant to reach 0 stops at `-2e-15`, where
 * `1/x` is an arrow longer than any screen. So `name` snaps its inputs back to
 * the lattice and calls `${name}_formula`, which holds the formula. It rounds
 * to the nearest index the lattice kept, a multiple of the stride, so the
 * drift of a long walk on a coarsened lattice cannot land on a line `maxMarks`
 * left out, and computes the coordinate from that index as the lattice did,
 * `index*dx + xoffset`. PreFigure then evaluates the function at exactly the
 * points checked here.
 *
 * The formula is written as `astToPythonExpression` writes it for curves, so a
 * field can use `pi`, absolute value and inverse trigonometry too.
 *
 * Returns null, having warned, for a function that is not given by a formula
 * (an interpolated or piecewise function has no expression to hand PreFigure)
 * or whose formula PreFigure cannot evaluate (`doenet-w0170`).
 */
function fieldFunctionDefinitions({
    name,
    definitions,
    grid,
    factor = 1,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterWarningContext & {
    name: string;
    definitions: CurveFunctionDefinition[];
    grid: FieldLattice["grid"];
    /** A factor PreFigure's function multiplies the field's values by. */
    factor?: number;
}): string | null {
    const warnNotFormula = (definition: CurveFunctionDefinition) => {
        pushWarning({
            diagnostics,
            code: "doenet-w0171",
            args: {
                subject: warningPrefix,
                definitionType: String(definition.functionType ?? "unknown"),
            },
            position: warningPosition,
        });
        return null;
    };

    const variables = Array.isArray(definitions[0].variables)
        ? definitions[0].variables
        : [];
    const renames: Record<string, string> = {};
    for (const [index, variable] of variables.slice(0, 2).entries()) {
        const variableName = astToVariableName(variable);
        if (variableName) {
            renames[variableName] = index === 0 ? "x" : "y";
        }
    }
    // A free symbol other than the variables would be a name PreFigure does
    // not know, and renaming the variables to `x` and `y` could capture one.
    const allowedSymbols = new Set(Object.keys(renames));

    const outputs: string[] = [];
    for (const definition of definitions) {
        if (definition.functionType !== "formula") {
            return warnNotFormula(definition);
        }
        const ast = selectedOutputAst(definition);
        if (ast === undefined) {
            return warnNotFormula(definition);
        }
        const result = astToPythonExpression(ast, allowedSymbols);
        if (result.unsupportedFeature !== undefined) {
            pushWarning({
                diagnostics,
                code: "doenet-w0170",
                args: {
                    subject: warningPrefix,
                    feature: result.unsupportedFeature,
                },
                position: warningPosition,
            });
            return null;
        }
        outputs.push(
            rewriteExpressionVariables({
                expression: result.expression,
                renames,
            }),
        );
    }

    const body = outputs.length === 1 ? outputs[0] : `(${outputs.join(",")})`;
    // `round` gives a Python int, which would make the snapped coordinate a
    // Python float, on which dividing by `x` raises when x is 0. Adding `0*x`,
    // a numpy zero, keeps it the numpy float PreFigure passed in, on which
    // that division gives an infinity and costs at most a mark.
    const snap = (variable: string, step: number, offset: number) =>
        `0*${variable}+round((${variable}-${pythonFloat(offset)})/${pythonFloat(step * grid.stride)})*${grid.stride}*${pythonFloat(step)}+${pythonFloat(offset)}`;
    const formulaName = `${name}_formula`;

    return [
        `${formulaName}(x,y)=${body}`,
        `${name}(x,y)=${factor === 1 ? "" : `${pythonFloat(factor)}*`}${formulaName}(${snap("x", grid.dx, grid.xoffset)},${snap("y", grid.dy, grid.yoffset)})`,
    ]
        .map((text) => `<definition>${escapeXml(text)}</definition>`)
        .join("");
}

/**
 * Warn that PreFigure raises at the lattice point `undefinedAt` and so may
 * draw none of the field (see {@link firstRaisingLatticePoint}).
 */
function warnIfUndefinedAtLatticePoint({
    undefinedAt,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterWarningContext & {
    undefinedAt: [number, number] | null;
}): void {
    if (undefinedAt === null) {
        return;
    }
    pushWarning({
        diagnostics,
        code: "doenet-w0172",
        args: {
            subject: warningPrefix,
            // A lattice coordinate is a multiple of the spacing, so it can
            // carry floating-point dust (`-9.600000000000001`).
            point: `(${snapNumber(undefinedAt[0])}, ${snapNumber(undefinedAt[1])})`,
        },
        position: warningPosition,
    });
}

/**
 * The `stroke` and `thickness` attributes of `styleAttrs`, the only ones
 * PreFigure copies onto a field's marks, warning if a dashed or dotted line
 * style is among those dropped.
 */
function fieldStyleAttributes({
    sv,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterWarningContext & {
    sv: PrefigureStateValues;
    styleAttrs: string[];
}): string[] {
    const attributeName = (attr: string) => attr.slice(0, attr.indexOf("="));

    if (styleAttrs.some((attr) => attributeName(attr) === "dash")) {
        pushWarning({
            diagnostics,
            code: "doenet-w0175",
            args: {
                subject: warningPrefix,
                lineStyle: String(sv.selectedStyle?.lineStyle),
            },
            position: warningPosition,
        });
    }

    return styleAttrs.filter((attr) =>
        FIELD_STYLE_ATTRIBUTE_NAMES.has(attributeName(attr)),
    );
}

/**
 * The definitions of a field's function, or null if it has none to draw.
 *
 * A field with no usable function draws nothing in the JSXGraph renderer, and
 * whether the function has the wrong number of outputs is already warned about
 * by the component itself.
 */
function usableDefinitions(
    sv: PrefigureStateValues,
    numOutputs: number,
): CurveFunctionDefinition[] | null {
    if (!sv.haveFunction || !Array.isArray(sv.fDefinitions)) {
        return null;
    }
    const definitions = sv.fDefinitions as CurveFunctionDefinition[];
    if (
        definitions.length !== numOutputs ||
        definitions.some((d) => !d || typeof d !== "object")
    ) {
        return null;
    }
    return definitions;
}

/** Input count as `fieldFunctionFromDefinition` reads it. */
function numInputsOf(definition: CurveFunctionDefinition): number {
    return (Number(definition.numInputs) || 1) > 1 ? 2 : 1;
}

/**
 * Converts a `<slopeField>` to a PreFigure `<definition>` and `<slope-field>`.
 */
export function convertSlopeFieldToPrefigure({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const warningContext = { diagnostics, warningPrefix, warningPosition };

    const definitions = usableDefinitions(sv, 1);
    if (definitions === null) {
        return emptyGroup(handle);
    }
    const [definition] = definitions;

    const lattice = fieldLattice(sv, definition, numInputsOf(definition));

    const functionName = `${handle}_f`;
    const definitionXml = fieldFunctionDefinitions({
        name: functionName,
        definitions,
        grid: lattice.grid,
        ...warningContext,
    });
    if (definitionXml === null) {
        return null;
    }

    if (Number(sv.markLength) !== SLOPE_FIELD_DEFAULT_MARK_LENGTH) {
        pushWarning({
            diagnostics,
            code: "doenet-w0173",
            args: { subject: warningPrefix },
            position: warningPosition,
        });
    }

    const attrs = fieldStyleAttributes({ sv, styleAttrs, ...warningContext });

    if (lattice.spacings === null) {
        return emptyGroup(handle);
    }

    const f = fieldFunctionFromDefinition(definition);
    const anyDefined = lattice.xs.some((x) =>
        lattice.ys.some((y) => !isUndefinedValue(f(x, y))),
    );

    if (!anyDefined) {
        // The JSXGraph renderer draws no mark either, for a function such as
        // sqrt(-1 - x^2) that has no real value anywhere. (A formula with a
        // symbol that is not one of its variables never gets here: the
        // translation rejects it.)
        return emptyGroup(handle);
    }

    warnIfUndefinedAtLatticePoint({
        undefinedAt: firstRaisingLatticePoint({
            asts: definitions.map(selectedOutputAst),
            variableNames: variableNamesOf(definitions[0]),
            xs: lattice.xs,
            ys: lattice.ys,
            divisionRaises: false,
        }),
        ...warningContext,
    });

    const fieldAttrs = [
        `at="${escapeXml(handle)}"`,
        `function="${escapeXml(functionName)}"`,
        `spacings="${escapeXml(lattice.spacings)}"`,
        ...attrs,
    ];

    return `${definitionXml}<slope-field ${fieldAttrs.join(" ")} />`;
}

/**
 * The JSXGraph renderer's arrowhead: each barb is this fraction of its arrow's
 * length, at this angle, in radians, from the shaft (`buildVectorFieldData`).
 */
const BARB_FRACTION = 0.3;

/**
 * The length, in graph units, below which a vector field's longest vector is
 * magnified before PreFigure draws it: 1e6 times PreFigure's cutoff of 1e-10.
 */
const MIN_UNSCALED_NORM = 1e-4;
const BARB_ANGLE = 0.44;

/**
 * The half-angle, in degrees, of the tip of PreFigure's arrowhead, its default
 * `arrow-angles` (`prefig/core/arrow.py`).
 */
const PREFIGURE_ARROW_TIP_ANGLE = 24;

/**
 * The narrowest `arrow-width` given, in line widths: any narrower and the head
 * would barely stand out from the shaft.
 */
const MIN_ARROW_WIDTH = 2;

/**
 * `attrs` with the `thickness` and `arrow-width` a vector field's arrows need.
 *
 * PreFigure sizes an arrowhead in line widths, the same for every arrow: at the
 * default `arrow-width` of 4, a head is about 4.5 line widths long, 18 pixels
 * at the default line width of 4, which swallows arrows of the default
 * `markLength` of 24 pixels. The JSXGraph renderer instead makes a barb
 * `BARB_FRACTION` of its arrow. PreFigure cannot vary the head from arrow to
 * arrow, so the head is sized for an arrow `markLength` long — the longest
 * arrow, or every arrow with `normalize` — and given the JSXGraph head's
 * length along the shaft. It is never narrower than `MIN_ARROW_WIDTH`.
 *
 * The thickness is rounded to a whole pixel, as a `<vector>`'s is, since
 * PreFigure reads an arrow's line width as an integer.
 */
function arrowAttributes({
    attrs,
    lineWidth,
    markLength,
}: {
    attrs: string[];
    lineWidth: unknown;
    markLength: number | null;
}): string[] {
    // A line too thin to round up to a pixel still draws, as it does in the
    // JSXGraph renderer. (A line width of 0 draws nothing: see the caller.)
    const thickness = wholePixelThickness(lineWidth);
    const result = wholePixelThicknessAttributes(attrs, lineWidth);

    if (thickness !== null && markLength !== null && markLength > 0) {
        // A PreFigure head of `arrow-width` w line widths reaches back along
        // the shaft (w/2)/tan(tip angle) line widths.
        const headLength = BARB_FRACTION * markLength * Math.cos(BARB_ANGLE);
        const arrowWidth =
            (2 *
                Math.tan((PREFIGURE_ARROW_TIP_ANGLE * Math.PI) / 180) *
                headLength) /
            thickness;
        result.push(
            `arrow-width="${Number(Math.max(MIN_ARROW_WIDTH, arrowWidth).toFixed(3))}"`,
        );
    }

    return result;
}

/**
 * Converts a `<vectorField>` to a PreFigure `<definition>` and `<vector-field>`.
 *
 * PreFigure draws each vector `scale` times its value, in graph units. The
 * JSXGraph renderer makes the longest arrow on screen `markLength` pixels long
 * and scales the rest with it, which is the same uniform scaling, so `scale`
 * is `markLength` over the longest vector's length in pixels. With
 * `normalize`, `exponent="0"` makes every vector a unit vector in graph units,
 * which `scale` makes `markLength` pixels long when the axes are scaled
 * equally; otherwise the arrows' lengths vary with their direction, which is
 * warned about.
 */
export function convertVectorFieldToPrefigure({
    sv,
    handle,
    styleAttrs,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const warningContext = { diagnostics, warningPrefix, warningPosition };

    const definitions = usableDefinitions(sv, 2);
    if (definitions === null) {
        return emptyGroup(handle);
    }
    const [definition] = definitions;

    const lattice = fieldLattice(sv, definition, numInputsOf(definition));

    const [xMin, yMin, xMax, yMax] = sv.graphBounds ?? [-10, -10, 10, 10];
    const [width, height] = sv.graphDimensions ?? [425, 425];
    const unitX = width / Math.abs(xMax - xMin);
    const unitY = height / Math.abs(yMax - yMin);

    const u = fieldFunctionFromDefinition(definitions[0]);
    const v = fieldFunctionFromDefinition(definitions[1]);
    // The longest vector, in pixels and in graph units.
    let maxMagnitude = 0;
    let maxNorm = 0;
    for (const x of lattice.xs) {
        for (const y of lattice.ys) {
            const ux = u(x, y);
            const uy = v(x, y);
            const magnitude = Math.hypot(ux * unitX, uy * unitY);
            if (Number.isFinite(magnitude)) {
                maxMagnitude = Math.max(maxMagnitude, magnitude);
                maxNorm = Math.max(maxNorm, Math.hypot(ux, uy));
            }
        }
    }
    // PreFigure draws a vector shorter than 1e-10 in graph units as zero, and
    // loses the field to a division by zero if every vector is. So a field
    // of such short vectors is given to PreFigure magnified to a longest
    // vector of 1, and `scale` shrinks it back. Either way, only a vector
    // under a millionth of the longest one, too short to draw, is lost.
    const factor = maxNorm > 0 && maxNorm < MIN_UNSCALED_NORM ? 1 / maxNorm : 1;

    const functionName = `${handle}_f`;
    const definitionXml = fieldFunctionDefinitions({
        name: functionName,
        definitions,
        grid: lattice.grid,
        factor,
        ...warningContext,
    });
    if (definitionXml === null) {
        return null;
    }

    const attrs = fieldStyleAttributes({ sv, styleAttrs, ...warningContext });

    if (lattice.spacings === null) {
        return emptyGroup(handle);
    }

    if (maxMagnitude === 0) {
        // Every vector is zero or undefined, so there is no arrow to draw, and
        // nothing for PreFigure to lose.
        return emptyGroup(handle);
    }

    const lineWidth = asFiniteNumber(sv.selectedStyle?.lineWidth);
    if (lineWidth !== null && lineWidth <= 0) {
        // The JSXGraph renderer's arrows are invisible, and PreFigure divides
        // by an arrow's line width, losing the field to a ZeroDivisionError.
        return emptyGroup(handle);
    }

    warnIfUndefinedAtLatticePoint({
        undefinedAt: firstRaisingLatticePoint({
            asts: definitions.map(selectedOutputAst),
            variableNames: variableNamesOf(definitions[0]),
            xs: lattice.xs,
            ys: lattice.ys,
            divisionRaises: true,
        }),
        ...warningContext,
    });

    const markLength = asFiniteNumber(sv.markLength);
    if (markLength === null) {
        // The JSXGraph renderer draws no arrows of an undefined length.
        return emptyGroup(handle);
    }
    const fieldAttrs = [
        `at="${escapeXml(handle)}"`,
        `function="${escapeXml(functionName)}"`,
        `spacings="${escapeXml(lattice.spacings)}"`,
    ];

    if (sv.normalize) {
        fieldAttrs.push(`exponent="0"`);
        const equalScales =
            Math.abs(unitX - unitY) <= 1e-6 * Math.max(unitX, unitY);
        if (!equalScales) {
            pushWarning({
                diagnostics,
                code: "doenet-w0174",
                args: { subject: warningPrefix },
                position: warningPosition,
            });
        }
        const unit = equalScales ? unitX : Math.sqrt(unitX * unitY);
        fieldAttrs.push(`scale="${markLength / unit}"`);
    } else {
        fieldAttrs.push(`scale="${markLength / (factor * maxMagnitude)}"`);
    }

    fieldAttrs.push(
        ...arrowAttributes({
            attrs,
            lineWidth: sv.selectedStyle?.lineWidth,
            markLength,
        }),
    );

    return `${definitionXml}<vector-field ${fieldAttrs.join(" ")} />`;
}
