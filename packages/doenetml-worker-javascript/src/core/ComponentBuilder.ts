import type Core from "../Core";
import type { ComponentIdx } from "@doenet/utils";
import { deriveChildResultsFromDefiningChildren } from "./ChildMatcher";
import {
    addChildrenAndRecurseToShadows,
    registerComponent,
} from "./ComponentLifecycle";
import {
    componentAndRenderedDescendants,
    expandAllComposites,
} from "./CompositeExpander";
import { addComponentsToResolver } from "./ResolverAdapter";
import { createStateVariableDefinitions } from "./StateVariableDefinitionFactory";
import { initializeComponentStateVariables } from "./StateVariableInitializer";
import { convertToErrorComponent } from "../utils/dast/errors";
import { gatherVariantComponents } from "../utils/variants";
import { unwrapSource } from "../utils/dast/convertNormalizedDast";
import { extractCreateComponentIdxMapping } from "../utils/componentIndices";

/**
 * Builds component instances from serialized DAST. Handles the recursive
 * walk that creates a parent before its children, registers each new
 * component in the live tree (`core._components`), wires up state-variable
 * definitions and initial dependencies, and on the initial document load
 * performs the post-creation flush of error components requested by
 * state-variable definitions.
 *
 * The expansion of composite components into their replacements is the
 * responsibility of `CompositeExpander` (mutual recursion is expected).
 *
 * Stateless — each function takes a back-reference to Core to read the
 * hot fields (`_components`, `componentInfoObjects`, `parameterStack`,
 * `dependencies`, `updateInfo`, `numerics`, `flags`, `coreFunctions`,
 * `document`, `componentIdxByStateId`, `nTimesAddedComponents`,
 * `rootNames`, `createComponentIdxMapping`, `errorComponentsToAdd`,
 * `initialAddPhase`) and to dispatch through the other extracted managers.
 */

/**
 * Build a list of ancestor descriptors with `parent` prepended to its own
 * `ancestors` chain — the canonical shape consumed by component
 * constructors and by `createIsolatedComponents` recursion.
 */
function ancestorsForChild(parent: any): any[] {
    return [
        {
            componentIdx: parent.componentIdx,
            componentClass: parent.constructor,
        },
        ...parent.ancestors,
    ];
}

/**
 * Top-level entry point for materializing serialized DAST into live
 * component instances. On `initialAdd` the resulting tree becomes
 * `core.document` and is followed by the full initial-render pipeline
 * (composite expansion, state-variable evaluation, queued error flush,
 * renderer instructions). Otherwise the new components are spliced into
 * `parent`'s defining children at `indexOfDefiningChildren`.
 */
