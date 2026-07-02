/**
 * Dependency subclasses that resolve string-style component references
 * (e.g. `<copy target="…">`) and the attribute-ref machinery used by
 * those references.
 */

import { Dependency } from "./Dependency";

export class RefResolutionIndexDependencies extends Dependency {
    static dependencyType = "refResolutionIndexDependencies";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        this.compositeReplacementDependencies = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            this.addBlockerUpdateTriggerForMissingComponent(this.compositeIdx);
            this.missingComponentBlockers.push(this.compositeIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.componentList = [];

        const gatherResult = await this.gatherComponentsInPath(
            composite.refResolution.originalPath,
        );

        if (gatherResult.success) {
            this.componentList = gatherResult.componentList;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        } else {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }

    // Iterate through the index of all parts of `originalPath`.
    // If encounter unexpanded composites, set up resolve blockers
    // so that this dependency will be resolved again once the composites are expanded.
    // Otherwise, gather all the component indices of the "integer" components into `componentList`.
    // If encountered unexpanded composites, return
    // - success: false
    // If successfully found all integer components return
    // - success: true,
    // - componentList: a list of the component indices of the "integer" components found in the unresolved path
    // Throw an error if an index of unresolved path does not contain either a string or a single integer component
    async gatherComponentsInPath(originalPath: any) {
        const componentList = [];
        let foundUnexpanded = false;
        for (const path_part of originalPath) {
            for (const index_part of path_part.index) {
                if (typeof index_part.value[0] !== "string") {
                    let indexComponent = index_part.value[0];

                    const haveComposite =
                        this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                            {
                                componentType: indexComponent.componentType,
                                includeNonStandard: true,
                            },
                        );

                    if (haveComposite) {
                        if (!indexComponent.isExpanded) {
                            this.addBlockerForUnexpandedComposite(
                                indexComponent,
                            );

                            foundUnexpanded = true;
                        } else {
                            this.addUpdateTriggersForCompositeReplacements([
                                indexComponent.componentIdx,
                            ]);
                            this.compositeReplacementDependencies.push(
                                indexComponent.componentIdx,
                            );

                            if (indexComponent.replacements.length !== 1) {
                                throw Error(
                                    "Something went wrong as path index is not an integer",
                                );
                            }
                            indexComponent = indexComponent.replacements[0];
                        }
                    }

                    if (
                        !foundUnexpanded &&
                        indexComponent.componentType !== "integer"
                    ) {
                        throw Error(
                            "Something went wrong as path index is not an integer",
                        );
                    }

                    componentList.push(indexComponent.componentIdx);
                }
            }
        }

        if (foundUnexpanded) {
            return { success: false };
        } else {
            return {
                success: true,
                componentList,
            };
        }
    }

    async getValue({ consumeChanges = true } = {}) {
        const result = await super.getValue({ consumeChanges });

        result.value = this.componentList;

        // since value was not determined using actual `downstreamComponentIndices`
        // we need to manually mark it as changed each time it is computed.
        result.changes.componentIdentitiesChanged = true;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        this.deleteUpdateTriggersForCompositeReplacements(
            this.compositeReplacementDependencies,
        );
    }
}

/**
 * A dependency that attempts to resolve the `originalPath` of a `refResolution` on a composite component.
 *
 * If `refResolution.nodeIdx` has any composite descendants
 * or any indices of the path have composites, these composites are first expanded.
 * Then, the `originalPath` path is resolved using the first node of `refResolution.nodesInResolvedPath` as the origin;
 * `nodeIdx` is updated to the matched component, and `unresolvedPath` is updated to any remaining unresolved path.
 *
 * If an index is encountered (which halts the rust resolver), then
 * - if the current `nodeIdx` is a composite, then `nodeIdx` is set to the corresponding replacement of the composite
 *   and the algorithm recurses
 * - else, the algorithm terminates with the current `nodeIdx` and `unresolvedPath`.
 *
 * The dependency value returned is
 * - extendIdx: the resulting `nodeIdx`
 * - unresolvedPath: any remaining `unresolvedPath`
 * - originalPath: the original path
 */
