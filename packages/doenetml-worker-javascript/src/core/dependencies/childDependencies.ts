/**
 * Dependency subclasses that walk downward through the component tree —
 * `ChildDependency` (active children matched against component-type
 * filters) and `DescendantDependency` (recursive variant via
 * `gatherDescendants`).
 */

import { Dependency, INITIAL_CHANGE_RECORD } from "./Dependency";
import { gatherDescendants } from "../../utils/descendants";
import { LIST_ENTRY_ARRAY_PREFIX } from "../../utils/listEntryReference";
import { ensureListEntryPropertyArray } from "../listEntryPropertyArrays";

export class ChildDependency extends Dependency {
    static dependencyType = "child";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
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

        this.includeAllChildren = this.definition.includeAllChildren;
        this.childGroups = this.definition.childGroups;
        if (!this.includeAllChildren && !Array.isArray(this.childGroups)) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: childGroups must be an array`,
            );
        }

        if (this.definition.childIndices !== undefined) {
            this.childIndices = this.definition.childIndices.map((x: any) =>
                Number(x),
            );
        }

        this.skipComponentIndices = this.definition.skipComponentIndices;
        this.skipPlaceholders = this.definition.skipPlaceholders;

        this.proceedIfAllChildrenNotMatched =
            this.definition.proceedIfAllChildrenNotMatched;

        this.dontRecurseToShadows = this.definition.dontRecurseToShadows;

        // Whether a change in the composites the children are replacements
        // of (`compositeReplacementRange`) is a change of the dependency,
        // as for a parent that keys its children's text by the composite
        // the text came from.
        this.reportCompositeChanges = this.definition.reportCompositeChanges;
    }

    async determineDownstreamComponents() {
        // console.log(`determine downstream components of ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        if (this.downstreamPrimitives) {
            this.previousDownstreamPrimitives = [...this.downstreamPrimitives];
        } else {
            this.previousDownstreamPrimitives = [];
        }

        this.downstreamPrimitives = [];

        let parent: any = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.parentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.parentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
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

        let childDependencies =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (!childDependencies) {
            childDependencies =
                this.dependencyHandler.updateTriggers.childDependenciesByParent[
                    this.parentIdx
                ] = [];
        }
        if (!childDependencies.includes(this)) {
            childDependencies.push(this);
        }

