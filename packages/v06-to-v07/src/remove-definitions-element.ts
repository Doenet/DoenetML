import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastMacro,
    DastMacroPathPart,
    DastRoot,
    DastRootContent,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";

/**
 * Remove the `<styleDefinitions>` or `<feedbackDefinitions>` element, adding its children in its place
 */
export const removeDefinitionsElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const definitionsNode = node.children.find(
                (child): child is DastElement =>
                    isDastElement(child) &&
                    (child.name === "styleDefinitions" ||
                        child.name === "feedbackDefinitions"),
            );
            if (definitionsNode) {
                // replace definitions node with its children
                node.children.splice(
                    node.children.indexOf(definitionsNode),
                    1,
                    ...definitionsNode.children,
                );
            }
        });
    };
};
