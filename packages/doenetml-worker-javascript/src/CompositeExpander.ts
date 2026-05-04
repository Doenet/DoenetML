import type Core from "./Core";
import { deepClone } from "@doenet/utils";
import {
    deriveChildResultsFromDefiningChildren,
    findChildGroup,
} from "./ChildMatcher";
import { processNewDefiningChildren } from "./ComponentLifecycle";
import {
    addReplacementsToResolver,
    gatherDiagnosticsAndAssignDoenetMLRange,
} from "./ResolverAdapter";
import {
    addAttributesToSingleReplacement,
    postProcessCopy,
    verifyReplacementsMatchSpecifiedType,
} from "./utils/copy";
import { preprocessAttributesObject } from "./utils/attributes";
import {
    createComponentIndicesFromSerializedChildren,
    createNewComponentIndices,
} from "./utils/componentIndices";

/**
 * Expands composite components into their replacements: walks descendants
 * looking for unexpanded composites, resolves their `readyToExpand`
 * dependency, runs the composite's `createSerializedReplacements`,
 * registers the new replacements with the resolver, propagates expansion
 * into shadows, swaps replacement composites into the active-children
 * list during child-result derivation, and marks composite ranges as
 * active or inactive when their visibility changes.
 *
 * Mutually recursive with `ComponentBuilder` (creating components
 * triggers expansion; expansion creates components).
 *
 * Stateless — each function takes a back-reference to Core to read
 * `_components`, `componentInfoObjects`, `parameterStack`, `dependencies`,
 * `flags`, `updateInfo`, `rootNames`, to invoke `matchPublicStateVariables`,
 * and to invoke the other extracted managers.
 */

export async function expandAllComposites({
    core,
    component,
    force = false,
}: {
    core: Core;
    component: any;
    force?: boolean;
}) {
    let parentsWithCompositesNotReady = await expandCompositesOfDescendants({
        core,
        component,
        forceExpandComposites: force,
    });

    let expandedAnother = true;

    while (expandedAnother) {
        expandedAnother = false;

        for (let parentIdx of parentsWithCompositesNotReady) {
            let parent = core._components[parentIdx];
            let foundReady = false;
            for (let compositeIdx of parent.unexpandedCompositesNotReady) {
                let composite = core._components[compositeIdx];
                if (composite.state.readyToExpandWhenResolved.isResolved) {
                    foundReady = true;
                    break;
                } else {
                    let resolveResult = await core.dependencies.resolveItem({
                        componentIdx: composite.componentIdx,
                        type: "stateVariable",
                        stateVariable: "readyToExpandWhenResolved",
                        force,
                        recurseUpstream: true,
                    });

                    if (resolveResult.success) {
                        foundReady = true;
                        break;
                    }
                }
            }

            if (foundReady) {
                let parent = core._components[parentIdx];
                await deriveChildResultsFromDefiningChildren({
                    core,
                    parent,
                    expandComposites: true,
                    forceExpandComposites: force,
                });
                expandedAnother = true;
            }
        }
    }
}

export async function expandCompositesOfDescendants({
    core,
    component,
    forceExpandComposites = false,
}: {
    core: Core;
    component: any;
    forceExpandComposites?: boolean;
}): Promise<any[]> {
    // Attempt to expand the composites of all descendants, including
    // attribute components.
    let parentsWithCompositesNotReady: any[] = [];

    if (!component.matchedCompositeChildren) {
        await deriveChildResultsFromDefiningChildren({
            core,
            parent: component,
            expandComposites: true,
            forceExpandComposites,
        });
        if (component.unexpandedCompositesNotReady.length > 0) {
            parentsWithCompositesNotReady.push(component.componentIdx);
        } else {
            await core.dependencies.resolveBlockersFromChangedActiveChildren(
                component,
                forceExpandComposites,
            );
        }
    }

    for (let attrName in component.attributes) {
        let attrComp = component.attributes[attrName].component;
        if (attrComp) {
            let additionalParentsWithNotReady =
                await expandCompositesOfDescendants({
                    core,
                    component: attrComp,
                    forceExpandComposites,
                });
            parentsWithCompositesNotReady.push(
                ...additionalParentsWithNotReady,
            );
        }
    }

    for (let childIdxStr in component.allChildren) {
        let child = component.allChildren[childIdxStr].component;
        if (typeof child !== "object") {
            continue;
        }

        let additionalParentsWithNotReady = await expandCompositesOfDescendants(
            {
                core,
                component: child,
                forceExpandComposites,
            },
        );
        parentsWithCompositesNotReady.push(...additionalParentsWithNotReady);
    }

    return parentsWithCompositesNotReady;
}

