import type Core from "../Core";
import { assignDoenetMLRange } from "@doenet/utils";
import { FlatFragment } from "@doenet/doenetml-worker";
import {
    addNodesToFlatFragment,
    calcStartEndIdx,
    getEffectiveComponentIdx,
} from "../utils/resolver";

/**
 * Adapter to the external (Rust) name resolver. Translates Core's
 * component-tree concepts (components, replacements, composites) into the
 * flat-fragment shape the resolver expects, and refreshes `core.rootNames`
 * after each mutation.
 *
 * Stateless — the resolver lives outside this process. Each function takes
 * a back-reference to Core to read `_components` / `componentInfoObjects`,
 * invoke the resolver callbacks (`addNodesToResolver`,
 * `deleteNodesFromResolver`, `calculateRootNames`), append diagnostics, and
 * notify `dependencies.addBlockersFromChangedReplacements`.
 */

export async function addReplacementsToResolver({
    core,
    serializedReplacements,
    component,
    updateOldReplacementsStart,
    updateOldReplacementsEnd,
    blankStringReplacements,
}: {
    core: Core;
    serializedReplacements: any[];
    component: any;
    updateOldReplacementsStart?: number;
    updateOldReplacementsEnd?: number;
    blankStringReplacements?: boolean[];
}): Promise<void> {
    if (component.constructor.replacementsAlreadyInResolver) {
        return;
    }

    const { parentIdx, indexResolution } =
        await determineParentAndIndexResolutionForResolver({
            core,
            component,
            updateOldReplacementsStart,
            updateOldReplacementsEnd,
            blankStringReplacements,
        });

    // If `createComponentIdx` was specified, the one replacement is already in the resolver,
    // so we just add its children and attribute components/references.
    // Otherwise add all replacements.
    const fragmentChildren: any[] = [];
    let parentSourceSequence: any = null;
    if (component.attributes.createComponentIdx != null) {
        if (serializedReplacements[0]?.children) {
            fragmentChildren.push(...serializedReplacements[0].children);
        }
        for (const attrName in serializedReplacements[0]?.attributes) {
            const attribute = serializedReplacements[0].attributes[attrName];
            if (attribute.type === "component") {
                fragmentChildren.push(attribute.component);
            } else if (attribute.type === "references") {
                fragmentChildren.push(...attribute.references);
            }
        }

        // if the replacement that is the fragment parent has a source sequence,
        // then add that as the `parentSourceSequence` of the flat fragment
        let sourceSequence =
            serializedReplacements[0]?.attributes["source:sequence"];
        const createComponentIdxPrimitive =
            component.attributes.createComponentIdx?.primitive;
        if (sourceSequence && createComponentIdxPrimitive?.type === "number") {
            parentSourceSequence = {
                type: "attribute",
                name: "source:sequence",
                parent: createComponentIdxPrimitive.value,
                children: sourceSequence.children.filter(
                    (child: any) => typeof child === "string",
                ),
                sourceDoc: sourceSequence.sourceDoc,
            };
        }
    } else {
        fragmentChildren.push(...serializedReplacements);
    }

    // We add all the parent's descendants to the resolver
    const flatFragment: FlatFragment = {
        type: "flatFragment",
        children: fragmentChildren.map((child) =>
            typeof child === "string" ? child : getEffectiveComponentIdx(child),
        ),
        nodes: [],
        parentIdx,
        parentSourceSequence,
        idxMap: {},
    };

    addNodesToFlatFragment({
        flatFragment,
        serializedComponents: fragmentChildren,
        parentIdx,
    });

    if (
        (flatFragment.nodes.length > 0 || indexResolution !== "None") &&
        core.addNodesToResolver
    ) {
        core.addNodesToResolver(flatFragment, indexResolution);

        core.rootNames = core.calculateRootNames?.().names;

        let indexParent =
            indexResolution.ReplaceAll?.parent ??
            indexResolution.ReplaceRange?.parent ??
            null;

        if (indexParent !== null && indexParent !== component.componentIdx) {
            const indexParentComposite = core._components[indexParent];

            if (indexParentComposite) {
                await core.dependencies.addBlockersFromChangedReplacements(
                    indexParentComposite,
                );
            }
        }
    }
}

