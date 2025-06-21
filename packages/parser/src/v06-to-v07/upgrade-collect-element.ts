import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastMacro,
    DastMacroPathPart,
    DastRoot,
    DastRootContent,
} from "../types";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { toXml } from "../dast-to-xml/dast-util-to-xml";
import { reparseAttribute } from "./reparse-attribute";

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
    return (tree) => {
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