export async function addComponents({
    core,
    serializedComponents,
    parentIdx,
    indexOfDefiningChildren,
    initialAdd = false,
}: {
    core: Core;
    serializedComponents: any;
    parentIdx?: ComponentIdx;
    indexOfDefiningChildren?: number;
    initialAdd?: boolean;
}) {
    core.initialAddPhase = initialAdd;

    if (!Array.isArray(serializedComponents)) {
        serializedComponents = [serializedComponents];
    }

    let parent;
    let ancestors: any[] = [];

    if (!initialAdd) {
        parent = core._components[parentIdx!];
        if (!parent) {
            core.addDiagnostic({
                type: "warning",
                message: `Cannot add children to parent ${parentIdx} as ${parentIdx} does not exist`,
            });
            return [];
        }

        ancestors = ancestorsForChild(parent);

        core.parameterStack.push(parent.sharedParameters, false);

        core.nTimesAddedComponents = (core.nTimesAddedComponents ?? 0) + 1;

        addComponentsToResolver({
            core,
            components: serializedComponents,
            parentIdx: parentIdx!,
        });
    }
    let createResult = await createIsolatedComponents({
        core,
        serializedComponents,
        ancestors,
    });
    if (!initialAdd) {
        core.parameterStack.pop();
    }

    const newComponents = createResult.components;

    let deletedComponents: Record<string, any> = {};
    let addedComponents: Record<string, any> = {};
    newComponents.forEach((x: any) => (addedComponents[x.componentIdx] = x));

    if (initialAdd) {
        if (newComponents.length !== 1) {
            throw Error(
                "Initial components need to be an array of just one component.",
            );
        }
        core.document = newComponents[0];

        await _expandAllCompositesBothPasses(core);
        await _drainStateVariablesToEvaluate(core);

        await addQueuedErrorComponentsFromStateVariables({ core });

        await core.replacementChangesFromCompositesToUpdate();

        let results = await core.initializeRenderedComponentInstruction(
            core.document,
        );

        if (core.errorComponentsToAdd.length > 0) {
            await addQueuedErrorComponentsFromStateVariables({ core });

            // Adding queued _error components can touch composites and alter
            // what needs to be rendered from the document root.
            await core.replacementChangesFromCompositesToUpdate();

            results = await core.initializeRenderedComponentInstruction(
                core.document,
            );
        }

        core.documentRendererInstructions = results.componentToRender;

        let updateInstructions = [
            {
                instructionType: "updateRendererStates",
                rendererStatesToUpdate: results.rendererStatesToUpdate,
            },
        ];

        core.callUpdateRenderers({ updateInstructions }, true);

        // if have some states to force update
        // then post these updates without setting init to true
        if (results.rendererStatesToForceUpdate.length > 0) {
            let updateInstructions = [
                {
                    instructionType: "updateRendererStates",
                    rendererStatesToUpdate: results.rendererStatesToForceUpdate,
                },
            ];
            core.callUpdateRenderers({ updateInstructions });
        }

        // initializing renderer instructions could trigger more composite updates
        // (presumably from deriving child results)
        // if so, make replacement changes and update renderer instructions again
        // TODO: should we check for child results earlier so we don't have to check them
        // when updating renderer instructions?
        await _drainCompositesToUpdateReplacements(core);

        await core.processStateVariableTriggers(true);
    } else {
        if (parent === undefined) {
            throw Error("Must specify parent when adding components.");
        }
        if (indexOfDefiningChildren === undefined) {
            indexOfDefiningChildren = parent.definingChildren.length;
        }

        let addResults = await addChildrenAndRecurseToShadows({
            core,
            parent,
            indexOfDefiningChildren: indexOfDefiningChildren!,
            newChildren: newComponents,
        });
        if (!addResults.success) {
            throw Error(
                "Couldn't satisfy child logic result.  Need informative error message",
            );
        }
        Object.assign(addedComponents, addResults.addedComponents);
        Object.assign(deletedComponents, addResults.deletedComponents);

        await _expandAllCompositesBothPasses(core);
        await _drainStateVariablesToEvaluate(core);
        await core.replacementChangesFromCompositesToUpdate();

        await core.updateRendererInstructions({
            componentNamesToUpdate: await componentAndRenderedDescendants({
                core,
                component: parent,
            }),
        });

        // updating renderer instructions could trigger more composite updates
        // (presumably from deriving child results)
        // if so, make replacement changes and update renderer instructions again
        // TODO: should we check for child results earlier so we don't have to check them
        // when updating renderer instructions?
        await _drainCompositesToUpdateReplacements(core);

        await core.processStateVariableTriggers(true);
    }

    core.initialAddPhase = false;
    return newComponents;
}

/**
 * Walks `serializedComponents` and produces matching live component
 * instances without splicing them into any parent's defining-children
 * list — used for replacements, attribute components, error components,
 * and reference-resolution sub-trees that get attached by their caller.
 * Mutually recursive with `createChildrenThenComponent` (children are
 * built before their parent is constructed).
 */
