/**
 * The entries of a list component (`listEntryComponentType`; Doenet/DoenetML#2157)
 * among the items a composite is indexed by.
 *
 * An index into a composite (`$g[2]`) is resolved by the resolver, from the
 * index resolutions the core gives it for the composite: one node per item,
 * the replacements of a reference (a `_copy`) among them spliced in its
 * place (`ResolverAdapter.ts`). A reference to a whole list component is one
 * shadow of it with no replacements, so it would take one position however
 * many entries the list has, where the reference to a composite took one per
 * replacement: `$g[2]` for `<group name="g">$s</group>` would find nothing.
 * (A list written in the composite itself takes one position, as a
 * composite written there did: `$g[1][2]`.)
 *
 * So once a composite's items include a reference to a list component, its
 * index resolutions are given again with the list replaced by one node per
 * entry, and again whenever the number of entries changes. An entry's node is the
 * component index reserved for the entry
 * (`RendererInstructionBuilder.rendererIdxForListEntry`), which has no
 * component; a reference that resolves to one reads the entry as an index
 * into the list (`listEntryAtResolverNode`).
 */
import type Core from "../Core";
import { calcStartEndIdx } from "../utils/resolver";
import { refreshRootNames } from "./ResolverAdapter";

/** Whether `component` is a list component that a reference made. */
function isReferencedList(component: any) {
    return (
        typeof component === "object" &&
        component?.constructor?.listEntryComponentType !== undefined &&
        component.replacementOf?.componentType === "_copy"
    );
}

/**
 * Whether the replacements of a reference among `replacements` include a
 * list component, looked for without evaluating anything.
 */
function includesReferencedList(replacements: any[] | undefined): boolean {
    for (const replacement of replacements ?? []) {
        if (
            replacement?.componentType === "_copy" &&
            replacement.isExpanded &&
            (replacement.replacements ?? []).some(
                (inner: any) =>
                    isReferencedList(inner) || includesReferencedList([inner]),
            )
        ) {
            return true;
        }
    }
    return false;
}

/**
 * The node whose index resolutions hold the items of `composite`, with the
 * component whose replacements are those items, as
 * `determineParentAndIndexResolutionForResolver` finds it: a copy made by a
 * reference gives its items to the composite it is a replacement of, if any.
 */
function indexParentOf(
    core: Core,
    composite: any,
): { parentIdx: number; owner: any } | undefined {
    let component = composite;
    while (component) {
        if (component.componentType !== "_copy") {
            return core.componentInfoObjects.isCompositeComponent({
                componentType: component.componentType,
                includeNonStandard: true,
            })
                ? { parentIdx: component.componentIdx, owner: component }
                : undefined;
        }
        const createComponentIdx =
            component.attributes.createComponentIdx?.primitive;
        if (createComponentIdx) {
            const createType =
                component.attributes.createComponentOfType?.primitive?.value;
            return createType &&
                core.componentInfoObjects.isCompositeComponent({
                    componentType: createType,
                    includeNonStandard: true,
                })
                ? { parentIdx: createComponentIdx.value, owner: component }
                : undefined;
        }
        if (!component.replacementOf) {
            return { parentIdx: component.componentIdx, owner: component };
        }
        component = component.replacementOf;
    }
    return undefined;
}

/**
 * Give the resolver the index resolutions of the composite that holds the
 * items of `composite` (`indexParentOf`), with each list component among
 * them replaced by its entries, if there is one among them. Pass
 * `changedOwnItems` when the items of that composite changed other than by
 * its own expansion, so that the references that index it are resolved
 * again.
 */
export async function giveListEntriesToIndexParent({
    core,
    composite,
    changedOwnItems = false,
}: {
    core: Core;
    composite: any;
    changedOwnItems?: boolean;
}) {
    if (!core.replaceIndexResolutionsInResolver || !core.addNodesToResolver) {
        return;
    }
    const indexParent = indexParentOf(core, composite);
    if (
        !indexParent ||
        !(
            isReferencedList(composite) ||
            includesReferencedList(indexParent.owner.replacements) ||
            (indexParent.owner.componentType === "_copy" &&
                (indexParent.owner.replacements ?? []).some(isReferencedList))
        )
    ) {
        return;
    }

    const { flattenedReplacements } = await calcStartEndIdx({
        replacements: indexParent.owner.replacements ?? [],
        copyComponentIdx: -1,
    });

    const builder = core.rendererInstructionBuilder;
    const content: (number | string)[] = [];
    const newNodes: any[] = [];
    for (const item of flattenedReplacements) {
        if (typeof item === "string") {
            content.push(item);
        } else if (isReferencedList(item)) {
            const numEntries = await item.stateValues.numEntries;
            for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
                const idx = builder.rendererIdxForListEntry(item, entryIndex);
                if (!builder.listEntryNodesInResolver.has(idx)) {
                    builder.listEntryNodesInResolver.add(idx);
                    newNodes.push({
                        type: "element",
                        name: "_listEntry",
                        parent: item.componentIdx,
                        children: [],
                        attributes: [],
                        idx,
                    });
                }
                content.push(idx);
            }
        } else {
            content.push(item.componentIdx);
        }
    }

    if (newNodes.length > 0) {
        const idxMap: Record<number, number> = {};
        for (const [position, node] of newNodes.entries()) {
            idxMap[node.idx] = position;
        }
        core.addNodesToResolver(
            {
                type: "flatFragment",
                children: [],
                nodes: newNodes,
                parentIdx: null,
                parentSourceSequence: null,
                idxMap,
            },
            "None",
        );
    }

    core.replaceIndexResolutionsInResolver(
        { content },
        { ReplaceAll: { parent: indexParent.parentIdx } },
    );
    refreshRootNames(core);

    // The references that index the composite are resolved again only when
    // what it is indexed by changed: resolving them again can update the
    // replacements of the copies among its items, which come back here.
    const contentKey = JSON.stringify(content);
    if (
        builder.listEntryIndexContent.get(indexParent.parentIdx) === contentKey
    ) {
        return;
    }
    builder.listEntryIndexContent.set(indexParent.parentIdx, contentKey);
    if (changedOwnItems || indexParent.owner !== composite) {
        await core.dependencies.addBlockersFromChangedReplacements(
            indexParent.owner,
        );
    }
}

/**
 * The list component and entry that the resolver node `nodeIdx` stands for,
 * when it is one `giveListEntriesToIndexParent` gave for an entry.
 */
export function listEntryAtResolverNode(
    core: Core,
    nodeIdx: number,
): { listIdx: number; entryIndex: number } | undefined {
    const builder = core.rendererInstructionBuilder;
    if (!builder.listEntryNodesInResolver.has(nodeIdx)) {
        return undefined;
    }
    return builder.listEntryOfRendererIdx.get(nodeIdx);
}
