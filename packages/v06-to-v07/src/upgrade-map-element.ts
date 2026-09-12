import { Plugin, unified } from "unified";
import {
    DastElement,
    DastRoot,
    isDastElement,
    replaceNode,
    toXml,
} from "@doenet/parser";
import { reparseAttribute } from "./reparse-attribute";
import { AssignNamesContext, readAssignNames } from "./assign-names/context";
import { registerCompositeAssignNames } from "./assign-names/register-composite";

/**
 * Upgrade the `<map>` element to the new syntax.
 */
export const upgradeMapElement: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
        replaceNode(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }
            if (node.name.toLowerCase() !== "map") {
                // No affected attributes, nothing to do
                return;
            }
            let name = toXml(node.attributes["name"]?.children).trim();
            const assignNamesValue = readAssignNames(node);

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

            // The names that `assignNames` handed out become indices into the `<repeat>`
            // (or `<repeatForSequence>`) that replaces this `<map>`. Registered only once
            // the conversion is known to succeed: a `<map>` left behind above still
            // carries its `assignNames`, so rewriting references to it would point them
            // at a name that nothing ends up having.
            if (assignNamesValue) {
                name =
                    registerCompositeAssignNames({
                        node,
                        assignNamesValue,
                        fallbackBase: "repeat",
                        context,
                        file,
                    }) ?? name;
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
                const groupName = context.uniqueName("group");
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
    };
};
