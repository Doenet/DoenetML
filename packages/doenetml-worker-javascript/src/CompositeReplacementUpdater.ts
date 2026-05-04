import type Core from "./Core";
import { postProcessCopy } from "./utils/copy";
import { preprocessAttributesObject } from "./utils/attributes";
import { convertUnresolvedAttributesForComponentType } from "./utils/dast/convertNormalizedDast";
import {
    createComponentIndicesFromSerializedChildren,
    createNewComponentIndices,
} from "./utils/componentIndices";

/**
 * Recomputes a composite component's replacements after its inputs
 * change: walks the diff between old and new replacement lists,
 * deletes obsolete replacements (recursing into shadows so the
 * shadowing tree stays in sync), creates the new ones via
 * `ComponentBuilder` / `CompositeExpander`, and threads the changes
 * through to any composites that shadow this one.
 *
 * Owns `updateInfo.compositesToUpdateReplacements` (read by the
 * post-update flush in `EssentialValueWriter` /
 * `RendererInstructionBuilder`). Holds a back-reference to Core for
 * the rest of the hot state and the other extracted managers
 * (notably `componentBuilder`, `compositeExpander`, `deletionEngine`,
 * `resolverAdapter`, `componentLifecycle`).
 */
export class CompositeReplacementUpdater {
    core: Core;

    constructor({ core }: { core: Core }) {
        this.core = core;
    }

