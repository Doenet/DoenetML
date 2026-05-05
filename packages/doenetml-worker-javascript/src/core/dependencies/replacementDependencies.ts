/**
 * Dependency on the replacements of a composite component. Optionally
 * recurses through nested composites so that nested replacement values
 * roll up.
 */

import { Dependency } from "./Dependency";
import { recursivelyReplaceCompositesWithReplacements } from "../CompositeExpander";

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

        this.includeWithheldReplacements =
            this.definition.includeWithheldReplacements;

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
            const checkForPublic =
                this.dependencyHandler.core.matchPublicStateVariables({
                    stateVariables: [this.stopIfHaveProp],
                    componentClass: composite.constructor,
                })[0];

            if (!checkForPublic.startsWith("__not_public_")) {
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

        if (this.recursive) {
            let result = recursivelyReplaceCompositesWithReplacements({
                core: this.dependencyHandler.core,
                replacements,
                recurseNonStandardComposites: this.recurseNonStandardComposites,
                includeWithheldReplacements: this.includeWithheldReplacements,
                stopIfHaveProp: this.stopIfHaveProp,
            });

            if (
                result.unexpandedCompositesNotReady.length > 0 ||
                result.unexpandedCompositesReady.length > 0
            ) {
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

                    for (let compositeIdx of [
                        ...result.unexpandedCompositesReady,
                        ...result.unexpandedCompositesNotReady,
                    ]) {
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

                for (let compositeIdx of result.unexpandedCompositesNotReady) {
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: compositeIdx,
                        blockerType: "stateVariable",
                        blockerStateVariable: "readyToExpandWhenResolved",
                        componentIdxBlocked: compositeIdx,
                        typeBlocked: "expandComposite",
                    });
                }

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
