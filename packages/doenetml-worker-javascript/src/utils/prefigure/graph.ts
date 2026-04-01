import {
    asFiniteNumber,
    escapeXml,
    formatNumber,
    pushWarning,
    warningMessageForDescendant,
} from "./common";
import { labelMarkup } from "./label";
import { convertGraphicalDescendantToPrefigure } from "./descendant";
import { convertDoenetMLAnnotationsToPreFigureXml } from "./annotations";
import type {
    AnnotationNode,
    Descendant,
    GraphBounds,
    GraphDependencyValues,
    GraphDimensions,
} from "./types";
import type { DiagnosticRecord } from "@doenet/utils";

function axisModeFromVisibility({
    displayXAxis,
    displayYAxis,
}: GraphDependencyValues): "all" | "horizontal" | "vertical" | null {
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

function pushUnsupportedAxisPositionWarnings({
    dependencyValues,
    diagnostics,
}: {
    dependencyValues: GraphDependencyValues;
    diagnostics: DiagnosticRecord[];
}): void {
    if (dependencyValues.xLabelPosition === "left") {
        diagnostics.push({
            type: "warning",
            message:
                '`<graph>`: xLabelPosition="left" is not supported in prefigure renderer; using right-position behavior.',
        });
    }

    if (dependencyValues.yLabelPosition === "bottom") {
        diagnostics.push({
            type: "warning",
            message:
                '`<graph>`: yLabelPosition="bottom" is not supported in prefigure renderer; using top-position behavior.',
        });
    }
}

function axesElementFromLabels({
    dependencyValues,
    axesMode,
}: {
    dependencyValues: GraphDependencyValues;
    axesMode: "all" | "horizontal" | "vertical";
}): string {
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
    annotations,
    graphComponentIdx,
}: {
    dependencyValues: GraphDependencyValues;
    descendants: Descendant[];
    unsupported: Descendant[];
    annotations: AnnotationNode[] | null;
    graphComponentIdx: number;
}): { xml: string; diagnostics: DiagnosticRecord[] } {
    const diagnostics: DiagnosticRecord[] = [];
    const usedHandles = new Set<string>();
    const handleByComponentIdx = new Map<number, string>();
    const elements = [];

    const rawXMin = asFiniteNumber(dependencyValues.xMin);
    const rawYMin = asFiniteNumber(dependencyValues.yMin);
    const rawXMax = asFiniteNumber(dependencyValues.xMax);
    const rawYMax = asFiniteNumber(dependencyValues.yMax);

    if ([rawXMin, rawYMin, rawXMax, rawYMax].some((x) => x === null)) {
        diagnostics.push({
            type: "warning",
            message:
                "`<graph>`: invalid axis bounds for prefigure conversion; using default bbox (-10,-10,10,10).",
        });
    }

    const graphBounds: GraphBounds =
        rawXMin === null ||
        rawYMin === null ||
        rawXMax === null ||
        rawYMax === null
            ? [-10, -10, 10, 10]
            : [rawXMin, rawYMin, rawXMax, rawYMax];

    let dimensionWidth = asFiniteNumber(dependencyValues.width?.size);
    if (dimensionWidth === null || dimensionWidth <= 0) {
        diagnostics.push({
            type: "warning",
            message:
                "`<graph>`: invalid width for prefigure conversion; using default diagram width 425.",
        });
        dimensionWidth = 425;
    }

    let diagramAspectRatio = asFiniteNumber(dependencyValues.aspectRatio);
    if (diagramAspectRatio === null || diagramAspectRatio <= 0) {
        diagnostics.push({
            type: "warning",
            message:
                "`<graph>`: invalid aspectRatio for prefigure conversion; using default aspect ratio 1.",
        });
        diagramAspectRatio = 1;
    }

    const dimensionHeight = dimensionWidth / diagramAspectRatio;
    const graphDimensions: GraphDimensions = [dimensionWidth, dimensionHeight];

    for (const descendant of unsupported ?? []) {
        pushWarning({
            diagnostics,
            message: `${warningMessageForDescendant(descendant)}: unsupported in graph prefigure renderer; descendant skipped.`,
            position: descendant?.position,
        });
    }

    for (const [index, descendant] of descendants.entries()) {
        const converted = convertGraphicalDescendantToPrefigure({
            descendant,
            index,
            usedHandles,
            diagnostics,
            graphBounds,
            graphDimensions,
        });
        if (converted) {
            elements.push(converted.xml);

            if (Number.isFinite(descendant.componentIdx)) {
                handleByComponentIdx.set(
                    descendant.componentIdx as number,
                    converted.handle,
                );
            }
        }
    }

    const graphDescendantComponentIndices = new Set(
        (dependencyValues.allDescendants ?? [])
            .map((x) => x.componentIdx)
            .filter((x): x is number => Number.isFinite(x)),
    );

    const xMin = formatNumber(graphBounds[0]);
    const yMin = formatNumber(graphBounds[1]);
    const xMax = formatNumber(graphBounds[2]);
    const yMax = formatNumber(graphBounds[3]);
    const bbox = `(${xMin},${yMin},${xMax},${yMax})`;

    const widthText = formatNumber(dimensionWidth) ?? "425";
    const heightText = formatNumber(dimensionHeight) ?? "425";
    const dimensions = `(${widthText},${heightText})`;

    let axesElement = "";
    const axesMode = axisModeFromVisibility(dependencyValues);

    if (axesMode) {
        pushUnsupportedAxisPositionWarnings({ dependencyValues, diagnostics });
        axesElement = axesElementFromLabels({ dependencyValues, axesMode });
    }

    const annotationsElement = convertDoenetMLAnnotationsToPreFigureXml({
        annotations,
        diagnostics,
        handleByComponentIdx,
        graphComponentIdx,
        graphDescendantComponentIndices,
    });

    const xml = `<diagram dimensions="${escapeXml(dimensions)}"><coordinates bbox="${escapeXml(bbox)}">${axesElement}${elements.join("")}</coordinates>${annotationsElement}</diagram>`;

    return { xml, diagnostics };
}
