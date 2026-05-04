import type Core from "./Core";
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
import { convertToErrorComponent } from "./utils/dast/errors";
import { gatherVariantComponents } from "./utils/variants";
import { unwrapSource } from "./utils/dast/convertNormalizedDast";
import { extractCreateComponentIdxMapping } from "./utils/componentIndices";

/**
 * Builds component instances from serialized DAST. Handles the recursive
 * walk that creates a parent before its children, registers each new
 * component in the live tree (`core._components`), wires up state-variable
 * definitions and initial dependencies, and on the initial document load
 * performs the post-creation flush of error components requested by
 * state-variable definitions.
 *
 * The expansion of composite components into their replacements is the
 * responsibility of `CompositeExpander` (mutual recursion is expected;
 * cross-calls go through Core's delegators).
 *
 * Holds a back-reference to Core to read the hot fields
 * (`_components`, `componentInfoObjects`, `parameterStack`, `dependencies`,
 * `updateInfo`, `numerics`, `flags`, `coreFunctions`, `document`,
 * `componentIdxByStateId`, `nTimesAddedComponents`, `rootNames`,
 * `createComponentIdxMapping`, `errorComponentsToAdd`, `initialAddPhase`)
 * and to dispatch through the other extracted managers.
 */
export class ComponentBuilder {
    core: Core;

    constructor({ core }: { core: Core }) {
        this.core = core;
    }

    async addComponents({
        serializedComponents,
        parentIdx,
        indexOfDefiningChildren,
        initialAdd = false,
    }) {
        this.core.initialAddPhase = initialAdd;

        if (!Array.isArray(serializedComponents)) {
            serializedComponents = [serializedComponents];
        }

        let parent;
        let ancestors = [];

        if (!initialAdd) {
            parent = this.core._components[parentIdx];
            if (!parent) {
                this.core.addDiagnostic({
                    type: "warning",
                    message: `Cannot add children to parent ${parentIdx} as ${parentIdx} does not exist`,
                });
                return [];
            }

            ancestors = [
                {
                    componentIdx: parentIdx,
                    componentClass: parent.constructor,
                },
                ...parent.ancestors,
            ];

            this.core.parameterStack.push(parent.sharedParameters, false);

            this.core.nTimesAddedComponents =
                (this.core.nTimesAddedComponents ?? 0) + 1;

            addComponentsToResolver({
                core: this.core,
                components: serializedComponents,
                parentIdx,
            });
        }
        let createResult = await this.createIsolatedComponents({
            serializedComponents,
            ancestors,
        });
        if (!initialAdd) {
            this.core.parameterStack.pop();
        }

        const newComponents = createResult.components;

        let deletedComponents = {};
        let addedComponents = {};
        newComponents.forEach((x) => (addedComponents[x.componentIdx] = x));

        if (initialAdd) {
            if (newComponents.length !== 1) {
                throw Error(
                    "Initial components need to be an array of just one component.",
                );
            }
            this.core.document = newComponents[0];

            await this._expandAllCompositesBothPasses();
            await this._drainStateVariablesToEvaluate();

            await this.addQueuedErrorComponentsFromStateVariables();

            await this.core.replacementChangesFromCompositesToUpdate();

            let results =
                await this.core.initializeRenderedComponentInstruction(
                    this.core.document,
                );

            if (this.core.errorComponentsToAdd.length > 0) {
                await this.addQueuedErrorComponentsFromStateVariables();

                // Adding queued _error components can touch composites and alter
                // what needs to be rendered from the document root.
                await this.core.replacementChangesFromCompositesToUpdate();

                results =
                    await this.core.initializeRenderedComponentInstruction(
                        this.core.document,
                    );
            }

            this.core.documentRendererInstructions = results.componentToRender;

            let updateInstructions = [
                {
                    instructionType: "updateRendererStates",
                    rendererStatesToUpdate: results.rendererStatesToUpdate,
                },
            ];

            this.core.callUpdateRenderers({ updateInstructions }, true);

            // if have some states to force update
            // then post these updates without setting init to true
            if (results.rendererStatesToForceUpdate.length > 0) {
                let updateInstructions = [
                    {
                        instructionType: "updateRendererStates",
                        rendererStatesToUpdate:
                            results.rendererStatesToForceUpdate,
                    },
                ];
                this.core.callUpdateRenderers({ updateInstructions });
            }

            // initializing renderer instructions could trigger more composite updates
            // (presumably from deriving child results)
            // if so, make replacement changes and update renderer instructions again
            // TODO: should we check for child results earlier so we don't have to check them
            // when updating renderer instructions?
            await this._drainCompositesToUpdateReplacements();

            await this.core.processStateVariableTriggers(true);
        } else {
            if (parent === undefined) {
                throw Error("Must specify parent when adding components.");
            }
            if (indexOfDefiningChildren === undefined) {
                indexOfDefiningChildren = parent.definingChildren.length;
            }

            let addResults = await addChildrenAndRecurseToShadows({
                core: this.core,
                parent,
                indexOfDefiningChildren: indexOfDefiningChildren,
                newChildren: newComponents,
            });
            if (!addResults.success) {
                throw Error(
                    "Couldn't satisfy child logic result.  Need informative error message",
                );
            }
            Object.assign(addedComponents, addResults.addedComponents);
            Object.assign(deletedComponents, addResults.deletedComponents);

            await this._expandAllCompositesBothPasses();
            await this._drainStateVariablesToEvaluate();
            await this.core.replacementChangesFromCompositesToUpdate();

            await this.core.updateRendererInstructions({
                componentNamesToUpdate: await componentAndRenderedDescendants({
                    core: this.core,
                    component: parent,
                }),
            });

            // updating renderer instructions could trigger more composite updates
            // (presumably from deriving child results)
            // if so, make replacement changes and update renderer instructions again
            // TODO: should we check for child results earlier so we don't have to check them
            // when updating renderer instructions?
            await this._drainCompositesToUpdateReplacements();

            await this.core.processStateVariableTriggers(true);
        }

        this.core.initialAddPhase = false;
        return newComponents;
    }

