import React from "react";
import { DynamicMath } from "./DynamicMath";

/**
 * Render a label as plain text or as inline MathJax, depending on whether the
 * source string is LaTeX.
 */
export function renderLabelWithLatex({
    label,
    labelHasLatex,
}: {
    label: string;
    labelHasLatex: boolean;
}): React.ReactNode {
    if (labelHasLatex) {
        return <DynamicMath latex={label} />;
    }

    return label;
}

/**
 * Return an accessible label string for assistive technologies.
 *
 * For LaTeX labels, prefer a plain-language fallback so range-input aria labels
 * don't announce raw TeX markup.
 */
export function accessibleLabelText({
    label,
    labelHasLatex,
    fallback,
}: {
    label: string;
    labelHasLatex: boolean;
    fallback: string;
}): string {
    const trimmed = label.trim();
    if (!trimmed) {
        return fallback;
    }

    // For LaTeX labels, use a plain-language fallback for assistive tech.
    return labelHasLatex ? fallback : trimmed;
}
