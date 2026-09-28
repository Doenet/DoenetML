import { Plugin, unified } from "unified";
import {
    DastElement,
    DastMacro,
    DastNodes,
    DastRoot,
    EXIT,
    isDastElement,
    replaceNode,
    toXml,
    visit,
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

                context.mapSourceGroups.push({
                    group: groupTag,
                    setup: setupTag,
                    repeat: templateNode,
                });

                return [setupTag, templateNode];
            }
        });
    };
};

/**
 * Fold a `<map>`'s sources into its `<repeat>`'s `for` when they are all references.
 *
 * ```xml
 *   <setup><group name="group">$c.iterateValues</group></setup><repeat for="$group" ...>
 * ```
 * becomes
 * ```xml
 *   <repeat for="$c.iterateValues" ...>
 * ```
 * `for` takes references directly, so the group only adds a layer, and a repeat over a
 * group does not always iterate as the group's contents would. With `for` naming the
 * list, the type of each value can also be read off it when a later reference to the
 * `valueName` needs one.
 *
 * This runs once the `<copy>` tags in the sources are resolved, as a copy of a whole list such as
 * `<copy prop="iterateValues" source="c" />` has only then become `$c.iterateValues`.
 * An element that does nothing but extend something, `<mathList extend="$l" />`, counts
 * as a reference to it too.
 */
export function inlineMapSourceGroups(
    tree: DastRoot,
    context: AssignNamesContext,
) {
    for (const entry of context.mapSourceGroups) {
        const { group, setup, repeat } = entry;
        if (entry.done) {
            continue;
        }
        const references: DastMacro[] = [];
        let onlyReferences = true;
        for (const child of group.children) {
            if (child.type === "text" && child.value.trim() === "") {
                continue;
            }
            const reference = asReference(child);
            if (!reference) {
                onlyReferences = false;
                break;
            }
            references.push(reference);
        }
        if (!onlyReferences || references.length === 0) {
            continue;
        }

        // Something else may refer to the generated name; only the `for` should.
        const groupName = toXml(group.attributes["name"]?.children).trim();
        if (isReferencedElsewhere(tree, groupName, repeat)) {
            continue;
        }
        const setupParent = findParent(tree, setup);
        if (!setupParent || setup.children.length !== 1) {
            continue;
        }

        repeat.attributes["for"] = {
            type: "attribute",
            name: "for",
            children: references.flatMap((reference, i) =>
                i === 0
                    ? [reference]
                    : [{ type: "text" as const, value: " " }, reference],
            ),
        };
        setupParent.children.splice(setupParent.children.indexOf(setup), 1);
        entry.done = true;
    }
}

/**
 * `child` as a bare reference, if that is all it is: a macro without attributes, or an
 * element with no children whose only attribute is an `extend` of a single macro.
 */
function asReference(child: DastNodes): DastMacro | undefined {
    if (child.type === "macro") {
        return Object.keys(child.attributes).length === 0 ? child : undefined;
    }
    if (!isDastElement(child) || child.children.length > 0) {
        return undefined;
    }
    const keys = Object.keys(child.attributes);
    if (keys.length !== 1 || keys[0] !== "extend") {
        return undefined;
    }
    const value = child.attributes["extend"].children.filter(
        (c) => !(c.type === "text" && c.value.trim() === ""),
    );
    if (
        value.length !== 1 ||
        value[0].type !== "macro" ||
        Object.keys(value[0].attributes).length > 0
    ) {
        return undefined;
    }
    return value[0];
}

/**
 * Whether a reference to `name` appears anywhere other than `repeat`'s `for`.
 */
function isReferencedElsewhere(
    tree: DastRoot,
    name: string,
    repeat: DastElement,
): boolean {
    let found = false;
    visit(tree, (node, info) => {
        if (
            node.type === "macro" &&
            node.path[0]?.name === name &&
            !(
                info.parents[0] === repeat &&
                repeat.attributes["for"]?.children.includes(node)
            )
        ) {
            found = true;
            return EXIT;
        }
    });
    return found;
}

function findParent(
    tree: DastRoot,
    target: DastElement,
): DastElement | DastRoot | undefined {
    let parent: DastElement | DastRoot | undefined;
    visit(tree, (node, info) => {
        if (node === target) {
            parent = (info.parents[0] as DastElement | undefined) ?? tree;
            return EXIT;
        }
    });
    return parent;
}

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
