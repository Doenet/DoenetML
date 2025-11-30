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
 * Remove the `<constraints>` element, adding its children in its place
 */
export const removeConstraintsElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const constraintsNode = node.children.find(
                (child): child is DastElement =>
                    isDastElement(child) && child.name === "constraints",
            );
            if (constraintsNode) {
                // replace constraints node with its children
                node.children.splice(
                    node.children.indexOf(constraintsNode),
                    1,
                    ...constraintsNode.children,
                );
            }
        });
    };
};
