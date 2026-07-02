import {
    createStableHandle,
    pushWarning,
    warningMessageForDescendant,
} from "./common";
import { styleAttributes, resolveSelectedStyleForTheme } from "./style";
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
import { convertRegionBetweenCurvesToPrefigure } from "./components/regionBetweenCurves";
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
    regionBetweenCurves: convertRegionBetweenCurvesToPrefigure,
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
    darkMode: boolean;
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
    darkMode,
}: ConvertGraphicalDescendantArgs): { xml: string; handle: string } | null {
    const sv: PrefigureStateValues = {
        ...(descendant?.stateValues ?? {}),
        graphBounds,
        graphDimensions,
    };

    // Swap in dark-mode colors once, here, so every downstream converter and the
    // shared styleAttributes call below emit theme-appropriate colors.
    sv.selectedStyle = resolveSelectedStyleForTheme(sv.selectedStyle, darkMode);

    if (sv.hidden) {
        return null;
    }

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

    const diagnosticsCountBeforeConvert = diagnostics.length;
    const body = converter({
        sv,
        handle,
        styleAttrs,
        diagnostics,
        warningPrefix,
        warningPosition,
    });

    if (!body) {
        // If conversion failed and the failed converter call did not emit any
        // diagnostics, add one generic fallback warning.
        if (diagnostics.length === diagnosticsCountBeforeConvert) {
            pushWarning({
                diagnostics,
                message: `${warningPrefix}: non-finite or incomplete geometry; descendant skipped.`,
                position: warningPosition,
            });
        }
        return null;
    }

    return {
        xml: body,
        handle,
    };
}