export async function createIsolatedComponents({
    core,
    serializedComponents,
    ancestors,
    shadow = false,
    componentsReplacementOf,
}: {
    core: Core;
    serializedComponents: any[];
    ancestors: any;
    shadow?: boolean;
    componentsReplacementOf?: any;
}) {
    const newComponents: any[] = [];

    let lastErrorMessage = "";

    const res = extractCreateComponentIdxMapping(serializedComponents);
    Object.assign(
        core.createComponentIdxMapping,
        res.createComponentIdxMapping,
    );

    for (let serializedComponent of serializedComponents) {
        if (typeof serializedComponent !== "object") {
            newComponents.push(serializedComponent);
            continue;
        }

        let componentClass =
            core.componentInfoObjects.allComponentClasses[
                serializedComponent.componentType
            ];
        if (componentClass === undefined) {
            // Note: This error shouldn't get reached from author-typed code,
            // as it should get caught by the correctComponentTypeCapitalization function.
            // However, it could get called from Javascript if developers
            // create a serialized component that doesn't exist.
            const message = `Invalid component type: \`<${serializedComponent.componentType}>\`.`;

            core.diagnosticsManager.markPending();

            const convertResult = convertToErrorComponent(
                serializedComponent,
                message,
            );
            serializedComponent = convertResult.component;

            lastErrorMessage = message;

            componentClass =
                core.componentInfoObjects.allComponentClasses[
                    serializedComponent.componentType
                ];
        }

        if (!serializedComponent.doenetAttributes) {
            serializedComponent.doenetAttributes = {};
        }

        let componentIdx = serializedComponent.componentIdx;
        if (componentIdx === undefined) {
            console.log(serializedComponent);
            throw Error("Found a serialized component without a componentIdx");
        }

        const createResult = await createChildrenThenComponent({
            core,
            serializedComponent,
            componentIdx,
            ancestors,
            componentClass,
            shadow,
            componentsReplacementOf,
        });

        const newComponent = createResult.newComponent;
        newComponents.push(newComponent);

        if (createResult.lastErrorMessage) {
            lastErrorMessage = createResult.lastErrorMessage;
        }
    }

    let results = {
        components: newComponents,
        lastErrorMessage,
    };

    return results;
}

/**
 * Materializes a single component: recursively creates its children
 * (and attribute / reference-path sub-components) first, then constructs
 * the component itself, registers it on Core, wires up shadow / adapter
 * relationships, derives child results, initializes state-variable
 * definitions and dependencies, and applies any state-variable updates
 * that were queued for this `componentIdx` while it was missing.
 */
