import { Plugin, unified } from "unified";
import {
    DastElement,
    DastRoot,
    isDastElement,
    replaceNode,
    toXml,
} from "@doenet/parser";
import { VFile } from "vfile";
import { reparseAttribute } from "./reparse-attribute";
import {
    AssignNamesContext,
    inheritNamespace,
    namespaceChainOf,
    readAssignNames,
} from "./assign-names/context";
import { registerCompositeAssignNames } from "./assign-names/register-composite";
import { makeTemplatePositionMap } from "./assign-names/composite-info";

/**
 * Upgrade the `<map>` element to the new syntax.
 */
export const upgradeMapElement: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
        replaceNode(tree, (node, info) => {
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
                    {
                        place: node.position,
                        ruleId: "map/missing-template-or-sources",
                        source: "v06-to-v07",
                    },
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
                        ancestorNames: namespaceChainOf(info.parents, context),
                        context,
                        file,
                        // A nested name such as `assignNames="(a b)"` counts positions
                        // inside one iteration, which are the template's children — and
                        // v0.6 skipped bare text there while v0.7 counts it.
                        positionMap: makeTemplatePositionMap(
                            templateNode,
                            node,
                            file,
                        ),
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
                    warnIfNameLost(sequenceNode, name, file);
                    sequenceNode.attributes["name"] = {
                        type: "attribute",
                        name: "name",
                        children: reparseAttribute(name),
                    };
                }
                sequenceNode.name = "repeatForSequence";
                // The `<template>` is discarded here, so whatever namespace it was has
                // to move to the element taking its place.
                inheritNamespace(templateNode, sequenceNode, context);
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

                // Reported before the rename below, so the message names the element
                // the author actually wrote rather than the one it becomes.
                if (name) {
                    warnIfNameLost(templateNode, name, file);
                }
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

/**
 * Report a `name` that is about to be overwritten.
 *
 * The `<sequence>` and the `<template>` become the `<repeat>` that takes the map's name,
 * so a name either of them carried has nowhere to go. References to it were resolved
 * before this plugin ran, so they cannot be redirected either.
 */
function warnIfNameLost(node: DastElement, newName: string, file: VFile) {
    const existing = toXml(node.attributes["name"]?.children).trim();
    if (!existing || existing === newName) {
        return;
    }
    file.message(
        `<${node.name} name="${existing}"> becomes the <repeat> that takes the name "${newName}", so "${existing}" is gone; references to it need fixing by hand.`,
        {
            place: node.position,
            ruleId: "map/name-overwritten",
            source: "v06-to-v07",
        },
    );
}
