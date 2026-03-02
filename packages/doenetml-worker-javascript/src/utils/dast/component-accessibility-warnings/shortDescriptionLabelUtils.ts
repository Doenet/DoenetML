import { FlatElement, NormalizedNode } from "@doenet/doenetml-worker";

/**
 * Determines whether a component has a non-blank child element with one of the
 * specified names.
 *
 * @param node The element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @param validNames Child element names to consider.
 * @returns True if a matching child with non-blank content is found.
 */
function hasNonBlankNamedChild(
    node: FlatElement,
    nodes: NormalizedNode[],
    validNames: string[],
): boolean {
    const validNameSet = new Set(validNames);

    for (const child of node.children) {
        if (typeof child === "string") {
            continue;
        }

        const childNode = nodes[child];
        if (childNode.type !== "element") {
            continue;
        }

        if (!validNameSet.has(childNode.name)) {
            continue;
        }

        if (
            childNode.children.some(
                (grandChild) =>
                    typeof grandChild !== "string" || grandChild.trim() !== "",
            )
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Determines whether a component has a non-blank short description or label.
 * A description/label is considered non-blank when it contains any
 * non-whitespace text child or any non-text child.
 *
 * @param node The element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns True if a non-blank short description or label is found.
 */
export function hasNonBlankShortDescriptionOrLabel(
    node: FlatElement,
    nodes: NormalizedNode[],
): boolean {
    return hasNonBlankNamedChild(node, nodes, ["shortDescription", "label"]);
}

/**
 * Determines whether a component has a non-blank short description.
 * A short description is considered non-blank when it contains any
 * non-whitespace text child or any non-text child.
 *
 * @param node The element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns True if a non-blank short description is found.
 */
export function hasNonBlankShortDescription(
    node: FlatElement,
    nodes: NormalizedNode[],
): boolean {
    return hasNonBlankNamedChild(node, nodes, ["shortDescription"]);
}