export async function createChildrenThenComponent({
    core,
    serializedComponent,
    componentIdx,
    ancestors,
    componentClass,
    shadow = false,
    componentsReplacementOf,
}: {
    core: Core;
    serializedComponent: any;
    componentIdx: ComponentIdx;
    ancestors: any;
    componentClass: any;
    shadow?: boolean;
    componentsReplacementOf?: any;
}) {
    let lastErrorMessage = "";
    let lastErrorMessageFromAttribute = "";

    if (!(Number.isInteger(componentIdx) && componentIdx >= 0)) {
        throw Error(`Found an invalid componentIdx: ${componentIdx}`);
    }

    if (core._components[componentIdx] !== undefined) {
        console.log(core._components[componentIdx], serializedComponent);
        throw Error(`Found a duplicate componentIdx: ${componentIdx}`);
    }

    const serializedChildren = serializedComponent.children;
    let definingChildren: any[] = [];
    const childrenToRemainSerialized: any[] = [];

    const ancestorsForChildren = [
        { componentIdx, componentClass },
        ...ancestors,
    ];

    const parentSharedParameters = core.parameterStack.parameters;
    core.parameterStack.push();
    const sharedParameters = core.parameterStack.parameters;

    if (componentClass.descendantCompositesMustHaveAReplacement && !shadow) {
        sharedParameters.compositesMustHaveAReplacement = true;
        sharedParameters.compositesDefaultReplacementType =
            componentClass.descendantCompositesDefaultReplacementType;
    } else if (
        componentClass.descendantCompositesMustHaveAReplacement === false ||
        shadow
    ) {
        sharedParameters.compositesMustHaveAReplacement = false;
    }

    if (serializedChildren !== undefined) {
        if (componentClass.preprocessSerializedChildren) {
            componentClass.preprocessSerializedChildren({
                serializedChildren,
                attributes: serializedComponent.attributes,
                componentIdx,
            });
        }

        if (componentClass.setUpVariant) {
            const descendantVariantComponents = gatherVariantComponents({
                serializedComponents: serializedChildren,
                componentInfoObjects: core.componentInfoObjects,
            });

            componentClass.setUpVariant({
                serializedComponent,
                sharedParameters,
                descendantVariantComponents,
                core,
            });
        }

        if (componentClass.keepChildrenSerialized) {
            const childrenAddressed = new Set<number>([]);

            const keepSerializedInds = componentClass.keepChildrenSerialized({
                serializedComponent,
                componentInfoObjects: core.componentInfoObjects,
            });

            for (const ind of keepSerializedInds) {
                if (childrenAddressed.has(Number(ind))) {
                    throw Error(
                        "Invalid instructions to keep children serialized from " +
                            componentClass.componentType +
                            ": child repeated",
                    );
                }
                childrenAddressed.add(Number(ind));
                childrenToRemainSerialized.push(serializedChildren[ind]);
            }

            const childrenToCreate: any[] = [];
            for (const [ind, child] of serializedChildren.entries() as Iterable<
                [number, any]
            >) {
                if (!childrenAddressed.has(ind)) {
                    childrenToCreate.push(child);
                }
            }

            if (childrenToCreate.length > 0) {
                const childrenResult = await createIsolatedComponents({
                    core,
                    serializedComponents: childrenToCreate,
                    ancestors: ancestorsForChildren,
                    shadow,
                    componentsReplacementOf,
                });

                definingChildren = childrenResult.components;
                if (childrenResult.lastErrorMessage) {
                    lastErrorMessage = childrenResult.lastErrorMessage;
                }
            }
        } else {
            const childrenResult = await createIsolatedComponents({
                core,
                serializedComponents: serializedChildren,
                ancestors: ancestorsForChildren,
                shadow,
                componentsReplacementOf,
            });

            definingChildren = childrenResult.components;
            if (childrenResult.lastErrorMessage) {
                lastErrorMessage = childrenResult.lastErrorMessage;
            }
        }
    }

    let attributes: Record<string, any> = {};

    if (serializedComponent.attributes) {
        for (const attrName in serializedComponent.attributes) {
            const attribute = serializedComponent.attributes[attrName];

            if (attribute.component) {
                if (attrName === componentClass.addAttributeToResolver) {
                    addComponentsToResolver({
                        core,
                        components: [attribute.component],
                        parentIdx: serializedComponent.componentIdx,
                    });
                }

                try {
                    const attrResult = await createIsolatedComponents({
                        core,
                        serializedComponents: [attribute.component],
                        ancestors: ancestorsForChildren,
                        shadow,
                        componentsReplacementOf,
                    });

                    if (attrResult.lastErrorMessage) {
                        lastErrorMessage = attrResult.lastErrorMessage;
                        lastErrorMessageFromAttribute =
                            attrResult.lastErrorMessage;
                    }

                    attributes[attrName] = {
                        component: attrResult.components[0],
                    };
                } catch (e: any) {
                    console.error(e);
                    if (e.message.includes("Circular dependency")) {
                        throw Error(
                            core.dependencies.getCircularDependencyMessage([
                                serializedComponent,
                            ]),
                        );
                    } else {
                        throw e;
                    }
                }
            } else if (attribute.references) {
                const attrResult = await createIsolatedComponents({
                    core,
                    serializedComponents: attribute.references,
                    ancestors: ancestorsForChildren,
                    shadow,
                    componentsReplacementOf,
                });

                if (attrResult.lastErrorMessage) {
                    lastErrorMessage = attrResult.lastErrorMessage;
                    lastErrorMessageFromAttribute = attrResult.lastErrorMessage;
                }

                attributes[attrName] = {
                    references: attrResult.components,
                    stringChildren: attribute.stringChildren,
                };
            } else {
                attributes[attrName] = serializedComponent.attributes[attrName];
            }
        }
    }

    let refResolution: any = null;
    if (serializedComponent.extending) {
        refResolution = unwrapSource(serializedComponent.extending);

        const nodeIdx = refResolution.nodeIdx;

        const originalPath: any[] = [];
        for (const pathPart of refResolution.originalPath) {
            const index: any[] = [];
            for (const indexPiece of pathPart.index) {
                const valueResult = await createIsolatedComponents({
                    core,
                    serializedComponents: indexPiece.value,
                    ancestors: ancestorsForChildren,
                    shadow,
                    componentsReplacementOf,
                });
                if (valueResult.lastErrorMessage) {
                    lastErrorMessage = valueResult.lastErrorMessage;
                }
                const value = valueResult.components;
                index.push({
                    value,
                    position: indexPiece.position,
                    sourceDoc: indexPiece.sourceDoc,
                });
            }
            originalPath.push({
                name: pathPart.name,
                index,
                position: pathPart.position,
                sourceDoc: pathPart.sourceDoc,
            });
        }
        refResolution = {
            nodeIdx,
            unresolvedPath: refResolution.unresolvedPath,
            originalPath,
            nodesInResolvedPath: refResolution.nodesInResolvedPath,
        };
    }

    if (serializedComponent.componentType === "_error") {
        lastErrorMessage = serializedComponent.state.message;

        core.addDiagnostic({
            type: "error",
            message: serializedComponent.state.message,
            position: serializedComponent.position,
            sourceDoc: serializedComponent.sourceDoc,
        });
    } else if (
        lastErrorMessageFromAttribute ||
        (lastErrorMessage && !componentClass.canDisplayChildErrors)
    ) {
        // We have to deal with two special cases where errors wouldn't be displayed:
        // 1. there is an error message from an attribute, or
        // 2. this component cannot display errors from children
        // In these cases, we turn this component into an error component
        // to ensure the error message is displayed.

        const convertResult = convertToErrorComponent(
            serializedComponent,
            lastErrorMessageFromAttribute || lastErrorMessage,
        );
        serializedComponent = convertResult.component;

        attributes = {};
        componentClass =
            core.componentInfoObjects.allComponentClasses[
                serializedComponent.componentType
            ];
    }

    const prescribedDependencies: Record<string, any> = {};

    if (serializedComponent.downstreamDependencies) {
        for (const idxStr in serializedComponent.downstreamDependencies) {
            const idx = Number(idxStr);
            if (idx === componentIdx) {
                throw Error(
                    core.dependencies.getCircularDependencyMessage([
                        serializedComponent,
                    ]),
                );
            }
            if (core._components[idx]) {
                prescribedDependencies[idx] =
                    serializedComponent.downstreamDependencies[idx];
            } else {
                throw Error(
                    core.dependencies.getCircularDependencyMessage([
                        serializedComponent,
                    ]),
                );
            }
        }
    }

    const stateVariableDefinitions = await createStateVariableDefinitions({
        core,
        componentClass,
        prescribedDependencies,
        componentIdx,
    });

    // In case a component with the same idx was deleted before, clear it
    // from the deleted-tracking maps so the new component isn't shadowed
    // by the prior tombstone.
    delete core.updateInfo.deletedComponents[componentIdx];
    delete core.updateInfo.deletedStateVariables[componentIdx];

    const stateId = serializedComponent.stateId ?? componentIdx.toString();
    core.componentIdxByStateId[stateId] = componentIdx;

    const newComponent = new componentClass({
        componentIdx,
        stateId,
        rootName:
            core.rootNames?.[componentIdx] ?? "_id_" + componentIdx.toString(),
        ancestors,
        definingChildren,
        stateVariableDefinitions,
        serializedChildren: childrenToRemainSerialized,
        serializedComponent,
        attributes,
        componentInfoObjects: core.componentInfoObjects,
        coreFunctions: core.coreFunctions,
        flags: core.flags,
        shadow,
        numerics: core.numerics,
        sharedParameters,
        parentSharedParameters,
        refResolution,
    });

    registerComponent({ core, component: newComponent });

    if (componentsReplacementOf) {
        newComponent.replacementOf = componentsReplacementOf;
    }

    if (serializedComponent.adaptedFrom) {
        // record adapter relationship
        newComponent.adaptedFrom =
            core._components[serializedComponent.adaptedFrom];
        newComponent.adaptedFrom.adapterUsed = newComponent;
    }

    for (const idxStr in prescribedDependencies) {
        const idx = Number(idxStr);
        const depArray = prescribedDependencies[idx];
        for (const dep of depArray) {
            if (dep.dependencyType === "referenceShadow") {
                const shadowInfo: Record<string, any> = {
                    componentIdx: idx,
                };
                Object.assign(shadowInfo, dep);
                delete shadowInfo.dependencyType;
                newComponent.shadows = shadowInfo;

                if (dep.firstLevelReplacement) {
                    newComponent.firstLevelReplacement = true;
                }

                const shadowedComponent = core._components[idx];
                if (!shadowedComponent.shadowedBy) {
                    shadowedComponent.shadowedBy = [];
                }
                shadowedComponent.shadowedBy.push(newComponent);

                const mediatingShadowComposite =
                    core._components[shadowInfo.compositeIdx];
                if (!mediatingShadowComposite.mediatesShadows) {
                    mediatingShadowComposite.mediatesShadows = [];
                }
                mediatingShadowComposite.mediatesShadows.push({
                    shadowing: newComponent.componentIdx,
                    shadowed: idx,
                    propVariable: dep.propVariable,
                });

                if (dep.isPrimaryShadow) {
                    shadowedComponent.primaryShadow = newComponent.componentIdx;

                    if (
                        core.dependencies.updateTriggers
                            .primaryShadowDependencies[idx]
                    ) {
                        for (const dep of core.dependencies.updateTriggers
                            .primaryShadowDependencies[idx]) {
                            await dep.recalculateDownstreamComponents();
                        }
                    }
                }

                break;
            }
        }
    }

    if (serializedComponent.unlinkedCopySource) {
        newComponent.unlinkedCopySource =
            serializedComponent.unlinkedCopySource;
    }

    await deriveChildResultsFromDefiningChildren({
        core,
        parent: newComponent,
        expandComposites: false,
    });

    await initializeComponentStateVariables({ core, component: newComponent });

    await core.dependencies.setUpComponentDependencies(newComponent);

    const variablesChanged =
        await core.dependencies.checkForDependenciesOnNewComponent(
            componentIdx,
        );

    for (const varDescription of variablesChanged) {
        await core.markStateVariableAndUpstreamDependentsStale({
            component: core._components[varDescription.componentIdx],
            varName: varDescription.varName,
        });
    }

    await checkForStateVariablesUpdatesForNewComponent({
        core,
        componentIdx,
    });

    await core.dependencies.resolveStateVariablesIfReady({
        component: newComponent,
    });

    core.recordStateVariablesMustEvaluate(componentIdx);

    await core.checkForActionChaining({ component: newComponent });

    core.parameterStack.pop();

    const results = { newComponent: newComponent, lastErrorMessage };

    return results;
}

