import { DastElement } from "../../types";

/**
 * Add a `<_dynamicChildren>` to the children so additional children can be added via an addChildren action.
 */
export function graphSugar(node: DastElement) {
    if (node.name !== "graph") {
        // This should be unreachable
        throw Error("graph sugar can only be applied to a `<graph>`");
    }

    node.children.push({
        type: "element",
        name: "_dynamicChildren",
        children: [],
        attributes: {},
        source_doc: node.source_doc,
    });
}
