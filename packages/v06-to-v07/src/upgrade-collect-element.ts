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
import { VFile } from "vfile";
import { renameAttrInPlace } from "./rename-attr-in-place";
import { reparseAttribute } from "./reparse-attribute";
import { determinePropType } from "./core-info/determine-prop-type";
import {
    AssignNamesContext,
    namespaceChainOf,
    deleteAssignNames,
    readAssignNames,
    setCompositeName,
} from "./assign-names/context";
import { registerCompositeAssignNames } from "./assign-names/register-composite";
import { parseReferencePath } from "./assign-names/apply-renames";
import { isValidReferenceableName } from "./assign-names/rename-registry";
import { markAsPropAccess } from "./assign-names/prop-access-parts";

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
        visit(tree, (node, info) => {
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
            // `source` — or `target`, which meant the same thing — is now `from`
            for (const oldKey of ["source", "target"]) {
                if (!node.attributes[oldKey]) {
                    continue;
                }
                renameAttrInPlace(node, oldKey, "from");
                makeFromAReference(node, file);
                break;
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
                ancestorNames: namespaceChainOf(info.parents, context),
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

            // Read the name the way every other pass does — trimmed — and generate one
            // when there is nothing usable. An untrimmed or empty value would end up
            // both as the list's `name` and inside the reference built below, where
            // `$collect_ c .x` does not parse.
            const authoredListName = node.attributes["name"]
                ? toXml(node.attributes["name"].children).trim()
                : "";
            const listName =
                authoredListName && isValidReferenceableName(authoredListName)
                    ? authoredListName
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
                        children: [
                            {
                                type: "macro",
                                path: [
                                    ...parseReferencePath(collectName),
                                    ...propPathParts(propName),
                                ],
                                attributes: {},
                            },
                        ],
                    },
                },
                children: [],
            };
            return [setup, list];
        });
    };
};

/**
 * Turn a `from` holding a bare component name into a real reference.
 *
 * Prefixing the text with a `$` is not enough: a hyphenated name only parses inside
 * `$(...)`, and `$foo-bar` would be read as `$foo` minus `bar`.
 */
function makeFromAReference(node: DastElement, file: VFile) {
    const attr = node.attributes["from"];
    const value = toXml(attr.children).trim();
    if (!value || value.startsWith("$")) {
        return;
    }
    try {
        attr.children = [
            {
                type: "macro",
                path: parseReferencePath(value),
                attributes: {},
            },
        ];
    } catch {
        file.message(
            `Could not read "${value}" as the name of what <collect> collects from.`,
            {
                place: node.position,
                ruleId: "collect/unparsable-from",
                source: "v06-to-v07",
            },
        );
    }
}

/**
 * The path parts naming a prop, marked as such.
 *
 * `applyAssignNameRenames` runs after this plugin and rewrites any path part that matches
 * an assigned name. Without the mark, a `<collect prop="y">` sitting in a document where
 * something else assigned the name `y` would have its prop rewritten into that
 * composite's index — `$collect_vals.y` becoming `$collect_vals.x[2]`.
 */
function propPathParts(propName: string) {
    const parts = parseReferencePath(propName);
    parts.forEach(markAsPropAccess);
    return parts;
}