/**
 * Apply any state-variable updates that were queued against
 * `componentIdx` while it was missing from `core._components` (e.g.
 * persisted state restored before the component was constructed). Marks
 * affected variables for re-evaluation when the component requires
 * special handling on the first post-restoration pass.
 */
export async function checkForStateVariablesUpdatesForNewComponent({
    core,
    componentIdx,
}: {
    core: Core;
    componentIdx: ComponentIdx;
}) {
    let comp = core._components[componentIdx];
    const stateId = comp.stateId;
    if (stateId in core.updateInfo.stateVariableUpdatesForMissingComponents) {
        let result = await core.processNewStateVariableValues(
            {
                [componentIdx]:
                    core.updateInfo.stateVariableUpdatesForMissingComponents[
                        stateId
                    ],
            },
            // This `true` indicates we have a new component
            true,
        );

        // In order to make sure that a component takes on the same value
        // that was saved to the database,
        // it may be necessary for a component to treat the value received differently
        // in the first pass of the definition.
        // Hence, we run the definition of all variables with the extra flag
        // justUpdatedForNewComponent = true
        if (
            comp.constructor.processWhenJustUpdatedForNewComponent ||
            result.foundIgnore
        ) {
            for (let vName in core.updateInfo
                .stateVariableUpdatesForMissingComponents[stateId]) {
                if (comp.state[vName]) {
                    core.updateInfo.stateVariablesToEvaluate.push({
                        componentIdx,
                        stateVariable: vName,
                    });
                    comp.state[vName].justUpdatedForNewComponent = true;
                    if (result.foundIgnore) {
                        // This is a kludge
                        // The only case so far with ignored children is that Math ignores strings
                        // (set in inverse definition of expressionWithCodes).
                        // We need change its value a second time after evaluating
                        // so that the next time the definition of expressionWithCodes is run,
                        // the strings don't show any changes and we'll use the essential value
                        // of expressionWithCodes
                        comp.reprocessAfterEvaluate =
                            core.updateInfo.stateVariableUpdatesForMissingComponents[
                                stateId
                            ];
                    }
                }
            }
        }

        delete core.updateInfo.stateVariableUpdatesForMissingComponents[
            stateId
        ];
    }
}

