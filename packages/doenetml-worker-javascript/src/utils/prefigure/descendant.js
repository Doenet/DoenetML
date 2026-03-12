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

/**
 * Normalize warning-related arguments for converters that do not consume style attrs.
 */
function withWarnings(converter) {
    return ({ sv, handle, warnings, warningPrefix, warningPosition }) =>
        converter({ sv, handle, warnings, warningPrefix, warningPosition });
}

/**
 * Normalize style + warning arguments for converters that consume style attrs.
 */
function withStyle(converter) {
    return ({
        sv,
        handle,
        styleAttrs,
        warnings,
        warningPrefix,
        warningPosition,
    }) =>
        converter({
            sv,
            handle,
            styleAttrs,
            warnings,
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

function styleIncludesFill(componentType, sv) {
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

const converterAliases = {
    endpoint: "point",
    equilibriumPoint: "point",
    triangle: "polygon",
    rectangle: "polygon",
};

const convertByComponentType = {
    ...baseConverters,
    endpoint: baseConverters[converterAliases.endpoint],
    equilibriumPoint: baseConverters[converterAliases.equilibriumPoint],
    triangle: baseConverters[converterAliases.triangle],
    rectangle: baseConverters[converterAliases.rectangle],
};

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
    warnings,
    graphBounds,
    graphDimensions,
}) {
    const sv = {
        ...(descendant?.stateValues ?? {}),
        graphBounds,
        graphDimensions,
    };
    const warningPrefix = warningMessageForDescendant(descendant);
    const warningPosition = descendant?.position;
    const handle = createStableHandle(descendant, index, usedHandles);
    const styleAttrs = styleAttributes({
        selectedStyle: sv.selectedStyle,
        warnings,
        warningPrefix,
        warningPosition,
        includeFill: styleIncludesFill(descendant.componentType, sv),
    });

    const converter = convertByComponentType[descendant.componentType];
    if (!converter) {
        pushWarning({
            warnings,
            message: `${warningPrefix}: unsupported in graph prefigure renderer; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    const body = converter({
        sv,
        handle,
        styleAttrs,
        warnings,
        warningPrefix,
        warningPosition,
    });

    if (!body) {
        pushWarning({
            warnings,
            message: `${warningPrefix}: non-finite or incomplete geometry; descendant skipped.`,
            position: warningPosition,
        });
        return null;
    }

    return body;
}
