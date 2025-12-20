import { DastElement } from "../../types";

/**
 * If there is a `description` attribute, turn it into a `<shortDescription>` child.
 */
export function descriptionAttributeSugar(node: DastElement) {
    if (
        ![
            "image",
            "graph",
            "answer",
            "mathInput",
            "textInput",
            "choiceInput",
            "booleanInput",
            "matrixInput",
        ].includes(node.name)
    ) {
        // This should be unreachable
        throw Error(
            "Description attribute sugar can only be applied to an `<image>`, `<graph>`, `<answer>` or `<*Input>`.",
        );
    }

    const descriptionAttribute = node.attributes["description"];

    if (descriptionAttribute) {
        delete node.attributes["description"];
        const shortDescriptionChild: DastElement = {
            type: "element",
            name: "shortDescription",
            children: descriptionAttribute.children,
            position: descriptionAttribute.position,
            source_doc: descriptionAttribute.source_doc,
            attributes: {},
        };
        node.children.splice(0, 0, shortDescriptionChild);
    }
}
