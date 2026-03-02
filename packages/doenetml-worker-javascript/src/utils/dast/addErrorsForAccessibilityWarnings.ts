import {
    FlatElement,
    FlatError,
    NormalizedNode,
    NormalizedRoot,
    UntaggedContent,
} from "@doenet/doenetml-worker";
import { getDecorativeShortDescriptionWarning } from "./component-accessibility-warnings/decorativeShortDescriptionWarning";
import { getInputAccessibilityWarning } from "./component-accessibility-warnings/inputAccessibilityWarning";
import { getAnswerAccessibilityWarning } from "./component-accessibility-warnings/answerAccessibilityWarning";

/**
 * Recursively traverses a normalized DAST and inserts generated error nodes for
 * accessibility warnings next to the corresponding component nodes.
 *
 * @param normalized_root The normalized DAST root to process.
 * @returns A new normalized root with accessibility warning errors added.
 */
export function addErrorsForAccessibilityWarnings(
    normalized_root: NormalizedRoot,
): NormalizedRoot {
    const { newChildren: newComponents, newNodes } =
        addErrorsForAccessibilityWarningsToComponents(
            normalized_root.children,
            normalized_root.nodes,
        );
    return {
        ...normalized_root,
        children: newComponents,
        nodes: newNodes,
    };
}

/**
 * Recursively processes a list of child references, appending generated
 * accessibility warning errors and returning updated children and nodes.
 *
 * @param children Child references to process.
 * @param nodes Current normalized node list.
 * @returns Updated child references and normalized node list.
 */
function addErrorsForAccessibilityWarningsToComponents(
    children: UntaggedContent[],
    nodes: NormalizedNode[],
): { newChildren: UntaggedContent[]; newNodes: NormalizedNode[] } {
    const newChildren: UntaggedContent[] = [];
    let newNodes: NormalizedNode[] = [...nodes];

    for (const child of children) {
        newChildren.push(child);
        if (typeof child === "string") {
            continue;
        }
        let component = nodes[child];

        if (component.type !== "element") {
            continue;
        }

        const accessibilityWarning = getAccessibilityWarning(
            component,
            newNodes,
        );

        if (accessibilityWarning) {
            const newIdx = newNodes.length;
            const errorNode: FlatError = {
                idx: newIdx,
                type: "error",
                parent: component.parent,
                message: accessibilityWarning,
                errorType: "error",
                position: component.position,
                sourceDoc: component.sourceDoc,
            };
            newNodes.push(errorNode);
            newChildren.push(newIdx);
        }
        const { newChildren: newGrandChildren, newNodes: updatedNodes } =
            addErrorsForAccessibilityWarningsToComponents(
                component.children,
                newNodes,
            );

        component = { ...component, children: newGrandChildren };
        newNodes = updatedNodes;
        newNodes[child] = component;
    }

    return { newChildren, newNodes };
}

/**
 * Returns an accessibility warning message for supported element types, or
 * null when no warning should be produced.
 *
 * @param component The element component to evaluate.
 * @param nodes Full normalized node list used for child lookups.
 * @returns Warning message or null.
 */
function getAccessibilityWarning(
    component: FlatElement,
    nodes: NormalizedNode[],
): string | null {
    if (component.extending) {
        // If we have a reference or are extending/copying another component,
        // we would need to determine the referent to determine for sure
        // whether or not there will be an accessibility warning
        // (as well as make sure this is a reference that creates a component).
        // Since we cannot determine the referent at this stage,
        // we do not give an accessibility warning in this case.
        return null;
    }

    switch (component.name) {
        case "graph":
        case "image":
        case "video":
            return getDecorativeShortDescriptionWarning(component, nodes);
        case "booleanInput":
        case "choiceInput":
        case "mathInput":
        case "matrixInput":
        case "textInput":
            return getInputAccessibilityWarning(component, nodes);
        case "answer":
            return getAnswerAccessibilityWarning(component, nodes);
    }

    return null;
}
