import { escapeXml, formatPoint } from "../common";
import { pointLabelAttributes } from "../label";
import { pointStyleAttributes } from "../style";
import type { ConverterArgs } from "../types";

/**
 * Converts a Doenet point descendant into a PreFigure `<point>` element.
 */
export function convertPointToPrefigure({
    sv,
    handle,
    diagnostics,
    warningPrefix,
    warningPosition,
}: ConverterArgs): string | null {
    const p = formatPoint(sv.numericalXs);
    if (p === null) {
        return null;
    }

    const pointAttrs = pointStyleAttributes({
        selectedStyle: sv.selectedStyle,
        diagnostics,
        warningPrefix,
        warningPosition,
        // endpoint/equilibriumPoint expose `open`; open points should be
        // stroke-only (no fill) to match Doenet semantics.
        includeFill: sv.open !== true,
    });
    const pointLabel = pointLabelAttributes({
        stateValues: sv,
        diagnostics,
        warningPrefix,
        warningPosition,
    });

    const attrs = [
        `at="${escapeXml(handle)}"`,
        `p="${escapeXml(p)}"`,
        ...pointAttrs,
        ...(pointLabel?.attrs ?? []),
    ];

    if (pointLabel?.label) {
        return `<point ${attrs.join(" ")}>${pointLabel.label}</point>`;
    }

    return `<point ${attrs.join(" ")} />`;
}
