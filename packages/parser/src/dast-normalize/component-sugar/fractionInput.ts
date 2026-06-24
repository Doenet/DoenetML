import { DastElement } from "../../types";

/**
 * Add the numerator and denominator input boxes as children of a
 * `<fractionInput>`. Each is a `_fractionInputComponent` tagged with its
 * `part` so the parent can route prefills and values to the correct box.
 */
export function fractionInputSugar(node: DastElement) {
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
