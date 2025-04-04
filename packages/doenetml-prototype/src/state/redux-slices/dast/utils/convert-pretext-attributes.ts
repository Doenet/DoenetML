import { Plugin } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastMacro,
    DastRoot,
    DastRootContent,
    isDastElement,
    visit,
} from "@doenet/parser";
import { unified } from "unified";
import { ELEMENT_EXPANSIONS } from "./element-expansions";

/**
 * PreTeXt follows some different conventions from DoenetML. For instance, it uses `xml:id` instead of `name`.
 * It also uses `<xref ref="name" />` instead of `<xref ref="$name" />`. This plugin converts PreTeXt style
 * attributes to DoenetML style attributes.
 */
export const pluginConvertPretextAttributes: Plugin<
    [],
    DastRoot,
    DastRoot
> = () => {
    return (tree) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.attributes["xml:id"]) {
                // Convert `xml:id` to `name`
                const attr = node.attributes["xml:id"];
                attr.name = "name";
                delete node.attributes["xml:id"];
                node.attributes.name = attr;
            }

            if (node.name === "xref") {
                // Test if the ref is a `$ref` or a `ref`.
                const refAttr = node.attributes.ref;
                if (!refAttr) {
                    return;
                }

                const hasMacroChild = refAttr.children.some(
                    (child) => child.type === "macro",
                );
                const hasNonWhitespaceTextChild = refAttr.children.some(
                    (child) =>
                        child.type === "text" && child.value.trim() !== "",
                );
                if (hasMacroChild || !hasNonWhitespaceTextChild) {
                    // No need to convert. If we're in this case we already have a `$ref` or
                    // for some reason the ref field is empty.
                    return;
                }

                // Get the text value of the ref attribute
                const refText = refAttr.children
                    .map((child) => (child.type === "text" ? child.value : ""))
                    .join("");
                const position = refAttr.position!;

                let macro: DastMacro = {
                    type: "macro",
                    attributes: {},
                    path: [
                        {
                            type: "pathPart",
                            index: [],
                            name: refText,
                        },
                    ],
                };

                // Replace the ref attribute with a macro
                refAttr.children.length = 0;
                refAttr.children.push(macro);
            }
        });
    };
};