export class RefResolutionDependency extends Dependency {
    static dependencyType = "refResolution";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        this.indexDependencyValues = this.definition.indexDependencyValues;
        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents({ force = false } = {}) {
        this.compositeReplacementDependencies = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            this.addBlockerUpdateTriggerForMissingComponent(this.compositeIdx);
            this.missingComponentBlockers.push(this.compositeIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let nodeIdx = composite.refResolution.nodeIdx;

        // If `nodeIdx` is a component that was created via an `extend` or `copy` attribute,
        // then it was (or will be) created from a copy that has a `createComponentIdx` attribute
        // set to `nodeIdx`. In this case, we find that copy using the `createComponentIdxMapping`
        // and create blockers/triggers to potentially postpone creating this dependency
        // and update it when `nodeIdx` is created or updated.
        const componentCreatingExtendIdx =
            this.dependencyHandler.core.createComponentIdxMapping[nodeIdx];

        if (componentCreatingExtendIdx != null) {
            const compositeCreating =
                this.dependencyHandler._components[componentCreatingExtendIdx];

            if (!compositeCreating) {
                this.addUpdateTriggerForMissingComponent(
                    componentCreatingExtendIdx,
                );
                this.missingComponentBlockers.push(componentCreatingExtendIdx);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            if (!compositeCreating.isExpanded) {
                this.addBlockerForUnexpandedComposite(compositeCreating);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            this.compositeReplacementDependencies.push(
                compositeCreating.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                compositeCreating.componentIdx,
            ]);
        }

        // Resolve all components in the path indices to integer values
        const resolveComponentResult =
            await this.resolveComponentsInPathIndices(
                composite.refResolution.originalPath,
                force,
            );

        if (!resolveComponentResult.success) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.originalPath = resolveComponentResult.path;

        const refComponent = this.dependencyHandler._components[nodeIdx];

        if (!refComponent) {
            this.addUpdateTriggerForMissingComponent(nodeIdx);
            this.missingComponentBlockers.push(nodeIdx);

            this.extendIdx = -1;
            this.unresolvedPath = this.originalPath;

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        const haveComposite =
            this.dependencyHandler.componentInfoObjects.isCompositeComponent({
                componentType: refComponent.componentType,
                includeNonStandard: true,
            });

        if (haveComposite) {
            // make sure that the composite refComponent is expanded
            if (!refComponent.isExpanded) {
                this.addBlockerForUnexpandedComposite(refComponent);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            this.compositeReplacementDependencies.push(
                refComponent.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                refComponent.componentIdx,
            ]);
        }

        let refResolution;

        /**
         * Given the ref resolution `composite.refResolution`
         * and the DoenetML string from `this.dependencyHandler.core.allDoenetMLs[0]`,
         * return the substring of DoenetML corresponding to the resolution's `originalPath`.
         */
        const getDoenetMLStringForReference = () => {
            const originalPath = composite.refResolution.originalPath;
            const startOffset = originalPath[0].position?.start.offset;
            const endOffset =
                originalPath[originalPath.length - 1].position?.end.offset;
            const sourceDoc = originalPath[0].sourceDoc ?? 0;

            let doenetMLString = "";
            if (startOffset != undefined && endOffset != undefined) {
                doenetMLString =
                    this.dependencyHandler.core.allDoenetMLs?.[
                        sourceDoc
                    ]?.substring(startOffset, endOffset) ?? "";
            }
            return doenetMLString;
        };

        // We skip parent search only if we start with no path,
        // which will happen from references to items created in a repeat
        const skip_parent_search = resolveComponentResult.path[0].name === "";

        // console.log(
        //     "resolve path",
        //     { path: resolveComponentResult.path },
        //     composite.refResolution.nodesInResolvedPath[0],
        //     skip_parent_search,
        // );

        try {
            refResolution = this.dependencyHandler.core.resolvePath!(
                { path: resolveComponentResult.path },
                composite.refResolution.nodesInResolvedPath[0],
                skip_parent_search,
            );
        } catch (e) {
            // console.log("resolve error", e);
            if (e === "NonUniqueReferent" || e === "NoReferent") {
                const referenceText = getDoenetMLStringForReference();

                // TODO: these message match the messages from `format_error_message` of `ref_resolve.ts`.
                // Rather than duplicating code to make the messages,
                // we could make sure that `ref_resolve` formats the messages in this case, too.
                const message =
                    e === "NonUniqueReferent"
                        ? `Multiple referents found for reference: \`$${referenceText}\``
                        : `No referent found for reference: \`$${referenceText}\``;

                this.dependencyHandler.core.addDiagnostic({
                    type: "warning",
                    message,
                    position: composite.position,
                    sourceDoc: composite.sourceDoc,
                });

                this.extendIdx = -1;
                this.unresolvedPath = this.originalPath;
                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            } else {
                throw e;
            }
        }

        this.extendIdx = refResolution.nodeIdx;
        this.unresolvedPath = refResolution.unresolvedPath;

        // console.log({ refResolution });

        for (const idx of refResolution.nodesInResolvedPath) {
            const componentInvolved = this.dependencyHandler._components[idx];
            if (
                idx !== this.compositeIdx &&
                componentInvolved &&
                this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                    {
                        componentType: componentInvolved.componentType,
                        includeNonStandard: true,
                    },
                )
            ) {
                this.compositeReplacementDependencies.push(
                    componentInvolved.componentIdx,
                );
                this.addUpdateTriggersForCompositeReplacements([
                    componentInvolved.componentIdx,
                ]);
            }
        }

        if (refResolution.unresolvedPath === null) {
            // No unresolved path left, so we're done

            return this.foundExtend();
        }

        if (refResolution.unresolvedPath[0].name !== "") {
            // We stopped matching on a name.
            // This name must match a prop.
            // Return the result

            return this.foundExtend();
        }

        // We stopped matching on an index of refResolution.nodeIdx
        nodeIdx = refResolution.nodeIdx;

        // Make sure the node we stopped on exists
        const newRefComponent = this.dependencyHandler._components[nodeIdx];

        if (!newRefComponent) {
            this.addUpdateTriggerForMissingComponent(nodeIdx);
            this.missingComponentBlockers.push(nodeIdx);

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            this.dependencyHandler.componentInfoObjects.isCompositeComponent({
                componentType: newRefComponent.componentType,
                includeNonStandard: true,
            })
        ) {
            // We ended on a composite component with the next unresolved path being an index.
            // If the composite isn't expanded, that's the next blocker for resolving the reference.
            if (!newRefComponent.isExpanded) {
                this.addBlockerForUnexpandedComposite(newRefComponent);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            // If the composite is expanded and yet the index did not match one of the composite's replacements,
            // then there is no replacement at that index, and we obtained no referent for the reference.
            const referenceText = getDoenetMLStringForReference();

            this.dependencyHandler.core.addDiagnostic({
                type: "warning",
                message: `No referent found for reference: \`$${referenceText}\``,
                position: composite.position,
                sourceDoc: composite.sourceDoc,
            });

            this.compositeReplacementDependencies.push(
                newRefComponent.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                newRefComponent.componentIdx,
            ]);
        }

        return this.foundExtend();
    }

    /**
     * Given that we've successfully resolved the reference
     * and set `this.extendIdx` to the resulting node,
     * finish the determination of downstream components by
     * - checking if the component `this.extendIdx` exist and setting up a blocker if it doesn't,
     * - setting the downstream component data to that component if it does exist.
     */

    foundExtend() {
        let extendedComponent =
            this.dependencyHandler._components[this.extendIdx];

        if (!extendedComponent) {
            this.addUpdateTriggerForMissingComponent(this.extendIdx);
            this.missingComponentBlockers.push(this.extendIdx);

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (extendedComponent.constructor.resolveToParent) {
            // replace the extended component with its parent
            this.extendIdx = extendedComponent.parentIdx;

            extendedComponent =
                this.dependencyHandler._components[this.extendIdx];

            if (!extendedComponent) {
                this.addUpdateTriggerForMissingComponent(this.extendIdx);
                this.missingComponentBlockers.push(this.extendIdx);

                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [this.extendIdx],
            downstreamComponentTypes: [extendedComponent.componentType],
        };
    }

    /**
     * Iterate through the index of all parts of `path`.
     * If any component is found, it must be an "integer".
     * Resolve its `value` state variable, which should be an integer,
     * and use its string value instead of the component.
     *
     * Note: we use strings rather than numbers for the literal indices
     * so that the unresolved path follows the `FlatPathPart` assumed by the resolver.
     */
    async resolveComponentsInPathIndices(
        path: any,
        _force?: boolean,
    ): Promise<any> {
        const pathWithResolvedIndexComponents = [];
        for (const path_part of path) {
            let index = [];
            for (const index_part of path_part.index) {
                if (typeof index_part.value[0] === "string") {
                    index.push(index_part);
                } else {
                    let indexComponent = index_part.value[0];

                    const haveComposite =
                        this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                            {
                                componentType: indexComponent.componentType,
                                includeNonStandard: true,
                            },
                        );

                    if (haveComposite) {
                        if (!indexComponent.isExpanded) {
                            this.addBlockerForUnexpandedComposite(
                                indexComponent,
                            );

                            return {
                                success: false,
                            };
                        }

                        this.addUpdateTriggersForCompositeReplacements([
                            indexComponent.componentIdx,
                        ]);
                        this.compositeReplacementDependencies.push(
                            indexComponent.componentIdx,
                        );

                        if (indexComponent.replacements.length !== 1) {
                            throw Error(
                                "Something went wrong as path index is not an integer",
                            );
                        }
                        indexComponent = indexComponent.replacements[0];
                    }

                    if (indexComponent.componentType !== "integer") {
                        throw Error(
                            "Something went wrong as path index is not an integer",
                        );
                    }

                    // save index as a literal string
                    index.push({
                        value: [
                            this.indexDependencyValues[
                                indexComponent.componentIdx
                            ].toString(),
                        ],
                        position: index_part.position,
                        sourceDoc: index_part.sourceDoc,
                    });
                }
            }

            pathWithResolvedIndexComponents.push({
                name: path_part.name,
                index,
                position: path_part.position,
                sourceDoc: path_part.sourceDoc,
            });
        }

        return {
            success: true,
            path: pathWithResolvedIndexComponents,
        };
    }

    async getValue({ consumeChanges = true } = {}) {
        const result = await super.getValue({ consumeChanges });

        result.value = {
            extendIdx: this.extendIdx ?? -1,
            unresolvedPath: this.unresolvedPath,
            originalPath: this.originalPath,
        };

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        this.deleteUpdateTriggersForCompositeReplacements(
            this.compositeReplacementDependencies,
        );
    }
}

/**
 * A dependency that gives the resolutions of references from an attribute
 * that was marked `createReferences: true`.
 *
 * Any plain strings in the attribute are ignored. Returns an array
 * with an entry for each reference, such as `$x`, found in the attribute.
 * Each entry has the fields:
 * - componentIdx: the index of the component that the reference resolved to,
 *   or `undefined` if no referent was found
 * - unresolvedPath: any unresolved path remaining after `componentIdx` was resolved
 * - originalPath: the original path corresponding to the given reference
 */
export class AttributeRefResolutions extends Dependency {
    static dependencyType = "attributeRefResolutions";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.originalDownstreamVariableNames = [
            "extendIdx",
            "unresolvedPath",
            "originalPath",
        ];

        this.missingComponentBlockers = [];

        this.extendIndicesResolved = [];
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            this.addBlockerUpdateTriggerForMissingComponent(this.parentIdx);
            this.missingComponentBlockers.push(this.parentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.references) {
            this.foundAttribute = true;
            return {
                success: true,
                downstreamComponentIndices: attribute.references.map(
                    (comp: any) => comp.componentIdx,
                ),
                downstreamComponentTypes: attribute.references.map(
                    (comp: any) => comp.componentType,
                ),
            };
        } else {
            this.foundAttribute = false;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }
    async getValue({ consumeChanges = true } = {}) {
        const result = await super.getValue({ consumeChanges });

        const newValue = [];

        for (const comp of result.value) {
            const extendIdx = comp.stateValues.extendIdx;

            newValue.push({
                componentIdx: extendIdx,
                unresolvedPath: comp.stateValues.unresolvedPath,
                originalPath: comp.stateValues.originalPath,
                position: comp.position,
                sourceDoc: comp.sourceDoc,
            });

            if (extendIdx !== -1) {
                if (!this.extendIndicesResolved.includes(extendIdx)) {
                    this.extendIndicesResolved.push(extendIdx);

                    // add this dependency to the list of attributeRefResolution dependencies
                    // for the referenced component
                    let attributeRefResolutionDeps =
                        this.dependencyHandler
                            .attributeRefResolutionDependenciesByReferenced[
                            extendIdx
                        ];
                    if (!attributeRefResolutionDeps) {
                        attributeRefResolutionDeps =
                            this.dependencyHandler.attributeRefResolutionDependenciesByReferenced[
                                extendIdx
                            ] = [];
                    }
                    attributeRefResolutionDeps.push({
                        dependency: this,
                        composite: comp,
                    });
                }

                // if any componentsReferencingAttribute dependencies exist for this extendIdx,
                // then add blockers to recalculate them
                if (
                    this.dependencyHandler.updateTriggers
                        .componentsReferencingAttributeByReferenced[extendIdx]
                ) {
                    for (let dep of this.dependencyHandler.updateTriggers
                        .componentsReferencingAttributeByReferenced[
                        extendIdx
                    ]) {
                        for (let varName of dep.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: dep.upstreamComponentIdx,
                                blockerType: "recalculateDownstreamComponents",
                                blockerStateVariable: varName,
                                blockerDependency: dep.dependencyName,
                                componentIdxBlocked: dep.upstreamComponentIdx,
                                typeBlocked: "stateVariable",
                                stateVariableBlocked: varName,
                            });
                        }
                        await this.dependencyHandler.addBlockersFromChangedStateVariableDependencies(
                            {
                                componentIdx: dep.upstreamComponentIdx,
                                stateVariables: dep.upstreamVariableNames,
                            },
                        );
                    }
                }
            }
        }

        result.value = newValue;
        result.usedDefault = !this.foundAttribute;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        // delete this dependency from the list of attributeRefResolution dependencies
        // for each referenced component
        for (const extendIdx of this.extendIndicesResolved) {
            let attributeRefResolutionDeps =
                this.dependencyHandler
                    .attributeRefResolutionDependenciesByReferenced[extendIdx];
            if (attributeRefResolutionDeps) {
                let ind = attributeRefResolutionDeps.findIndex(
                    (entry: any) => entry.dependency === this,
                );
                if (ind !== -1) {
                    attributeRefResolutionDeps.splice(ind, 1);
                }
            }
        }
    }
}

/**
 * A dependency that gives the list of components that reference
 * a given component via an attribute that was marked `createReferences: true`.
 *
 * Any plain strings in the attribute are ignored. Returns an array
 * with an entry for each component that references the given component.
 */
export class ComponentsReferencingAttributeDependency extends Dependency {
    static dependencyType = "componentsReferencingAttribute";