export async function componentAndRenderedDescendants({
    core,
    component,
}: {
    core: Core;
    component: any;
}): Promise<any[]> {
    if (component?.componentIdx == undefined) {
        return [];
    }

    let componentIndices = [component.componentIdx];
    if (component.constructor.renderChildren) {
        if (!component.matchedCompositeChildren) {
            await deriveChildResultsFromDefiningChildren({
                core,
                parent: component,
                expandComposites: true, //forceExpandComposites: true,
            });
        }
        for (let child of component.activeChildren) {
            componentIndices.push(
                ...(await componentAndRenderedDescendants({
                    core,
                    component: child,
                })),
            );
        }
    }
    return componentIndices;
}

export async function expandCompositeOfDefiningChildren({
    core,
    parent,
    children,
    expandComposites,
    forceExpandComposites,
}: {
    core: Core;
    parent: any;
    children: any[];
    expandComposites: boolean;
    forceExpandComposites: boolean;
}) {
    // If a composite is not directly matched by any childGroup, replace
    // the composite with its replacements, expanding it if not already
    // expanded.
    let unexpandedCompositesReady: number[] = [];
    let unexpandedCompositesNotReady: number[] = [];

    for (let childInd = 0; childInd < children.length; childInd++) {
        let child = children[childInd];

        if (
            child instanceof
            core.componentInfoObjects.allComponentClasses._composite
        ) {
            // if composite itself is in the child logic
            // then don't replace it with its replacements
            // but leave the composite as an activeChild
            if (
                findChildGroup({
                    core,
                    childType: child.componentType,
                    parentClass: parent.constructor,
                }).success
            ) {
                continue;
            }

            // expand composite if it isn't already
            if (!child.isExpanded) {
                if (!child.state.readyToExpandWhenResolved.isResolved) {
                    if (expandComposites) {
                        let resolveResult = await core.dependencies.resolveItem(
                            {
                                componentIdx: child.componentIdx,
                                type: "stateVariable",
                                stateVariable: "readyToExpandWhenResolved",
                                expandComposites, //: forceExpandComposites,
                                force: forceExpandComposites,
                            },
                        );

                        if (!resolveResult.success) {
                            unexpandedCompositesNotReady.push(
                                child.componentIdx,
                            );
                            core.updateInfo.compositesToExpand.add(
                                child.componentIdx,
                            );
                            continue;
                        }
                    } else {
                        unexpandedCompositesNotReady.push(child.componentIdx);
                        core.updateInfo.compositesToExpand.add(
                            child.componentIdx,
                        );
                        continue;
                    }
                } else if (!expandComposites) {
                    unexpandedCompositesReady.push(child.componentIdx);
                    core.updateInfo.compositesToExpand.add(child.componentIdx);
                    continue;
                }

                // will either succeed or throw error since is ready to expand
                await expandCompositeComponent({ core, component: child });
            }

            // recurse on replacements
            let result = await expandCompositeOfDefiningChildren({
                core,
                parent,
                children: child.replacements,
                expandComposites,
                forceExpandComposites,
            });

            unexpandedCompositesReady.push(...result.unexpandedCompositesReady);
            unexpandedCompositesNotReady.push(
                ...result.unexpandedCompositesNotReady,
            );
        }
    }

    return { unexpandedCompositesReady, unexpandedCompositesNotReady };
}

