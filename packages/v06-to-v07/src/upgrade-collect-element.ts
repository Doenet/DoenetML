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
    replaceNode,
    toXml,
    visit,
} from "@doenet/parser";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { reparseAttribute } from "./reparse-attribute";
import { getUniqueName } from "./utils";
import { determinePropType } from "./core-info/determine-prop-type";

/**
 * Upgrade the `<collect>` element to the new syntax.
 * ```xml
 *    <collect componentTypes="point" name="points" source="panel1" assignNames="q1 q2 q3 q4 q5" />
 *    $q3
 * ```
 * becomes
 * ```xml
 *   <collect componentType="point" name="points" from="$panel1" />
 *   $points[3]
 * ```
 */
export const upgradeCollectElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        // If `assignNames` is present, we need to rename a bunch of references
        const refsToRename: Record<string, DastMacro["path"]> = {};

        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name !== "collect") {
                // No affected attributes, nothing to do
                return;
            }
            // `componentTypes` is now `componentType`
            if (node.attributes["componentTypes"]) {
                renameAttrInPlace(node, "componentTypes", "componentType");
            }
            // `source` is now `from`
            if (node.attributes["source"]) {
                renameAttrInPlace(node, "source", "from");
                // Ensure the value starts with a dollar sign
                const fromValue = toXml(node.attributes["from"].children);
                if (!fromValue.startsWith("$")) {
                    node.attributes["from"].children = reparseAttribute(
                        `$${fromValue}`,
                    );
                }
            } else if (node.attributes["target"]) {
                // `target` could also now be`from`
                renameAttrInPlace(node, "target", "from");
                // Ensure the value starts with a dollar sign
                const fromValue = toXml(node.attributes["from"].children);
                if (!fromValue.startsWith("$")) {
                    node.attributes["from"].children = reparseAttribute(
                        `$${fromValue}`,
                    );
                }
            }
            const assignNames = node.attributes["assignNames"];
            if (!assignNames) {
                return;
            }
            delete node.attributes["assignNames"];
            const assignedNames = toXml(assignNames.children)
                .split(/\s+/)
                .filter((n) => n);
            assignedNames.forEach((name, index) => {
                const strRepr = `$${toXml(node.attributes["name"].children)}[${index + 1}]`;
                const attr = reparseAttribute(strRepr)?.[0];
                // attr should contain a single macro
                if (!attr || attr.type !== "macro") {
                    throw new Error(
                        `Expected attribute to be a single macro, got: ${JSON.stringify(attr)}`,
                    );
                }
                refsToRename[name] = attr.path;
            });
        });

        // If the `<collect>` has a `prop` attribute, it needs to be hoisted into a `<setup>` tag
        // and a `mathList` needs to extend the hoisted tag. E.g.
        // ```xml
        //   <collect componentType="point" name="points" from="$panel1"
        //     prop="x" assignNames="q1 q2 q3 q4 q5" />
        // ```
        // becomes
        // ```xml
        //   <setup>
        //     <collect componentType="point" name="collect_points" from="$panel1" />
        //   </setup>
        //   <mathList name="points" extend="$collect_points.x" />
        // ```
        replaceNode(tree, (node) => {
            if (!isDastElement(node) || node.name !== "collect") {
                return;
            }

            const propAttr = node.attributes["prop"];
            const propName = toXml(propAttr?.children).trim();
            if (!propName) {
                return;
            }
            delete node.attributes["prop"];
            // Create a new `<setup>` element
            const setup: DastElement = {
                type: "element",
                name: "setup",
                attributes: {},
                children: [node],
            };
            const componentType = toXml(
                node.attributes["componentType"]?.children,
            ).trim();
            // The `mathList` will have the name originally given to the `collect`
            // We need a new name for the collect.

            const listName = node.attributes["name"]
                ? toXml(node.attributes["name"].children)
                : getUniqueName(tree, "list");
            const collectName = getUniqueName(tree, `collect_${listName}`);
            node.attributes["name"] = {
                type: "attribute",
                name: "name",
                children: [{ type: "text", value: collectName }],
            };
            let listType = determinePropType(componentType, propName);
            if (!listType) {
                file.message(
                    `Could not determine type for prop "${propName}" of component type "${componentType}". Using "math" as default.`,
                    { place: node.position },
                );
                listType = "math";
            }
            const list: DastElement = {
                type: "element",
                // We assume there is a corresponding `*List` type. (E.g., `mathList`, `pointList`, etc.)
                // If there is not, it is the author's responsibility to fix it.
                name: `${listType}List`,
                attributes: {
                    name: {
                        type: "attribute",
                        name: "name",
                        children: [{ type: "text", value: listName }],
                    },
                    extend: {
                        type: "attribute",
                        name: "extend",
                        children: reparseAttribute(
                            `$${collectName}.${propName}`,
                        ),
                    },
                },
                children: [],
            };
            return [setup, list];
        });

        // Now that we have collected all of the renames, we walk the tree again and
        // apply them.
        visit(tree, (node) => {
            if (node.type !== "macro") {
                return;
            }
            // See if there is part of the macro path that matches anything in `refsToRename`
            if (!node.path.some((part) => refsToRename[part.name])) {
                return;
            }

            // Splice in the new path parts at the location of the matching part
            node.path = node.path.flatMap((part) => {
                return refsToRename[part.name] || [part];
            });
        });
    };
};
