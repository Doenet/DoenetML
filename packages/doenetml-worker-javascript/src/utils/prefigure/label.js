import { escapeXml, pushWarning } from "./common";

const prefigurePointAlignmentByLabelPosition = {
    upperright: "ne",
    upperleft: "nw",
    lowerright: "se",
    lowerleft: "sw",
    top: "n",
    bottom: "s",
    left: "w",
    right: "e",
};

function normalizeKey(value) {
    return String(value)
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, "");
}

const LINE_LABEL_LOCATION_NEAR_START = "0.15";
const LINE_LABEL_LOCATION_NEAR_END = "0.85";

/**
 * Reorders two raw [x, y] points so the first is the leftward point.
 * For vertical lines, the lower point comes first.
 */
export function orientEndpointsForLineLabel(p1Raw, p2Raw) {
    if (p1Raw[0] > p2Raw[0] || (p1Raw[0] === p2Raw[0] && p1Raw[1] > p2Raw[1])) {
        return [p2Raw, p1Raw];
    }
    return [p1Raw, p2Raw];
}

/**
 * Converts a Doenet label value into PreFigure-compatible XML label content.
 *
 * If `labelHasLatex` is true and balanced `\(...\)` delimiters are present,
 * those delimiters are rewritten to `<m>...</m>` while preserving surrounding
 * plain text. Otherwise the full label is wrapped in a single `<m>` block.
 */
export function labelMarkup({ label, labelHasLatex }) {
    if (typeof label !== "string") {
        return null;
    }

    const text = label.trim();
    if (!text) {
        return null;
    }

    if (labelHasLatex) {
        const openDelimiters = (text.match(/\\\(/g) ?? []).length;
        const closeDelimiters = (text.match(/\\\)/g) ?? []).length;

        if (openDelimiters > 0 && openDelimiters === closeDelimiters) {
            return escapeXml(text)
                .replaceAll("\\(", "<m>")
                .replaceAll("\\)", "</m>");
        }

        return `<m>${escapeXml(text)}</m>`;
    }

    return escapeXml(text);
}

/**
 * Returns `<point>` label attributes/content for PreFigure output.
 */
export function pointLabelAttributes({
    stateValues,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const label = labelMarkup({
        label: stateValues?.label,
        labelHasLatex: stateValues?.labelHasLatex,
    });

    if (!label) {
        return null;
    }

    const attrs = [];
    const rawPosition = stateValues?.labelPosition;
    if (rawPosition) {
        const alignment =
            prefigurePointAlignmentByLabelPosition[normalizeKey(rawPosition)];

        if (alignment) {
            attrs.push(`alignment="${escapeXml(alignment)}"`);
        } else {
            pushWarning({
                warnings,
                message: `${warningPrefix}: unsupported labelPosition '${rawPosition}' for point label; default PreFigure alignment used.`,
                position: warningPosition,
            });
        }
    }

    return { attrs, label };
}

/**
 * Maps Doenet `labelPosition` to a PreFigure `label-location` value.
 *
 * We use small insets (`LINE_LABEL_LOCATION_NEAR_START` and
 * `LINE_LABEL_LOCATION_NEAR_END`) rather than hard 0/1 so labels near the
 * graph boundary are less likely to be clipped and tend to flow inward.
 */
export function lineLabelLocationFromPosition(labelPosition, ep1, ep2) {
    const pos = normalizeKey(labelPosition ?? "");
    switch (pos) {
        case "left":
        case "upperleft":
        case "lowerleft":
            return LINE_LABEL_LOCATION_NEAR_START;
        case "right":
        case "upperright":
        case "lowerright":
            return LINE_LABEL_LOCATION_NEAR_END;
        case "center":
            return null; // PreFigure default is 0.5 — omit for brevity
        case "top":
            if (ep2[1] > ep1[1]) return LINE_LABEL_LOCATION_NEAR_END;
            if (ep2[1] < ep1[1]) return LINE_LABEL_LOCATION_NEAR_START;
            return null; // horizontal — no distinct top
        case "bottom":
            if (ep2[1] < ep1[1]) return LINE_LABEL_LOCATION_NEAR_END;
            if (ep2[1] > ep1[1]) return LINE_LABEL_LOCATION_NEAR_START;
            return null; // horizontal — no distinct bottom
        default:
            return null;
    }
}

/**
 * Returns the numeric label-location used by vector-label anchor interpolation.
 */
export function lineLabelLocationValue(labelPosition, ep1, ep2) {
    const locText = lineLabelLocationFromPosition(labelPosition, ep1, ep2);
    if (locText === null) {
        return 0.5;
    }

    const parsed = Number(locText);
    return Number.isFinite(parsed) ? parsed : 0.5;
}

/**
 * Returns label attrs/content for a PreFigure `<line>` element.
 *
 * Emits `label-location` to position the label along the visible line.
 * Does NOT emit `alignment` — PreFigure internally forces line label
 * alignment to "north" (above the line) regardless of any passed value.
 *
 * ep1 and ep2 must be the ORIENTED endpoint arrays produced by
 * `orientEndpointsForLineLabel`.
 */
export function lineLabelAttributes({
    stateValues,
    ep1,
    ep2,
    warnings,
    warningPrefix,
    warningPosition,
}) {
    const label = labelMarkup({
        label: stateValues?.label,
        labelHasLatex: stateValues?.labelHasLatex,
    });

    if (!label) {
        return null;
    }

    const attrs = [];
    const rawPosition = stateValues?.labelPosition;
    if (rawPosition) {
        const loc = lineLabelLocationFromPosition(rawPosition, ep1, ep2);
        if (loc !== null) {
            attrs.push(`label-location="${escapeXml(loc)}"`);
        }
    }

    return { attrs, label };
}
