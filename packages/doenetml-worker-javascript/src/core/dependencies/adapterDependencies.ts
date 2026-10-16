/**
 * Dependency subclasses that follow the adapter chain — the upstream
 * component's `adaptedFrom` link, optionally reading state from that
 * source.
 */

import { Dependency } from "./Dependency";
import { referentVariableName } from "../../utils/valueReference";

/**
 * Where a dependency of `component` that asks about its adapter's source
 * reads from.
 *
 * A component an adapter made reads the component it was adapted from. A
 * value reference (`_ref`) that presents as an adapter's type has no adapter
 * component; the referent it reads is what the adapter would have been made
 * from, and the reference knows it (`referentInfo`) and follows it. The
 * dependency then reads the reference itself rather than reaching past it
 * to the referent: `referentInfo` for the source's identity, and for a
 * variable of the source the variable the reference makes on demand under
 * `referentVariableName`, which reads the referent's variable as it is
 * there (`ValueRef.createOnDemandStateVariableDefinitions`). Those are
 * determined by `referentInfo` and name the referent, so the dependency
 * keeps up when the reference retargets and when its referent is deleted
 * and remade; a dependency on the referent directly would be left with
 * nothing downstream, since it names the reference and the deletion only
 * re-registers dependencies that name the deleted component.
 *
 * `undefined` for a component that is neither adapted nor such a reference.
 */
function adapterSourceOf(
    component: any,
): { source: any; isReference: boolean } | undefined {
    if (component.adaptedFrom) {
        return { source: component.adaptedFrom, isReference: false };
    }
    if (component.presentsAsAdapter) {
        return { source: component, isReference: true };
    }
    return undefined;
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

        const adapterSource = adapterSourceOf(component);

        if (!adapterSource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        // The variable is the source's own on an adapted component, and the
        // one a reference exposes it under
        this.originalDownstreamVariableNames = [
            adapterSource.isReference
                ? referentVariableName(this.definition.variableName)
                : this.definition.variableName,
        ];

        return {
            success: true,
            downstreamComponentIndices: [adapterSource.source.componentIdx],
            downstreamComponentTypes: [adapterSource.source.componentType],
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

    /**
     * Set when the component is a value reference, whose source is read off
     * its `referentInfo` (see `adapterSourceOf`).
     */
    readsReference = false;

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

        const adapterSource = adapterSourceOf(component);

        if (!adapterSource) {
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        const variableNames: string[] = this.definition.variableNames ?? [];
        this.readsReference = adapterSource.isReference;
        this.originalDownstreamVariableNames = this.readsReference
            ? ["referentInfo", ...variableNames.map(referentVariableName)]
            : variableNames;

        return {
            success: true,
            downstreamComponentIndices: [adapterSource.source.componentIdx],
            downstreamComponentTypes: [adapterSource.source.componentType],
        };
    }

    async getValue(args?: any) {
        const result = await super.getValue(args);
        if (!this.readsReference || !result.value) {
            return result;
        }

        // Present the referent as the source, with the variables asked for
        // under their own names
        const { referentInfo, ...exposed } = result.value.stateValues ?? {};
        if (!referentInfo) {
            result.value = null;
            return result;
        }
        const value: Record<string, any> = {
            componentIdx: referentInfo.componentIdx,
            componentType: referentInfo.componentType,
        };
        if (this.definition.variableNames) {
            value.stateValues = {};
            for (const variableName of this.definition.variableNames) {
                value.stateValues[variableName] =
                    exposed[referentVariableName(variableName)];
            }
        }
        result.value = value;
        return result;
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
