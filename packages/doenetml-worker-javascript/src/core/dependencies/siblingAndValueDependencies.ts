/**
 * Dependency subclasses driven by sibling / value lookups:
 *  - `CountAmongSiblings` — index of a component among siblings of the
 *    same type
 *  - `PrecedingSiblings` — the siblings before a component, waiting only
 *    for the composites among them to expand
 *  - `Value` / `Flag` — return a literal value (Flag pulls from
 *    `Core.flags`)
 */

import { Dependency } from "./Dependency";
import { ChildDependency } from "./childDependencies";
import {
    changeContext,
    partsDecidedByDoenetML,
    pathHasIndexThatCanChange,
    contentCanChange,
} from "../../utils/decidedByDoenetML";

export class CountAmongSiblingsDependency extends Dependency {
    static dependencyType = "countAmongSiblings";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
        if (this.definition.componentType) {
            this.componentType = this.definition.componentType;
        } else if (this.definition.sameType) {
            this.sameType = true;
        }

        this.includeInheritedComponentTypes = Boolean(
            this.definition.includeInheritedComponentTypes,
        );
    }

    async determineDownstreamComponents() {
        let component = this.dependencyHandler._components[this.componentIdx];

        if (!component) {
            let dependenciesMissingComponent =
                this.dependencyHandler.updateTriggers
                    .dependenciesMissingComponentBySpecifiedName[
                    this.componentIdx
                ];
            if (!dependenciesMissingComponent) {
                dependenciesMissingComponent =
                    this.dependencyHandler.updateTriggers.dependenciesMissingComponentBySpecifiedName[
                        this.componentIdx
                    ] = [];
            }
            if (!dependenciesMissingComponent.includes(this)) {
                dependenciesMissingComponent.push(this);
            }

            for (let varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.componentIdx,
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

        if (component.parentIdx == undefined) {
            console.warn(
                `component ${this.componentIdx} does not have a parent for state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}.`,
            );
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = component.parentIdx;
        let parent: any = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            // Note: since parent is created after children,
            // will typically hit this condition first time through
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

        if (!parent.childrenMatched) {
            let canProceedWithPlaceholders =
                parent.childrenMatchedWithPlaceholders;

            if (!canProceedWithPlaceholders) {
                let haveCompositesNotReady =
                    parent.unexpandedCompositesNotReady.length > 0;

                if (
                    !haveCompositesNotReady &&
                    parent.unexpandedCompositesReady.length > 0
                ) {
                    // could make progress just by expanding composites and
                    // then recalculating the downstream components
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

                    for (let compositeNotReady of parent.unexpandedCompositesNotReady) {
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

        // TODO: do we need this to actually depend on siblings?
        // Or is the update trigger enough to handle all needed updates?
        // Removed dependence on siblings so works even if they are placeholders
        return {
            success: true,
            // downstreamComponentIndices: parent.activeChildren.map(x => x.componentIdx),
            // downstreamComponentTypes: parent.activeChildren.map(x => x.componentType),
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
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

        let dependenciesMissingComponent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[this.parentIdx];
        if (dependenciesMissingComponent) {
            let ind = dependenciesMissingComponent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingComponent.splice(ind, 1);
            }
        }
    }

    async getValue() {
        let childComponentType;
        if (this.componentType) {
            childComponentType = this.componentType;
        } else if (this.sameType) {
            childComponentType =
                this.dependencyHandler.components[this.upstreamComponentIdx]
                    .componentType;
        }

        let children =
            this.dependencyHandler.components[this.parentIdx].activeChildren;
        if (childComponentType) {
            if (this.includeInheritedComponentTypes) {
                children = children.filter((x: any) =>
                    this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                        {
                            inheritedComponentType: x.componentType,
                            baseComponentType: childComponentType,
                        },
                    ),
                );
            } else {
                children = children.filter(
                    (x: any) => x.componentType === childComponentType,
                );
            }
        }

        // This could be 0 if the component doesn't match the specified componentType
        let value =
            children
                .map((x: any) => x.componentIdx)
                .indexOf(this.upstreamComponentIdx) + 1;

        // if `initializeCounters` was passed into core with a key that matches the component type
        // then increment `value` so that the first instance would yield that initial counter.
        if (this.parentIdx === this.dependencyHandler.core.documentIdx) {
            let initializeCounters =
                this.dependencyHandler.core.initializeCounters;

            if (this.includeInheritedComponentTypes) {
                // if we are including inherited component types,
                // then just use the first counter found and skip any additional counters
                // (where the order encountered is arbitrary)
                for (let cType in initializeCounters) {
                    if (
                        this.dependencyHandler.componentInfoObjects.isInheritedComponentType(
                            {
                                inheritedComponentType: cType,
                                baseComponentType: childComponentType,
                            },
                        )
                    ) {
                        value += initializeCounters[cType] - 1;
                        break;
                    }
                }
            } else {
                let initialCounter = initializeCounters[childComponentType];
                if (initialCounter) {
                    value += initialCounter - 1;
                }
            }
        }

        // don't need changes, as it is changed directly from core
        // and then upstream variables are marked as changed
        return { value, changes: {} };
    }
}

/**
 * The children of the component's parent that come before it, with their
 * `variableNames`. Primitive children are left out.
 *
 * Unlike a `child` dependency of the parent, it waits only for the
 * composites written before the component to expand, not for every composite
 * among the children. So a composite after the component can read what this
 * dependency decides (a section's number, which depends only on what comes
 * before the section) in the parameters it needs before it can expand, such
 * as `<sequence to="$s.sectionNumber"/>` after the section `s`. Read through
 * the parent's children, that was a circular dependency, and the document
 * failed to load (DIAG-5, #2578 item 1).
 *
 * A composite before the component that has not expanded, including one
 * given a type and standing in its parent's children as a placeholder, is
 * waited for: what it will make may be among the siblings.
 */
export class PrecedingSiblingsDependency extends Dependency {
    static dependencyType = "precedingSiblings";

    setUpParameters() {
        this.componentIdx = this.upstreamComponentIdx;

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
    }

    async determineDownstreamComponents() {
        const component = this.dependencyHandler._components[this.componentIdx];

        if (component?.parentIdx == undefined) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.parentIdx = component.parentIdx;
        const parent: any = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.parentIdx,
            );
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        // Recalculated whenever the parent's children change.
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

        const activeChildren: any[] = parent.activeChildren ?? [];
        const position = activeChildren.findIndex(
            (child) =>
                typeof child === "object" &&
                child?.componentIdx === this.componentIdx,
        );

        if (position === -1) {
            // Not among its parent's children yet: wait for the parent to
            // place it, as a `child` dependency of the parent would.
            for (const varName of this.upstreamVariableNames) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.parentIdx,
                    blockerType: "childMatches",
                    blockerStateVariable: varName,
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

        const compositeClass =
            this.dependencyHandler.componentInfoObjects.allComponentClasses
                ._composite;

        const downstreamComponentIndices: number[] = [];
        const downstreamComponentTypes: string[] = [];

        for (const child of activeChildren.slice(0, position)) {
            if (typeof child !== "object" || child === null) {
                continue;
            }
            // A placeholder for a composite given a type, or a composite
            // left among the children because it has not expanded.
            const unexpandedIdx =
                child.componentIdx === undefined
                    ? child.fromComposite
                    : child instanceof compositeClass && !child.isExpanded
                      ? child.componentIdx
                      : undefined;
            if (unexpandedIdx !== undefined) {
                const composite =
                    this.dependencyHandler._components[unexpandedIdx];
                if (composite) {
                    await this.addBlockerForUnexpandedComposite(composite);
                }
                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }
            downstreamComponentIndices.push(child.componentIdx);
            downstreamComponentTypes.push(child.componentType);
        }

        return {
            success: true,
            downstreamComponentIndices,
            downstreamComponentTypes,
        };
    }

    deleteFromUpdateTriggers() {
        const childDeps =
            this.dependencyHandler.updateTriggers.childDependenciesByParent[
                this.parentIdx
            ];
        if (childDeps) {
            const ind = childDeps.indexOf(this);
            if (ind !== -1) {
                childDeps.splice(ind, 1);
            }
        }
        const dependenciesMissingParent =
            this.dependencyHandler.updateTriggers
                .dependenciesMissingComponentBySpecifiedName[this.parentIdx];
        if (dependenciesMissingParent) {
            const ind = dependenciesMissingParent.indexOf(this);
            if (ind !== -1) {
                dependenciesMissingParent.splice(ind, 1);
            }
        }
    }
}

export class ValueDependency extends Dependency {
    static dependencyType = "value";

    setUpParameters() {
        this.value = this.definition.value;
    }

    async getValue() {
        return {
            value: this.value,
            changes: {},
        };
    }
}

/**
 * Whether the attributes `attributeNames` of the component, and its
 * children in the child groups `childGroups` (named as in the component's
 * `returnChildGroups`), are decided by the DoenetML alone, rather than by
 * values that can change (`partsDecidedByDoenetML`, `canChange`). A
 * definition whose diagnostic can come from either reads it to set the
 * level (DIAG-2, `levelFromSource`).
 *
 * It depends on what the author wrote, not on any value, so it is decided
 * once, the first time it is read. With `childGroups`, it is a child
 * dependency on those groups, so it is read only once the children are
 * matched to them; it gives a boolean, not the children.
 */
export class DecidedByDoenetMLDependency extends ChildDependency {
    static dependencyType = "decidedByDoenetML";

    setUpParameters() {
        this.attributeNames = this.definition.attributeNames ?? [];
        this.decidingChildGroups = this.definition.childGroups ?? [];
        this.parentIdx = this.upstreamComponentIdx;
        this.childGroups = this.decidingChildGroups;
        this.originalDownstreamVariableNames = [];
    }

    async determineDownstreamComponents() {
        if (this.decidingChildGroups.length === 0) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
        return super.determineDownstreamComponents();
    }

    async getValue() {
        if (this.value === undefined) {
            const component =
                this.dependencyHandler._components[this.upstreamComponentIdx];
            this.value = component
                ? partsDecidedByDoenetML({
                      component,
                      attributeNames: this.attributeNames,
                      childGroups: this.decidingChildGroups,
                      ctx: changeContext(this.dependencyHandler.core),
                  })
                : true;
        }
        return { value: this.value, changes: {} };
    }
}

/**
 * Whether what the component `componentIdx` holds (its replacements, or a
 * list's entries) and, with `pathOfAttribute`, the indices of the reference
 * in that attribute of this component, are decided by the DoenetML alone
 * (`contentCanChange`, `pathHasIndexThatCanChange`): the level of a
 * diagnostic that something is missing from it, an action's target or a
 * collect's source (DIAG-2, `levelFromSource`). The indices are read from
 * the reference as written (`$ml.xs[$i]`), as a path once resolved holds
 * only their values. Like `decidedByDoenetML`, it is decided once, the first
 * time it is read; a component not made yet can change.
 */
export class ContentDecidedByDoenetMLDependency extends Dependency {
    static dependencyType = "contentDecidedByDoenetML";

    setUpParameters() {
        this.heldByIdx = this.definition.componentIdx;
        this.pathOfAttribute = this.definition.pathOfAttribute;
    }

    async getValue() {
        if (this.value === undefined) {
            const components = this.dependencyHandler._components;
            const ctx = changeContext(this.dependencyHandler.core);
            const component = components[this.heldByIdx];
            const references = this.pathOfAttribute
                ? (components[this.upstreamComponentIdx]?.attributes?.[
                      this.pathOfAttribute
                  ]?.references ?? [])
                : [];
            this.value =
                Boolean(component) &&
                !contentCanChange(component, ctx) &&
                !references.some((reference: any) =>
                    pathHasIndexThatCanChange(
                        reference?.refResolution?.originalPath,
                        ctx,
                    ),
                );
        }
        return { value: this.value, changes: {} };
    }
}

export class FlagDependency extends ValueDependency {
    static dependencyType = "flag";

    setUpParameters() {
        this.flagName = this.definition.flagName;
        this.value = this.dependencyHandler.core.flags[this.flagName];
    }
}

/**
 * The `initializeCounters` the hosting page passed in: a map from a component
 * type to the number the document's count of that type starts at. (All the
 * types of division share one count, so an entry for any of them starts it.)
 *
 * Fixed for a core's lifetime, like flags.
 */
export class InitializeCountersDependency extends ValueDependency {
    static dependencyType = "initializeCounters";

    setUpParameters() {
        this.value = this.dependencyHandler.core.initializeCounters;
    }
}

/**
 * The content locale the hosting page asked for, as a BCP-47 tag.
 *
 * Fixed for a core's lifetime, like flags: changing the content language
 * changes every computed string in the document, so the viewer rebuilds the
 * core rather than trying to update in place.
 */
export class LocaleDependency extends ValueDependency {
    static dependencyType = "locale";

    setUpParameters() {
        this.value = this.dependencyHandler.core.localeData.locale;
    }
}

/**
 * A translator for the content the core computes, keyed by locale.
 *
 * The value is the *factory*, not a translator: the catalogs are fixed for the
 * core's lifetime but the locale is not, since a nested `<document lang>` can
 * differ from the one around it. A definition reads the locale of the document
 * it sits in — an ordinary ancestor dependency — and asks this for the
 * matching translator.
 *
 * The factory is a bound property on the core, so its identity is stable and
 * this dependency never reports a spurious change.
 */
export class TranslatorDependency extends ValueDependency {
    static dependencyType = "translator";

    setUpParameters() {
        this.value = this.dependencyHandler.core.getContentTranslator;
    }
}