/**
 * Drain `core.errorComponentsToAdd` (populated when state-variable
 * definitions hit recoverable errors), creating an `_error` child under
 * the nearest ancestor that can display child errors. Inserts the error
 * component immediately after its triggering source within the parent's
 * defining children when both share the same parent, so multiple errors
 * from the same source preserve their relative order.
 */
export async function addQueuedErrorComponentsFromStateVariables({
    core,
}: {
    core: Core;
}) {
    if (!core.errorComponentsToAdd?.length) {
        return;
    }

    const errorComponentsToAdd = core.errorComponentsToAdd;
    core.errorComponentsToAdd = [];

    const numberInsertedAfterSource: Record<string, number> = {};

    for (let errorInfo of errorComponentsToAdd) {
        let sourceComponent = core._components[errorInfo.componentIdx];
        let parent;

        while (sourceComponent?.parentIdx > 0) {
            const candidateParent = core._components[sourceComponent.parentIdx];

            if (!candidateParent) {
                break;
            }

            if (candidateParent.constructor.canDisplayChildErrors) {
                parent = candidateParent;
                break;
            }

            sourceComponent = candidateParent;
        }

        if (!parent) {
            if (core.document?.constructor.canDisplayChildErrors) {
                parent = core.document;
            }
        }

        if (!parent) {
            continue;
        }

        let indexOfDefiningChildren = parent.definingChildren.length;

        if (sourceComponent?.parentIdx === parent.componentIdx) {
            const sourceInd = parent.definingChildren.findIndex(
                (child: any) =>
                    typeof child === "object" &&
                    child.componentIdx === sourceComponent.componentIdx,
            );

            if (sourceInd !== -1) {
                const numberAlreadyInserted =
                    numberInsertedAfterSource[sourceComponent.componentIdx] ??
                    0;
                indexOfDefiningChildren = sourceInd + 1 + numberAlreadyInserted;
                numberInsertedAfterSource[sourceComponent.componentIdx] =
                    numberAlreadyInserted + 1;
            }
        }

        let serializedErrorComponents = [
            {
                type: "serialized",
                componentType: "_error",
                componentIdx: core._components.length,
                state: { message: errorInfo.message },
                position: errorInfo.position,
                sourceDoc: errorInfo.sourceDoc,
                children: [],
                attributes: {},
                doenetAttributes: {},
            },
        ];

        core._components[core._components.length] = undefined;

        let ancestors = ancestorsForChild(parent);

        core.parameterStack.push(parent.sharedParameters, false);
        let createResult;
        try {
            createResult = await createIsolatedComponents({
                core,
                serializedComponents: serializedErrorComponents,
                ancestors,
            });
        } finally {
            core.parameterStack.pop();
        }

        let addResults = await addChildrenAndRecurseToShadows({
            core,
            parent,
            indexOfDefiningChildren,
            newChildren: createResult.components,
        });

        if (!addResults.success) {
            throw Error(
                "Couldn't add error component from state variable evaluation.",
            );
        }
    }
}

