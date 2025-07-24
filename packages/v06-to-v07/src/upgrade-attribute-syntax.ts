import { Plugin } from "unified";
import {
    DastAttribute,
    DastElement,
    DastElementContent,
    DastMacro,
    DastMacroPathPart,
    DastNodes,
    DastRoot,
    DastRootContent,
    isDastElement,
    toXml,
    visit,
} from "@doenet/parser";
import { reparseAttribute } from "./reparse-attribute";

/**
 * Upgrade references with attribute syntax.
 * ```xml
 *   $x{foo="bar"}
 * ```
 * becomes
 * ```xml
 *   <copy source="x" foo="bar" />
 * ```
 * This must happen **before** the `upgradeCopySyntax` plugin resolves all the copy
 * elements.
 */
export const upgradeAttributeSyntax: Plugin<[], DastRoot, DastRoot> = () => {
    return async (tree, file) => {
        visit(tree, (node) => {
            if (node.type !== "macro") {
                return;
            }
            if (Object.keys(node.attributes).length === 0) {
                return;
            }
            // Found a macro with attributes
            // We directly convert it into a `copy` element
            const copy: DastElement = {
                type: "element",
                name: "copy",
                attributes: {
                    ...node.attributes,
                    source: {
                        type: "attribute",
                        name: "source",
                        children: reparseAttribute("$" + toXml(node.path)),
                    },
                },
                children: [],
            };
            // Delete the old (non-position) props
            Object.keys(node).forEach((key) => {
                if (key !== "position") {
                    // @ts-ignore
                    delete node[key];
                }
            });
            Object.assign(node, copy);
        });

        // If macros with attributes appear in an element's attribute,
        // we need to create a setup tag for them.
        const macrosInAttributes: { node: DastMacro }[] = [];
        visit(tree, (node, info) => {
            if (!isDastElement(node)) {
                return;
            }
            Object.entries(node.attributes).forEach(([name, attr]) => {
                for (const n of attr.children) {
                    if (
                        n.type === "macro" &&
                        Object.keys(n.attributes).length > 0
                    ) {
                        macrosInAttributes.push({
                            node: n,
                        });
                    }
                }
            });
        });

        if (macrosInAttributes.length === 0) {
            // We're done
            return;
        }
        // If we are here we are going to need to create new <copy> tags
        // inside of a <setup> tag. These need to be assigned unique names.
        const usedNames: Set<string> = new Set();
        // Gather all used names assigned via `name="..."` attributes
        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            const usedName = toXml(node.attributes["name"]?.children).trim();
            if (usedName) {
                usedNames.add(usedName);
            }
        });
        // It is possible that names are assigned via the `{name="..."}` syntax in a macro.
        // We already have a list of all macros with attributes, so add any of those names.
        for (const { node: macroNode } of macrosInAttributes) {
            const nameAttr = toXml(
                macroNode.attributes["name"]?.children,
            ).trim();
            if (nameAttr) {
                usedNames.add(nameAttr);
            }
        }

        let nameCounter = 1;
        /**
         * Generate a globally unique name in the form of `ref1`, `ref2`, etc.
         */
        function generateUniqueName(): string {
            let name = `ref${nameCounter}`;
            while (usedNames.has(name)) {
                name = `ref${nameCounter}`;
                nameCounter++;
            }
            usedNames.add(name);
            return name;
        }
        const setupTag: DastElement = {
            type: "element",
            name: "setup",
            attributes: {},
            children: [],
        };
        for (const { node: macroNode } of macrosInAttributes) {
            const copy: DastElement = {
                type: "element",
                name: "copy",
                attributes: {
                    source: {
                        type: "attribute",
                        name: "source",
                        children: reparseAttribute(`$${toXml(macroNode.path)}`),
                    },
                    ...macroNode.attributes,
                },
                children: [],
            };
            // If the macro has a `name` attribute, we need to add it to the copy
            const nameAttr = macroNode.attributes["name"];
            let name = nameAttr
                ? toXml(nameAttr.children).trim()
                : generateUniqueName();
            copy.attributes["name"] = {
                type: "attribute",
                name: "name",
                children: reparseAttribute(name),
            };
            setupTag.children.push(copy);

            // Now that a new setup tag has been created, remove all the attributes
            // and point the macro to its newly named referent.
            macroNode.attributes = {};
            macroNode.path = [
                {
                    type: "pathPart",
                    name,
                    index: [],
                },
            ];
        }
        let documentElement = tree.children.find(
            (n) => isDastElement(n) && n.name === "document",
        ) as DastElement | DastRoot | undefined;
        if (!documentElement) {
            documentElement = tree;
        }

        documentElement.children.unshift(setupTag);
    };
};
