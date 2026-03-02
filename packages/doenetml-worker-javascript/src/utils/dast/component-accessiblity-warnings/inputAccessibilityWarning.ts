import { FlatElement, NormalizedNode } from "@doenet/doenetml-worker";

/**
 * Returns an accessibility warning for an input component that lacks a
 * non-blank short description or label.
 *
 * @param node The input element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns Warning message or null.
 */
export function getInputAccessibilityWarning(
    node: FlatElement,
    nodes: NormalizedNode[],
) {
    for (const child of node.children) {
        if (typeof child === "string") {
            continue;
        }
        const childNode = nodes[child];
        if (childNode.type === "element") {
            if (
                childNode.name === "shortDescription" ||
                childNode.name === "label"
            ) {
                // If short description or label contains any non-whitespace text or any non-text children,
                // then it is considered non-blank
                if (
                    childNode.children.some(
                        (grandChild) =>
                            typeof grandChild !== "string" ||
                            grandChild.trim() !== "",
                    )
                ) {
                    // Input has a non-blank short description or label, so no accessibility warning
                    return null;
                }
            }
        }
    }

    return `For accessibility, <${node.name}> must have a short description or a label.`;
}
