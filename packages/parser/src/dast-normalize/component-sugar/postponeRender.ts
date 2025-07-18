import { DastElement, DastElementContent } from "../../types";

/**
 * Wrap all children other than `<title>`s into a `<_postponeRenderContainer>`
 * so that the content is not created when a document is loaded, speeding up initial render time.
 */
export function postponeRenderSugar(node: DastElement) {
    if (!["solution", "givenAnswer", "aside", "proof"].includes(node.name)) {
        // This should be unreachable
        throw Error(
            "Postpone render sugar can only be applied to a `<solution>`, `<givenAnswer>`, `<aside>`, or `<proof>`",
        );
    }

    const titleChildren: DastElementContent[] = [];
    const postponedChildren: DastElementContent[] = [];

    for (const child of node.children) {
        if (child.type === "element" && child.name === "title") {
            titleChildren.push(child);
        } else {
            postponedChildren.push(child);
        }
    }

    node.children = [
        ...titleChildren,
        {
            type: "element",
            name: "_postponeRenderContainer",
            children: postponedChildren,
            attributes: {},
            source_doc: node.source_doc,
        },
    ];
}