export async function expandCompositeComponent({
    core,
    component,
}: {
    core: Core;
    component: any;
}) {
    if (!("readyToExpandWhenResolved" in component.state)) {
        throw Error(
            `Could not find state variable readyToExpandWhenResolved of composite ${component.componentIdx}`,
        );
    }

    if (!component.state.readyToExpandWhenResolved.isResolved) {
        core.updateInfo.compositesToExpand.add(component.componentIdx);
        return { success: false };
    }

    core.updateInfo.compositesToExpand.delete(component.componentIdx);

    core.updateInfo.compositesBeingExpanded.push(component.componentIdx);

    if (component.parent) {
        for (const list of [
            component.parent.unexpandedCompositesReady,
            component.parent.unexpandedCompositesNotReady,
        ]) {
            if (!list) {
                continue;
            }
            const ind = list.indexOf(component.componentIdx);
            if (ind !== -1) {
                list.splice(ind, 1);
            }
        }
    }

    if (
        component.shadows &&
        !component.shadows.propVariable &&
        !component.constructor.doNotExpandAsShadowed
    ) {
        return await expandShadowingComposite({ core, component });
    }

    // Call the static function createSerializedReplacements from the composite component
    // which returns an object containing a key "replacements" with value an array
    // of serialized components that will be turned into real components.
    // The replacement components will be used to replace
    // the composite itself as children for the composite's parent
    let initialNComponents;
    let result;
    const originalWorkspace = { ...component.replacementsWorkspace };

    do {
        initialNComponents = core._components.length;
        component.replacementsWorkspace = { ...originalWorkspace };
        result = await component.constructor.createSerializedReplacements({
            component: core._components[component.componentIdx], // to create proxy
            components: core._components,
            nComponents: core._components.length,
            workspace: component.replacementsWorkspace,
            componentInfoObjects: core.componentInfoObjects,
            allDoenetMLs: core.allDoenetMLs,
            flags: core.flags,
            resolveItem: core.dependencies.resolveItem.bind(core.dependencies),
            publicCaseInsensitiveAliasSubstitutions:
                core.publicCaseInsensitiveAliasSubstitutions.bind(core),
        });

        // If `core._components` changed in length while `createSerializedReplacements` was executing,
        // it means that some other action (like calling another `createSerializedReplacements`)
        // occurred while resolving state variables.
        // Since this would lead to collisions in assigned component indices, we rerun `createSerializedReplacements`.
        // TODO: are there any scenarios where this will lead to an infinite loop?
    } while (core._components.length !== initialNComponents);

    const newNComponents = result.nComponents;

    if (
        !(
            Number.isInteger(newNComponents) &&
            newNComponents >= core._components.length
        )
    ) {
        throw Error(
            `Invalid nComponents returned by createSerializedReplacements for ${component.componentType}: `,
            newNComponents,
        );
    }

    let position = core._components[component.componentIdx].position;
    let sourceDoc = core._components[component.componentIdx].sourceDoc;
    let overwriteDoenetMLRange = component.componentType === "_copy";

    gatherDiagnosticsAndAssignDoenetMLRange({
        core,
        components: result.replacements,
        diagnostics: result.diagnostics,
        position,
        sourceDoc,
        overwriteDoenetMLRange,
    });

    if (component.constructor.stateVariableToEvaluateAfterReplacements) {
        await component.stateValues[
            component.constructor.stateVariableToEvaluateAfterReplacements
        ];
    }

    if (result.replacements) {
        let serializedReplacements = result.replacements;

        await addReplacementsToResolver({
            core,
            serializedReplacements,
            component,
        });

        // expand `core._components` to length `newNComponents` so that the component indices will not be reused
        if (newNComponents > core._components.length) {
            core._components[newNComponents - 1] = undefined;
        }

        await createAndSetReplacements({
            core,
            component,
            serializedReplacements,
        });
    } else {
        throw Error(
            `Invalid createSerializedReplacements of ${component.componentIdx}`,
        );
    }

    _finishExpanding({ core, componentIdx: component.componentIdx });

    return { success: true, compositesExpanded: [component.componentIdx] };
}