    async updateCompositeReplacements({
        component,
        componentChanges,
        sourceOfUpdate,
    }) {
        // console.log("updateCompositeReplacements " + component.componentIdx);

        let deletedComponents: Record<string, any> = {};
        let addedComponents: Record<string, any> = {};
        let parentsOfDeleted = new Set();

        if (
            component.shadows &&
            !component.shadows.propVariable &&
            !component.constructor.doNotExpandAsShadowed
        ) {
            // if shadows, don't update replacements
            // instead, replacements will get updated when shadowed component
            // is updated

            let results = {
                success: true,
                deletedComponents,
                addedComponents,
                parentsOfDeleted,
            };

            return results;
        }

        let proxiedComponent = this.core._components[component.componentIdx];

        if (!component.replacements) {
            component.replacements = [];
        }

        // evaluate readyToExpandWhenResolved
        // to make sure all dependencies needed to calculate
        // replacement changes are resolved
        // TODO: why must we evaluate and not just resolve it?
        await component.stateValues.readyToExpandWhenResolved;

        // Call the static function calculateReplacementChanges from the composite component
        // which returns the an array of replacement instructions that specify
        // changes to the replacements of the composite.
        // Arguments
        // component: the composite component
        // componentChanges: an array of changes made to the replacements of composites during the current update
        //   that was formerly used by composites to inform their replacement changes but is currently
        //   not used by any composites.  It is retained in case we need this information again.
        // components: all components in the document
        // workspace: an a composite can use to store information that can be share between
        //   the initial call to createSerializedReplacements and subsequence calls to calculateReplacementChanges
        // componentInfoObjects
        // flags
        // resolveItem: a function that the composite can use to resolve any state variables
        // publicCaseInsensitiveAliasSubstitutions: a function that can be used to find a case insensitive match
        //   to a public state variable, substituting aliases if necessary
        let initialNComponents;
        let replacementResults;
        const originalWorkspace = { ...component.replacementsWorkspace };

        do {
            initialNComponents = this.core._components.length;
            component.replacementsWorkspace = { ...originalWorkspace };
            const rawReplacementResults =
                await component.constructor.calculateReplacementChanges({
                    component: proxiedComponent,
                    componentChanges,
                    components: this.core._components,
                    nComponents: this.core._components.length,
                    workspace: component.replacementsWorkspace,
                    componentInfoObjects: this.core.componentInfoObjects,
                    flags: this.core.flags,
                    resolveItem: this.core.dependencies.resolveItem.bind(
                        this.core.dependencies,
                    ),
                    publicCaseInsensitiveAliasSubstitutions:
                        this.core.publicCaseInsensitiveAliasSubstitutions.bind(
                            this.core,
                        ),
                });

            replacementResults = {
                replacementChanges:
                    rawReplacementResults?.replacementChanges ?? [],
                diagnostics: rawReplacementResults?.diagnostics ?? [],
                nComponents:
                    rawReplacementResults?.nComponents ??
                    this.core._components.length,
            };

            // If `this.core._components` changed in length while `calculateReplacementChanges` was executing,
            // it means that some other action (like calling another `calculateReplacementChanges`)
            // occurred while resolving state variables.
            // Since this would lead to collisions in assigned component indices, we rerun `calculateReplacementChanges`.
            // TODO: are there any scenarios where this will lead to an infinite loop?
        } while (this.core._components.length !== initialNComponents);

        if (component.constructor.stateVariableToEvaluateAfterReplacements) {
            await component.stateValues[
                component.constructor.stateVariableToEvaluateAfterReplacements
            ];
        }

        // console.log("replacement changes for " + component.componentIdx);
        // console.log(replacementResults);
        // console.log(component.replacements.map(x => x.componentIdx));
        // console.log(component.replacements);
        // console.log(component.unresolvedState);
        // console.log(component.unresolvedDependencies);

        // let changedReplacementIdentitiesOfComposites = [];

        if (replacementResults.nComponents > this.core._components.length) {
            this.core._components[replacementResults.nComponents - 1] =
                undefined;
        }

        if (replacementResults.diagnostics.length > 0) {
            const parent = this.core._components[component.componentIdx];
            this.core.gatherDiagnosticsAndAssignDoenetMLRange({
                components: [],
                diagnostics: replacementResults.diagnostics,
                position: parent.position,
                sourceDoc: parent.sourceDoc,
            });
        }

        // iterate through all replacement changes
        for (let change of replacementResults.replacementChanges) {
            let originalEffectiveLength =
                component.replacements.length -
                (component.replacementsToWithhold ?? 0);

            if (change.changeType === "add") {
                if (change.replacementsToWithhold !== undefined) {
                    await this.adjustReplacementsToWithhold({
                        component,
                        change,
                        componentChanges,
                    });

                    // adjust original effective length, as we may have adjusted index resolutions in resolver
                    originalEffectiveLength =
                        component.replacements.length -
                        (component.replacementsToWithhold ?? 0);
                }

                let unproxiedComponent =
                    this.core._components[component.componentIdx];
                this.core.parameterStack.push(
                    unproxiedComponent.sharedParameters,
                    false,
                );

                let newComponents;

                let currentShadowedBy = {
                    [component.componentIdx]:
                        calculateAllComponentsShadowing(component),
                };

                let numberToDelete = change.numberReplacementsToReplace;
                let firstIndex = change.firstReplacementInd;

                const updateOldReplacementsStart = Math.min(
                    originalEffectiveLength,
                    firstIndex,
                );
                const updateOldReplacementsEnd = Math.min(
                    originalEffectiveLength,
                    firstIndex + (numberToDelete ?? 0),
                );

                // determine which replacements are blank strings before deleting replacements
                const blankStringReplacements = component.replacements.map(
                    (repl) => typeof repl === "string" && repl.trim() === "",
                );

                if (numberToDelete > 0 && change.changeTopLevelReplacements) {
                    // delete replacements before creating new replacements so that can reuse componentNames
                    await this.deleteReplacementsFromShadowsThenComposite({
                        change,
                        composite: component,
                        componentChanges,
                        sourceOfUpdate,
                        parentsOfDeleted,
                        deletedComponents,
                        addedComponents,
                        processNewChildren: false,
                    });
                }

                if (!change.serializedReplacements) {
                    throw Error(`Invalid replacement change.`);
                }

                const serializedReplacements = change.serializedReplacements;

                const position =
                    this.core._components[component.componentIdx].position;
                const sourceDoc =
                    this.core._components[component.componentIdx].sourceDoc;
                const overwriteDoenetMLRange =
                    component.componentType === "_copy";

                this.core.gatherDiagnosticsAndAssignDoenetMLRange({
                    components: serializedReplacements,
                    diagnostics: [],
                    position,
                    sourceDoc,
                    overwriteDoenetMLRange,
                });

                const newNComponents = change.nComponents;

                await this.core.addReplacementsToResolver({
                    serializedReplacements,
                    component,
                    updateOldReplacementsStart,
                    updateOldReplacementsEnd,
                    blankStringReplacements,
                });

                // expand `this.core._components` to length `newNComponents` so that the component indices will not be reused
                if (newNComponents > this.core._components.length) {
                    this.core._components[newNComponents - 1] = undefined;
                }

                try {
                    const createResult =
                        await this.core.createIsolatedComponents({
                            serializedComponents: serializedReplacements,
                            ancestors: component.ancestors,
                            componentsReplacementOf: component,
                        });

                    newComponents = createResult.components;
                } catch (e: any) {
                    console.error(e);
                    // throw e;
                    newComponents = await this.setErrorReplacements({
                        composite: component,
                        message: e.message,
                    });
                }

                this.core.parameterStack.pop();

                const newReplacementsByComposite = {
                    [component.componentIdx]: {
                        newComponents,
                        parent: change.parent,
                    },
                };

                if (
                    unproxiedComponent.shadowedBy &&
                    currentShadowedBy[unproxiedComponent.componentIdx].length >
                        0
                ) {
                    const newReplacementsForShadows =
                        await this.createShadowedReplacements({
                            replacementsToShadow: newComponents,
                            componentToShadow: unproxiedComponent,
                            parentToShadow: change.parent,
                            currentShadowedBy,
                            componentChanges,
                            sourceOfUpdate,
                            parentsOfDeleted,
                            deletedComponents,
                            addedComponents,
                            updateOldReplacementsStart,
                            updateOldReplacementsEnd,
                            blankStringReplacements,
                        });

                    Object.assign(
                        newReplacementsByComposite,
                        newReplacementsForShadows,
                    );
                }

                for (const compositeIdxStr in newReplacementsByComposite) {
                    const compositeIdx = Number(compositeIdxStr);
                    const composite = this.core._components[compositeIdx];

                    // if composite was just deleted in previous pass of this loop, skip
                    if (!composite) {
                        continue;
                    }

                    const newReplacements =
                        newReplacementsByComposite[compositeIdx].newComponents;

                    if (!composite.isExpanded) {
                        await this.core.expandCompositeComponent(composite);

                        const newChange = {
                            changeType: "addedReplacements",
                            composite,
                            newReplacements: composite.replacements,
                            topLevel: true,
                            firstIndex: 0,
                            numberDeleted: 0,
                        };

                        componentChanges.push(newChange);

                        continue;
                    }

                    for (const comp of newReplacements) {
                        if (typeof comp === "object") {
                            addedComponents[comp.componentIdx] = comp;
                        }

                        // TODO: used to checkForDownstreamDependencies here
                        // Is this needed for new system?
                    }

                    if (change.changeTopLevelReplacements === true) {
                        const parent =
                            this.core._components[composite.parentIdx];

                        // splice in new replacements
                        composite.replacements.splice(
                            firstIndex,
                            0,
                            ...newReplacements,
                        );
                        await this.core.dependencies.addBlockersFromChangedReplacements(
                            composite,
                        );

                        const newChange = {
                            changeType: "addedReplacements",
                            composite,
                            newReplacements,
                            topLevel: true,
                            firstIndex: firstIndex,
                            numberDeleted: numberToDelete,
                        };

                        componentChanges.push(newChange);

                        await this.core.processNewDefiningChildren({
                            parent,
                            expandComposites: false,
                        });

                        const componentsAffected =
                            await this.core.componentAndRenderedDescendants(
                                parent,
                            );
                        componentsAffected.forEach((cIdx) =>
                            this.core.updateInfo.componentsToUpdateRenderers.add(
                                cIdx,
                            ),
                        );
                    } else {
                        // if not top level replacements

                        // TODO: check if change.parent is appropriate dependency of composite?

                        const parent =
                            this.core._components[
                                newReplacementsByComposite[compositeIdx].parent
                                    .componentIdx
                            ];

                        this.core.spliceChildren(
                            parent,
                            change.indexOfDefiningChildren,
                            newReplacements,
                        );

                        await this.core.processNewDefiningChildren({ parent });

                        for (const repl of newReplacements) {
                            if (typeof repl === "object") {
                                addedComponents[repl.componentIdx] = repl;
                            }
                        }

                        const componentsAffected =
                            await this.core.componentAndRenderedDescendants(
                                parent,
                            );
                        componentsAffected.forEach((cIdx) =>
                            this.core.updateInfo.componentsToUpdateRenderers.add(
                                cIdx,
                            ),
                        );

                        const newChange = {
                            changeType: "addedReplacements",
                            composite,
                            newReplacements,
                        };

                        componentChanges.push(newChange);
                    }
                }
            } else if (change.changeType === "delete") {
                if (change.replacementsToWithhold !== undefined) {
                    await this.adjustReplacementsToWithhold({
                        component,
                        change,
                        componentChanges,
                    });
                }

                await this.deleteReplacementsFromShadowsThenComposite({
                    change,
                    composite: component,
                    componentsToDelete: change.components,
                    componentChanges,
                    sourceOfUpdate,
                    parentsOfDeleted,
                    deletedComponents,
                    addedComponents,
                });
            } else if (change.changeType === "updateStateVariables") {
                // TODO: check if component is appropriate dependency of composite

                const workspace = {};
                const newStateVariableValues = {};
                for (const stateVariable in change.stateChanges) {
                    const instruction = {
                        componentIdx: change.component.componentIdx,
                        stateVariable,
                        value: change.stateChanges[stateVariable],
                        overrideFixed: true,
                    };

                    await this.core.requestComponentChanges({
                        instruction,
                        initialChange: false,
                        workspace,
                        newStateVariableValues,
                    });
                }

                await this.core.processNewStateVariableValues(
                    newStateVariableValues,
                );
            } else if (change.changeType === "changeReplacementsToWithhold") {
                // don't change actual array of replacements
                // but just change those that will get added to activeChildren

                if (change.replacementsToWithhold !== undefined) {
                    await this.adjustReplacementsToWithhold({
                        component,
                        change,
                        componentChanges,
                        adjustResolver: true,
                    });
                }

                await this.processChildChangesAndRecurseToShadows(component);
            }
        }

        const results = {
            success: true,
            deletedComponents,
            addedComponents,
            parentsOfDeleted,
        };

        return results;
    }

