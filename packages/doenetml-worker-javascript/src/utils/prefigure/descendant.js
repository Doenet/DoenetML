import { createStableHandle, warningMessageForDescendant } from "./common";
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
    point: ({ sv, handle, warnings, warningPrefix }) =>
        convertPointToPrefigure({ sv, handle, warnings, warningPrefix }),
    line: ({ sv, handle, styleAttrs }) =>
        convertLineToPrefigure({ sv, handle, styleAttrs }),
    lineSegment: ({ sv, handle, styleAttrs }) =>
        convertLineSegmentToPrefigure({ sv, handle, styleAttrs }),
    ray: ({ sv, handle, styleAttrs }) =>
        convertRayToPrefigure({ sv, handle, styleAttrs }),
    vector: ({ sv, handle, styleAttrs }) =>
        convertVectorToPrefigure({ sv, handle, styleAttrs }),
    circle: ({ sv, handle, styleAttrs }) =>
        convertCircleToPrefigure({ sv, handle, styleAttrs }),
    polyline: ({ sv, handle, styleAttrs }) =>
        convertPolylineToPrefigure({ sv, handle, styleAttrs }),
    polygon: ({ sv, handle, styleAttrs }) =>
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
}) {
    const sv = descendant?.stateValues ?? {};
    const warningPrefix = warningMessageForDescendant(descendant);
    const handle = createStableHandle(descendant, index, usedHandles);
    const styleAttrs = styleAttributes({
        selectedStyle: sv.selectedStyle,
        warnings,
        warningPrefix,
    });

    const converter = convertByComponentType[descendant.componentType];
    if (!converter) {
        warnings.push({
            type: "warning",
            level: 1,
            message: `${warningPrefix}: unsupported in graph prefigure mode; descendant skipped.`,
        });
        return null;
    }

    const body = converter({ sv, handle, styleAttrs, warnings, warningPrefix });

    if (!body) {
        warnings.push({
            type: "warning",
            level: 1,
            message: `${warningPrefix}: non-finite or incomplete geometry; descendant skipped.`,
        });
        return null;
    }

    return body;
}
