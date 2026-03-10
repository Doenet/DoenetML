import { escapeXml } from "./common";

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
export function pointLabelAttributes({ stateValues, warnings, warningPrefix }) {
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
            warnings.push({
                type: "warning",
                level: 1,
                message: `${warningPrefix}: unsupported labelPosition '${rawPosition}' for point label; default PreFigure alignment used.`,
            });
        }
    }

    return { attrs, label };
}
