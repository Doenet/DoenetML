import { FlatElement, NormalizedNode } from "@doenet/doenetml-worker";

/**
 * Returns an accessibility warning for an `answer` when it is determined to
 * create an input but lacks a non-blank short description or label.
 *
 * @param node The `answer` element to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns Warning message or null.
 */
export function getAnswerAccessibilityWarning(
    node: FlatElement,
    nodes: NormalizedNode[],
) {
    // If an answer will definitely have an input sugared into it,
    // then it needs a non-blank short description or label to be accessible.
    // (If we cannot determine for sure that an input will be sugared in, then we do not give an accessibility warning.)

    // Algorithm for determining if an answer will definitely have an input sugared into it:
    // - If an answer has an input or considerAsResponse child, then no sugared input
    // - Else, if it has a choice child, then it will have a sugared choiceInput
    // - Else if it has a child that isn't an award or an award child that doesn't have a when child,
    //   then it will have a sugared input

    let foundNonAwardChild = false;
    let foundAwardWithoutWhen = false;
    let foundChoiceChild = false;

    for (const child of node.children) {
        if (typeof child === "string") {
            if (child.trim() !== "") {
                foundNonAwardChild = true;
            }
            continue;
        }
        const childNode = nodes[child];
        if (childNode.type === "element") {
            if (
                [
                    "booleanInput",
                    "choiceInput",
                    "mathInput",
                    "matrixInput",
                    "textInput",
                ].includes(childNode.name)
            ) {
                // Answer has an input child, so no sugared input and no accessibility warning
                return null;
            } else if (childNode.name === "considerAsResponse") {
                // Answer has a considerAsResponse child, so no sugared input and no accessibility warning
                return null;
            } else if (childNode.name === "choice") {
                // Answer has a choice child, so it will have a sugared choiceInput and needs a short description or label for that input to be accessible
                foundChoiceChild = true;
                continue;
            } else if (childNode.name === "award") {
                if (
                    !childNode.children.some(
                        (grandChild) =>
                            typeof grandChild !== "string" &&
                            ((grandChildNode) =>
                                grandChildNode.type === "element" &&
                                grandChildNode.name === "when")(
                                nodes[grandChild],
                            ),
                    )
                ) {
                    // Found an award child that doesn't have a when child, so answer will have a sugared input and needs a short description or label for that input to be accessible
                    foundAwardWithoutWhen = true;
                }
            } else if (
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

    if (foundChoiceChild || foundNonAwardChild || foundAwardWithoutWhen) {
        // Answer will have a sugared input, but it doesn't have a non-blank short description or label, so return an accessibility warning
        return `For accessibility, an <answer> creating an input must have a short description or a label.`;
    } else {
        return null;
    }
}