    async setErrorReplacements({ composite, message }) {
        // display error for replacements and set composite to error state

        this.core.addDiagnostic({
            type: "error",
            message,
            position: composite.position,
            sourceDoc: composite.sourceDoc,
        });
        let errorReplacements = [
            {
                type: "serialized",
                componentType: "_error",
                componentIdx: this.core._components.length,
                state: { message },
                position: composite.position,
                sourceDoc: composite.sourceDoc,
                children: [],
                attributes: {},
            },
        ];

        this.core._components[this.core._components.length] = undefined;

        composite.isInErrorState = true;

        let createResult = await this.core.createIsolatedComponents({
            serializedComponents: errorReplacements,
            ancestors: composite.ancestors,
            componentsReplacementOf: composite,
        });

        return createResult.components;
    }

    async deleteReplacementsFromShadowsThenComposite({
        change,
        composite,
        componentsToDelete,
        componentChanges,
        sourceOfUpdate,
        parentsOfDeleted,
        deletedComponents,
        addedComponents,
        processNewChildren = true,
    }) {
        if (!composite.isExpanded) {
            return;
        }

        for (const shadowingComposite of iterateExpandableShadows(composite)) {
            let shadowingComponentsToDelete;

            if (componentsToDelete) {
                shadowingComponentsToDelete = [];
                for (let compToDelete of componentsToDelete) {
                    const shadowingCompToDelete =
                        findExpandableShadowByCompositeIdx(
                            compToDelete,
                            shadowingComposite.shadows.compositeIdx,
                        );
                    if (!shadowingCompToDelete) {
                        console.error(
                            `could not find shadowing component of ${compToDelete.componentIdx}`,
                        );
                    } else {
                        shadowingComponentsToDelete.push(shadowingCompToDelete);
                    }
                }
            }

            await this.deleteReplacementsFromShadowsThenComposite({
                change,
                composite: shadowingComposite,
                componentsToDelete: shadowingComponentsToDelete,
                componentChanges,
                sourceOfUpdate,
                parentsOfDeleted,
                deletedComponents,
                addedComponents,
                processNewChildren,
            });
        }

        if (change.changeTopLevelReplacements) {
            let firstIndex = change.firstReplacementInd;
            let numberToDelete = change.numberReplacementsToDelete;
            if (change.changeType === "add") {
                numberToDelete = change.numberReplacementsToReplace;
            }

            // delete from replacements
            let replacementsToDelete = composite.replacements.splice(
                firstIndex,
                numberToDelete,
            );
            await this.core.dependencies.addBlockersFromChangedReplacements(
                composite,
            );

            // TODO: why does this delete delete upstream components
            // but the non toplevel delete doesn't?
            let deleteResults = await this.core.deleteComponents({
                components: replacementsToDelete,
                componentChanges,
                sourceOfUpdate,
                skipProcessingChildrenOfParents: [composite.parentIdx],
            });

            if (processNewChildren) {
                // since skipped, process children now but without expanding composites
                await this.core.processNewDefiningChildren({
                    parent: this.core._components[composite.parentIdx],
                    expandComposites: false,
                });
            }

            if (deleteResults.success === false) {
                throw Error("Couldn't delete components on composite update");
            }
            for (let parent of deleteResults.parentsOfDeleted) {
                parentsOfDeleted.add(parent.componentIdx);
                let componentsAffected =
                    await this.core.componentAndRenderedDescendants(parent);
                componentsAffected.forEach((cIdx) =>
                    this.core.updateInfo.componentsToUpdateRenderers.add(cIdx),
                );
            }
            let deletedNamesByParent: Record<string, any[]> = {};
            for (let compName in deleteResults.deletedComponents) {
                let comp = deleteResults.deletedComponents[compName];
                let par = comp.parentIdx;
                if (deletedNamesByParent[par] === undefined) {
                    deletedNamesByParent[par] = [];
                }
                deletedNamesByParent[par].push(compName);
            }
            let newChange = {
                changeType: "deletedReplacements",
                composite,
                topLevel: true,
                firstIndex: firstIndex,
                numberDeleted: numberToDelete,
                deletedNamesByParent: deletedNamesByParent,
                deletedComponents: deleteResults.deletedComponents,
            };
            componentChanges.push(newChange);
            Object.assign(deletedComponents, deleteResults.deletedComponents);
            let parent = this.core._components[composite.parentIdx];
            let componentsAffected =
                await this.core.componentAndRenderedDescendants(parent);
            componentsAffected.forEach((cIdx) =>
                this.core.updateInfo.componentsToUpdateRenderers.add(cIdx),
            );
        } else {
            // if not change top level replacements
            let numberToDelete = componentsToDelete.length;
            // TODO: check if components are appropriate dependency of composite
            let deleteResults = await this.core.deleteComponents({
                components: componentsToDelete,
                deleteUpstreamDependencies: false,
                componentChanges: componentChanges,
                sourceOfUpdate: sourceOfUpdate,
            });
            if (deleteResults.success === false) {
                throw Error(
                    "Couldn't delete components prescribed by composite",
                );
            }
            for (let parent of deleteResults.parentsOfDeleted) {
                parentsOfDeleted.add(parent.componentIdx);
                let componentsAffected =
                    await this.core.componentAndRenderedDescendants(parent);
                componentsAffected.forEach((cIdx) =>
                    this.core.updateInfo.componentsToUpdateRenderers.add(cIdx),
                );
            }
            let deletedNamesByParent: Record<string, any[]> = {};
            for (let compName in deleteResults.deletedComponents) {
                let comp = deleteResults.deletedComponents[compName];
                let par = comp.parentIdx;
                if (deletedNamesByParent[par] === undefined) {
                    deletedNamesByParent[par] = [];
                }
                deletedNamesByParent[par].push(compName);
            }
            let newChange = {
                changeType: "deletedReplacements",
                composite,
                numberDeleted: numberToDelete,
                deletedNamesByParent: deletedNamesByParent,
                deletedComponents: deleteResults.deletedComponents,
            };
            componentChanges.push(newChange);
            Object.assign(deletedComponents, deleteResults.deletedComponents);
            Object.assign(addedComponents, deleteResults.addedComponents);
        }
    }

