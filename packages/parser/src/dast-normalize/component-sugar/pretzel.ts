import { DastElement } from "../../types";

/**
 * 1. For each `<problem>` child, replaces its `<answer>` children with `<givenAnswers>`.
 * 2. Wrap all children into a `<_pretzelArranger>`
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
            attributes: {},
            source_doc: node.source_doc,
            position: node.position,
        },
    ];
}