    async createIsolatedComponents({
        serializedComponents,
        ancestors,
        shadow = false,
        componentsReplacementOf,
    }) {
        const newComponents = [];

        let lastErrorMessage = "";

        const res = extractCreateComponentIdxMapping(serializedComponents);
        Object.assign(
            this.core.createComponentIdxMapping,
            res.createComponentIdxMapping,
        );

        for (let serializedComponent of serializedComponents) {
            if (typeof serializedComponent !== "object") {
                newComponents.push(serializedComponent);
                continue;
            }

            let componentClass =
                this.core.componentInfoObjects.allComponentClasses[
                    serializedComponent.componentType
                ];
            if (componentClass === undefined) {
                // Note: This error shouldn't get reached from author-typed code,
                // as it should get caught by the correctComponentTypeCapitalization function.
                // However, it could get called from Javascript if developers
                // create a serialized component that doesn't exist.
                const message = `Invalid component type: \`<${serializedComponent.componentType}>\`.`;

                this.core.diagnosticsManager.markPending();

                const convertResult = convertToErrorComponent(
                    serializedComponent,
                    message,
                );
                serializedComponent = convertResult.component;

                lastErrorMessage = message;

                componentClass =
                    this.core.componentInfoObjects.allComponentClasses[
                        serializedComponent.componentType
                    ];
            }

            if (!serializedComponent.doenetAttributes) {
                serializedComponent.doenetAttributes = {};
            }

            let componentIdx = serializedComponent.componentIdx;
            if (componentIdx === undefined) {
                throw Error(
                    "Found a serialized component without a componentIdx",
                    serializedComponent,
                );
            }

            const createResult = await this.createChildrenThenComponent({
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

    async createChildrenThenComponent({
        serializedComponent,
        componentIdx,
        ancestors,
        componentClass,
        shadow = false,
        componentsReplacementOf,
    }) {
        let lastErrorMessage = "";
        let lastErrorMessageFromAttribute = "";

        if (!(Number.isInteger(componentIdx) && componentIdx >= 0)) {
            throw Error(`Found an invalid componentIdx: ${componentIdx}`);
        }

        if (this.core._components[componentIdx] !== undefined) {
            console.log(
                this.core._components[componentIdx],
                serializedComponent,
            );
            throw Error(`Found a duplicate componentIdx: ${componentIdx}`);
        }

        const serializedChildren = serializedComponent.children;
        let definingChildren = [];
        const childrenToRemainSerialized = [];

        const ancestorsForChildren = [
            { componentIdx, componentClass },
            ...ancestors,
        ];

        const parentSharedParameters = this.core.parameterStack.parameters;
        this.core.parameterStack.push();
        const sharedParameters = this.core.parameterStack.parameters;

        if (
            componentClass.descendantCompositesMustHaveAReplacement &&
            !shadow
        ) {
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
                    componentInfoObjects: this.core.componentInfoObjects,
                });

                componentClass.setUpVariant({
                    serializedComponent,
                    sharedParameters,
                    descendantVariantComponents,
                });
            }

            if (componentClass.keepChildrenSerialized) {
                const childrenAddressed = new Set([]);

                const keepSerializedInds =
                    componentClass.keepChildrenSerialized({
                        serializedComponent,
                        componentInfoObjects: this.core.componentInfoObjects,
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

                const childrenToCreate = [];
                for (const [ind, child] of serializedChildren.entries()) {
                    if (!childrenAddressed.has(ind)) {
                        childrenToCreate.push(child);
                    }
                }

                if (childrenToCreate.length > 0) {
                    const childrenResult = await this.createIsolatedComponents({
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
                const childrenResult = await this.createIsolatedComponents({
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

        let attributes = {};

        if (serializedComponent.attributes) {
            for (const attrName in serializedComponent.attributes) {
                const attribute = serializedComponent.attributes[attrName];

                if (attribute.component) {
                    if (attrName === componentClass.addAttributeToResolver) {
                        addComponentsToResolver({
                            core: this.core,
                            components: [attribute.component],
                            parentIdx: serializedComponent.componentIdx,
                        });
                    }

                    try {
                        const attrResult = await this.createIsolatedComponents({
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
                    } catch (e) {
                        console.error(e);
                        if (e.message.includes("Circular dependency")) {
                            throw Error(
                                this.core.dependencies.getCircularDependencyMessage(
                                    [serializedComponent],
                                ),
                            );
                        } else {
                            throw e;
                        }
                    }
                } else if (attribute.references) {
                    const attrResult = await this.createIsolatedComponents({
                        serializedComponents: attribute.references,
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
                        references: attrResult.components,
                        stringChildren: attribute.stringChildren,
                    };
                } else {
                    attributes[attrName] =
                        serializedComponent.attributes[attrName];
                }
            }
        }

        let refResolution = null;
        if (serializedComponent.extending) {
            refResolution = unwrapSource(serializedComponent.extending);

            const nodeIdx = refResolution.nodeIdx;

            const originalPath = [];
            for (const pathPart of refResolution.originalPath) {
                const index = [];
                for (const indexPiece of pathPart.index) {
                    const valueResult = await this.createIsolatedComponents({
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

            this.core.addDiagnostic({
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
                this.core.componentInfoObjects.allComponentClasses[
                    serializedComponent.componentType
                ];
        }

        const prescribedDependencies = {};

        if (serializedComponent.downstreamDependencies) {
            for (const idxStr in serializedComponent.downstreamDependencies) {
                const idx = Number(idxStr);
                if (idx === componentIdx) {
                    throw Error(
                        this.core.dependencies.getCircularDependencyMessage([
                            serializedComponent,
                        ]),
                    );
                }
                if (this.core._components[idx]) {
                    prescribedDependencies[idx] =
                        serializedComponent.downstreamDependencies[idx];
                } else {
                    throw Error(
                        this.core.dependencies.getCircularDependencyMessage([
                            serializedComponent,
                        ]),
                    );
                }
            }
        }

        const stateVariableDefinitions =
            await this.core.createStateVariableDefinitions({
                componentClass,
                prescribedDependencies,
                componentIdx,
            });

        // In case a component with the same idx was deleted before, clear it
        // from the deleted-tracking maps so the new component isn't shadowed
        // by the prior tombstone.
        delete this.core.updateInfo.deletedComponents[componentIdx];
        delete this.core.updateInfo.deletedStateVariables[componentIdx];

        const stateId = serializedComponent.stateId ?? componentIdx.toString();
        this.core.componentIdxByStateId[stateId] = componentIdx;

        const newComponent = new componentClass({
            componentIdx,
            stateId,
            rootName:
                this.core.rootNames?.[componentIdx] ??
                "_id_" + componentIdx.toString(),
            ancestors,
            definingChildren,
            stateVariableDefinitions,
            serializedChildren: childrenToRemainSerialized,
            serializedComponent,
            attributes,
            componentInfoObjects: this.core.componentInfoObjects,
            coreFunctions: this.core.coreFunctions,
            flags: this.core.flags,
            shadow,
            numerics: this.core.numerics,
            sharedParameters,
            parentSharedParameters,
            refResolution,
        });

        registerComponent({ core: this.core, component: newComponent });

        if (componentsReplacementOf) {
            newComponent.replacementOf = componentsReplacementOf;
        }

        if (serializedComponent.adaptedFrom) {
            // record adapter relationship
            newComponent.adaptedFrom =
                this.core._components[serializedComponent.adaptedFrom];
            newComponent.adaptedFrom.adapterUsed = newComponent;
        }

        for (const idxStr in prescribedDependencies) {
            const idx = Number(idxStr);
            const depArray = prescribedDependencies[idx];
            for (const dep of depArray) {
                if (dep.dependencyType === "referenceShadow") {
                    const shadowInfo = {
                        componentIdx: idx,
                    };
                    Object.assign(shadowInfo, dep);
                    delete shadowInfo.dependencyType;
                    newComponent.shadows = shadowInfo;

                    if (dep.firstLevelReplacement) {
                        newComponent.firstLevelReplacement = true;
                    }

                    const shadowedComponent = this.core._components[idx];
                    if (!shadowedComponent.shadowedBy) {
                        shadowedComponent.shadowedBy = [];
                    }
                    shadowedComponent.shadowedBy.push(newComponent);

                    const mediatingShadowComposite =
                        this.core._components[shadowInfo.compositeIdx];
                    if (!mediatingShadowComposite.mediatesShadows) {
                        mediatingShadowComposite.mediatesShadows = [];
                    }
                    mediatingShadowComposite.mediatesShadows.push({
                        shadowing: newComponent.componentIdx,
                        shadowed: idx,
                        propVariable: dep.propVariable,
                    });

                    if (dep.isPrimaryShadow) {
                        shadowedComponent.primaryShadow =
                            newComponent.componentIdx;

                        if (
                            this.core.dependencies.updateTriggers
                                .primaryShadowDependencies[idx]
                        ) {
                            for (const dep of this.core.dependencies
                                .updateTriggers.primaryShadowDependencies[
                                idx
                            ]) {
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
            core: this.core,
            parent: newComponent,
            expandComposites: false,
        });

        await this.core.initializeComponentStateVariables(newComponent);

        await this.core.dependencies.setUpComponentDependencies(newComponent);

        const variablesChanged =
            await this.core.dependencies.checkForDependenciesOnNewComponent(
                componentIdx,
            );

        for (const varDescription of variablesChanged) {
            await this.core.markStateVariableAndUpstreamDependentsStale({
                component: this.core._components[varDescription.componentIdx],
                varName: varDescription.varName,
            });
        }

        await this.checkForStateVariablesUpdatesForNewComponent(componentIdx);

        await this.core.dependencies.resolveStateVariablesIfReady({
            component: newComponent,
        });

        this.core.recordStateVariablesMustEvaluate(componentIdx);

        await this.core.checkForActionChaining({ component: newComponent });

        this.core.parameterStack.pop();

        const results = { newComponent: newComponent, lastErrorMessage };

        return results;
    }

    async checkForStateVariablesUpdatesForNewComponent(componentIdx) {
        let comp = this.core._components[componentIdx];
        const stateId = comp.stateId;
        if (
            stateId in
            this.core.updateInfo.stateVariableUpdatesForMissingComponents
        ) {
            let result = await this.core.processNewStateVariableValues(
                {
                    [componentIdx]:
                        this.core.updateInfo
                            .stateVariableUpdatesForMissingComponents[stateId],
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
                for (let vName in this.core.updateInfo
                    .stateVariableUpdatesForMissingComponents[stateId]) {
                    if (comp.state[vName]) {
                        this.core.updateInfo.stateVariablesToEvaluate.push({
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
                                this.core.updateInfo.stateVariableUpdatesForMissingComponents[
                                    stateId
                                ];
                        }
                    }
                }
            }

            delete this.core.updateInfo
                .stateVariableUpdatesForMissingComponents[stateId];
        }
    }

    async addQueuedErrorComponentsFromStateVariables() {
        if (!this.core.errorComponentsToAdd?.length) {
            return;
        }

        const errorComponentsToAdd = this.core.errorComponentsToAdd;
        this.core.errorComponentsToAdd = [];

        const numberInsertedAfterSource = {};

        for (let errorInfo of errorComponentsToAdd) {
            let sourceComponent = this.core._components[errorInfo.componentIdx];
            let parent;

            while (sourceComponent?.parentIdx > 0) {
                const candidateParent =
                    this.core._components[sourceComponent.parentIdx];

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
                if (this.core.document?.constructor.canDisplayChildErrors) {
                    parent = this.core.document;
                }
            }

            if (!parent) {
                continue;
            }

            let indexOfDefiningChildren = parent.definingChildren.length;

            if (sourceComponent?.parentIdx === parent.componentIdx) {
                const sourceInd = parent.definingChildren.findIndex(
                    (child) =>
                        typeof child === "object" &&
                        child.componentIdx === sourceComponent.componentIdx,
                );

                if (sourceInd !== -1) {
                    const numberAlreadyInserted =
                        numberInsertedAfterSource[
                            sourceComponent.componentIdx
                        ] ?? 0;
                    indexOfDefiningChildren =
                        sourceInd + 1 + numberAlreadyInserted;
                    numberInsertedAfterSource[sourceComponent.componentIdx] =
                        numberAlreadyInserted + 1;
                }
            }

            let serializedErrorComponents = [
                {
                    type: "serialized",
                    componentType: "_error",
                    componentIdx: this.core._components.length,
                    state: { message: errorInfo.message },
                    position: errorInfo.position,
                    sourceDoc: errorInfo.sourceDoc,
                    children: [],
                    attributes: {},
                    doenetAttributes: {},
                },
            ];

            this.core._components[this.core._components.length] = undefined;

            let ancestors = [
                {
                    componentIdx: parent.componentIdx,
                    componentClass: parent.constructor,
                },
                ...parent.ancestors,
            ];

            this.core.parameterStack.push(parent.sharedParameters, false);
            let createResult;
            try {
                createResult = await this.createIsolatedComponents({
                    serializedComponents: serializedErrorComponents,
                    ancestors,
                });
            } finally {
                this.core.parameterStack.pop();
            }

            let addResults = await addChildrenAndRecurseToShadows({
                core: this.core,
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
    async _expandAllCompositesBothPasses() {
        await expandAllComposites({
            core: this.core,
            component: this.core.document,
        });
        await expandAllComposites({
            core: this.core,
            component: this.core.document,
            force: true,
        });
    }

    /**
     * Drain `updateInfo.stateVariablesToEvaluate`, evaluating each queued
     * `(componentIdx, stateVariable)` pair via `getStateVariableValue`. The
     * queue is reset before evaluation so re-entrant pushes accumulate for
     * the next drain.
     */
    async _drainStateVariablesToEvaluate() {
        if (!this.core.updateInfo.stateVariablesToEvaluate) {
            return;
        }
        const stateVariablesToEvaluate =
            this.core.updateInfo.stateVariablesToEvaluate;
        this.core.updateInfo.stateVariablesToEvaluate = [];
        for (const {
            componentIdx,
            stateVariable,
        } of stateVariablesToEvaluate) {
            const comp = this.core._components[componentIdx];
            if (comp && comp.state[stateVariable]) {
                await this.core.getStateVariableValue({
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
    async _drainCompositesToUpdateReplacements() {
        if (this.core.updateInfo.compositesToUpdateReplacements.size === 0) {
            return;
        }
        await this.core.replacementChangesFromCompositesToUpdate();

        const componentNamesToUpdate = [
            ...this.core.updateInfo.componentsToUpdateRenderers,
        ];
        this.core.updateInfo.componentsToUpdateRenderers.clear();

        await this.core.updateRendererInstructions({
            componentNamesToUpdate,
        });
    }
}
