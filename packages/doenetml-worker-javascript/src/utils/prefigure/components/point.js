import { escapeXml, formatPoint } from "../common";
import { pointLabelAttributes } from "../label";
import { pointStyleAttributes } from "../style";

/**
 * Converts a Doenet point descendant into a PreFigure `<point>` element.
 */
export function convertPointToPrefigure({
    sv,
    handle,
    warnings,
    warningPrefix,
}) {
    const p = formatPoint(sv.numericalXs);
    if (p === null) {
        return null;
    }

    const pointAttrs = pointStyleAttributes({
        selectedStyle: sv.selectedStyle,
        warnings,
        warningPrefix,
    });
    const pointLabel = pointLabelAttributes({
        stateValues: sv,
        warnings,
        warningPrefix,
    });

    const attrs = [
        `id="${escapeXml(handle)}"`,
        `p="${escapeXml(p)}"`,
        ...pointAttrs,
        ...(pointLabel?.attrs ?? []),
    ];

    if (pointLabel?.label) {
        return `<point ${attrs.join(" ")}>${pointLabel.label}</point>`;
    }

    return `<point ${attrs.join(" ")} />`;
}
