import {
    asFiniteNumber,
    escapeXml,
    formatNumber,
    warningMessageForDescendant,
} from "./common";
import { labelMarkup } from "./label";
import { convertGraphicalDescendantToPrefigure } from "./descendant";

function axisModeFromVisibility({ displayXAxis, displayYAxis }) {
    const showXAxis = Boolean(displayXAxis);
    const showYAxis = Boolean(displayYAxis);

    if (showXAxis && showYAxis) {
        return "all";
    }
    if (showXAxis) {
        return "horizontal";
    }
    if (showYAxis) {
        return "vertical";
    }
    return null;
}

function pushUnsupportedAxisPositionWarnings({ dependencyValues, warnings }) {
    if (dependencyValues.xLabelPosition === "left") {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                '<graph>: xLabelPosition="left" is not supported in prefigure mode; using right-position behavior.',
        });
    }

    if (dependencyValues.yLabelPosition === "bottom") {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                '<graph>: yLabelPosition="bottom" is not supported in prefigure mode; using top-position behavior.',
        });
    }
}

function axesElementFromLabels({ dependencyValues, axesMode }) {
    const axisLabelElements = [];

    const xLabel = labelMarkup({
        label: dependencyValues.xLabel,
        labelHasLatex: dependencyValues.xLabelHasLatex,
    });
    if (xLabel && dependencyValues.displayXAxis) {
        axisLabelElements.push(`<xlabel alignment="nw">${xLabel}</xlabel>`);
    }

    const yLabel = labelMarkup({
        label: dependencyValues.yLabel,
        labelHasLatex: dependencyValues.yLabelHasLatex,
    });
    if (yLabel && dependencyValues.displayYAxis) {
        axisLabelElements.push(`<ylabel alignment="se">${yLabel}</ylabel>`);
    }

    if (axisLabelElements.length > 0) {
        return `<axes axes="${axesMode}">${axisLabelElements.join("")}</axes>`;
    }
    return `<axes axes="${axesMode}" />`;
}

/**
 * Builds the full PreFigure XML document and warning list for a graph.
 *
 * Algorithm outline:
 * 1. Convert unsupported descendants into warnings.
 * 2. Convert supported descendants to element XML in stable order.
 * 3. Compute bbox/dimensions with defensive defaults.
 * 4. Build axis metadata + labels (including unsupported-position warnings).
 * 5. Assemble and return final `<diagram>` XML + warnings.
 */
export function createPrefigureXML({
    dependencyValues,
    descendants,
    unsupported,
}) {
    const warnings = [];
    const usedHandles = new Set();
    const elements = [];

    for (const descendant of unsupported ?? []) {
        warnings.push({
            type: "warning",
            level: 1,
            message: `${warningMessageForDescendant(descendant)}: unsupported in graph prefigure mode; descendant skipped.`,
        });
    }

    for (const [index, descendant] of (descendants ?? []).entries()) {
        const converted = convertGraphicalDescendantToPrefigure({
            descendant,
            index,
            usedHandles,
            warnings,
        });
        if (converted) {
            elements.push(converted);
        }
    }

    const xMin = formatNumber(dependencyValues.xMin);
    const yMin = formatNumber(dependencyValues.yMin);
    const xMax = formatNumber(dependencyValues.xMax);
    const yMax = formatNumber(dependencyValues.yMax);
    const width = asFiniteNumber(dependencyValues.width?.size);
    const aspectRatio = asFiniteNumber(dependencyValues.aspectRatio);

    if ([xMin, yMin, xMax, yMax].some((x) => x === null)) {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                "<graph>: invalid axis bounds for prefigure conversion; using default bbox (-10,-10,10,10).",
        });
    }

    const bbox = [xMin, yMin, xMax, yMax].some((x) => x === null)
        ? "(-10,-10,10,10)"
        : `(${xMin},${yMin},${xMax},${yMax})`;

    let dimensionWidth = width;
    if (dimensionWidth === null || dimensionWidth <= 0) {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                "<graph>: invalid width for prefigure conversion; using default diagram width 425.",
        });
        dimensionWidth = 425;
    }

    let diagramAspectRatio = aspectRatio;
    if (diagramAspectRatio === null || diagramAspectRatio <= 0) {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                "<graph>: invalid aspectRatio for prefigure conversion; using default aspect ratio 1.",
        });
        diagramAspectRatio = 1;
    }

    const dimensionHeight = dimensionWidth / diagramAspectRatio;
    const widthText = formatNumber(dimensionWidth) ?? "425";
    const heightText = formatNumber(dimensionHeight) ?? "425";
    const dimensions = `(${widthText},${heightText})`;

    let axesElement = "";
    const axesMode = axisModeFromVisibility(dependencyValues);

    if (axesMode) {
        pushUnsupportedAxisPositionWarnings({ dependencyValues, warnings });
        axesElement = axesElementFromLabels({ dependencyValues, axesMode });
    }

    const xml = `<diagram dimensions="${escapeXml(dimensions)}"><coordinates bbox="${escapeXml(bbox)}">${axesElement}${elements.join("")}</coordinates></diagram>`;

    return { xml, warnings };
}