        let activeChildrenIndices = this.includeAllChildren
            ? [...parent.activeChildren.keys()]
            : parent.returnMatchedChildIndices(this.childGroups);
        if (activeChildrenIndices === undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: childGroups ${this.childGroups} does not exist.`,
            );
        }

        // if childIndices specified, filter out just those indices
        // Note: indices are relative to the selected ones
        // (not actual index in activeChildren)
        // so filter uses the i argument, not the x argument
        // A list component is several children of the value, one per
        // entry, so with one among the children the indices pick from the
        // value once the lists are expanded (`expandListChildren`).
        this.childIndicesAfterExpansion = false;
        if (this.childIndices) {
            if (
                activeChildrenIndices.some(
                    (x: any) =>
                        parent.activeChildren[x]?.constructor
                            ?.listEntryComponentType !== undefined &&
                        !parent.listChildrenMatchedWhole?.has(x),
                )
            ) {
                this.childIndicesAfterExpansion = true;
            } else {
                activeChildrenIndices = activeChildrenIndices.filter(
                    (x: any, i: number) => this.childIndices.includes(i),
                );
            }
        }

        if (!parent.childrenMatched && !this.proceedIfAllChildrenNotMatched) {
            let canProceedWithPlaceholders = false;

            if (parent.childrenMatchedWithPlaceholders) {
                if (this.skipPlaceholders) {
                    activeChildrenIndices = activeChildrenIndices.filter(
                        (x: any) =>
                            !parent.placeholderActiveChildrenIndices.includes(
                                x,
                            ),
                    );
                }

                if (
                    this.skipComponentIndices &&
                    this.originalDownstreamVariableNames.length === 0
                ) {
                    // if skipping componentIdx and there are no variable names,
                    // then only information to get is componentTypes of children,
                    // which one can do even with placeholders
                    canProceedWithPlaceholders = true;
                } else {
                    // if need to include component indices or variables,
                    // then we can proceed only if we aren't asking for any placeholder children

                    canProceedWithPlaceholders = activeChildrenIndices.every(
                        (x: any) =>
                            !parent.placeholderActiveChildrenIndices.includes(
                                x,
                            ),
                    );
                }
            }

            if (!canProceedWithPlaceholders) {
                let haveCompositesNotReady =
                    parent.unexpandedCompositesNotReady.length > 0;

                if (
                    !haveCompositesNotReady &&
                    parent.unexpandedCompositesReady.length > 0
                ) {
                    // could make progress just by expanding composites and
                    // then recalculating the downstream components,
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
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

                if (haveCompositesNotReady) {
                    for (let varName of this.upstreamVariableNames) {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.parentIdx,
                            blockerType: "childMatches",
                            blockerStateVariable: varName, // add so that can have different blockers of child logic
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

                    // mark that child logic is blocked by
                    // the readyToExpandWhenResolved state variable of the composites not ready

                    // Note: since unresolved composites that don't have a component type
                    // will prevent child logic from being satisfied with placeholders
                    // (as they don't get turned into placeholders)
                    // add blockers just to them, if they exist
                    // (This prevents adding circular dependencies that could
                    // be avoided once child logic is resolved with placeholders)

                    let compositesBlockingWithComponentType = [];
                    let compositesBlockingWithoutComponentType = [];

                    for (let compositeNotReady of parent.unexpandedCompositesNotReady) {
                        if (parent.childrenMatchedWithPlaceholders) {
                            // if child logic is satisifed with placeholders,
                            // then we don't need to expand any composites
                            // that don't overlap with the active children indices we need
                            let inds =
                                parent
                                    .placeholderActiveChildrenIndicesByComposite[
                                    compositeNotReady
                                ];
                            if (
                                inds.every(
                                    (x: any) =>
                                        !activeChildrenIndices.includes(x),
                                )
                            ) {
                                continue;
                            }
                        }
                        let compositeComp =
                            this.dependencyHandler._components[
                                compositeNotReady
                            ];
                        if (
                            compositeComp.attributes.createComponentOfType
                                ?.primitive
                        ) {
                            compositesBlockingWithComponentType.push(
                                compositeNotReady,
                            );
                        } else {
                            compositesBlockingWithoutComponentType.push(
                                compositeNotReady,
                            );
                        }
                    }

                    let compositesToAddBlockers =
                        compositesBlockingWithoutComponentType;
                    if (compositesToAddBlockers.length === 0) {
                        compositesToAddBlockers =
                            compositesBlockingWithComponentType;
                    }

                    for (let compositeNotReady of compositesToAddBlockers) {
                        for (let varName of this.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: compositeNotReady,
                                blockerType: "stateVariable",
                                blockerStateVariable:
                                    "readyToExpandWhenResolved",
                                componentIdxBlocked: this.upstreamComponentIdx,
                                typeBlocked: "childMatches",
                                stateVariableBlocked: varName, // add to just block for this variable
                            });
                        }
                    }

                    return {
                        success: false,
                        downstreamComponentIndices: [],
                        downstreamComponentTypes: [],
                    };
                }
            }
        }

        let activeChildrenMatched = activeChildrenIndices.map(
            (x: any) => parent.activeChildren[x],
        );

        this.compositeReplacementRange = [];

        if (this.dontRecurseToShadows) {
            let allActiveChildrenMatched = activeChildrenMatched;
            let allActiveChildrenIndices = activeChildrenIndices;

            activeChildrenMatched = [];
            activeChildrenIndices = [];

            for (let [ind, child] of allActiveChildrenMatched.entries()) {
                if (!(
                    child.shadows &&
                    child.shadows.compositeIdx === parent?.shadows?.compositeIdx
                )) {
                    activeChildrenMatched.push(child);
                    activeChildrenIndices.push(allActiveChildrenIndices[ind]);
                }
            }
        } else {
            // translate parent.compositeReplacementActiveRange
            // so that indices refer to index from activeChildrenMatched

            if (
                parent.compositeReplacementActiveRange &&
                activeChildrenMatched.length > 0
            ) {
                for (let compositeInfo of parent.compositeReplacementActiveRange) {
                    let translatedFirstInd, translatedLastInd;

                    let translatedPotentialListComponents = [];

                    for (let [
                        ind,
                        activeInd,
                    ] of activeChildrenIndices.entries()) {
                        if (compositeInfo.firstInd > activeInd) {
                            continue;
                        }
                        if (compositeInfo.lastInd < activeInd) {
                            // firstInd/lastInd as describing the interval with inclusive convention at both ends.
                            // Therefore if lastInd = firstInd-1, it means that there were no replacements for the composite.
                            // Since we still want to communicate the compositeReplacementRange in this case,
                            // we set the translated ind to be a interval of length 0 that corresponds to the composite's location.
                            if (
                                compositeInfo.lastInd ===
                                compositeInfo.firstInd - 1
                            ) {
                                translatedFirstInd = ind;
                                translatedLastInd = ind - 1;
                            }
                            break;
                        }

                        // activeInd is matched by compositeInfo

                        if (translatedFirstInd === undefined) {
                            // this is the first activeInd to match, so translate first ind
                            // to the index of activeInd
                            translatedFirstInd = ind;
                        }

                        // last one to match will be picked
                        translatedLastInd = ind;

                        translatedPotentialListComponents.push(
                            compositeInfo.potentialListComponents[
                                activeInd - compositeInfo.firstInd
                            ],
                        );
                    }

                    if (translatedLastInd !== undefined) {
                        this.compositeReplacementRange.push({
                            compositeIdx: compositeInfo.compositeIdx,
                            compositeStateId:
                                this.dependencyHandler._components[
                                    compositeInfo.compositeIdx
                                ]?.stateId,
                            extendIdx: compositeInfo.extendIdx,
                            unresolvedPath: compositeInfo.unresolvedPath,
                            firstInd: translatedFirstInd,
                            lastInd: translatedLastInd,
                            asList: compositeInfo.asList,
                            potentialListComponents:
                                translatedPotentialListComponents,
                        });
                    }
                }
            }

            for (let child of activeChildrenMatched) {
                let childSource = child;
                let parentSource = parent;

                while (
                    childSource?.shadows &&
                    childSource.shadows.compositeIdx ===
                        parentSource?.shadows?.compositeIdx
                ) {
                    parentSource =
                        this.dependencyHandler._components[
                            parentSource.shadows.componentIdx
                        ];
                    childSource =
                        this.dependencyHandler._components[
                            childSource.shadows.componentIdx
                        ];
                }
            }
        }

        this.activeChildrenIndices = activeChildrenIndices;

        let downstreamComponentIndices = [];
        let downstreamComponentTypes = [];

        // What each list component among the children presents its entries
        // as, which `ChildMatcher` decided when it matched the list.
        this.listChildPresentedTypes = {};
        this.hasListChildren = false;

        for (let [ind, child] of activeChildrenMatched.entries()) {
            if (typeof child !== "object") {
                this.downstreamPrimitives.push(child);
                continue;
            }

            const listEntryType = child.constructor?.listEntryComponentType;
            if (
                listEntryType !== undefined &&
                !parent.listChildrenMatchedWhole?.has(
                    activeChildrenIndices[ind],
                )
            ) {
                this.listChildPresentedTypes[child.componentIdx] = parent
                    .listChildPresentedTypes?.[activeChildrenIndices[ind]] ?? {
                    componentType: listEntryType,
                };
                this.hasListChildren = true;
            }

            this.downstreamPrimitives.push(null);

            downstreamComponentIndices.push(
                child.componentIdx
                    ? child.componentIdx
                    : `__placeholder_${ind}`,
            );
            downstreamComponentTypes.push(
                child.presentedComponentType ?? child.componentType,
            );
        }

        if (this.hasListChildren) {
            this.recordVariablesForEveryComponent();
        }

        if (
            this.originalDownstreamVariableNames.includes("hidden") &&
            this.downstreamPrimitives.find((x: any) => x !== null)
        ) {
            // We are asking for the hidden state variable and the result includes primitives.
            // Since primitives don't have a hidden state variable, we instead depend on the hidden state variable
            // of the composite.

            for (let compositeObj of this.compositeReplacementRange) {
                downstreamComponentIndices.push(compositeObj.compositeIdx);
                downstreamComponentTypes.push(
                    this.dependencyHandler._components[
                        compositeObj.compositeIdx
                    ].componentType,
                );

                this.addedCompositeHiddenDependency = true;
            }

            if (
                this.addedCompositeHiddenDependency &&
                this.originalDownstreamVariableNames.length > 1
            ) {
                // Added a composite hidden dependency but there are other variables that may not be on the composite.
                // Make variables optional so we don't cause an unexpected error.
                this.variablesOptional = true;
            }
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

        let compositeReplacementRange = this.compositeReplacementRange;

        if (this.addedCompositeHiddenDependency) {
            // We added composite hidden dependencies.
            // Delete them off the actual dependencies returned
            // and instead add them to the compositeReplacesRange object returned.

            let nDepsAdded = compositeReplacementRange.length;
            let extraDependencies = result.value.splice(
                result.value.length - nDepsAdded,
                nDepsAdded,
            );

            compositeReplacementRange = JSON.parse(
                JSON.stringify(compositeReplacementRange),
            );

            for (let [ind, range] of compositeReplacementRange.entries()) {
                range.hidden = extraDependencies[ind].stateValues.hidden;
            }
        }

        let resultValueWithPrimitives: any = [];
        let resultInd = 0;

        for (let primitiveOrNull of this.downstreamPrimitives) {
            if (primitiveOrNull === null) {
                resultValueWithPrimitives.push(result.value[resultInd]);
                resultInd++;
            } else {
                resultValueWithPrimitives.push(primitiveOrNull);
            }
        }

        resultValueWithPrimitives.compositeReplacementRange =
            compositeReplacementRange;

        if (this.hasListChildren) {
            resultValueWithPrimitives = await this.expandListChildren({
                values: resultValueWithPrimitives,
                result,
                consumeChanges,
            });
        } else {
            delete this.expandedChildSources;
        }

        result.value = resultValueWithPrimitives;

        if (this.reportCompositeChanges) {
            const compositeRanges = JSON.stringify(
                (resultValueWithPrimitives.compositeReplacementRange ?? []).map(
                    (range: any) => [
                        range.compositeIdx,
                        range.firstInd,
                        range.lastInd,
                    ],
                ),
            );
            if (compositeRanges !== this.previousCompositeRanges) {
                result.changes.componentIdentitiesChanged = true;
                if (consumeChanges) {
                    this.previousCompositeRanges = compositeRanges;
                }
            }
        }

        if (
            this.downstreamPrimitives.length !==
                this.previousDownstreamPrimitives.length ||
            this.downstreamPrimitives.some(
                (v: any, i: number) =>
                    v !== this.previousDownstreamPrimitives[i],
            )
        ) {
            result.changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.previousDownstreamPrimitives = [
                    ...this.downstreamPrimitives,
                ];
            }
        }

        // if (!this.doNotProxy) {
        //   result.value = new Proxy(result.value, readOnlyProxyHandler)
        // }

        return result;
    }

    /**
     * A list component among the children is read through variables of its
     * own (its count, at the least) even when nothing is asked of its
     * entries, so once one is met, every child has its variables recorded.
     * A child already downstream, from before, read none.
     */
    recordVariablesForEveryComponent() {
        if (this.hasVariableMapping()) {
            return;
        }
        this.mapsVariablesForEveryComponent = true;
        if (this.downstreamComponentIndices === undefined) {
            // still being initialized, which sets up the records
            return;
        }
        this.mappedDownstreamVariableNamesByComponent =
            this.downstreamComponentIndices.map(() =>
                this.dependencyHandler.internVariableNameList([]),
            );
        this.valuesChanged = this.downstreamComponentIndices.map(() =>
            this.dependencyHandler.internInitialValuesChangedRecord(
                this.dependencyHandler.internVariableNameList([]),
                INITIAL_CHANGE_RECORD,
            ),
        );
    }

    mapListEntryVariables(downComponent: any, originalVarNames: string[]) {
        const listClass = downComponent.constructor;
        const presented =
            this.listChildPresentedTypes?.[downComponent.componentIdx];
        if (
            listClass.listEntryComponentType === undefined ||
            presented === undefined
        ) {
            return undefined;
        }

        // An entry answers to the aliases of the type it presents as.
        const names: string[] = this.dependencyHandler.core.substituteAliases({
            stateVariables: originalVarNames,
            componentClass:
                this.dependencyHandler.componentInfoObjects.allComponentClasses[
                    presented.componentType
                ],
        });

        const mapped = names.map((name) => {
            // An entry presenting as an adapter's type reads, as its value,
            // the variable of the entry that the adapter would have read.
            const entryVariable =
                presented.adapterVariable !== undefined && name === "value"
                    ? presented.adapterVariable
                    : name;
            const listVariable =
                listClass.listEntryStateVariables[entryVariable];
            if (listVariable !== undefined) {
                return listVariable;
            }
            // A property the list computes for each entry from its value
            // (`numDimensions`, `x2` of a math read as a point) is an array
            // made on the list when first asked for.
            if (listClass.derivedEntryProperty(entryVariable) !== undefined) {
                const arrayName = `${LIST_ENTRY_ARRAY_PREFIX}${entryVariable}`;
                ensureListEntryPropertyArray({
                    core: this.dependencyHandler.core,
                    component: downComponent,
                    arrayName,
                });
                return arrayName;
            }
            return `__${entryVariable}_not_a_list_entry_variable`;
        });
        mapped.push(listClass.listEntryCountVariable);

        return mapped;
    }

    /**
     * Replace the record of each list component among `values` with one
     * record per entry, of the type the entry presents as, whose variables
     * are the list's (an array variable giving the entry its own value).
     * An entry's record also names its index (`listEntryIndex`) and the
     * list's array of values (`listValuesVariable`), for a parent that reads
     * the entries' values by itself.
     * The ranges of `values.compositeReplacementRange` are moved to match,
     * and each list gets a range of its own, so its entries are separated as
     * a composite's replacements are. The change records and `usedDefault`
     * are renumbered by the new downstream positions.
     *
     * Records, in `expandedChildSources`, where each child of the result
     * comes from, for `EssentialValueWriter` to route a write to child `k`.
     */
    async expandListChildren({
        values,
        result,
        consumeChanges,
    }: {
        values: any;
        result: any;
        consumeChanges: boolean;
    }) {
        const expanded: any = [];
        const childSources: any[] = [];

        const ranges = (values.compositeReplacementRange ?? []).map(
            (range: any) => ({
                ...range,
                potentialListComponents: [
                    ...(range.potentialListComponents ?? []),
                ],
            }),
        );

        const valuesChanged = result.changes.valuesChanged;
        const newValuesChanged: any = {};
        const usedDefault = result.usedDefault;
        const newUsedDefault: any[] = [];

        if (!this.previousListEntryCounts) {
            this.previousListEntryCounts = {};
        }

        let downInd = 0;
        let newDownInd = 0;

        for (let [pos, item] of values.entries()) {
            if (this.downstreamPrimitives[pos] !== null) {
                expanded.push(item);
                childSources.push({ primitiveInd: pos });
                continue;
            }

            const componentIdx = this.downstreamComponentIndices[downInd];
            const comp = this.dependencyHandler._components[componentIdx];
            const presented =
                comp && this.listChildPresentedTypes[componentIdx];

            if (!presented) {
                expanded.push(item);
                childSources.push({ downstreamInd: downInd });
                if (valuesChanged?.[downInd]) {
                    newValuesChanged[newDownInd] = valuesChanged[downInd];
                }
                newUsedDefault[newDownInd] = usedDefault[downInd];
                downInd++;
                newDownInd++;
                continue;
            }

            const mappedNames =
                this.mappedDownstreamVariableNamesByComponent[downInd];
            const countVariable = mappedNames[mappedNames.length - 1];
            const numEntries = await comp.state[countVariable].value;
            if (consumeChanges) {
                this.consumeChangeRecord(downInd, countVariable);
            }

            if (this.previousListEntryCounts[componentIdx] !== numEntries) {
                result.changes.componentIdentitiesChanged = true;
                if (consumeChanges) {
                    this.previousListEntryCounts[componentIdx] = numEntries;
                }
            }

            // Which variables hold one value per entry (`listPerEntryVariables`);
            // the rest are shared by every entry.
            const perEntryVariables = comp.constructor.listPerEntryVariables;
            const isArray: Record<string, boolean> = {};
            for (const [
                varInd,
                originalName,
            ] of this.originalDownstreamVariableNames.entries()) {
                isArray[originalName] =
                    perEntryVariables.includes(mappedNames[varInd]) ||
                    mappedNames[varInd].startsWith(LIST_ENTRY_ARRAY_PREFIX);
            }

            const firstInd = expanded.length;

            if (numEntries === 0 && this.listMustHaveAnEntry(comp)) {
                expanded.push(
                    this.blankListEntry({ comp, item, isArray, presented }),
                );
                childSources.push({ downstreamInd: downInd });
                if (valuesChanged?.[downInd]) {
                    newValuesChanged[newDownInd] = valuesChanged[downInd];
                }
                newUsedDefault[newDownInd] = usedDefault[downInd];
                newDownInd++;
                // One child for one child, so no range moves.
                ranges.push({
                    compositeIdx: componentIdx,
                    firstInd,
                    lastInd: firstInd,
                    asList: true,
                    potentialListComponents: [true],
                });
                downInd++;
                continue;
            }

            for (let entryInd = 0; entryInd < numEntries; entryInd++) {
                const entry: any = {
                    componentType: presented.componentType,
                    listEntryIndex: entryInd,
                    listValuesVariable:
                        comp.constructor.listEntryStateVariables.value,
                };
                if (item.componentIdx !== undefined) {
                    entry.componentIdx = item.componentIdx;
                }
                if (item.position) {
                    entry.position = item.position;
                    entry.sourceDoc = item.sourceDoc;
                }
                if (item.stateValues) {
                    entry.stateValues = {};
                    for (const name in item.stateValues) {
                        const value = item.stateValues[name];
                        entry.stateValues[name] = isArray[name]
                            ? value?.[entryInd]
                            : value;
                    }
                }
                expanded.push(entry);
                childSources.push({
                    downstreamInd: downInd,
                    entryIndex: entryInd,
                });
                if (valuesChanged?.[downInd]) {
                    newValuesChanged[newDownInd] = valuesChanged[downInd];
                }
                newUsedDefault[newDownInd] = usedDefault[downInd];
                newDownInd++;
            }

            // The list was one child at `firstInd` and is now `numEntries`.
            for (const range of ranges) {
                if (range.firstInd <= firstInd && range.lastInd >= firstInd) {
                    range.potentialListComponents.splice(
                        firstInd - range.firstInd,
                        1,
                        ...Array(numEntries).fill(true),
                    );
                    range.lastInd += numEntries - 1;
                } else if (range.firstInd > firstInd) {
                    range.firstInd += numEntries - 1;
                    range.lastInd += numEntries - 1;
                }
            }
            ranges.push({
                compositeIdx: componentIdx,
                firstInd,
                lastInd: firstInd + numEntries - 1,
                asList:
                    "asList" in comp.state
                        ? await comp.stateValues.asList
                        : true,
                potentialListComponents: Array(numEntries).fill(true),
            });

            downInd++;
        }

        if (this.childIndicesAfterExpansion) {
            return this.selectChildIndices({
                expanded,
                childSources,
                newValuesChanged: valuesChanged ? newValuesChanged : undefined,
                newUsedDefault,
                result,
            });
        }

        expanded.compositeReplacementRange = ranges;

        if (valuesChanged) {
            result.changes.valuesChanged = newValuesChanged;
        }
        result.usedDefault = newUsedDefault;

        this.expandedChildSources = childSources;

        return expanded;
    }

    /**
     * Whether a list with no entries is seen as one blank child: a reference
     * to the list (the replacement of a `_copy`) where composites must have a
     * replacement, as a copy of an empty composite gets one there
     * (`utils/copy.js`).
     */
    listMustHaveAnEntry(comp: any) {
        if (comp.replacementOf?.componentType !== "_copy") {
            return false;
        }
        const listParent = this.dependencyHandler._components[comp.parentIdx];
        return Boolean(
            listParent?.sharedParameters?.compositesMustHaveAReplacement,
        );
    }

    /**
     * The record of the blank child `listMustHaveAnEntry` gives: of the type
     * a composite's default replacement has there, holding that type's blank,
     * with the variables the list shares among its entries.
     */
    blankListEntry({
        comp,
        item,
        isArray,
        presented,
    }: {
        comp: any;
        item: any;
        isArray: Record<string, boolean>;
        presented: any;
    }) {
        const listParent = this.dependencyHandler._components[comp.parentIdx];
        const componentType =
            listParent?.sharedParameters?.compositesDefaultReplacementType ??
            presented.componentType;
        const blank = comp.constructor.listBlankEntryStateValues(componentType);
        const entry: any = { componentType };
        if (item.componentIdx !== undefined) {
            entry.componentIdx = item.componentIdx;
        }
        if (item.stateValues) {
            entry.stateValues = {};
            for (const name in item.stateValues) {
                if (!isArray[name]) {
                    entry.stateValues[name] = item.stateValues[name];
                } else if (name in blank) {
                    entry.stateValues[name] = blank[name];
                }
            }
        }
        return entry;
    }

    /**
     * Keep the children of an expanded value at `childIndices`, renumbering
     * the change records and `usedDefault` to match. The kept children are
     * not a run of the parent's children, so no composite ranges are kept.
     */
    selectChildIndices({
        expanded,
        childSources,
        newValuesChanged,
        newUsedDefault,
        result,
    }: {
        expanded: any[];
        childSources: any[];
        newValuesChanged: any;
        newUsedDefault: any[];
        result: any;
    }) {
        const selected: any = [];
        const selectedSources: any[] = [];
        const selectedValuesChanged: any = {};
        const selectedUsedDefault: any[] = [];

        let downInd = -1;
        for (const [ind, child] of expanded.entries()) {
            const isComponent = childSources[ind].primitiveInd === undefined;
            if (isComponent) {
                downInd++;
            }
            if (!this.childIndices.includes(ind)) {
                continue;
            }
            if (isComponent) {
                const newInd = selectedUsedDefault.length;
                if (newValuesChanged?.[downInd]) {
                    selectedValuesChanged[newInd] = newValuesChanged[downInd];
                }
                selectedUsedDefault.push(newUsedDefault[downInd]);
            }
            selected.push(child);
            selectedSources.push(childSources[ind]);
        }

        selected.compositeReplacementRange = [];

        if (newValuesChanged) {
            result.changes.valuesChanged = selectedValuesChanged;
        }
        result.usedDefault = selectedUsedDefault;

        this.expandedChildSources = selectedSources;

        return selected;
    }

    deleteFromUpdateTriggers() {
        let childDeps =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (childDeps) {
            let ind = childDeps.indexOf(this);
            if (ind !== -1) {
                childDeps.splice(ind, 1);
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

export class DescendantDependency extends Dependency {
    static dependencyType = "descendant";

    setUpParameters() {
        if (this.definition.ancestorIdx != undefined) {
            this.ancestorIdx = this.definition.ancestorIdx;
            this.specifiedComponentName = this.ancestorIdx;
        } else {
            this.ancestorIdx = this.upstreamComponentIdx;
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

        this.componentTypes = this.definition.componentTypes;
        this.recurseToMatchedChildren =
            this.definition.recurseToMatchedChildren;
        this.useReplacementsForComposites =
            this.definition.useReplacementsForComposites;
        this.matchListsByEntryType = this.definition.matchListsByEntryType;
        // A list component among the descendants (`listEntryComponentType`)
        // is found by the type of its entries and presented as its entries,
        // one record each, as a child dependency presents it (`getValue`).
        this.presentListsAsEntries = Boolean(
            this.definition.presentListsAsEntries,
        );
        if (this.presentListsAsEntries) {
            this.matchListsByEntryType = true;
        }
        this.includeNonActiveChildren =
            this.definition.includeNonActiveChildren;
        this.includeAttributeChildren =
            this.definition.includeAttributeChildren;
        this.skipOverAdapters = this.definition.skipOverAdapters;
        this.ignoreReplacementsOfMatchedComposites =
            this.definition.ignoreReplacementsOfMatchedComposites;

        // Note: ignoreReplacementsOfEncounteredComposites means ignore replacements
        // of all composites except copies of external content
        this.ignoreReplacementsOfEncounteredComposites =
            this.definition.ignoreReplacementsOfEncounteredComposites;

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
    }

    async determineDownstreamComponents() {
        // console.log(`deterine downstream components of descendancy dependency ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

        let ancestor = this.dependencyHandler._components[this.ancestorIdx];

        if (!ancestor) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.ancestorIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.ancestorIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.ancestorIdx,
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

        let descendantDependencies =
            this.dependencyHandler.updateTriggers
                .descendantDependenciesByAncestor[this.ancestorIdx];
        if (!descendantDependencies) {
            descendantDependencies =
                this.dependencyHandler.updateTriggers.descendantDependenciesByAncestor[
                    this.ancestorIdx
                ] = [];
        }
        if (!descendantDependencies.includes(this)) {
            descendantDependencies.push(this);
        }

        let result = this.gatherUnexpandedComposites(ancestor);

        if (
            result.haveCompositesNotReady ||
            result.haveUnexpandedCompositeReady
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

                for (const parentIdxStr in result.unexpandedCompositesReadyByParentName) {
                    const parentIdx = Number(parentIdxStr);
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: parentIdx,
                        blockerType: "childMatches",
                        blockerStateVariable: varName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: this.dependencyName,
                    });
                }

