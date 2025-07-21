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
import { reparseAttribute } from "./reparse-attribute";

/**
 * Upgrade the `<module>` element to the new syntax.
 */
export const upgradeModuleElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name !== "module") {
                // No affected attributes, nothing to do
                return;
            }
            const setupNode = node.children.find(
                (child): child is DastElement =>
                    isDastElement(child) && child.name === "setup",
            );
            if (!setupNode) {
                // No need to upgrade the syntax
                return;
            }
            const nonSetupChildren = node.children.filter(
                (child) => !isDastElement(child) || child.name !== "setup",
            );

            const customAttributeNodes = setupNode.children.filter(
                (child): child is DastElement =>
                    isDastElement(child) && child.name === "customAttribute",
            );
            // We will turn `<setup>` into `<moduleAttributes>`; its children will be completely replaced
            setupNode.children = [];
            setupNode.name = "moduleAttributes";
            for (const customAttributeNode of customAttributeNodes) {
                const name = toXml(
                    customAttributeNode.attributes["assignNames"]?.children,
                )
                    .trim()
                    .split(/\s+/)[0];
                const componentType = toXml(
                    customAttributeNode.attributes["componentType"]?.children,
                ).trim();
                if (!componentType) {
                    file.message(
                        `Module "customAttribute" is missing a "componentType"; the syntax cannot be upgraded with a "componentType".`,
                        {
                            place: customAttributeNode.position,
                        },
                    );
                    continue;
                }
                const defaultValue =
                    customAttributeNode.attributes["defaultValue"]?.children ||
                    [];

                const newNode: DastElement = {
                    type: "element",
                    name: componentType,
                    attributes: {},
                    children: defaultValue,
                    position: customAttributeNode.position,
                };
                if (name) {
                    newNode.attributes["name"] = {
                        type: "attribute",
                        name: "name",
                        children: reparseAttribute(name),
                    };
                }
                setupNode.children.push(newNode);
            }
        });
    };
};
