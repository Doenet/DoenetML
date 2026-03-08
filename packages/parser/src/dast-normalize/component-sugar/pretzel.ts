import { DastElement } from "../../types";

/**
 * 1. For each `<problem>` child, replace each direct `<answer>` child with `<givenAnswer>`.
 * 2. Wrap the resulting children in a single `<_pretzelArranger>` child.
 * 3. Forward `mode` to the arranger so mode-specific ordering can be computed.
 */
export function pretzelSugar(node: DastElement) {
    if (node.name !== "pretzel") {
        // This should be unreachable
        throw Error("Pretzel sugar can only be applied to a `<pretzel>`");
    }

    for (const child of node.children) {
        if (child.type === "element" && child.name === "problem") {
            for (const grandChild of child.children) {
                if (
                    grandChild.type === "element" &&
                    grandChild.name === "answer"
                ) {
                    grandChild.name = "givenAnswer";
                }
            }
        }
    }

    node.children = [
        {
            type: "element",
            name: "_pretzelArranger",
            children: node.children,
            attributes: node.attributes.mode
                ? { mode: node.attributes.mode }
                : {},
            source_doc: node.source_doc,
            position: node.position,
        },
    ];
}
