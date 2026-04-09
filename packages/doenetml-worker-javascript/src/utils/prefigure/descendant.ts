import {
    createStableHandle,
    pushWarning,
    warningMessageForDescendant,
} from "./common";
import { styleAttributes } from "./style";
import { convertPointToPrefigure } from "./components/point";
import {
    convertLineToPrefigure,
    convertLineSegmentToPrefigure,
    convertRayToPrefigure,
} from "./components/line";
import { convertVectorToPrefigure } from "./components/vector";
import { convertCircleToPrefigure } from "./components/circle";
import {
    convertPolylineToPrefigure,
    convertPolygonToPrefigure,
} from "./components/polygon";
import { convertAngleToPrefigure } from "./components/angle";
import { convertCurveToPrefigure } from "./components/curve";
import type {
    Converter,
    Descendant,
    GraphBounds,
    GraphDimensions,
    PrefigureStateValues,
} from "./types";
import type { DiagnosticRecord } from "@doenet/utils";

const FILLED_COMPONENT_TYPES = new Set([
    "circle",
    "polygon",
    "triangle",
    "rectangle",
]);

const NO_FILL_COMPONENT_TYPES = new Set(["polyline", "angle", "curve"]);

function styleIncludesFill(
    componentType: string,
    sv: PrefigureStateValues,
): boolean {
    if (FILLED_COMPONENT_TYPES.has(componentType)) {
        return Boolean(sv.filled);
    }

    return !NO_FILL_COMPONENT_TYPES.has(componentType);
}

const convertByComponentType: Record<string, Converter> = {
    point: convertPointToPrefigure,
    line: convertLineToPrefigure,
    lineSegment: convertLineSegmentToPrefigure,
    ray: convertRayToPrefigure,
    vector: convertVectorToPrefigure,
    circle: convertCircleToPrefigure,
    polyline: convertPolylineToPrefigure,
    polygon: convertPolygonToPrefigure,
    angle: convertAngleToPrefigure,
    curve: convertCurveToPrefigure,
    endpoint: convertPointToPrefigure,
    equilibriumPoint: convertPointToPrefigure,
    triangle: convertPolygonToPrefigure,
    rectangle: convertPolygonToPrefigure,
};

interface ConvertGraphicalDescendantArgs {
    descendant: Descendant;
    index: number;
    usedHandles: Set<string>;
    diagnostics: DiagnosticRecord[];
    graphBounds: GraphBounds;
    graphDimensions: GraphDimensions;
}

/**
 * Converts a single graphical descendant into a PreFigure element string.
 *
 * This dispatcher centralizes three concerns:
 * - style extraction shared by most components,
 * - routing to component-specific converter functions through one shared
 *   converter signature, even when a specific converter ignores `styleAttrs`,
 * - consistent warning behavior for unsupported/invalid descendants.
 */
export function convertGraphicalDescendantToPrefigure({
    descendant,
    index,
    usedHandles,
    diagnostics,
    graphBounds,
    graphDimensions,
}: ConvertGraphicalDescendantArgs): { xml: string; handle: string } | null {
    const sv: PrefigureStateValues = {
        ...(descendant?.stateValues ?? {}),
        graphBounds,
        graphDimensions,
    };
    const warningPrefix = warningMessageForDescendant(descendant);
    const warningPosition = descendant?.position;
    const handle = createStableHandle(descendant, index, usedHandles);
    const styleAttrs = styleAttributes({
        selectedStyle: sv.selectedStyle,
        diagnostics,
        warningPrefix,
        warningPosition,
        includeFill: styleIncludesFill(descendant.componentType, sv),
    });

    const converter = convertByComponentType[descendant.componentType];
    if (!converter) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: unsupported in graph prefigure renderer; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    const body = converter({
        sv,
        handle,
        styleAttrs,
        diagnostics,
        warningPrefix,
        warningPosition,
    });

    if (!body) {
        pushWarning({
            diagnostics,
            message: `${warningPrefix}: non-finite or incomplete geometry; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    return {
        xml: body,
        handle,
    };
}