    async processChildChangesAndRecurseToShadows(component) {
        let parent = this.core._components[component.parentIdx];
        await this.core.processNewDefiningChildren({
            parent,
            expandComposites: false,
        });
        let componentsAffected =
            await this.core.componentAndRenderedDescendants(parent);
        componentsAffected.forEach((cIdx) =>
            this.core.updateInfo.componentsToUpdateRenderers.add(cIdx),
        );

        for (const shadowingComponent of iterateExpandableShadows(component)) {
            await this.processChildChangesAndRecurseToShadows(
                shadowingComponent,
            );
        }
    }

    async createShadowedReplacements({
        replacementsToShadow,
        componentToShadow,
        parentToShadow,
        currentShadowedBy,
        componentChanges,
        sourceOfUpdate,
        parentsOfDeleted,
        deletedComponents,
        addedComponents,
        updateOldReplacementsStart,
        updateOldReplacementsEnd,
        blankStringReplacements,
    }) {
        let newShadowedBy = calculateAllComponentsShadowing(componentToShadow);

        if (
            !currentShadowedBy[componentToShadow.componentIdx] ||
            !newShadowedBy.every((x) =>
                currentShadowedBy[componentToShadow.componentIdx].includes(x),
            )
        ) {
            // If components shadowing componentToShadow increased
            // that means it is shadowed by one of its newly created replacements
            // so we have a circular dependency
            throw Error(
                `Circular dependency involving ${componentToShadow.componentIdx}.`,
            );
        }

        // use compositesBeingExpanded to look for circular dependency
        this.core.updateInfo.compositesBeingExpanded.push(
            componentToShadow.componentIdx,
        );

        let newComponentsForShadows: Record<string, any> = {};

        for (const shadowingComponent of iterateExpandableShadows(
            componentToShadow,
        )) {
            if (
                this.core.updateInfo.compositesBeingExpanded.includes(
                    shadowingComponent.componentIdx,
                )
            ) {
                throw Error(
                    `Circular dependency involving ${shadowingComponent.componentIdx}.`,
                );
            }

            if (shadowingComponent.shadowedBy) {
                currentShadowedBy[shadowingComponent.componentIdx] =
                    calculateAllComponentsShadowing(shadowingComponent);
            }

            if (shadowingComponent.isExpanded) {
                let newSerializedReplacements = [];

                // since replacing all replacements, reset replacementsCreated count
                shadowingComponent.replacementsWorkspace.replacementsCreated = 0;

                const stateIdInfo = {
                    prefix: `${shadowingComponent.stateId}|`,
                    num: shadowingComponent.replacementsWorkspace
                        .replacementsCreated,
                };

                let nComponents = this.core._components.length;
                let newNComponents = nComponents;
                for (let [idx, repl] of replacementsToShadow.entries()) {
                    if (typeof repl === "object") {
                        const serializedComponent = await repl.serialize();

                        if (
                            shadowingComponent.constructor
                                .useSerializedChildrenComponentIndices
                        ) {
                            const res =
                                createComponentIndicesFromSerializedChildren(
                                    [serializedComponent],
                                    [
                                        shadowingComponent.serializedChildren[
                                            idx
                                        ],
                                    ],
                                    newNComponents,
                                    stateIdInfo,
                                );
                            newNComponents = res.nComponents;

                            newSerializedReplacements.push(...res.components);
                        } else {
                            const res = createNewComponentIndices(
                                [serializedComponent],
                                newNComponents,
                                stateIdInfo,
                            );
                            newNComponents = res.nComponents;

                            newSerializedReplacements.push(...res.components);
                        }
                    } else {
                        newSerializedReplacements.push(repl);
                    }
                }

                shadowingComponent.replacementsWorkspace.replacementsCreated =
                    stateIdInfo.num;

                this.core.adjustForCreateComponentIdxName(
                    newSerializedReplacements,
                    shadowingComponent,
                );

                await this.core.addReplacementsToResolver({
                    serializedReplacements: newSerializedReplacements,
                    component: shadowingComponent,
                    updateOldReplacementsStart,
                    updateOldReplacementsEnd,
                    blankStringReplacements,
                });

                // expand `this.core._components` to length `newNComponents` so that the component indices will not be reused
                if (newNComponents > this.core._components.length) {
                    this.core._components[newNComponents - 1] = undefined;
                }

                newSerializedReplacements = postProcessCopy({
                    serializedComponents: newSerializedReplacements,
                    componentIdx: shadowingComponent.shadows.compositeIdx,
                });

                // TODO: is isResponse the only attribute to convert?
                if (shadowingComponent.attributes.isResponse) {
                    let compositeAttributesObj = preprocessAttributesObject(
                        shadowingComponent.constructor.createAttributesObject(),
                    );

                    for (let repl of newSerializedReplacements) {
                        if (typeof repl !== "object") {
                            continue;
                        }

                        // add attributes
                        if (!repl.attributes) {
                            repl.attributes = {};
                        }
                        let nComponents = this.core._components.length;
                        const res = convertUnresolvedAttributesForComponentType(
                            {
                                attributes: {
                                    isResponse:
                                        shadowingComponent.attributes
                                            .isResponse,
                                },
                                componentType: repl.componentType,
                                componentInfoObjects:
                                    this.core.componentInfoObjects,
                                compositeAttributesObj,
                                nComponents,
                            },
                        );

                        const attributesFromComposite = res.attributes;
                        nComponents = res.nComponents;
                        if (nComponents > this.core._components.length) {
                            this.core._components[nComponents - 1] = undefined;
                        }

                        Object.assign(repl.attributes, attributesFromComposite);
                    }
                }

                // console.log(
                //     `newSerializedReplacements for ${shadowingComponent.componentIdx} who shadows ${shadowingComponent.shadows.componentIdx}`,
                // );
                // console.log(deepClone(newSerializedReplacements));

                let newComponents;

                let unproxiedShadowingComponent =
                    this.core._components[shadowingComponent.componentIdx];
                this.core.parameterStack.push(
                    unproxiedShadowingComponent.sharedParameters,
                    false,
                );

                try {
                    let createResult = await this.core.createIsolatedComponents(
                        {
                            serializedComponents: newSerializedReplacements,
                            ancestors: shadowingComponent.ancestors,
                            componentsReplacementOf: shadowingComponent,
                        },
                    );
                    newComponents = createResult.components;
                } catch (e: any) {
                    console.error(e);
                    // throw e;
                    newComponents = await this.setErrorReplacements({
                        composite: shadowingComponent,
                        message: e.message,
                    });
                }

                this.core.parameterStack.pop();

                let shadowingParent;
                if (parentToShadow) {
                    shadowingParent = findExpandableShadowByCompositeIdx(
                        parentToShadow,
                        shadowingComponent.shadows.compositeIdx,
                    );
                    if (!shadowingParent) {
                        console.error(
                            `could not find shadowing parent of ${parentToShadow.componentIdx}`,
                        );
                    }
                }

                newComponentsForShadows[shadowingComponent.componentIdx] = {
                    newComponents,
                    parent: shadowingParent,
                };

                if (
                    shadowingComponent.shadowedBy &&
                    currentShadowedBy[shadowingComponent.componentIdx].length >
                        0
                ) {
                    let recursionComponents =
                        await this.createShadowedReplacements({
                            replacementsToShadow: newComponents,
                            componentToShadow: shadowingComponent,
                            parentToShadow: shadowingParent,
                            currentShadowedBy,
                            componentChanges,
                            sourceOfUpdate,
                            parentsOfDeleted,
                            deletedComponents,
                            addedComponents,
                            updateOldReplacementsStart,
                            updateOldReplacementsEnd,
                            blankStringReplacements,
                        });
                    Object.assign(newComponentsForShadows, recursionComponents);
                }
            }
        }

        // record that are finished expanding the composite
        let targetInd = this.core.updateInfo.compositesBeingExpanded.indexOf(
            componentToShadow.componentIdx,
        );
        if (targetInd === -1) {
            throw Error(
                `Something is wrong as we lost track that we were expanding ${componentToShadow.componentIdx}`,
            );
        }
        this.core.updateInfo.compositesBeingExpanded.splice(targetInd, 1);

        return newComponentsForShadows;
    }

