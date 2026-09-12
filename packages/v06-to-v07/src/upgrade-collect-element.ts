import { Plugin, unified } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastRoot,
    DastRootContent,
    isDastElement,
    replaceNode,
    toXml,
    visit,
} from "@doenet/parser";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { reparseAttribute } from "./reparse-attribute";
import { determinePropType } from "./core-info/determine-prop-type";
import {
    AssignNamesContext,
    deleteAssignNames,
    readAssignNames,
    setCompositeName,
} from "./assign-names/context";
import { registerCompositeAssignNames } from "./assign-names/register-composite";

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
export const upgradeCollectElement: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
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
            const assignNamesValue = readAssignNames(node);
            if (!assignNamesValue) {
                deleteAssignNames(node);
                return;
            }
            // Note: the name registered here must be the one an author references. When
            // this `<collect>` has a `prop`, the hoisting step below moves this name onto
            // the generated list element and renames the collect itself, so giving the
            // collect a name *now* is what makes both paths agree.
            const compositeName = registerCompositeAssignNames({
                node,
                assignNamesValue,
                fallbackBase: "collect",
                context,
                file,
            });
            if (compositeName === undefined) {
                deleteAssignNames(node);
                return;
            }
            setCompositeName(node, compositeName);
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
                : context.uniqueName("list");
            const collectName = context.uniqueName(`collect_${listName}`);
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
    };
};