async function expandShadowingComposite({
    core,
    component,
}: {
    core: Core;
    component: any;
}) {
    if (
        core.updateInfo.compositesBeingExpanded.includes(
            component.shadows.componentIdx,
        )
    ) {
        // found a circular dependency,
        // as we are in the middle of expanding a composite
        // that we are now trying to shadow
        let compositeInvolved =
            core._components[component.shadows.componentIdx];
        // find non-shadow for error message, as that would be a component from document
        while (compositeInvolved.shadows) {
            compositeInvolved =
                core._components[compositeInvolved.shadows.componentIdx];
        }
        throw Error(
            `Circular dependency involving ${compositeInvolved.componentIdx}.`,
        );
    }

    let shadowedComposite = core._components[component.shadows.componentIdx];
    let compositesExpanded = [];

    if (!shadowedComposite.isExpanded) {
        let result = await expandCompositeComponent({
            core,
            component: shadowedComposite,
        });

        if (!result.success) {
            throw Error(
                `expand result of ${component.componentIdx} was not a success even though ready to expand.`,
            );
        }
        compositesExpanded.push(...result.compositesExpanded);
    }

    // we'll copy the replacements of the shadowed composite
    // and make those be the replacements of the shadowing composite
    let serializedReplacements: any[] = [];

    if (component.replacementsWorkspace.replacementsCreated === undefined) {
        component.replacementsWorkspace.replacementsCreated = 0;
    }

    const stateIdInfo = {
        prefix: `${component.stateId}|`,
        num: component.replacementsWorkspace.replacementsCreated,
    };

    let nComponents = core._components.length;
    let newNComponents = nComponents;

    // We address one complication from shadowing a component with copied in children.
    // In this case, the name resolver will already have the component indices of the serialized children of `component`.
    // The corresponding replacements of `component` should have those component indices.
    // However, those replacements already exist in the replacements of `shadowedComposite` which we are copying.
    // As a workaround, we create a map from the indices of the children of `shadowedComposite`
    // to the indices of the children of `component` and override the component indices created on the new replacements.
    const idxMapOverride: Record<string, number> = {};
    const copyInChildren =
        shadowedComposite.attributes.copyInChildren?.primitive.value;
    if (copyInChildren) {
        const componentChildren = JSON.parse(
            JSON.stringify(component.serializedChildren),
        );
        const shadowedChildren = JSON.parse(
            JSON.stringify(shadowedComposite.serializedChildren),
        );

        // We are reusing this code that maps indices from serialized components to get the map
        // from indices of `shadowedChildren` to indices of `componentChildren`.
        const res = createComponentIndicesFromSerializedChildren(
            shadowedChildren,
            componentChildren,
            newNComponents,
        );

        for (const idx in res.idxMap) {
            // the above code might also have created new indices, which we ignore
            if (res.idxMap[idx] < newNComponents) {
                idxMapOverride[idx] = res.idxMap[idx];
            }
        }
    }

    for (let [idx, repl] of shadowedComposite.replacements.entries()) {
        if (typeof repl === "object") {
            const serializedComponent = await repl.serialize();

            if (component.constructor.useSerializedChildrenComponentIndices) {
                const res = createComponentIndicesFromSerializedChildren(
                    [serializedComponent],
                    [component.serializedChildren[idx]],
                    newNComponents,
                    stateIdInfo,
                );
                newNComponents = res.nComponents;

                serializedReplacements.push(...res.components);
            } else {
                const res = createNewComponentIndices(
                    [serializedComponent],
                    newNComponents,
                    stateIdInfo,
                    idxMapOverride,
                );
                newNComponents = res.nComponents;

                serializedReplacements.push(...res.components);
            }
        } else {
            serializedReplacements.push(repl);
        }
    }

    if (component.constructor.addExtraSerializedChildrenWhenShadowing) {
        let rendered = true;
        if ("rendered" in component.state) {
            rendered = await component.state.rendered.value;
        }

        if (rendered) {
            // add any serialized children that are beyond the replacements we already have
            serializedReplacements.push(
                ...deepClone(
                    component.serializedChildren.slice(
                        serializedReplacements.length,
                    ),
                ),
            );
        }
    }

    adjustForCreateComponentIdxName({
        serializedReplacements,
        composite: component,
    });

    // Have three composites involved:
    // 1. the shadowing composite (component, the one we're trying to expand)
    // 2. the shadowed composite
    // 3. the composite mediating the shadowing
    //    (of which shadowing composite is the replacement)

    let nameOfCompositeMediatingTheShadow = component.shadows.compositeIdx;
    let compositeMediatingTheShadow =
        core._components[nameOfCompositeMediatingTheShadow];
    serializedReplacements = postProcessCopy({
        serializedComponents: serializedReplacements,
        componentIdx: nameOfCompositeMediatingTheShadow,
    });

    // If shadowed composite mediates the shadow of compositeMediatingTheShadow,
    // then we have a circular reference.
    let foundCircular = false;
    let shadowedByShadowed = shadowedComposite.mediatesShadows
        ?.filter((v: any) => v.propVariable === undefined)
        .map((v: any) => v.shadowed);

    while (shadowedByShadowed?.length > 0) {
        if (shadowedByShadowed.includes(nameOfCompositeMediatingTheShadow)) {
            foundCircular = true;
            let message = "Circular dependency detected";
            if (component.attributes.createComponentOfType?.primitive) {
                message += ` involving \`<${component.attributes.createComponentOfType.primitive.value}>\` component`;
            }
            message += ".";
            serializedReplacements = [
                {
                    type: "serialized",
                    componentType: "_error",
                    componentIdx: newNComponents++,
                    attributes: {},
                    doenetAttributes: {},
                    children: [],
                    state: { message },
                    position: compositeMediatingTheShadow.position,
                    sourceDoc: compositeMediatingTheShadow.sourceDoc,
                },
            ];
            core.addDiagnostic({
                type: "error",
                message,
                position: compositeMediatingTheShadow.position,
                sourceDoc: compositeMediatingTheShadow.sourceDoc,
            });

            break;
        }

        // recurse to check if one the shadowed components mediates
        // the shadow of compositeMediatingTheShadow
        shadowedByShadowed = shadowedByShadowed.reduce(
            (acc: any[], cIdx: number) => {
                let comp = core._components[cIdx];
                if (comp?.mediatesShadows) {
                    return [
                        ...acc,
                        ...comp.mediatesShadows
                            .filter((v: any) => v.propVariable === undefined)
                            .map((v: any) => v.shadowed),
                    ];
                } else {
                    return acc;
                }
            },
            [],
        );
    }

    if (!foundCircular) {
        // `replacementsCreated` is already initialized to 0 ~200 lines
        // earlier in this same function and is never re-set to undefined
        // between the two sites. The duplicate guard that used to live
        // here was dead. Removed per CORE_REFACTOR_DEFERRED.md
        // §"Drop dead `replacementsCreated` guard".

        let verificationResult = await verifyReplacementsMatchSpecifiedType({
            component,
            replacements: serializedReplacements,
            componentInfoObjects: core.componentInfoObjects,
            compositeAttributesObj: preprocessAttributesObject(
                component.constructor.createAttributesObject(),
            ),
            components: core._components,
            nComponents: newNComponents,
            stateIdInfo,
            publicCaseInsensitiveAliasSubstitutions:
                core.publicCaseInsensitiveAliasSubstitutions.bind(core),
        });

        for (const diagnostic of verificationResult.diagnostics) {
            core.addDiagnostic(diagnostic);
        }

        newNComponents = verificationResult.nComponents;

        serializedReplacements = verificationResult.replacements;

        addAttributesToSingleReplacement(
            serializedReplacements,
            component,
            core.componentInfoObjects,
        );
    }

    component.replacementsWorkspace.replacementsCreated = stateIdInfo.num;

    await addReplacementsToResolver({
        core,
        serializedReplacements,
        component,
    });

    // expand `core._components` to length `newNComponents` so that the component indices will not be reused
    if (newNComponents > core._components.length) {
        core._components[newNComponents - 1] = undefined;
    }

    await createAndSetReplacements({
        core,
        component,
        serializedReplacements,
    });

    if (shadowedComposite.replacementsToWithhold > 0) {
        component.replacementsToWithhold =
            shadowedComposite.replacementsToWithhold;
    }

    _finishExpanding({ core, componentIdx: component.componentIdx });

    compositesExpanded.push(component.componentIdx);

    return { success: true, compositesExpanded };
}