    async adjustReplacementsToWithhold({
        component,
        change,
        componentChanges,
        adjustResolver = false,
    }) {
        let replacementsToWithhold = change.replacementsToWithhold;

        let changeInReplacementsToWithhold;
        if (component.replacementsToWithhold !== undefined) {
            changeInReplacementsToWithhold =
                replacementsToWithhold - component.replacementsToWithhold;
        } else {
            changeInReplacementsToWithhold = replacementsToWithhold;
        }
        if (changeInReplacementsToWithhold < 0) {
            // Note: don't subtract one of this last ind, as slice doesn't include last ind
            let lastIndToStopWithholding =
                component.replacements.length - replacementsToWithhold;
            let firstIndToStopWithholding =
                component.replacements.length -
                replacementsToWithhold +
                changeInReplacementsToWithhold;
            let newReplacements = component.replacements.slice(
                firstIndToStopWithholding,
                lastIndToStopWithholding,
            );
            let newChange = {
                changeType: "addedReplacements",
                composite: component,
                topLevel: true,
                newReplacements: newReplacements,
                firstIndex: firstIndToStopWithholding,
                numberDeleted: 0,
            };

            componentChanges.push(newChange);
        } else if (changeInReplacementsToWithhold > 0) {
            let firstIndToStartWithholding =
                component.replacements.length - replacementsToWithhold;
            let lastIndToStartWithholding =
                firstIndToStartWithholding + changeInReplacementsToWithhold;
            let withheldReplacements = component.replacements.slice(
                firstIndToStartWithholding,
                lastIndToStartWithholding,
            );
            let withheldNamesByParent: Record<string, any[]> = {};
            for (let comp of withheldReplacements) {
                let par = comp.parentIdx;
                if (withheldNamesByParent[par] === undefined) {
                    withheldNamesByParent[par] = [];
                }
                withheldNamesByParent[par].push(comp.componentIdx);
            }
            let newChange = {
                changeType: "deletedReplacements",
                composite: component,
                topLevel: true,
                firstIndex: firstIndToStartWithholding,
                numberDeleted: changeInReplacementsToWithhold,
                deletedNamesByParent: withheldNamesByParent,
                deletedComponents: withheldReplacements,
            };
            componentChanges.push(newChange);
        }

        if (adjustResolver) {
            const blankStringReplacements = component.replacements.map(
                (repl) => typeof repl === "string" && repl.trim() === "",
            );

            const { indexResolution } =
                await this.core.determineParentAndIndexResolutionForResolver({
                    component,
                    updateOldReplacementsStart: 0,
                    updateOldReplacementsEnd:
                        component.replacements.length -
                        (component.replacementsToWithhold ?? 0),
                    blankStringReplacements,
                });

            let indexParent =
                indexResolution.ReplaceAll?.parent ??
                indexResolution.ReplaceRange?.parent ??
                null;

            if (
                indexParent !== null &&
                indexParent !== component.componentIdx
            ) {
                const indexParentComposite = this.core._components[indexParent];

                if (indexParentComposite) {
                    if (this.core.replaceIndexResolutionsInResolver) {
                        const newContentForIndex = component.replacements
                            .slice(
                                0,
                                component.replacements.length -
                                    change.replacementsToWithhold,
                            )
                            .map((repl) => {
                                if (typeof repl === "string") {
                                    return repl;
                                } else {
                                    return repl.componentIdx;
                                }
                            });

                        this.core.replaceIndexResolutionsInResolver(
                            { content: newContentForIndex },
                            indexResolution,
                        );

                        this.core.rootNames =
                            this.core.calculateRootNames?.().names;

                        await this.core.dependencies.addBlockersFromChangedReplacements(
                            indexParentComposite,
                        );
                    }
                }
            }
        }

        component.replacementsToWithhold = replacementsToWithhold;
        await this.core.dependencies.addBlockersFromChangedReplacements(
            component,
        );

        for (const shadowingComponent of iterateExpandableShadows(component)) {
            await this.adjustReplacementsToWithhold({
                component: shadowingComponent,
                change,
                componentChanges,
                adjustResolver,
            });
        }
    }
}

