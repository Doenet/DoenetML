import { FlatElement, NormalizedNode } from "@doenet/doenetml-worker";

/**
 * Determines whether a component has a non-blank child element with one of the
 * specified names.
 *
 * A matching child is considered non-blank when it contains any non-whitespace
 * text child or any non-text child.
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
 * Determines whether a component has an implicit label produced by `labelIsName`.
 *
 * A component is treated as labeled when it has both a `name` attribute and a
 * `labelIsName` attribute whose value is not explicitly `"false"`.
 *
 * The `name` attribute is treated as present only when it has exactly one
 * string child that does not start with `_`.
 *
 * @param node The element to evaluate.
 * @returns True if `labelIsName` produces a label from `name`.
 */
function hasLabelFromNameAndLabelIsName(node: FlatElement): boolean {
    const nameAttr = node.attributes.find((attr) => attr.name === "name");
    if (!nameAttr) {
        return false;
    }

    if (
        nameAttr.children.length !== 1 ||
        typeof nameAttr.children[0] !== "string" ||
        nameAttr.children[0].startsWith("_")
    ) {
        return false;
    }

    const labelIsNameAttr = node.attributes.find(
        (attr) => attr.name === "labelIsName",
    );
    if (!labelIsNameAttr) {
        return false;
    }

    const explicitlyFalse =
        labelIsNameAttr.children.length === 1 &&
        typeof labelIsNameAttr.children[0] === "string" &&
        labelIsNameAttr.children[0].toLowerCase() === "false";

    return !explicitlyFalse;
}

/**
 * Determines whether a component has a non-blank short description or label.
 * A description/label is considered non-blank when it contains any
 * non-whitespace text child or any non-text child.
 *
 * Also returns true when a label is produced implicitly from `labelIsName`
 * and a valid explicit `name` attribute.
 *
 * @param node The element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns True if a non-blank short description or label is found.
 */
export function hasNonBlankShortDescriptionOrLabel(
    node: FlatElement,
    nodes: NormalizedNode[],
): boolean {
    return (
        hasNonBlankNamedChild(node, nodes, ["shortDescription", "label"]) ||
        hasLabelFromNameAndLabelIsName(node)
    );
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