/**
 * Pop `componentIdx` off `core.updateInfo.compositesBeingExpanded` to
 * record that the composite has finished expanding. Throws if the
 * composite was not on the in-progress list — that would indicate the
 * push/pop pairing in `expandCompositeComponent` /
 * `expandShadowingComposite` has drifted.
 */
function _finishExpanding({
    core,
    componentIdx,
}: {
    core: Core;
    componentIdx: number;
}) {
    const targetInd =
        core.updateInfo.compositesBeingExpanded.indexOf(componentIdx);
    if (targetInd === -1) {
        throw Error(
            `Something is wrong as we lost track that we were expanding ${componentIdx}`,
        );
    }
    core.updateInfo.compositesBeingExpanded.splice(targetInd, 1);
}

/**
 * If `composite` has `createComponentIdx` specified,
 * then its one replacement should have the componentIdx.
 * Similarly, if it has `createComponentName` specified,
 * then its one replacement should receive that name.
 */
export function adjustForCreateComponentIdxName({
    serializedReplacements,
    composite,
}: {
    serializedReplacements: any[];
    composite: any;
}) {
    if (serializedReplacements.length === 1) {
        if (
            composite.attributes.createComponentIdx?.primitive.value !=
            undefined
        ) {
            serializedReplacements[0].componentIdx =
                composite.attributes.createComponentIdx.primitive.value;
        }

        if (
            composite.attributes.createComponentName?.primitive.value !=
            undefined
        ) {
            serializedReplacements[0].attributes.name = {
                type: "primitive",
                name: "name",
                primitive: {
                    type: "string",
                    value: composite.attributes.createComponentName.primitive
                        .value,
                },
            };
        }
    }
}

export async function createAndSetReplacements({
    core,
    component,
    serializedReplacements,
}: {
    core: Core;
    component: any;
    serializedReplacements: any[];
}) {
    core.parameterStack.push(component.sharedParameters, false);

    try {
        let replacementResult = await core.createIsolatedComponents({
            serializedComponents: serializedReplacements,
            ancestors: component.ancestors,
            shadow: true,
            componentsReplacementOf: component,
        });
        component.replacements = replacementResult.components;
    } catch (e: any) {
        console.error(e);
        // throw e;
        component.replacements = await core.setErrorReplacements({
            composite: component,
            message: e.message,
        });
    }
    core.parameterStack.pop();

    await core.dependencies.addBlockersFromChangedReplacements(component);

    component.isExpanded = true;
}

