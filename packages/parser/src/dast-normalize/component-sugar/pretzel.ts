import { DastElement } from "../../types";

/**
 * Wrap all children into a `<_pretzelArranger>`
 */
export function pretzelSugar(node: DastElement) {
    if (node.name !== "pretzel") {
        // This should be unreachable
        throw Error("Pretzel sugar can only be applied to a `<pretzel>`");
    }

    node.children = [
        {
            type: "element",
            name: "_pretzelArranger",
            children: node.children,
            attributes: {},
            source_doc: node.source_doc,
        },
    ];
}
