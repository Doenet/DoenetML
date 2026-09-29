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
import { isCompositeComponentType } from "./core-info/determine-prop-type";

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
            const sourcesNodes = node.children.filter(
                (child): child is DastElement =>
                    isDastElement(child) && child.name === "sources",
            );
            if (
                !templateNode ||
                !isDastElement(templateNode) ||
                sourcesNodes.length === 0
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

            if (sourcesNodes.length > 1) {
                // With several `<sources>`, v0.6 went through every combination of
                // their values, the first `<sources>` changing slowest. Nested repeats
                // do the same, but two things they cannot say: `behavior="parallel"`,
                // which stepped through the sources together, and `assignNames`, which
                // counted the combinations in one flat list.
                const behaviorKey = Object.keys(node.attributes).find(
                    (key) => key.toLowerCase() === "behavior",
                );
                const behavior = behaviorKey
                    ? toXml(node.attributes[behaviorKey].children)
                          .trim()
                          .toLowerCase()
                    : "combination";
                const reason =
                    behavior !== "combination"
                        ? `behavior="${behavior}" has no v0.7 equivalent`
                        : assignNamesValue
                          ? `assignNames numbered the combinations in one list, while the nested repeats it becomes are numbered one level at a time`
                          : undefined;
                if (reason) {
                    file.message(
                        `<map> with several <sources> could not be converted: ${reason}. Convert it by hand, for example with nested <repeat>s.`,
                        {
                            place: node.position,
                            ruleId: "map/multiple-sources",
                            source: "v06-to-v07",
                        },
                    );
                    return;
                }
                if (name) {
                    file.message(
                        `<map name="${name}"> with several <sources> becomes nested repeats, and "${name}" goes on the outer one. A reference such as $${name}[n] counted every combination in v0.6 but counts only the outer iterations now; such references need fixing by hand.`,
                        {
                            place: node.position,
                            ruleId: "map/multiple-sources-name",
                            source: "v06-to-v07",
                        },
                    );
                }
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

            // Build the loops from the inside out: the last `<sources>` changes fastest,
            // so it is the innermost, and it is the one that holds the template.
            const setups: DastElement[] = [];
            let loop: DastElement | undefined;
            for (let i = sourcesNodes.length - 1; i >= 0; i--) {
                loop = makeLoop({
                    sourcesNode: sourcesNodes[i],
                    innerLoop: loop,
                    templateNode,
                    // The map's name goes on the outermost loop.
                    name: i === 0 ? name : "",
                    context,
                    file,
                    setups,
                });
            }

            // Every `<sources>` was evaluated outside the map, so their groups go before
            // the outermost loop, in the order they were written.
            return [...setups.reverse(), loop!];
        });
    };
};

/**
 * The loop that one `<sources>` becomes: a `<repeatForSequence>` for a lone
 * `<sequence>`, and otherwise a `<repeat>` over a `<group>` of the sources, whose
 * `<setup>` is added to `setups`.
 *
 * The innermost loop (no `innerLoop`) holds the template's children, and takes over the
 * template's namespace; an outer one holds the loop inside it.
 */
function makeLoop({
    sourcesNode,
    innerLoop,
    templateNode,
    name,
    context,
    file,
    setups,
}: {
    sourcesNode: DastElement;
    innerLoop: DastElement | undefined;
    templateNode: DastElement;
    name: string;
    context: AssignNamesContext;
    file: VFile;
    setups: DastElement[];
}): DastElement {
    const valueName = toXml(sourcesNode.attributes["alias"]?.children).trim();
    const indexName = toXml(
        sourcesNode.attributes["indexAlias"]?.children,
    ).trim();

    const children = innerLoop ? [innerLoop] : templateNode.children;

    // Only a `<sequence>` on its own is the whole of the sources; next to anything
    // else it is one item among several, which the group below keeps.
    const sourceItems = sourcesNode.children.filter(
        (child) => !(child.type === "text" && child.value.trim() === ""),
    );
    const sequenceNode =
        sourceItems.length === 1 &&
        isDastElement(sourceItems[0]) &&
        sourceItems[0].name === "sequence"
            ? sourceItems[0]
            : undefined;

    let loop: DastElement;
    if (sequenceNode) {
        // We have a `<sequence>` node. This gets converted to a `<repeatForSequence>` node.
        if (name) {
            warnIfNameLost(sequenceNode, name, file);
        }
        loop = sequenceNode;
        loop.name = "repeatForSequence";
        if (!innerLoop) {
            // The `<template>` is discarded here, so whatever namespace it was has
            // to move to the element taking its place.
            inheritNamespace(templateNode, loop, context);
        }
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

        if (innerLoop) {
            loop = {
                type: "element",
                name: "repeat",
                attributes: {},
                children,
            };
        } else {
            // Reported before the rename below, so the message names the element
            // the author actually wrote rather than the one it becomes.
            if (name) {
                warnIfNameLost(templateNode, name, file);
            }
            // `<template>` becomes a `<repeat>`, keeping its namespace
            loop = templateNode;
            loop.name = "repeat";
        }
        loop.attributes["for"] = {
            type: "attribute",
            name: "for",
            children: reparseAttribute(`$${groupName}`),
        };

        setups.push(setupTag);
        context.mapSourceGroups.push({
            group: groupTag,
            setup: setupTag,
            repeat: loop,
            position: sourcesNode.position,
        });
    }

    if (name) {
        loop.attributes["name"] = {
            type: "attribute",
            name: "name",
            children: reparseAttribute(name),
        };
    }
    if (valueName) {
        loop.attributes["valueName"] = {
            type: "attribute",
            name: "valueName",
            children: reparseAttribute(valueName),
        };
    }
    if (indexName) {
        loop.attributes["indexName"] = {
            type: "attribute",
            name: "indexName",
            children: reparseAttribute(indexName),
        };
    }
    // Put in the correct children
    loop.children = children;
    return loop;
}

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
 * Report each `<map>` source group left in place that mixes a list, a composite or a
 * reference with other items.
 *
 * Such a group is the faithful conversion, but v0.7 does not yet iterate over most of
 * them correctly: the repeat gets the right number of values and the wrong ones
 * (https://github.com/Doenet/DoenetML/issues/2073). A composite that stands for a
 * single component, such as a `<select>` of one option, does iterate correctly, but
 * which composites those are can't be told before the document runs, so every
 * composite is reported. Run after the last fold.
 */
export function warnAboutMixedSourceGroups(
    context: AssignNamesContext,
    file: VFile,
) {
    for (const { group, done, position } of context.mapSourceGroups) {
        if (done) {
            continue;
        }
        const items = group.children.filter(
            (child) => !(child.type === "text" && child.value.trim() === ""),
        );
        const expands = (item: DastNodes) =>
            item.type === "macro" ||
            (isDastElement(item) &&
                (item.name === "copy" ||
                    /List$/.test(item.name) ||
                    isCompositeComponentType(item.name)));
        if (items.length < 2 || !items.some(expands)) {
            continue;
        }
        file.message(
            `The <repeat> made from this <sources> iterates over a <group> that mixes a list, composite or reference with other items, which v0.7 may not iterate over correctly yet (https://github.com/Doenet/DoenetML/issues/2073). Check the result, or split the sources.`,
            {
                place: position,
                ruleId: "map/mixed-sources",
                source: "v06-to-v07",
            },
        );
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