export async function replaceCompositeChildren({
    core,
    parent,
}: {
    core: Core;
    parent: any;
}) {
    // If a composite is not directly matched by any childGroup, replace
    // the composite with its replacements, expanding it if not already
    // expanded.
    delete parent.placeholderActiveChildrenIndices;
    delete parent.placeholderActiveChildrenIndicesByComposite;
    delete parent.compositeReplacementActiveRange;

    let undisplayableErrorChildren;

    let nPlaceholdersAdded = 0;

    for (
        let childInd = 0;
        childInd < parent.activeChildren.length;
        childInd++
    ) {
        let child = parent.activeChildren[childInd];

        if (
            child instanceof
            core.componentInfoObjects.allComponentClasses._composite
        ) {
            // if composite itself is in the child logic
            // then don't replace it with its replacements
            // but leave the composite as an activeChild
            if (
                findChildGroup({
                    core,
                    childType: child.componentType,
                    parentClass: parent.constructor,
                }).success
            ) {
                continue;
            }

            let replaceWithPlaceholders = false;

            // if an unexpanded composite has a createComponentOfType specified
            // replace with placeholders
            // otherwise, leave composite as an activeChild
            if (!child.isExpanded) {
                if (child.attributes.createComponentOfType?.primitive) {
                    replaceWithPlaceholders = true;
                } else {
                    continue;
                }
            }

            let replacements;

            if (replaceWithPlaceholders) {
                let numComponents;

                if (child.attributes.numComponents) {
                    numComponents =
                        child.attributes.numComponents.primitive.value;
                } else {
                    numComponents = 1;
                }

                let componentType =
                    core.componentInfoObjects.componentTypeLowerCaseMapping[
                        child.attributes.createComponentOfType.primitive.value.toLowerCase()
                    ];
                replacements = [];

                for (let i = 0; i < numComponents; i++) {
                    replacements.push({
                        componentType,
                        fromComposite: child.componentIdx,
                        placeholderInd: nPlaceholdersAdded,
                    });
                    nPlaceholdersAdded++;
                }

                parent.hasPlaceholderActiveChildren = true;
                let placeholdInds = [...Array(numComponents).keys()].map(
                    (x) => x + childInd,
                );

                if (!parent.placeholderActiveChildrenIndices) {
                    parent.placeholderActiveChildrenIndices = [];
                }
                parent.placeholderActiveChildrenIndices.push(...placeholdInds);

                if (!parent.placeholderActiveChildrenIndicesByComposite) {
                    parent.placeholderActiveChildrenIndicesByComposite = {};
                }
                parent.placeholderActiveChildrenIndicesByComposite[
                    child.componentIdx
                ] = placeholdInds;
            } else {
                // don't use any replacements that are marked as being withheld
                await markWithheldReplacementsInactive({
                    core,
                    composite: child,
                });

                replacements = child.replacements;
                if (child.replacementsToWithhold > 0) {
                    replacements = replacements.slice(
                        0,
                        -child.replacementsToWithhold,
                    );
                }

                // don't include blank string replacements if parent excludes blank children
                if (
                    !parent.constructor.includeBlankStringChildren ||
                    parent.constructor.removeBlankStringChildrenPostSugar
                ) {
                    replacements = replacements.filter(
                        (x: any) => typeof x !== "string" || /\S/.test(x),
                    );
                }
            }

            if (!parent.compositeReplacementActiveRange) {
                parent.compositeReplacementActiveRange = [];
            }

            // Record whether or not each component can be considered an element of a list.
            // If this composite or a containing composite has asList set,
            // then it may be turned into a list if all the components can be list elements.

            // All inline components and any components with canBeInList set
            // are considered potential components for a list.
            let replacementsCanBeInList = replacements.map((repl: any) =>
                Boolean(
                    typeof repl !== "object" ||
                    (core.componentInfoObjects.isInheritedComponentType({
                        inheritedComponentType: repl.componentType,
                        baseComponentType: "_inline",
                    }) &&
                        repl.constructor.canBeInList !== false) ||
                    repl.constructor.canBeInList,
                ),
            );

            for (let otherCompositeObject of parent.compositeReplacementActiveRange) {
                if (otherCompositeObject.lastInd >= childInd) {
                    otherCompositeObject.lastInd += replacements.length - 1;
                    otherCompositeObject.potentialListComponents.splice(
                        childInd,
                        1,
                        ...replacementsCanBeInList,
                    );
                }
            }

            if (
                replacements.some(
                    (repl: any) => repl.componentType === "_error",
                ) &&
                !parent.constructor.canDisplayChildErrors
            ) {
                // The composite returned an error but this parent cannot display child errors,
                // so remove it from the replacements
                // (to avoid a confusing warning about an invalid _error child)
                // and store it in undisplayableErrorChildren.
                // We will add these error children to an ancestor that can display them, below.

                if (!undisplayableErrorChildren) {
                    undisplayableErrorChildren = [];
                }
                let errorReplacements = replacements.filter(
                    (repl: any) => repl.componentType === "_error",
                );
                replacements = replacements.filter(
                    (repl: any) => repl.componentType !== "_error",
                );
                undisplayableErrorChildren.push(...errorReplacements);
            }

            // compositeReplacementActiveRange will be used
            // - in renderers to determined if they should add commas
            // - in child dependencies, where they will be translated for matched children
            //   and used in some components to determine if those children can be formed into a list
            if (child.isExpanded) {
                parent.compositeReplacementActiveRange.push({
                    compositeIdx: child.componentIdx,
                    compositeName:
                        core.rootNames?.[child.componentIdx] ??
                        "_id_" + child.componentIdx.toString(),
                    extendIdx: await child.stateValues.extendIdx,
                    unresolvedPath: await child.stateValues.unresolvedPath,
                    firstInd: childInd,
                    lastInd: childInd + replacements.length - 1,
                    asList: await child.stateValues.asList,
                    potentialListComponents: replacementsCanBeInList,
                });
            }

            parent.activeChildren.splice(childInd, 1, ...replacements);

            // Update allChildren object with info on composite and its replacemnts
            let allChildrenObj = parent.allChildren[child.componentIdx];
            delete allChildrenObj.activeChildrenIndex;
            for (let ind2 = 0; ind2 < replacements.length; ind2++) {
                let replacement = replacements[ind2];
                if (replacement.componentIdx != undefined) {
                    // ignore placeholder, string, and primitive number active children
                    parent.allChildren[replacement.componentIdx] = {
                        activeChildrenIndex: childInd + ind2,
                        component: replacement,
                    };
                }
            }

            // find index of child in allChildrenOrdered
            // and place replacements immediately afterward
            let ind2 = parent.allChildrenOrdered.indexOf(child.componentIdx);
            parent.allChildrenOrdered.splice(
                ind2 + 1,
                0,
                ...replacements
                    .filter((x: any) => typeof x === "object")
                    .map((x: any) =>
                        x.componentIdx ? x.componentIdx : x.placeholderInd,
                    ),
            );

            if (replacements.length !== 1) {
                // if replaced composite with anything other than one replacement
                // shift activeChildrenIndices of later children
                let nShift = replacements.length - 1;
                for (
                    let ind2 = childInd + replacements.length;
                    ind2 < parent.activeChildren.length;
                    ind2++
                ) {
                    let child2 = parent.activeChildren[ind2];
                    if (child2.componentIdx != undefined) {
                        parent.allChildren[
                            child2.componentIdx
                        ].activeChildrenIndex += nShift;
                    }
                }
            }

            // rewind one index, in case any of the new activeChildren are composites
            childInd--;
        }
    }

    if (undisplayableErrorChildren) {
        await addUndisplayableErrorChildrenToAncestor({
            core,
            parent,
            undisplayableErrorChildren,
        });
    }
}