/**
 * Yield each entry in `component.shadowedBy` that should participate in
 * shadow-driven expansion. Shadows reached via a `propVariable` and shadows
 * whose constructor sets `doNotExpandAsShadowed` are skipped — those are
 * the same two predicates that all six iterate-shadow sites in this file
 * had been re-checking by hand.
 */
function* iterateExpandableShadows(component: any) {
    if (!component.shadowedBy) {
        return;
    }
    for (const shadow of component.shadowedBy) {
        if (
            shadow.shadows.propVariable ||
            shadow.constructor.doNotExpandAsShadowed
        ) {
            continue;
        }
        yield shadow;
    }
}

/**
 * Find the expandable shadow on `component` whose `shadows.compositeIdx`
 * matches `compositeIdx`. Used to map a component (or component-to-delete)
 * onto its corresponding shadow inside a particular shadowing composite.
 * Returns `undefined` if no match.
 */
function findExpandableShadowByCompositeIdx(
    component: any,
    compositeIdx: number,
): any | undefined {
    for (const shadow of iterateExpandableShadows(component)) {
        if (shadow.shadows.compositeIdx === compositeIdx) {
            return shadow;
        }
    }
    return undefined;
}

function calculateAllComponentsShadowing(component: any): number[] {
    let allShadowing: number[] = [];
    if (component.shadowedBy) {
        for (let comp2 of component.shadowedBy) {
            if (
                !comp2.shadows.propVariable &&
                !comp2.constructor.doNotExpandAsShadowed
            ) {
                allShadowing.push(comp2.componentIdx);
                let additionalShadowing =
                    calculateAllComponentsShadowing(comp2);
                allShadowing.push(...additionalShadowing);
            }
        }
    }

    // Idea for this part: if a component is shadowing this component's composite,
    // then it is effectively shadowing the component
    // TODO 1: Why do we need to to this?  Why aren't these components reachable through shadowBy?
    // TODO 2: Does this properly deal with the no-link case?
    if (component.replacementOf) {
        let additionalShadowing = calculateAllComponentsShadowing(
            component.replacementOf,
        );
        allShadowing.push(...additionalShadowing);
    }

    return allShadowing;
}
