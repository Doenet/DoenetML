import { DastElement } from "../../types";
import { isMadeFromSource } from "./utils/extend";

/**
 * Add the numerator and denominator input boxes as children of a
 * `<fractionInput>`. Each is a `_fractionInputComponent` tagged with its
 * `part` so the parent can route prefills and values to the correct box.
 *
 * A `<fractionInput>` written with `extend`, `copy` or `copyWithState` has
 * its source's boxes, so it gets none here: two more would be added to the
 * source's, and an extend would report them as children it ignores.
 */
export function fractionInputSugar(node: DastElement) {
    if (isMadeFromSource(node)) {
        return;
    }
    const makeInput = (part: string): DastElement => ({
        type: "element",
        name: "_fractionInputComponent",
        attributes: {
            part: {
                type: "attribute",
                name: "part",
                children: [{ type: "text", value: part }],
            },
        },
        children: [],
        position: node.position,
        source_doc: node.source_doc,
    });

    node.children.splice(
        0,
        0,
        makeInput("numerator"),
        makeInput("denominator"),
    );
}