async function addUndisplayableErrorChildrenToAncestor({
    core,
    parent,
    undisplayableErrorChildren,
}: {
    core: Core;
    parent: any;
    undisplayableErrorChildren: any[];
}) {
    // If parent had an error added by a composite, but it can't display errors,
    // then look for an ancestor that can display errors
    // (which will exist since document can display errors).
    // Add the errors to the defining children of that ancestor.
    let ancestorToDisplayErrors = parent;
    let definingChildIndToAddError;
    while (!ancestorToDisplayErrors.constructor.canDisplayChildErrors) {
        let nextAncestor = core._components[ancestorToDisplayErrors.parentIdx];

        definingChildIndToAddError = nextAncestor.definingChildren.indexOf(
            ancestorToDisplayErrors,
        );

        ancestorToDisplayErrors = nextAncestor;
    }

    // if child wasn't a defining child, put the error as the first child
    if (definingChildIndToAddError === -1) {
        definingChildIndToAddError = 0;
    }

    ancestorToDisplayErrors.definingChildren.splice(
        definingChildIndToAddError,
        0,
        ...undisplayableErrorChildren,
    );

    await processNewDefiningChildren({
        core,
        parent: ancestorToDisplayErrors,
        expandComposites: false,
    });
}

async function markWithheldReplacementsInactive({
    core,
    composite,
}: {
    core: Core;
    composite: any;
}) {
    let numActive = composite.replacements.length;

    if (await composite.stateValues.isInactiveCompositeReplacement) {
        numActive = 0;
    } else if (composite.replacementsToWithhold > 0) {
        numActive -= composite.replacementsToWithhold;
    }

    for (let repl of composite.replacements.slice(0, numActive)) {
        await changeInactiveComponentAndDescendants({
            core,
            component: repl,
            inactive: false,
        });
    }

    for (let repl of composite.replacements.slice(numActive)) {
        await changeInactiveComponentAndDescendants({
            core,
            component: repl,
            inactive: true,
        });
    }

    // composite is newly active
    // if updates to replacements were postponed
    // add them back to the queue
    if (!(await composite.stateValues.isInactiveCompositeReplacement)) {
        let cIdx = composite.componentIdx;
        if (core.updateInfo.inactiveCompositesToUpdateReplacements.has(cIdx)) {
            core.updateInfo.inactiveCompositesToUpdateReplacements.delete(cIdx);
            core.updateInfo.compositesToUpdateReplacements.add(cIdx);
        }
    }
}

