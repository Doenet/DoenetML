import { FlatElement, NormalizedNode } from "@doenet/doenetml-worker";

/**
 * Returns an accessibility warning for components that require a short
 * description unless marked as decorative (when supported).
 *
 * @param node The element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns Warning message or null.
 */
export function getDecorativeShortDescriptionWarning(
    node: FlatElement,
    nodes: NormalizedNode[],
) {
    // only graph or image can be decorative
    const allowDecorative = ["graph", "image"].includes(node.name);

    if (allowDecorative) {
        const decorativeAttr = node.attributes.find(
            (attr) => attr.name === "decorative",
        );
        if (decorativeAttr) {
            // If decorative attribute is present and not set to "false", then graph is decorative, so no accessibility warning
            if (
                decorativeAttr.children.length !== 1 ||
                typeof decorativeAttr.children[0] !== "string" ||
                decorativeAttr.children[0]?.toLowerCase() !== "false"
            ) {
                // Graph is decorative, so no accessibility warning
                return null;
            }
        }
    }

    // If not decorative, then graph must contain a non-blank short description

    for (const child of node.children) {
        if (typeof child === "string") {
            continue;
        }
        const childNode = nodes[child];
        if (childNode.type === "element") {
            if (childNode.name === "shortDescription") {
                // If short description contains any non-whitespace text or any non-text children,
                // then it is considered non-blank
                if (
                    childNode.children.some(
                        (grandChild) =>
                            typeof grandChild !== "string" ||
                            grandChild.trim() !== "",
                    )
                ) {
                    // Graph has a non-blank short description, so no accessibility warning
                    return null;
                }
            }
        }
    }

    if (allowDecorative) {
        return `For accessibility, <${node.name}> must either have a short description or be specified as decorative.`;
    } else {
        return `For accessibility, <${node.name}> must have a short description.`;
    }
}
