/**
 * Dependency on the replacements of a composite component. Optionally
 * recurses through nested composites so that nested replacement values
 * roll up.
 */

import { Dependency } from "./Dependency";
import { recursivelyReplaceCompositesWithReplacements } from "../CompositeExpander";
import {
    COLLECTIONS_OF_NAMED_ITEMS,
    isWrapperOfSeveral,
} from "../../utils/wrappers";

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

        this.includeWithheldReplacements =
            this.definition.includeWithheldReplacements;

        // A path whose first part may be a name declared in each item of a
        // collection (`$r.P.x`, D41 decision 1, COLL-2): it is resolved in
        // each item, and what it names stands for that item, with what is
        // left of the path (`remainingPath`) read from it.
        this.namePerItem = this.definition.namePerItem;

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

        // The path left for each replacement, by its position among the
        // components returned, when a name was resolved in its item
        // (`namePerItem`); `undefined` where the path is unchanged.
        let remainingPaths: (any[] | null | undefined)[] | undefined;
        let itemsNamedIn: (number | undefined)[] | undefined;
        if (this.namePerItem) {
            const named = this.namedInEachItem(replacements);
            replacements = named.replacements;
            remainingPaths = named.remainingPaths;
            itemsNamedIn = named.itemsNamedIn;
            this.compositesFound.push(...named.itemsSearched);
        }

        if (this.stopAtWrappersOfSeveral && isWrapperOfSeveral(composite)) {
            replacements = [composite];
            remainingPaths = undefined;
            itemsNamedIn = undefined;
        } else if (this.recursive) {
            let result = this.replaceCompositesKeepingPaths(
                replacements,
                remainingPaths,
                itemsNamedIn,
            );
            remainingPaths = result.remainingPaths;
            itemsNamedIn = result.itemsNamedIn;

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
        this.remainingPaths = [];
        this.itemsNamedIn = [];

        for (let [ind, repl] of replacements.entries()) {
            if (typeof repl !== "object") {
                this.replacementPrimitives.push(repl);
                continue;
            }

            this.replacementPrimitives.push(null);
            this.remainingPaths.push(remainingPaths?.[ind]);
            this.itemsNamedIn.push(itemsNamedIn?.[ind]);

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
                const remainingPath = this.remainingPaths?.[resultInd];
                resultValueWithPrimitives.push(
                    remainingPath === undefined
                        ? result.value[resultInd]
                        : {
                              ...result.value[resultInd],
                              remainingPath,
                              namedInItem: this.itemsNamedIn?.[resultInd],
                          },
                );
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
     * The items of a collection (`replacements`, its replacements), each
     * replaced by the component the name at the start of `namePerItem`
     * names in it, when it declares one (`$r.P`: the `P` of each iteration;
     * NAME-3: never one item's alone). An item that does not declare it is
     * kept, with the path unchanged, so that a property (`$r.x`) is read
     * from it as before. A name resolved in an item reaches only what the
     * item holds (`skip_parent_search`).
     */
    namedInEachItem(replacements: any[]) {
        const core = this.dependencyHandler.core;
        const components = this.dependencyHandler._components;
        // A `<group>` holding one component stands for it (COLL-3), and so
        // does a reference with no path: `$g.P` of `<group
        // name="g">$r</group>` is `$r.P`. A name is read in each item only
        // of a collection whose items hold names.
        const holdsNamedItems = (component: any) =>
            COLLECTIONS_OF_NAMED_ITEMS.has(component?.componentType) ||
            (component?.componentType === "_copy" &&
                component.state?.unresolvedPath?.value == null &&
                COLLECTIONS_OF_NAMED_ITEMS.has(
                    component.state?.extendedComponent?.value?.componentType,
                ));
        let composite: any = components[this.compositeIdx];
        const unwrapped: number[] = [];
        const items = replacements;
        while (!holdsNamedItems(composite)) {
            const content = replacements.filter(
                (x: any) => typeof x !== "string" || x.trim() !== "",
            );
            const [only] = content;
            if (
                content.length !== 1 ||
                typeof only !== "object" ||
                !(
                    only.componentType === "group" ||
                    COLLECTIONS_OF_NAMED_ITEMS.has(only.componentType) ||
                    (only.componentType === "_copy" &&
                        only.state?.unresolvedPath?.value == null)
                ) ||
                !only.isExpanded
            ) {
                return {
                    replacements: items,
                    remainingPaths: undefined,
                    itemsNamedIn: undefined,
                    itemsSearched: unwrapped,
                };
            }
            composite = only;
            unwrapped.push(only.componentIdx);
            replacements = only.replacements ?? [];
            if (
                only.replacementsToWithhold > 0 &&
                !this.includeWithheldReplacements
            ) {
                replacements = replacements.slice(
                    0,
                    -only.replacementsToWithhold,
                );
            }
        }
        const named: any[] = [];
        const remainingPaths: (any[] | null | undefined)[] = [];
        const itemsNamedIn: (number | undefined)[] = [];
        const itemsSearched: number[] = [];
        const nameIn = (item: any, path: any[], itemIdx: number) => {
            let resolution: any;
            try {
                resolution = core.resolvePath!(
                    { path },
                    item.componentIdx,
                    true,
                );
            } catch (_e) {
                resolution = undefined;
            }
            let component =
                resolution && resolution.nodeIdx !== item.componentIdx
                    ? components[resolution.nodeIdx]
                    : undefined;
            // A name the item gives a component that a reference in it
            // creates (`_createComponentIdx`), such as a repeat's `valueName`
            // (`$r.v`), names that reference's replacement, which may not be
            // made yet: the reference stands for it, and is expanded with the
            // other composites found.
            if (!component && resolution) {
                const creatingIdx =
                    core.createComponentIdxMapping?.[resolution.nodeIdx];
                if (creatingIdx != null) {
                    component = components[creatingIdx];
                }
            }
            if (!component) {
                return false;
            }
            itemsSearched.push(item.componentIdx);
            // A composite the name was resolved through, as a
            // `<conditionalContent>` in the template whose cases each
            // declare it, may change what the name names (the case shown
            // switching), so the name is resolved again when it does.
            for (const idx of resolution.nodesInResolvedPath ?? []) {
                if (
                    idx !== item.componentIdx &&
                    components[idx] &&
                    this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                        {
                            componentType: components[idx].componentType,
                            includeNonStandard: true,
                        },
                    )
                ) {
                    itemsSearched.push(idx);
                }
            }
            const remaining = resolution.unresolvedPath ?? null;
            // A name in each item of a collection named in the item
            // (`$r.q.t`, `q` a repeat in the template of `r`): `t` of each
            // item of each `q`.
            if (
                remaining?.[0]?.name &&
                holdsNamedItems(component) &&
                component.isExpanded
            ) {
                itemsSearched.push(component.componentIdx);
                let inner: any[] = component.replacements ?? [];
                const withheld = component.replacementsToWithhold ?? 0;
                if (withheld > 0 && !this.includeWithheldReplacements) {
                    inner = inner.slice(0, -withheld);
                }
                for (const innerItem of inner) {
                    if (typeof innerItem === "object") {
                        nameIn(innerItem, remaining, innerItem.componentIdx);
                    }
                }
                return true;
            }
            named.push(component);
            remainingPaths.push(remaining);
            itemsNamedIn.push(itemIdx);
            return true;
        };
        for (const item of replacements) {
            if (typeof item !== "object") {
                named.push(item);
                remainingPaths.push(undefined);
                itemsNamedIn.push(undefined);
                continue;
            }
            if (!nameIn(item, this.namePerItem, item.componentIdx)) {
                named.push(item);
                remainingPaths.push(undefined);
                itemsNamedIn.push(undefined);
            }
        }
        return {
            replacements: named,
            remainingPaths,
            itemsNamedIn,
            itemsSearched: [...unwrapped, ...itemsSearched],
        };
    }

    /**
     * `recursivelyReplaceCompositesWithReplacements` of `replacements`, each
     * with the path left for it (`remainingPaths`, from `namedInEachItem`):
     * a component a name named, with nothing left of the path, is kept
     * whole, as a reference to it is; with a property left, it is expanded
     * as a composite would be for that property, and what it expands to
     * keeps that path.
     */
    replaceCompositesKeepingPaths(
        replacements: any[],
        remainingPaths: (any[] | null | undefined)[] | undefined,
        itemsNamedIn: (number | undefined)[] | undefined,
    ) {
        const core = this.dependencyHandler.core;
        const options = {
            core,
            recurseNonStandardComposites: this.recurseNonStandardComposites,
            stopAtListComposites: this.stopAtListComposites,
            includeWithheldReplacements: this.includeWithheldReplacements,
        };
        if (!remainingPaths) {
            return {
                ...recursivelyReplaceCompositesWithReplacements({
                    ...options,
                    replacements,
                    stopIfHaveProp: this.stopIfHaveProp,
                    stopAtWrappersOfSeveral: this.stopAtWrappersOfSeveral,
                }),
                remainingPaths: undefined,
                itemsNamedIn: undefined,
            };
        }
        const combined = {
            compositesFound: [] as number[],
            newReplacements: [] as any[],
            unexpandedCompositesReady: [] as number[],
            unexpandedCompositesNotReady: [] as number[],
            remainingPaths: [] as (any[] | null | undefined)[],
            itemsNamedIn: [] as (number | undefined)[],
        };
        for (const [ind, replacement] of replacements.entries()) {
            const remainingPath = remainingPaths[ind];
            const firstName =
                remainingPath === undefined
                    ? this.stopIfHaveProp
                    : (remainingPath?.[0]?.name ?? undefined) || undefined;
            // With nothing left of the path, what the name names is copied
            // as a reference to it is: a composite gives its replacements,
            // a list composite among them kept whole (`$r[1].P`).
            const result = recursivelyReplaceCompositesWithReplacements({
                ...options,
                replacements: [replacement],
                stopAtListComposites:
                    remainingPath === null || options.stopAtListComposites,
                stopIfHaveProp: firstName,
                stopAtWrappersOfSeveral:
                    remainingPath === undefined
                        ? this.stopAtWrappersOfSeveral
                        : Boolean(firstName),
            });
            combined.compositesFound.push(...result.compositesFound);
            combined.unexpandedCompositesReady.push(
                ...result.unexpandedCompositesReady,
            );
            combined.unexpandedCompositesNotReady.push(
                ...result.unexpandedCompositesNotReady,
            );
            for (const newReplacement of result.newReplacements) {
                combined.newReplacements.push(newReplacement);
                combined.remainingPaths.push(remainingPath);
                combined.itemsNamedIn.push(itemsNamedIn?.[ind]);
            }
        }
        return combined;
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