                for (const parentIdxStr in result.unexpandedCompositesNotReadyByParentName) {
                    const parentIdx = Number(parentIdxStr);
                    await this.dependencyHandler.addBlocker({
                        blockerComponentIdx: parentIdx,
                        blockerType: "childMatches",
                        blockerStateVariable: varName,
                        componentIdxBlocked: this.upstreamComponentIdx,
                        typeBlocked: "recalculateDownstreamComponents",
                        stateVariableBlocked: varName,
                        dependencyBlocked: this.dependencyName,
                    });

                    // TODO: when we have the composites block child logic,
                    // we can get circular dependencies.
                    // The solution of just removing these blockers seems to work,
                    // but not sure if it is the most efficient solution.
                    // Does this lead to unnecessary recalculations?

                    // for (let compositeNotReady of result.unexpandedCompositesNotReadyByParentName[parentIdx]) {
                    //   this.dependencyHandler.addBlocker({
                    //     blockerComponentIdx: compositeNotReady,
                    //     blockerType: "stateVariable",
                    //     blockerStateVariable: "readyToExpandWhenResolved",
                    //     componentIdxBlocked: this.upstreamComponentIdx,
                    //     typeBlocked: "childMatches",
                    //     stateVariableBlocked: varName,
                    //   });
                    // }
                }
            }

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        // if reached this far, then we have expanded all composites
        // or have placeholders that don't impede

        let descendants = gatherDescendants({
            ancestor,
            descendantTypes: this.componentTypes,
            recurseToMatchedChildren: this.recurseToMatchedChildren,
            useReplacementsForComposites: this.useReplacementsForComposites,
            includeNonActiveChildren: this.includeNonActiveChildren,
            skipOverAdapters: this.skipOverAdapters,
            ignoreReplacementsOfMatchedComposites:
                this.ignoreReplacementsOfMatchedComposites,
            ignoreReplacementsOfEncounteredComposites:
                this.ignoreReplacementsOfEncounteredComposites,
            matchListsByEntryType: this.matchListsByEntryType,
            // an authored point in a list is drawn as its entry, not again
            listsAreOpaque: this.presentListsAsEntries,
            componentInfoObjects: this.dependencyHandler.componentInfoObjects,
        });

        if (this.presentListsAsEntries) {
            this.listChildPresentedTypes = {};
            this.hasListChildren = false;
            for (const descendant of descendants) {
                const entryType =
                    this.dependencyHandler._components[descendant.componentIdx]
                        ?.constructor?.listEntryComponentType;
                if (entryType !== undefined) {
                    this.listChildPresentedTypes[descendant.componentIdx] = {
                        componentType: entryType,
                    };
                    this.hasListChildren = true;
                }
            }
            if (this.hasListChildren) {
                this.recordVariablesForEveryComponent();
            }
        }

        if (this.sourceIndex !== undefined) {
            let theDescendant = descendants[this.sourceIndex - 1];
            if (theDescendant) {
                descendants = [theDescendant];
            } else {
                descendants = [];
            }
        }

        return {
            success: true,
            downstreamComponentIndices: descendants.map(
                (x: any) => x.componentIdx,
            ),
            // a value reference as the type it stands in for, as for a child
            downstreamComponentTypes: descendants.map(
                (x: any) =>
                    this.dependencyHandler._components[x.componentIdx]
                        ?.presentedComponentType ?? x.componentType,
            ),
        };
    }

    recordVariablesForEveryComponent() {
        ChildDependency.prototype.recordVariablesForEveryComponent.call(this);
    }

    mapListEntryVariables(downComponent: any, originalVarNames: string[]) {
        return ChildDependency.prototype.mapListEntryVariables.call(
            this,
            downComponent,
            originalVarNames,
        );
    }

    /**
     * With `presentListsAsEntries`, each list component among the
     * descendants is replaced by one record per entry, of the entries' type,
     * whose variables are the list's (one value of an array for those that
     * hold a value per entry), as `ChildDependency.expandListChildren` does
     * for children. An entry has no component; its record's `componentIdx`
     * is the index its renderer is given (`rendererIdxForListEntry`), to
     * which an action for the entry goes, with `listIdx` and
     * `listEntryIndex`. The change records and `usedDefault` are renumbered.
     */
    async getValue({
        verbose = false,
        consumeChanges = true,
    }: { verbose?: boolean; consumeChanges?: boolean } = {}) {
        const result = await Dependency.prototype.getValue.call(this, {
            verbose,
            skipProxy: true,
            consumeChanges,
        });
        if (!this.hasListChildren) {
            return result;
        }

        const builder = this.dependencyHandler.core.rendererInstructionBuilder;
        const expanded: any[] = [];
        const valuesChanged = result.changes.valuesChanged;
        const newValuesChanged: any = {};
        const newUsedDefault: any[] = [];
        if (!this.previousListEntryCounts) {
            this.previousListEntryCounts = {};
        }

        for (const [downInd, item] of (result.value as any[]).entries()) {
            const componentIdx = this.downstreamComponentIndices[downInd];
            const comp = this.dependencyHandler._components[componentIdx];
            const presented =
                comp && this.listChildPresentedTypes[componentIdx];
            if (!presented) {
                if (valuesChanged?.[downInd]) {
                    newValuesChanged[expanded.length] = valuesChanged[downInd];
                }
                newUsedDefault[expanded.length] = result.usedDefault[downInd];
                expanded.push(item);
                continue;
            }

            const mappedNames =
                this.mappedDownstreamVariableNamesByComponent[downInd];
            const countVariable = mappedNames[mappedNames.length - 1];
            const numEntries = await comp.state[countVariable].value;
            if (consumeChanges) {
                this.consumeChangeRecord(downInd, countVariable);
            }
            if (this.previousListEntryCounts[componentIdx] !== numEntries) {
                result.changes.componentIdentitiesChanged = true;
                if (consumeChanges) {
                    this.previousListEntryCounts[componentIdx] = numEntries;
                }
            }

            const perEntryVariables = comp.constructor.listPerEntryVariables;
            const isArray: Record<string, boolean> = {};
            for (const [
                varInd,
                originalName,
            ] of this.originalDownstreamVariableNames.entries()) {
                isArray[originalName] =
                    perEntryVariables.includes(mappedNames[varInd]) ||
                    mappedNames[varInd].startsWith(LIST_ENTRY_ARRAY_PREFIX);
            }

            for (let entryInd = 0; entryInd < numEntries; entryInd++) {
                const entry: any = {
                    componentType: presented.componentType,
                    componentIdx: builder.rendererIdxForListEntry(
                        comp,
                        entryInd,
                    ),
                    listIdx: componentIdx,
                    listEntryIndex: entryInd,
                };
                if (item.stateValues) {
                    entry.stateValues = {};
                    for (const name in item.stateValues) {
                        const value = item.stateValues[name];
                        entry.stateValues[name] = isArray[name]
                            ? value?.[entryInd]
                            : value;
                    }
                }
                if (valuesChanged?.[downInd]) {
                    newValuesChanged[expanded.length] = valuesChanged[downInd];
                }
                newUsedDefault[expanded.length] = result.usedDefault[downInd];
                expanded.push(entry);
            }
        }

        result.value = expanded;
        if (valuesChanged) {
            result.changes.valuesChanged = newValuesChanged;
        }
        result.usedDefault = newUsedDefault;
        return result;
    }

    gatherUnexpandedComposites(component: any) {
        let unexpandedCompositesReadyByParentName: Record<string, any> = {};
        let unexpandedCompositesNotReadyByParentName: Record<string, any> = {};
        let haveUnexpandedCompositeReady = false;
        let haveCompositesNotReady = false;

        // if we don't need component indices or variables,
        // then gathering a placeholder descendant is fine
        let placeholdersOKForMatchedDescendants =
            this.skipComponentIndices &&
            this.originalDownstreamVariableNames.length === 0;

        if (!component.matchedCompositeChildren) {
            if (component.matchedCompositeChildrenWithPlaceholders) {
                if (component.unexpandedCompositesReady.length > 0) {
                    let unexpandedReady =
                        this.unexpandedCompositesAdjustedForPlacedholders(
                            component.unexpandedCompositesReady,
                            placeholdersOKForMatchedDescendants,
                        );
                    if (unexpandedReady.length > 0) {
                        unexpandedCompositesReadyByParentName[
                            component.componentIdx
                        ] = unexpandedReady;
                        haveUnexpandedCompositeReady = true;
                    }
                }
                if (component.unexpandedCompositesNotReady.length > 0) {
                    let unexpandedNotReady =
                        this.unexpandedCompositesAdjustedForPlacedholders(
                            component.unexpandedCompositesNotReady,
                            placeholdersOKForMatchedDescendants,
                        );
                    if (unexpandedNotReady.length > 0) {
                        unexpandedCompositesNotReadyByParentName[
                            component.componentIdx
                        ] = unexpandedNotReady;
                        haveCompositesNotReady = true;
                    }
                }
            } else {
                if (component.unexpandedCompositesReady.length > 0) {
                    unexpandedCompositesReadyByParentName[
                        component.componentIdx
                    ] = component.unexpandedCompositesReady;
                    haveUnexpandedCompositeReady = true;
                }
                if (component.unexpandedCompositesNotReady.length > 0) {
                    unexpandedCompositesNotReadyByParentName[
                        component.componentIdx
                    ] = component.unexpandedCompositesNotReady;
                    haveCompositesNotReady = true;
                }
            }
        }

        for (const childIdxStr in component.allChildren) {
            let child = component.allChildren[childIdxStr].component;
            if (typeof child === "object") {
                let result = this.gatherUnexpandedComposites(child);
                if (result.haveUnexpandedCompositeReady) {
                    Object.assign(
                        unexpandedCompositesReadyByParentName,
                        result.unexpandedCompositesReadyByParentName,
                    );
                    haveUnexpandedCompositeReady = true;
                }
                if (result.haveCompositesNotReady) {
                    Object.assign(
                        unexpandedCompositesNotReadyByParentName,
                        result.unexpandedCompositesNotReadyByParentName,
                    );
                    haveCompositesNotReady = true;
                }
            }
        }

        return {
            unexpandedCompositesReadyByParentName,
            haveUnexpandedCompositeReady,
            unexpandedCompositesNotReadyByParentName,
            haveCompositesNotReady,
        };
    }

    unexpandedCompositesAdjustedForPlacedholders(
        unexpandedComposites: any,
        placeholdersOKForMatchedDescendants: any,
    ) {
        let adjustedUnexpanded = [];
        for (let compositeIdx of unexpandedComposites) {
            let composite = this.dependencyHandler._components[compositeIdx];
            if (composite.attributes.createComponentOfType) {
                let placeholderType =
                    this.dependencyHandler.componentInfoObjects
                        .componentTypeLowerCaseMapping[
                        composite.attributes.createComponentOfType.primitive.value.toLowerCase()
                    ];

                let matches = this.componentTypes.some((ct: any) =>
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType: placeholderType,
                            baseComponentType: ct,
                        },
                    ),
                );

                if (matches) {
                    if (!placeholdersOKForMatchedDescendants) {
                        adjustedUnexpanded.push(compositeIdx);
                    }
                } else {
                    // Composite is a placeholder that is not matched by componentTypes.
                    // Could that placeholder later have a descendant that is matched by componentTypes?

                    adjustedUnexpanded.push(compositeIdx);
                }
            } else {
                // no componentType specified
                adjustedUnexpanded.push(compositeIdx);
            }
        }

        return adjustedUnexpanded;
    }

    deleteFromUpdateTriggers() {
        let descendantDeps =
            this.dependencyHandler.updateTriggers
                .descendantDependenciesByAncestor[this.ancestorIdx];
        if (descendantDeps) {
            let ind = descendantDeps.indexOf(this);
            if (ind !== -1) {
                descendantDeps.splice(ind, 1);
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
