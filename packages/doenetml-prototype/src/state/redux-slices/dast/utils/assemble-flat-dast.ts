import { FlatDastRoot } from "@doenet/doenetml-worker-rust";
import { DastElement, DastRoot, DastText } from "@doenet/parser";

/**
 * Convert a `FlatDastRoot` to a `DastRoot`.
 */
export function assembleFlatDast(flatDast: FlatDastRoot): DastRoot {
    const ret: DastRoot = {
        type: "root",
        children: flatDast.children.map((child) =>
            dastFromFlatArray(flatDast.elements, child),
        ),
    };
    return ret;
}

/**
 * Return an assembled version of a single node specified by id/index in the array.
 */
function dastFromFlatArray(
    flatDastArray: FlatDastRoot["elements"],
    nodeId: number = 0,
) {
    const node = flatDastArray[nodeId];
    if (!node) {
        throw new Error(`No node with id ${nodeId}`);
    }
    if (node.type === "error") {
        return node;
    }
    const ret: DastElement = {
        ...node,
        children: node.children.map((child) => {
            switch (typeof child) {
                case "number": {
                    const retElement = dastFromFlatArray(
                        flatDastArray,
                        child,
                    ) as DastElement;
                    return retElement;
                }

                case "string": {
                    const retText: DastText = {
                        type: "text",
                        value: child,
                    };
                    return retText;
                }
                default:
                    throw new Error(
                        `FlatDast children must be numbers or strings`,
                    );
            }
        }),
    };

    return ret;
}