export async function changeInactiveComponentAndDescendants({
    core,
    component,
    inactive,
}: {
    core: Core;
    component: any;
    inactive: boolean;
}) {
    if (typeof component !== "object") {
        return;
    }

    if (
        (await component.stateValues.isInactiveCompositeReplacement) !==
        inactive
    ) {
        component.state.isInactiveCompositeReplacement.value = inactive;
        await core.markUpstreamDependentsStale({
            component,
            varName: "isInactiveCompositeReplacement",
        });
        core.dependencies.recordActualChangeInUpstreamDependencies({
            component,
            varName: "isInactiveCompositeReplacement",
        });
        for (const childIdxStr in component.allChildren) {
            await changeInactiveComponentAndDescendants({
                core,
                component: core._components[childIdxStr],
                inactive,
            });
        }

        for (let attrName in component.attributes) {
            let attrComp = component.attributes[attrName].component;
            if (attrComp) {
                await changeInactiveComponentAndDescendants({
                    core,
                    component: core._components[attrComp.componentIdx],
                    inactive,
                });
            }
        }

        if (component.replacements) {
            await markWithheldReplacementsInactive({
                core,
                composite: component,
            });
        }
    }
}

/**
 * Walk `replacements`, substituting each expanded composite for its
 * own replacements (recursively). Composites that are not yet expanded
 * are kept in place and recorded in `unexpandedCompositesReady` or
 * `unexpandedCompositesNotReady` based on whether
 * `readyToExpandWhenResolved` has resolved, so the caller can decide
 * to wait for or force their expansion.
 *
 * `recurseNonStandardComposites` widens the "what counts as a composite"
 * test to include non-standard composites. `includeWithheldReplacements`
 * keeps replacements past `replacementsToWithhold`. `stopIfHaveProp`,
 * if set, names a state variable: a composite that publicly exposes
 * that variable is treated as the replacement itself rather than
 * recursed into.
 */
export function recursivelyReplaceCompositesWithReplacements({
    core,
    replacements,
    recurseNonStandardComposites = false,
    includeWithheldReplacements = false,
    stopIfHaveProp,
}: {
    core: Core;
    replacements: any[];
    recurseNonStandardComposites?: boolean;
    includeWithheldReplacements?: boolean;
    stopIfHaveProp?: string;
}): {
    compositesFound: number[];
    newReplacements: any[];
    unexpandedCompositesReady: number[];
    unexpandedCompositesNotReady: number[];
} {
    let compositesFound: number[] = [];
    let newReplacements: any[] = [];
    let unexpandedCompositesReady: number[] = [];
    let unexpandedCompositesNotReady: number[] = [];

    for (let replacement of replacements) {
        const isComposite = core.componentInfoObjects.isCompositeComponent({
            componentType: replacement.componentType,
            includeNonStandard: recurseNonStandardComposites,
        });

        if (!isComposite) {
            newReplacements.push(replacement);
            continue;
        }

        if (stopIfHaveProp) {
            const checkForPublic = core.matchPublicStateVariables({
                stateVariables: [stopIfHaveProp],
                componentClass: replacement.constructor,
            })[0];

            if (!checkForPublic.startsWith("__not_public_")) {
                // The composite has a public state variable that matches `stopIfHaveProp`.
                // Therefore, we don't recurse to its replacements but treat the composite itself as the replacement.
                newReplacements.push(replacement);
                continue;
            }
        }

        compositesFound.push(replacement.componentIdx);

        if (!replacement.isExpanded) {
            if (replacement.state.readyToExpandWhenResolved.isResolved) {
                unexpandedCompositesReady.push(replacement.componentIdx);
            } else {
                unexpandedCompositesNotReady.push(replacement.componentIdx);
            }
            newReplacements.push(replacement);
            continue;
        }

        let replacementReplacements = replacement.replacements;
        if (
            !includeWithheldReplacements &&
            replacement.replacementsToWithhold > 0
        ) {
            replacementReplacements = replacementReplacements.slice(
                0,
                -replacement.replacementsToWithhold,
            );
        }
        const recursionResult = recursivelyReplaceCompositesWithReplacements({
            core,
            replacements: replacementReplacements,
            recurseNonStandardComposites,
            includeWithheldReplacements,
            stopIfHaveProp,
        });
        compositesFound.push(...recursionResult.compositesFound);
        newReplacements.push(...recursionResult.newReplacements);
        unexpandedCompositesReady.push(
            ...recursionResult.unexpandedCompositesReady,
        );
        unexpandedCompositesNotReady.push(
            ...recursionResult.unexpandedCompositesNotReady,
        );
    }

    return {
        compositesFound,
        newReplacements,
        unexpandedCompositesReady,
        unexpandedCompositesNotReady,
    };
}
