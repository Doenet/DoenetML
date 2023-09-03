import { DastNodes } from "../../../types";
import { visit, VisitInfo } from "./visit";

/**
 * Recursively replace nodes in `ast`. The `visitor` function is called on each node. If
 * `visitor` returns a node or an array of nodes, those nodes replace the node passed to `visitor`.
 * If `null` is returned, the node is deleted. If `undefined` is returned, no replacement happens.
 */
export function replaceNode(
    ast: DastNodes | DastNodes[],
    visitor: (
        node: DastNodes,
        info: VisitInfo,
    ) => DastNodes | DastNodes[] | null | undefined | void,
) {
    visit(ast, {
        leave: (node, info) => {
            let replacement = visitor(node, info);
            // Returning `undefined` or the same node means we shouldn't replace that node
            if (typeof replacement === "undefined" || replacement === node) {
                return;
            }

            if (!info.containingArray || info.index == null) {
                throw new Error(
                    "Trying to replace node, but cannot find containing array",
                );
            }

            if (
                replacement === null ||
                (Array.isArray(replacement) && replacement.length === 0)
            ) {
                // A null return means that we delete the current node
                info.containingArray.splice(info.index, 1);
                return info.index;
            }

            if (!Array.isArray(replacement)) {
                replacement = [replacement];
            }

            info.containingArray.splice(info.index, 1, ...replacement);
            // We don't want to *reprocess* the nodes we just inserted into the array,
            // lest we get stuck in a recursive loop if the replacement contains the original.
            // Thus we jump to the index after our replacements.
            return info.index + replacement.length;
        },
    });
}
