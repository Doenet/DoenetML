import { DastElement } from "../../types";

/**
 * Wrap all the children of a `<drill>` into a `<_drillRound>`.
 *
 * The children of a `<drill>` are a template for one question. The
 * `<_drillRound>` keeps them as a template and holds a single live copy of
 * them at a time, made afresh (with its own random values) for each round.
 */
export function drillSugar(node: DastElement) {
    if (node.name !== "drill") {
        // This should be unreachable
        throw Error("Drill sugar can only be applied to a `<drill>`");
    }

    node.children = [
        {
            type: "element",
            name: "_drillRound",
            children: node.children,
            attributes: {},
            source_doc: node.source_doc,
        },
    ];
}
