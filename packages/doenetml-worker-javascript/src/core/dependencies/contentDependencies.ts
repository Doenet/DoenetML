/**
 * Dependency subclasses that read content lifted from the document
 * itself rather than from another component's state — serialized
 * children, DoenetML source / range, document variants, counters,
 * file-by-cid lookups, and the meta-dependency
 * `DetermineDependenciesDependency` that wraps a state-variable's
 * dynamic dependency-resolution step.
 */

import { Dependency } from "./Dependency";
import { retrieveTextFileForCid } from "@doenet/utils";

export class SerializedChildrenDependency extends Dependency {
    static dependencyType = "serializedChildren";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

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

        return {
            success: true,
            downstreamComponentIndices: [this.parentIdx],
            downstreamComponentTypes: [parent.componentType],
        };
    }

    async getValue() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        return {
            value: parent.serializedChildren,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
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

export class DoenetMLDependency extends Dependency {
    static dependencyType = "doenetML";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        this.displayOnlyChildren = this.definition.displayOnlyChildren;
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

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    async getValue() {
        let doenetML = this.dependencyHandler.core.requestComponentDoenetML(
            this.componentIdx,
            this.displayOnlyChildren,
        );

        return {
            value: doenetML,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
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

export class DoenetMLRangeDependency extends Dependency {
    static dependencyType = "position";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
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

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    async getValue() {
        let component = this.dependencyHandler._components[this.componentIdx];

        // TODO: address doenetmlId

        return {
            value: component.position ?? null,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
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

export class VariantsDependency extends Dependency {
    static dependencyType = "variants";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
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

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    async getValue() {
        let component = this.dependencyHandler._components[this.componentIdx];

        return {
            value: component.variants,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
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

export class CounterDependency extends Dependency {
    static dependencyType = "counter";

    setUpParameters() {
        this.counterName = this.definition.counterName;

        this.componentIdx = this.upstreamComponentIdx;
    }

    async determineDownstreamComponents() {
        let component = this.dependencyHandler._components[this.componentIdx];

        let counters = component.counters[this.counterName];
        if (!counters) {
            counters = component.counters[this.counterName] = {
                dependencies: [],
                componentList: [],
                value: null,
            };
        }

        if (!counters.dependencies.includes(this)) {
            counters.dependencies.push(this);
        }

        await this.dependencyHandler.collateCountersAndPropagateToAncestors(
            component,
        );

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        let component = this.dependencyHandler._components[this.componentIdx];

        return {
            value: component.counters[this.counterName].value,
            changes: {},
        };
    }
}

export class DetermineDependenciesDependency extends Dependency {
    static dependencyType = "determineDependencies";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (this.definition.variableNames === undefined) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: variableNames is not defined`,
            );
        }
        this.originalDownstreamVariableNames = this.definition.variableNames;

        this.returnSingleComponent = true;
    }

    async determineDownstreamComponents() {
        // console.log(`determine downstream components of determine deps dependency ${this.dependencyName} of ${this.representativeStateVariable} of ${this.upstreamComponentIdx}`)

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

        for (let varName of this.upstreamVariableNames) {
            await this.dependencyHandler.addBlocker({
                blockerComponentIdx: this.upstreamComponentIdx,
                blockerType: "determineDependencies",
                blockerStateVariable: varName,
                blockerDependency: this.dependencyName,
                componentIdxBlocked: this.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });
        }

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    deleteFromUpdateTriggers() {
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

    async markStale() {
        let component =
            this.dependencyHandler._components[this.upstreamComponentIdx];

        for (let varName of this.upstreamVariableNames) {
            if (!(
                component &&
                component.state[varName] &&
                component.state[varName].currentlyResolving
            )) {
                await this.dependencyHandler.addBlocker({
                    blockerComponentIdx: this.upstreamComponentIdx,
                    blockerType: "determineDependencies",
                    blockerStateVariable: varName,
                    blockerDependency: this.dependencyName,
                    componentIdxBlocked: this.upstreamComponentIdx,
                    typeBlocked: "stateVariable",
                    stateVariableBlocked: varName,
                });

                // add a blocker to recalculating the downstream dependencies of all
                // the dependencies of varName
                for (let depName in this.dependencyHandler
                    .downstreamDependencies[this.upstreamComponentIdx][
                    varName
                ]) {
                    let dep =
                        this.dependencyHandler.downstreamDependencies[
                            this.upstreamComponentIdx
                        ][varName][depName];
                    if (dep.dependencyType !== "determineDependencies") {
                        await this.dependencyHandler.addBlocker({
                            blockerComponentIdx: this.upstreamComponentIdx,
                            blockerType: "determineDependencies",
                            blockerStateVariable: varName,
                            blockerDependency: this.dependencyName,
                            componentIdxBlocked: this.upstreamComponentIdx,
                            typeBlocked: "recalculateDownstreamComponents",
                            stateVariableBlocked: varName,
                            dependencyBlocked: depName,
                        });
                    }
                }
            }
        }
    }
}

export class FileDependency extends Dependency {
    static dependencyType = "file";

    setUpParameters() {
        this.cid = this.definition.cid;
        this.uri = this.definition.uri;
        this.fileType = this.definition.fileType;
    }

    async getValue() {
        let extension;

        if (this.cid) {
            if (this.fileType.toLowerCase() === "csv") {
                extension = "csv";
            } else {
                return {
                    value: null,
                    changes: {},
                };
            }

            let fileContents = await retrieveTextFileForCid(
                this.cid,
                extension,
            );

            return {
                value: fileContents,
                changes: {},
            };
        } else {
            // no cid.  Try to find from uri
            let response = await fetch(this.uri);

            if (response.ok) {
                let fileContents = await response.text();
                return {
                    value: fileContents,
                    changes: {},
                };
            } else {
                return {
                    value: null,
                    changes: {},
                };
            }
        }
    }
}
