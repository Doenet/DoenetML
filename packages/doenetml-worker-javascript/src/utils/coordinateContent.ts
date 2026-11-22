/**
 * Which coordinates of a `<point>` its content gives (D49, VAL-5).
 *
 * A point's value takes each coordinate from `x`, `y` or `z` first, then
 * from `coords`, then from its content (`Point.unconstrainedXs`), and its
 * number of dimensions is the most of what `z` (3) or `y` (2) and what
 * `coords` or the content give (`Point.numDimensions`). So the content is
 * unused when `coords` is written, or when `x`, `y` and `z` give every
 * coordinate it would fill. A point is missing only when a coordinate it
 * uses names nothing (`Point.contentNamesNothing`), and content the
 * attributes override entirely is a warning at load (`doenet-w0202`).
 */
import { codedDiagnostic } from "./diagnostics";

/** The attributes that give a point's coordinates one by one. */
export const COORDINATE_ATTRIBUTES = ["x", "y", "z"];

/**
 * Whether content of `contentDimensions` coordinates gives a coordinate of
 * a point whose coordinate attributes written are `written` (`x`, `y`,
 * `z`, in order): some coordinate up to the point's number of dimensions
 * has no attribute. Content whose number of coordinates isn't known (a
 * reference that names nothing, or a point or vector child) counts as two,
 * as a point given only `x` is a point in the plane: so
 * `<point x="3">$nothing</point>` takes its `y` from the content, and
 * `<point x="3" y="4">$nothing</point>` takes nothing from it (D49).
 */
export function contentGivesACoordinate(
    written: boolean[],
    contentDimensions = 2,
): boolean {
    const attributeDimensions = written[2] ? 3 : written[1] ? 2 : 0;
    const numDimensions = Math.max(contentDimensions, attributeDimensions);
    for (let i = 0; i < numDimensions; i++) {
        if (!written[i]) {
            return true;
        }
    }
    return false;
}

/**
 * The warning that the content of a `<point>` or `<vector>` isn't used,
 * since its attributes give its whole value (D49): `reason` `coords` or
 * `displacement`, the attribute that does, or `coordinates`, for `x`, `y`
 * and `z` giving every coordinate the content would.
 */
export function contentUnusedDiagnostic({
    componentType,
    reason,
    written = [],
}: {
    componentType: string;
    reason: "coords" | "displacement" | "coordinates";
    written?: boolean[];
}) {
    return codedDiagnostic({
        type: "warning",
        code: "doenet-w0202",
        args: {
            componentType,
            reason,
            attributes: COORDINATE_ATTRIBUTES.filter((_, i) => written[i])
                .map((name) => `\`${name}\``)
                .join(", "),
        },
    });
}

/**
 * The attribute a `<point>` or `<vector>` sugar puts content its attributes
 * override entirely into (`_unusedContent`), so that it is still made, and
 * its references still report what they report, but is not read.
 */
export function unusedContentAttribute({
    children,
    nComponents,
    stateIdInfo,
}: {
    children: any[];
    nComponents: number;
    stateIdInfo?: { prefix: string; num: number };
}) {
    const attribute = {
        type: "component",
        name: "_unusedContent",
        component: {
            type: "serialized",
            componentType: "coords",
            componentIdx: nComponents++,
            stateId: stateIdInfo
                ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                : undefined,
            children,
            state: {},
            attributes: {},
            doenetAttributes: {},
        },
    };
    return { attribute, nComponents };
}
