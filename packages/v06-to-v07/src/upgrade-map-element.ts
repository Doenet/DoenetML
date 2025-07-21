import { Plugin, unified } from "unified";
import {
    DastElement,
    DastMacro,
    DastRoot,
    isDastElement,
    replaceNode,
    toXml,
    visit,
} from "@doenet/parser";
import { reparseAttribute } from "./reparse-attribute";
import { getUniqueName } from "./utils";

/**
 * Upgrade the `<map>` element to the new syntax.
 */
export const upgradeMapElement: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree, file) => {
        // If `assignNames` is present, we need to rename a bunch of references
        const refsToRename: Record<string, DastMacro["path"]> = {};

        replaceNode(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name !== "map") {
                // No affected attributes, nothing to do
                return;
            }
            const name = toXml(node.attributes["name"]?.children).trim();
            const assignNames = toXml(node.attributes["assignNames"]?.children)
                .trim()
                .split(/\s+/);

            // If we have both a `name` and `assignNames`, there are macros that need to be renamed
            if (name && assignNames.length > 0) {
                assignNames.forEach((assignName, index) => {
                    refsToRename[assignName] = [
                        {
                            type: "pathPart",
                            name: name,
                            index: [
                                {
                                    type: "index",
                                    value: [
                                        {
                                            type: "text",
                                            value: `${index + 1}`,
                                        },
                                    ],
                                },
                            ],
                        },
                    ];
                });
            }

            const templateNode = node.children.find(
                (child) => isDastElement(child) && child.name === "template",
            );
            const sourcesNode = node.children.find(
                (child) => isDastElement(child) && child.name === "sources",
            );
            if (
                !templateNode ||
                !isDastElement(templateNode) ||
                !sourcesNode ||
                !isDastElement(sourcesNode)
            ) {
                // We don't know how to convert in this case
                file.message(
                    `Map element must have both a template and sources children to be converted`,
                    { place: node.position },
                );
                // We always must have a template and a sources.
                return;
            }

            const valueName = toXml(
                sourcesNode.attributes["alias"]?.children,
            ).trim();
            const indexName = toXml(
                sourcesNode.attributes["indexAlias"]?.children,
            ).trim();

            let sequenceNode: DastElement | undefined;
            if (
                (sequenceNode = sourcesNode.children.find(
                    (child) =>
                        isDastElement(child) && child.name === "sequence",
                ) as DastElement)
            ) {
                // We have a `<sequence>` node. This gets converted to a `<repeatForSequence>` node.

                if (name) {
                    sequenceNode.attributes["name"] = {
                        type: "attribute",
                        name: "name",
                        children: reparseAttribute(name),
                    };
                }
                sequenceNode.name = "repeatForSequence";
                if (valueName) {
                    sequenceNode.attributes["valueName"] = {
                        type: "attribute",
                        name: "valueName",
                        children: reparseAttribute(valueName),
                    };
                }
                if (indexName) {
                    sequenceNode.attributes["indexName"] = {
                        type: "attribute",
                        name: "indexName",
                        children: reparseAttribute(indexName),
                    };
                }

                // Put in the correct children
                sequenceNode.children = templateNode.children;

                // The whole `<map>` element gets replaced with the `<repeatForSequence>`
                return sequenceNode;
            } else {
                // If we have no `<sequence>` node, the contents are an explicit list that turns into a `<group>` element
                // in a `<setup>` tag.
                const groupTag: DastElement = {
                    type: "element",
                    name: "group",
                    attributes: {},
                    children: sourcesNode.children,
                };
                const setupTag: DastElement = {
                    type: "element",
                    name: "setup",
                    attributes: {},
                    children: [groupTag],
                };
                const groupName = getUniqueName(tree, "group");
                groupTag.attributes["name"] = {
                    type: "attribute",
                    name: "name",
                    children: reparseAttribute(groupName),
                };

                // `<template>` becomes a `<repeat>`
                templateNode.name = "repeat";
                templateNode.attributes["for"] = {
                    type: "attribute",
                    name: "for",
                    children: reparseAttribute(`$${groupName}`),
                };
                if (name) {
                    templateNode.attributes["name"] = {
                        type: "attribute",
                        name: "name",
                        children: reparseAttribute(name),
                    };
                }
                if (valueName) {
                    templateNode.attributes["valueName"] = {
                        type: "attribute",
                        name: "valueName",
                        children: reparseAttribute(valueName),
                    };
                }
                if (indexName) {
                    templateNode.attributes["indexName"] = {
                        type: "attribute",
                        name: "indexName",
                        children: reparseAttribute(indexName),
                    };
                }

                return [setupTag, templateNode];
            }
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
