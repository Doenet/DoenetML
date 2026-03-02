import { FlatElement, NormalizedNode } from "@doenet/doenetml-worker";
import { hasNonBlankShortDescriptionOrLabel } from "./shortDescriptionLabelUtils";

/**
 * Returns an accessibility warning for an input component that lacks a
 * non-blank short description or label.
 *
 * A label may be provided explicitly via a non-blank `label` child, or
 * implicitly via `labelIsName` with a valid explicit `name` attribute.
 *
 * @param node The input element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns Warning message or null.
 */
export function getInputAccessibilityWarning(
    node: FlatElement,
    nodes: NormalizedNode[],
) {
    if (hasNonBlankShortDescriptionOrLabel(node, nodes)) {
        return null;
    }

    return `For accessibility, <${node.name}> must have a short description or a label.`;
}