    setUpParameters() {
        if (this.definition.referencedIdx != undefined) {
            this.referencedIdx = this.definition.referencedIdx;
            this.specifiedComponentName = this.referencedIdx;
        } else {
            this.referencedIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.allowUnresolvedPath = this.definition.allowUnresolvedPath || false;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        let referencedComponent =
            this.dependencyHandler._components[this.referencedIdx];

        if (!referencedComponent) {
            this.addBlockerUpdateTriggerForMissingComponent(this.referencedIdx);
            this.missingComponentBlockers.push(this.referencedIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            !this.dependencyHandler.updateTriggers
                .componentsReferencingAttributeByReferenced[this.referencedIdx]
        ) {
            this.dependencyHandler.updateTriggers.componentsReferencingAttributeByReferenced[
                this.referencedIdx
            ] = [];
        }
        this.dependencyHandler.updateTriggers.componentsReferencingAttributeByReferenced[
            this.referencedIdx
        ].push(this);

        let attributeRefResolutionDeps =
            this.dependencyHandler
                .attributeRefResolutionDependenciesByReferenced[
                this.referencedIdx
            ];

        if (attributeRefResolutionDeps) {
            if (!this.allowUnresolvedPath) {
                attributeRefResolutionDeps = attributeRefResolutionDeps.filter(
                    (entry: any) =>
                        entry.composite.stateValues.unresolvedPath === null,
                );
            }

            if (this.attributeName) {
                attributeRefResolutionDeps = attributeRefResolutionDeps.filter(
                    (entry: any) =>
                        entry.dependency.attributeName === this.attributeName,
                );
            }

            const downstreamComponentIndices = [];
            const downstreamComponentTypes = [];

            for (const entry of attributeRefResolutionDeps) {
                const parentIdx = entry.dependency.parentIdx;
                const parent = this.dependencyHandler._components[parentIdx];
                if (parent) {
                    downstreamComponentIndices.push(parentIdx);
                    downstreamComponentTypes.push(parent.componentType);
                }
            }

            return {
                success: true,
                downstreamComponentIndices: downstreamComponentIndices,
                downstreamComponentTypes: downstreamComponentTypes,
            };
        }

        return {
            success: false,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

/**
 * A dependency that gives the (non-blank) strings from an attribute
 * that was marked `createReferences: true`.
 *
 * Such a attribute is generally used to extract references such as `$x`.
 * However, in some cases, one may want to use the same attribute for references
 * or for other string content. For such a case, this `StringsFromReferenceAttribute`
 * will give the strings that were added to the attribute, ignoring any references.
 */
export class StringsFromReferenceAttribute extends Dependency {
    static dependencyType = "stringsFromReferenceAttribute";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            this.addBlockerUpdateTriggerForMissingComponent(this.parentIdx);
            this.missingComponentBlockers.push(this.parentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.references) {
            this.attributeStrings = [...attribute.stringChildren];
        } else {
            this.attributeStrings = null;
        }
        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        return {
            value: this.attributeStrings,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

/**
 * A dependency that gives the `rendererId` of the specified component,
 * where `rendererId` is the `rootName` of the component, if it exists,
 * else "_id_" followed by the `componentIdx` as a string.
 *
 * The `rootName` is the simplest unique reference to the component
 * when the document root is the origin. As `rootName` is designed to be
 * a HTML id, indices are represented with `:`. For example,
 * if `$a.b[2][3].c` is the simplest reference to a component from the root,
 * then its root name will be `a.b:2:3.c`.
 *
 * If a component was adapted from another component,
 * then the `renderedId` of the original component is used instead,
 * as that corresponds to the component that was authored.
 */
export class RendererId extends Dependency {
    static dependencyType = "rendererId";

    setUpParameters() {
        this.componentIdx = this.definition.componentIdx;
        this.specifiedComponentName = this.componentIdx;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        this.component = this.dependencyHandler._components[this.componentIdx];

        if (!this.component) {
            this.addBlockerUpdateTriggerForMissingComponent(this.componentIdx);
            this.missingComponentBlockers.push(this.componentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        if (this.component) {
            return {
                value: this.dependencyHandler.core.getRendererId(
                    this.component,
                ),
                changes: {},
            };
        } else {
            return {
                value: "",
                changes: {},
            };
        }
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}
