/**
 * Dependency subclasses that follow the adapter chain — the upstream
 * component's `adaptedFrom` link, optionally reading state from that
 * source.
 */

import { Dependency } from "./Dependency";

/**
 * The component `component` was adapted from, for a dependency of
 * `component` that asks about its adapter's source.
 *
 * A value reference (`_ref`) that presents as an adapter's type has no
 * adapter component; the referent it reads is what the adapter would have
 * been made from, and it is known once the reference's `referentInfo` has
 * resolved. Until then the dependency is blocked on that variable and
 * recalculated when it resolves.
 */
async function adapterSourceOf(
    dependency: Dependency,
    component: any,
): Promise<{ source?: any; blocked?: boolean }> {
    if (component.adaptedFrom) {
        return { source: component.adaptedFrom };
    }
    if (!component.presentsAsAdapter) {
        return {};
    }

    const referentInfo = component.state.referentInfo;
    if (!referentInfo?.isResolved) {
        for (const varName of dependency.upstreamVariableNames) {
            await dependency.dependencyHandler.addBlocker({
                blockerComponentIdx: component.componentIdx,
                blockerType: "stateVariable",
                blockerStateVariable: "referentInfo",
                componentIdxBlocked: dependency.upstreamComponentIdx,
                typeBlocked: "recalculateDownstreamComponents",
                stateVariableBlocked: varName,
                dependencyBlocked: dependency.dependencyName,
            });

            await dependency.dependencyHandler.addBlocker({
                blockerComponentIdx: dependency.upstreamComponentIdx,
                blockerType: "recalculateDownstreamComponents",
                blockerStateVariable: varName,
                blockerDependency: dependency.dependencyName,
                componentIdxBlocked: dependency.upstreamComponentIdx,
                typeBlocked: "stateVariable",
                stateVariableBlocked: varName,
            });
        }
        return { blocked: true };
    }

    const info = await referentInfo.value;
    return {
        source: info
            ? dependency.dependencyHandler._components[info.componentIdx]
            : undefined,
    };
}

export class AdapterSourceStateVariableDependency extends Dependency {
    static dependencyType = "adapterSourceStateVariable";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        if (!this.definition.variableName) {
            throw Error(
                `Invalid state variable ${this.representativeStateVariable} of ${this.upstreamComponentIdx}, dependency ${this.dependencyName}: must have a variableName`,
            );
        } else {
            this.originalDownstreamVariableNames = [
                this.definition.variableName,
            ];
        }

        this.returnSingleVariableValue = true;

        // for adaptor source state variable
        // always make variables optional so that don't get error
        // depending on adaptor source (which a component can't control)
        this.variablesOptional = true;
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

        const { source, blocked } = await adapterSourceOf(this, component);

        if (blocked) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (!source) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [source.componentIdx],
            downstreamComponentTypes: [source.componentType],
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

export class AdapterSourceDependency extends Dependency {
    static dependencyType = "adapterSource";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
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

        this.returnSingleComponent = true;

        // for adaptor source state variable
        // always make variables optional so that don't get error
        // depending on adaptor source (which a component can't control)
        this.variablesOptional = true;
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

        const { source, blocked } = await adapterSourceOf(this, component);

        if (blocked) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (!source) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [source.componentIdx],
            downstreamComponentTypes: [source.componentType],
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
