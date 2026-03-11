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

const convertByComponentType = {
    point: ({ sv, handle, warnings, warningPrefix, warningPosition }) =>
        convertPointToPrefigure({
            sv,
            handle,
            warnings,
            warningPrefix,
            warningPosition,
        }),
    line: ({
        sv,
        handle,
        styleAttrs,
        warnings,
        warningPrefix,
        warningPosition,
    }) =>
        convertLineToPrefigure({
            sv,
            handle,
            styleAttrs,
            warnings,
            warningPrefix,
            warningPosition,
        }),
    lineSegment: ({
        sv,
        handle,
        styleAttrs,
        warnings,
        warningPrefix,
        warningPosition,
    }) =>
        convertLineSegmentToPrefigure({
            sv,
            handle,
            styleAttrs,
            warnings,
            warningPrefix,
            warningPosition,
        }),
    ray: ({
        sv,
        handle,
        styleAttrs,
        warnings,
        warningPrefix,
        warningPosition,
    }) =>
        convertRayToPrefigure({
            sv,
            handle,
            styleAttrs,
            warnings,
            warningPrefix,
            warningPosition,
        }),
    vector: ({
        sv,
        handle,
        styleAttrs,
        warnings,
        warningPrefix,
        warningPosition,
    }) =>
        convertVectorToPrefigure({
            sv,
            handle,
            styleAttrs,
            warnings,
            warningPrefix,
            warningPosition,
        }),
    circle: ({ sv, handle, styleAttrs }) =>
        convertCircleToPrefigure({ sv, handle, styleAttrs }),
    polyline: ({ sv, handle, styleAttrs }) =>
        convertPolylineToPrefigure({ sv, handle, styleAttrs }),
    polygon: ({ sv, handle, styleAttrs }) =>
        convertPolygonToPrefigure({ sv, handle, styleAttrs }),
    triangle: ({ sv, handle, styleAttrs }) =>
        convertPolygonToPrefigure({ sv, handle, styleAttrs }),
    rectangle: ({ sv, handle, styleAttrs }) =>
        convertPolygonToPrefigure({ sv, handle, styleAttrs }),
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
}) {
    const sv = {
        ...(descendant?.stateValues ?? {}),
        graphBounds,
    };
    const warningPrefix = warningMessageForDescendant(descendant);
    const warningPosition = descendant?.position;
    const handle = createStableHandle(descendant, index, usedHandles);
    const styleAttrs = styleAttributes({
        selectedStyle: sv.selectedStyle,
        warnings,
        warningPrefix,
        warningPosition,
        includeFill:
            descendant.componentType === "circle" ||
            descendant.componentType === "polygon" ||
            descendant.componentType === "triangle" ||
            descendant.componentType === "rectangle"
                ? Boolean(sv.filled)
                : true,
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