/**
 * Two-pass `expandAllComposites` against the document: first the
 * non-forced pass, then a forced pass to flush anything that was still
 * pending. Both branches of `addComponents` need this sequence after
 * mutating the tree.
 */
async function _expandAllCompositesBothPasses(core: Core) {
    await expandAllComposites({ core, component: core.document });
    await expandAllComposites({ core, component: core.document, force: true });
}

/**
 * Drain `updateInfo.stateVariablesToEvaluate`, evaluating each queued
 * `(componentIdx, stateVariable)` pair via `getStateVariableValue`. The
 * queue is reset before evaluation so re-entrant pushes accumulate for
 * the next drain.
 */
async function _drainStateVariablesToEvaluate(core: Core) {
    if (!core.updateInfo.stateVariablesToEvaluate) {
        return;
    }
    const stateVariablesToEvaluate = core.updateInfo.stateVariablesToEvaluate;
    core.updateInfo.stateVariablesToEvaluate = [];
    for (const { componentIdx, stateVariable } of stateVariablesToEvaluate) {
        const comp = core._components[componentIdx];
        if (comp && comp.state[stateVariable]) {
            await core.getStateVariableValue({
                component: comp,
                stateVariable,
            });
        }
    }
}

/**
 * If composites have queued replacement updates, flush them and
 * forward the resulting `componentsToUpdateRenderers` to the renderer.
 * No-op when the queue is empty.
 */
async function _drainCompositesToUpdateReplacements(core: Core) {
    if (core.updateInfo.compositesToUpdateReplacements.size === 0) {
        return;
    }
    await core.replacementChangesFromCompositesToUpdate();

    const componentNamesToUpdate = [
        ...core.updateInfo.componentsToUpdateRenderers,
    ];
    core.updateInfo.componentsToUpdateRenderers.clear();

    await core.updateRendererInstructions({
        componentNamesToUpdate,
    });
}
