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
import type {
    ConverterBaseArgs,
    Descendant,
    GraphBounds,
    GraphDimensions,
    PrefigureStateValues,
    StyledConverter,
    WarningOnlyConverter,
} from "./types";
import type { DiagnosticRecord } from "@doenet/utils";

/**
 * Normalize warning-related arguments for converters that do not consume style attrs.
 */
function withWarnings(converter: WarningOnlyConverter): WarningOnlyConverter {
    return ({
        sv,
        handle,
        diagnostics,
        warningPrefix,
        warningPosition,
    }: ConverterBaseArgs) =>
        converter({ sv, handle, diagnostics, warningPrefix, warningPosition });
}

/**
 * Normalize style + warning arguments for converters that consume style attrs.
 */
function withStyle(converter: StyledConverter): StyledConverter {
    return ({
        sv,
        handle,
        styleAttrs,
        diagnostics,
        warningPrefix,
        warningPosition,
    }) =>
        converter({
            sv,
            handle,
            styleAttrs,
            diagnostics,
            warningPrefix,
            warningPosition,
        });
}

const FILLED_COMPONENT_TYPES = new Set([
    "circle",
    "polygon",
    "triangle",
    "rectangle",
]);

const NO_FILL_COMPONENT_TYPES = new Set(["polyline", "angle"]);

function styleIncludesFill(
    componentType: string,
    sv: PrefigureStateValues,
): boolean {
    if (FILLED_COMPONENT_TYPES.has(componentType)) {
        return Boolean(sv.filled);
    }

    return !NO_FILL_COMPONENT_TYPES.has(componentType);
}

const pointConverter = withWarnings(convertPointToPrefigure);
const lineConverter = withStyle(convertLineToPrefigure);
const lineSegmentConverter = withStyle(convertLineSegmentToPrefigure);
const rayConverter = withStyle(convertRayToPrefigure);
const vectorConverter = withStyle(convertVectorToPrefigure);
const circleConverter = withStyle(convertCircleToPrefigure);
const polylineConverter = withStyle(convertPolylineToPrefigure);
const polygonConverter = withStyle(convertPolygonToPrefigure);
const angleConverter = withWarnings(convertAngleToPrefigure);

const baseConverters = {
    point: pointConverter,
    line: lineConverter,
    lineSegment: lineSegmentConverter,
    ray: rayConverter,
    vector: vectorConverter,
    circle: circleConverter,
    polyline: polylineConverter,
    polygon: polygonConverter,
    angle: angleConverter,
};
const convertByComponentType: Record<
    string,
    StyledConverter | WarningOnlyConverter
> = {
    ...baseConverters,
    endpoint: baseConverters.point,
    equilibriumPoint: baseConverters.point,
    triangle: baseConverters.polygon,
    rectangle: baseConverters.polygon,
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
 * - routing to component-specific converter functions,
 * - consistent warning behavior for unsupported/invalid descendants.
 */
export function convertGraphicalDescendantToPrefigure({
    descendant,
    index,
    usedHandles,
    diagnostics,
    graphBounds,
    graphDimensions,
}: ConvertGraphicalDescendantArgs): string | null {
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

    return body;
}
