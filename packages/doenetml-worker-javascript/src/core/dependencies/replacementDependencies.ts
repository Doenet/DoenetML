/**
 * Dependency on the replacements of a composite component. Optionally
 * recurses through nested composites so that nested replacement values
 * roll up.
 */

import { Dependency } from "./Dependency";
import { recursivelyReplaceCompositesWithReplacements } from "../CompositeExpander";
import { isWrapperOfSeveral } from "../../utils/wrappers";
import { propertyNotOwnOf } from "../../utils/numItems";

/**
 * The collections built as composites, and a `<conditionalContent>`, which
 * have properties of their own (`numItems` and their settings, COLL-2) that a
 * `<group>` holding only one of them reads of it (COLL-3).
 */
const COMPOSITES_WITH_OWN_PROPERTIES = new Set([
    "repeat",
    "repeatForSequence",
    "select",
    "collect",
    "sort",
    "shuffle",
    "conditionalContent",
]);

export class ReplacementDependency extends Dependency {
    static dependencyType = "replacement";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames) {
            if (!Array.isArray(this.definition.variableNames)) {
                throw Error(
                    `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames must be an array`,
                );
            }
            this.originalDownstreamVariableNames =
                this.definition.variableNames;
        } else {
            this.originalDownstreamVariableNames = [];
        }

        this.recursive = this.definition.recursive;

        this.recurseNonStandardComposites =
            this.definition.recurseNonStandardComposites;

        if (
            this.definition.sourceIndex !== null &&
            this.definition.sourceIndex !== undefined
        ) {
            if (Number.isInteger(this.definition.sourceIndex)) {
                this.sourceIndex = this.definition.sourceIndex;
            } else {
                this.sourceIndex = NaN;
            }
        }

        // If we encounter a composite that has a public state variable matching `stopIfHaveProp`
        // then we won't returns its replacements but instead return the composite itself.
        this.stopIfHaveProp = this.definition.stopIfHaveProp;

        this.stopAtListComposites = this.definition.stopAtListComposites;

        // A wrapper holding several components (`isWrapperOfSeveral`) is
        // returned itself, rather than its replacements, for a property is
        // not passed into it (D41 decision 3).
        this.stopAtWrappersOfSeveral = this.definition.stopAtWrappersOfSeveral;

        // The composite is a collection whose items are sought, as a
        // repeat's `for` (COLL-5): a wrapper holding several among its
        // replacements, at any depth, is one item and is returned itself,
        // though the composite, which is no wrapper of the author's, is
        // still recursed into.
        this.wrappersOfSeveralAsItems =
            this.definition.wrappersOfSeveralAsItems;

        this.includeWithheldReplacements =
            this.definition.includeWithheldReplacements;

        // A property after a `<group>` holding only a collection, or only a
        // reference to one, at any depth (`$g.numItems` of `<group
        // name="g">$r</group>`): when it is the collection's own, it is read
        // of the collection, as `$r.numItems` is (COLL-2, COLL-3), not passed
        // into its items.
        this.ownPropertyThroughGroups =
            this.definition.ownPropertyThroughGroups;

        // A `<group>` holding one component stands for it (COLL-3), at any
        // depth: replacements that are one group, or one reference to a
        // group (`$a`), are replaced by what it holds, so that a group of
        // one holding a group of one holding `$r` gives `$r` (or
        // `<repeat>` written there).
        this.throughGroupsOfOne = this.definition.throughGroupsOfOne;

        this.expandReplacements = true;
    }

    async determineDownstreamComponents() {
        if (this.replacementPrimitives) {
            this.previousReplacementPrimitives = [
                ...this.replacementPrimitives,
            ];
        } else {
            this.previousReplacementPrimitives = [];
        }

        this.replacementPrimitives = [];

        let composite: any =
            this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.compositeIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.compositeIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.compositeIdx,
                    blockerType: "componentIdentity",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (this.stopIfHaveProp) {
            // matched without regard to case, as a property of any
            // component is (`$r.numitems`, `$s.Fixed`)
            const checkForPublic =
                this.dependencyHandler.core.publicAliasSubstitutions({
                    stateVariables: [this.stopIfHaveProp],
                    componentClass: composite.constructor,
                })[0];

            if (
                !checkForPublic.startsWith("__not_public_") &&
                !propertyNotOwnOf(composite, this.stopIfHaveProp)
            ) {
                // We found that the composite has a public state variable matching `stopIfHaveProp`.
                // Therefore, we treat the composite itself as the "replacement",
                // and don't even check if the composite is expanded or get its replacements.
                this.replacementPrimitives.push(null);

                return {
                    success: true,
                    downstreamComponentIndices: [composite.componentIdx],
                    downstreamComponentTypes: [composite.componentType],
                };
            }
        }

        if (!composite.isExpanded) {
            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "recalculateDownstreamComponents",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.compositeIdx,
                    blockerType: "expandComposite",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });
            }

            if (!composite.state.readyToExpandWhenResolved.isResolved) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.compositeIdx,
                    blockerType: "stateVariable",
                    blockerStateVariable: "readyToExpandWhenResolved",
                    componentIdxBlocked: this.compositeIdx,
                    typeBlocked: "expandComposite",
                });
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.compositesFound = [this.compositeIdx];
        let replacements = composite.replacements;
        if (
            !this.includeWithheldReplacements &&
            composite.replacementsToWithhold > 0
        ) {
            replacements = replacements.slice(
                0,
                -composite.replacementsToWithhold,
            );
        }

        if (this.ownPropertyThroughGroups) {
            const stoodFor = this.collectionStoodFor(replacements);
            replacements = stoodFor.replacements;
            this.compositesFound.push(...stoodFor.searched);
        }

        if (this.throughGroupsOfOne) {
            const nonBlank = (components: any[]) =>
                components.filter(
                    (x: any) => typeof x !== "string" || x.trim() !== "",
                );
            const shownReplacements = (component: any) => {
                let shown = component.replacements ?? [];
                if (
                    !this.includeWithheldReplacements &&
                    component.replacementsToWithhold > 0
                ) {
                    shown = shown.slice(0, -component.replacementsToWithhold);
                }
                return shown;
            };
            // A reference to a group of one (`$a`) gives a copy of what the
            // group holds: pass through a reference that gives one group or
            // one reference, and stop at the reference to the collection.
            const passesThrough = (component: any) => {
                const content = nonBlank(shownReplacements(component));
                return (
                    content.length === 1 &&
                    ["group", "_copy"].includes(content[0].componentType)
                );
            };
            let content = nonBlank(replacements);
            while (
                content.length === 1 &&
                (content[0].componentType === "group" ||
                    (content[0].componentType === "_copy" &&
                        (!content[0].isExpanded || passesThrough(content[0]))))
            ) {
                const groupOrReference = content[0];
                if (!groupOrReference.isExpanded) {
                    const ready =
                        groupOrReference.state.readyToExpandWhenResolved
                            .isResolved;
                    await this.blockUntilExpanded(
                        ready ? [groupOrReference.componentIdx] : [],
                        ready ? [] : [groupOrReference.componentIdx],
                    );
                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
                this.compositesFound.push(groupOrReference.componentIdx);
                replacements = shownReplacements(groupOrReference);
                content = nonBlank(replacements);
            }
        }

        if (this.stopAtWrappersOfSeveral && isWrapperOfSeveral(composite)) {
            replacements = [composite];
        } else if (this.recursive) {
            let result = recursivelyReplaceCompositesWithReplacements({
                core: this.dependencyHandler.core,
                replacements,
                recurseNonStandardComposites: this.recurseNonStandardComposites,
                stopAtListComposites: this.stopAtListComposites,
                includeWithheldReplacements: this.includeWithheldReplacements,
                stopIfHaveProp: this.stopIfHaveProp,
                stopAtWrappersOfSeveral:
                    this.stopAtWrappersOfSeveral ||
                    this.wrappersOfSeveralAsItems,
            });

            if (
                result.unexpandedCompositesNotReady.length > 0 ||
                result.unexpandedCompositesReady.length > 0
            ) {
                await this.blockUntilExpanded(
                    result.unexpandedCompositesReady,
                    result.unexpandedCompositesNotReady,
                );

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            replacements = result.newReplacements;
            this.compositesFound.push(...result.compositesFound);
        }

        for (let cIdx of this.compositesFound) {
            let replacementDependencies =
                this.dependencyHandler.updateTriggers
                    .replacementDependenciesByComposite[cIdx];
            if (!replacementDependencies) {
                replacementDependencies =
                    this.dependencyHandler.updateTriggers.replacementDependenciesByComposite[
                        cIdx
                    ] = [];
            }
            if (!replacementDependencies.includes(this)) {
                replacementDependencies.push(this);
            }
        }

        if (this.sourceIndex !== undefined) {
            // Note: strings that are not blank do take up a slot for source index.
            // However, this non-blank strings that do take up a slot
            // will not be returned as a replacement (instead the replacement will be empty).
            // Rationale: we do not have a mechanism for linking a string to its replacement source,
            // so returning the string would it unlinked and inconsistent with other cases.
            let nonBlankStringReplacements = replacements.filter(
                (x: any) => typeof x !== "string" || x.trim() !== "",
            );
            let theReplacement =
                nonBlankStringReplacements[this.sourceIndex - 1];
            if (theReplacement && typeof theReplacement !== "string") {
                replacements = [theReplacement];
            } else {
                replacements = [];
            }
        }

        let downstreamComponentIndices = [];
        let downstreamComponentTypes = [];

        for (let repl of replacements) {
            if (typeof repl !== "object") {
                this.replacementPrimitives.push(repl);
                continue;
            }

            this.replacementPrimitives.push(null);

            downstreamComponentIndices.push(repl.componentIdx);
            downstreamComponentTypes.push(repl.componentType);
        }

        return {
            success: true,
            downstreamComponentIndices,
            downstreamComponentTypes,
        };
    }

    async getValue({ verbose, consumeChanges = true }: any = {}) {
        let result = await this.getValueNoProxy({
            verbose,
            consumeChanges,
        });

        // TODO: do we have to adjust anything else from result
        // if we add primitives to result.value?

        let resultValueWithPrimitives: any[] = [];
        let resultInd = 0;

        for (let primitiveOrNull of this.replacementPrimitives) {
            if (primitiveOrNull === null) {
                resultValueWithPrimitives.push(result.value[resultInd]);
                resultInd++;
            } else {
                resultValueWithPrimitives.push(primitiveOrNull);
            }
        }

        result.value = resultValueWithPrimitives;

        if (
            this.replacementPrimitives.length !==
                this.previousReplacementPrimitives.length ||
            this.replacementPrimitives.some(
                (v: any, i: number) =>
                    v !== this.previousReplacementPrimitives[i],
            )
        ) {
            result.changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.previousReplacementPrimitives = [
                    ...this.replacementPrimitives,
                ];
            }
        }

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
    }

    /**
     * Block this dependency until the composites given are expanded: those
     * `ready` to expand, and those `notReady`, which wait for
     * `readyToExpandWhenResolved`.
     */
    async blockUntilExpanded(ready: number[], notReady: number[]) {
        for (let varName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: varName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });

            for (let compositeIdx of [...ready, ...notReady]) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: compositeIdx,
                    blockerType: "expandComposite",
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "recalculateDownstreamComponents",
                    stateVariableBlocked: varName,
                    dependencyBlocked: this.dependencyName,
                });
            }
        }

        for (let compositeIdx of notReady) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: compositeIdx,
                blockerType: "stateVariable",
                blockerStateVariable: "readyToExpandWhenResolved",
                componentIdxBlocked: compositeIdx,
                typeBlocked: "expandComposite",
            });
        }
    }

    /**
     * `replacements`, the replacements of a `<group>` (or of a reference to
     * one), or, when the group holds only a collection, or only a reference
     * to one, at any depth, and that collection has the property
     * `ownPropertyThroughGroups` of its own (`$g.numItems` of `<group
     * name="g">$r</group>`), that collection alone, so that the property is
     * read of it, as after the collection itself (COLL-2, COLL-3).
     * `searched` are the composites passed through, whose replacements
     * changing changes what is found.
     */
    collectionStoodFor(replacements: any[]) {
        const core = this.dependencyHandler.core;
        const components = this.dependencyHandler._components;
        const searched: number[] = [];
        let current = replacements;
        while (true) {
            const content = current.filter(
                (x: any) => typeof x !== "string" || x.trim() !== "",
            );
            const [only] = content;
            if (
                content.length !== 1 ||
                typeof only !== "object" ||
                !(
                    only.componentType === "group" ||
                    COMPOSITES_WITH_OWN_PROPERTIES.has(only.componentType) ||
                    (only.componentType === "_copy" &&
                        only.state?.unresolvedPath?.value == null)
                ) ||
                !only.isExpanded
            ) {
                return { replacements, searched };
            }
            const standsFor =
                only.componentType === "_copy"
                    ? components[
                          only.state?.extendedComponent?.value?.componentIdx
                      ]
                    : only;
            if (COMPOSITES_WITH_OWN_PROPERTIES.has(standsFor?.componentType)) {
                const ownProperty = !core
                    .matchPublicStateVariables({
                        stateVariables: [this.ownPropertyThroughGroups],
                        componentClass: standsFor.constructor,
                    })[0]
                    .startsWith("__not_public_");
                return ownProperty
                    ? {
                          replacements: [standsFor],
                          searched: [...searched, only.componentIdx],
                      }
                    : { replacements, searched };
            }
            searched.push(only.componentIdx);
            current = only.replacements ?? [];
            if (
                only.replacementsToWithhold > 0 &&
                !this.includeWithheldReplacements
            ) {
                current = current.slice(0, -only.replacementsToWithhold);
            }
        }
    }

    deleteFromUpdateTriggers() {
        if (this.compositesFound) {
            for (let compositeIdx of this.compositesFound) {
                let replacementDeps =
                    this.dependencyHandler.updateTriggers
                        .replacementDependenciesByComposite[compositeIdx];
                if (replacementDeps) {
                    let ind = replacementDeps.indexOf(this);
                    if (ind !== -1) {
                        replacementDeps.splice(ind, 1);
                    }
                }
            }
        }

        if (this.specifiedComponentName) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.specifiedComponentName
                ];
            if (dependenciesMissingComponent) {
                let ind = dependenciesMissingComponent.indexOf(this);
                if (ind !== -1) {
                    dependenciesMissingComponent.splice(ind, 1);
                }
            }
        }
    }
}
