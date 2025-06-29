import { DastElement } from "../../types";

/**
 * Wrap all children of `<solution>` into a `<_postponeRenderContainer>`
 * so that solutions are not created when a document is loaded, speeding up initial render time.
 */
export function solutionSugar(node: DastElement) {
    if (node.name !== "solution" && node.name !== "givenAnswer") {
        // This should be unreachable
        throw Error(
            "Solution sugar can only be applied to a `<solution>` or a `<givenAnswer>`",
        );
    }

    node.children = [
        {
            type: "element",
            name: "_postponeRenderContainer",
            children: node.children,
            attributes: {},
        },
    ];
}