export async function determineParentAndIndexResolutionForResolver({
    core,
    component,
    updateOldReplacementsStart,
    updateOldReplacementsEnd,
    blankStringReplacements,
}: {
    core: Core;
    component: any;
    updateOldReplacementsStart?: number;
    updateOldReplacementsEnd?: number;
    blankStringReplacements?: boolean[];
}): Promise<{ parentIdx: number; indexResolution: any }> {
    // If the composite was created as a child for a list,
    // then the parent for resolving names is that list (the parent of the resolver).
    // If `createComponentIdx` was specified, then that should be the parent for resolving names.
    // Else, the composite should be the parent for resolving names.

    let update_start = updateOldReplacementsStart;
    let update_end = updateOldReplacementsEnd;

    if (
        updateOldReplacementsStart !== undefined &&
        updateOldReplacementsEnd !== undefined
    ) {
        // We are replacing a range of replacement, but these include blank strings.
        // Adjust the range to ignore blank strings
        for (const [i, isBlankString] of (
            blankStringReplacements ?? []
        ).entries()) {
            if (i >= updateOldReplacementsEnd) {
                break;
            }
            if (isBlankString) {
                update_end!--;
                if (i < updateOldReplacementsStart) {
                    update_start!--;
                }
            }
        }
    }

    let parentIdx: number;

    let indexResolution: any = "None";

    if (component.doenetAttributes.forList) {
        // Don't add index resolutions in this case,
        // we're just adding to the children of the list, not the replacements of the list
        parentIdx = component.parentIdx;
    } else if (component.attributes.createComponentIdx?.primitive) {
        // If `createComponentIdx` is set, then we have a copy component created from an `extend` attribute.
        // That component is already in the resolver so will be the parent of the fragment added to the browser.
        parentIdx = component.attributes.createComponentIdx?.primitive.value;

        // If the component type of that parent, specified by `createComponentOfType`, is a composite,
        // then it could have an index specified, so we add an index resolution
        if (
            component.attributes.createComponentOfType?.primitive &&
            core.componentInfoObjects.isCompositeComponent({
                componentType:
                    component.attributes.createComponentOfType.primitive.value,
                includeNonStandard: true,
            })
        ) {
            indexResolution = { ReplaceAll: { parent: parentIdx } };

            if (update_start !== undefined && update_end !== undefined) {
                indexResolution = {
                    ReplaceRange: {
                        parent: parentIdx,
                        range: { start: update_start, end: update_end },
                    },
                };
            }
        }
    } else if (component.componentType === "_copy") {
        // If we have a copy that wasn't from an extend, then it was from a reference.
        // Although references don't have names that can be
        // Copy components are typically not part of the resolver structure and generally skipped.
        // Since we don't allow direct authoring of copy components,
        // they should occur only from references

        // determine if is a replacement of another type of composite
        let copyComponent = component;
        parentIdx = component.componentIdx;

        while (copyComponent.replacementOf) {
            if (copyComponent.replacementOf.componentType === "_copy") {
                copyComponent = copyComponent.replacementOf;
                continue;
            } else {
                break;
            }
        }

        // now we have a copyComponent that is not a replacement of a copy
        if (copyComponent.replacementOf) {
            const indexParent = copyComponent.replacementOf;

            // determine where the replacement will end up being spliced in
            const { startIdx, endIdx } = await calcStartEndIdx({
                replacements: indexParent.replacements,
                copyComponentIdx: copyComponent.componentIdx,
                updateStart: update_start,
                updateEnd: update_end,
            });

            if (startIdx !== undefined && endIdx !== undefined) {
                indexResolution = {
                    ReplaceRange: {
                        parent: indexParent.componentIdx,
                        range: { start: startIdx, end: endIdx },
                    },
                };
            } else {
                // if the copy was not found as a replacement of the composite,
                // then it wasn't a top-level replacement and it doesn't affect the composite's index resolution
                indexResolution = "None";
            }
        } else {
            parentIdx = copyComponent.componentIdx;
            indexResolution = { ReplaceAll: { parent: parentIdx } };
        }
    } else {
        parentIdx = component.componentIdx;

        if (
            core.componentInfoObjects.isCompositeComponent({
                componentType: component.componentType,
                includeNonStandard: true,
            })
        ) {
            if (update_start !== undefined && update_end !== undefined) {
                indexResolution = {
                    ReplaceRange: {
                        parent: parentIdx,
                        range: { start: update_start, end: update_end },
                    },
                };
            } else {
                indexResolution = { ReplaceAll: { parent: parentIdx } };
            }
        }
    }

    return { parentIdx, indexResolution };
}

export function addComponentsToResolver({
    core,
    components,
    parentIdx,
}: {
    core: Core;
    components: any[];
    parentIdx: number;
}): void {
    const flatFragment: FlatFragment = {
        type: "flatFragment",
        children: components.map((child) =>
            typeof child === "string" ? child : getEffectiveComponentIdx(child),
        ),
        nodes: [],
        parentIdx,
        parentSourceSequence: null,
        idxMap: {},
    };

    addNodesToFlatFragment({
        flatFragment,
        serializedComponents: components,
        parentIdx,
    });

    if (core.addNodesToResolver) {
        core.addNodesToResolver(flatFragment, "None");

        core.rootNames = core.calculateRootNames?.().names;
    }
}

export function gatherDiagnosticsAndAssignDoenetMLRange({
    core,
    components,
    diagnostics,
    position,
    sourceDoc,
    overwriteDoenetMLRange = false,
}: {
    core: Core;
    components: any;
    diagnostics: any[];
    position: any;
    sourceDoc: number;
    overwriteDoenetMLRange?: boolean;
}): void {
    assignDoenetMLRange(
        components,
        position,
        sourceDoc,
        overwriteDoenetMLRange,
    );
    assignDoenetMLRange(diagnostics, position, sourceDoc);

    // Add all diagnostics, preserving their existing type field
    for (const diagnostic of diagnostics) {
        core.addDiagnostic(diagnostic);
    }
}

export function removeComponentsFromResolver({
    core,
    componentsToRemove,
}: {
    core: Core;
    componentsToRemove: any[];
}): void {
    if (componentsToRemove.length === 0) {
        return;
    }

    const flatElements = componentsToRemove.map((comp) => {
        let flatElement: any = {
            type: "element",
            name: comp.componentType,
            parent: comp.parentIdx,
            children: [],
            attributes: [],
            idx: comp.componentIdx,
        };

        if (comp.attributes.createComponentName && !comp.isExpanded) {
            flatElement.attributes.push({
                type: "attribute",
                name: "name",
                parent: comp.parentIdx,
                children: [comp.attributes.createComponentName.primitive.value],
            });
        } else if (comp.attributes.name) {
            flatElement.attributes.push({
                type: "attribute",
                name: "name",
                parent: comp.parentIdx,
                children: [comp.attributes.name.primitive.value],
            });
        }
        return flatElement;
    });

    if (core.deleteNodesFromResolver) {
        core.deleteNodesFromResolver({
            nodes: flatElements,
        });

        core.rootNames = core.calculateRootNames?.().names;
    }
}
