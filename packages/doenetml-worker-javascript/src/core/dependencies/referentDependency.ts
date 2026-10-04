/**
 * The dependency through which a value reference (`_ref`, see
 * `components/abstract/ValueRef.js`) learns which state variable of which
 * component it reads. Part of Doenet/DoenetML#2128.
 */

import { Dependency } from "./Dependency";
import { arrayEntryNamesFromPropIndex } from "../StateVariableInitializer";
import { doenetMLStringForReference } from "../../utils/sourceLocation";
import {
    describeReferentVariable,
    type ReferentDescription,
} from "../../utils/referentDescription";

/**
 * A dependency that resolves one part of an unresolved path on a component
 * to the name of a state variable, the way `stateVariableFromUnresolvedPath`
 * does (case, aliases, public variables only, an array entry from an index,
 * `variableForIndexAsProp` for a bare index, and `variableForImplicitProp`
 * when there is no path), and reports the variable's name and description
 * instead of its value.
 *
 * It declares no downstream variable, so it is an identity dependency on the
 * component: a change of the variable's value does not re-run it, a deletion
 * of the component does, and a component created later under the index is
 * waited for. The definition reading it can therefore determine the
 * dependencies of other state variables from its value without those being
 * re-determined on every change of the value they read.
 *
 * The value is a `ReferentDescription` (`utils/referentDescription.ts`), or
 * `null` when the component is missing, has no such variable, or the
 * variable is a whole array.
 */
export class ReferentDependency extends Dependency {
    static dependencyType = "referent";

    componentIdx!: number;
    specifiedComponentName!: number;
    referentVariable?: string;

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }

        this.originalDownstreamVariableNames = [];
    }

    async determineDownstreamComponents() {
        const component = this.dependencyHandler._components[this.componentIdx];

        if (!component) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.componentIdx,
            );

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.referentVariable = await this.findReferentVariable(component);

        return {
            success: true,
            downstreamComponentIndices: [this.componentIdx],
            downstreamComponentTypes: [component.componentType],
        };
    }

    /**
     * The name of the state variable of `component` that the dependency's
     * `unresolvedPath` (or, with none, the implicit prop) designates, or
     * `undefined` when it designates nothing readable as one value.
     */
    async findReferentVariable(component: any): Promise<string | undefined> {
        const core = this.dependencyHandler.core;
        const unresolvedPath = this.definition.unresolvedPath;

        let name: string | undefined;
        let index: any[] = [];

        if (unresolvedPath == null) {
            name = component.constructor.variableForImplicitProp;
        } else {
            if (unresolvedPath.length !== 1) {
                // a path through a second prop is not one value
                return undefined;
            }
            ({ name, index } = unresolvedPath[0]);
            if (name === "") {
                name = component.constructor.variableForIndexAsProp;
            }
        }

        if (!name) {
            return undefined;
        }

        let [variableName] = core.publicCaseInsensitiveAliasSubstitutions({
            stateVariables: [name],
            componentClass: component.constructor,
        });

        if (variableName.startsWith("__not_public_")) {
            return undefined;
        }

        if (index.length > 0) {
            const propIndex = index.map((indexPart: any) =>
                Math.round(Number(indexPart.value[0])),
            );
            if (!propIndex.every(Number.isFinite)) {
                return undefined;
            }

            // The reference as the author wrote it, so a failure to apply
            // the index is reported in those terms (the upstream component
            // is the reference).
            const referringComponent =
                core._components[this.upstreamComponentIdx];
            const referenceText = doenetMLStringForReference(
                referringComponent?.refResolution?.originalPath,
                core.allDoenetMLs,
            );

            [variableName] = await arrayEntryNamesFromPropIndex({
                core,
                stateVariables: [variableName],
                component,
                propIndex,
                reference: referenceText
                    ? {
                          text: `$${referenceText}`,
                          position: referringComponent?.position,
                          sourceDoc: referringComponent?.sourceDoc,
                      }
                    : undefined,
            });
        }

        if (!component.state[variableName]) {
            if (
                !core.checkIfArrayEntry({
                    stateVariable: variableName,
                    component,
                }).isArrayEntry
            ) {
                return undefined;
            }
            await core.createFromArrayEntry({
                stateVariable: variableName,
                component,
            });
        }

        if (component.state[variableName].isArray) {
            // a whole array is not one value
            return undefined;
        }

        return variableName;
    }

    async getValue({ consumeChanges = true } = {}) {
        const changes: Record<string, any> = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.componentIdentitiesChanged = false;
            }
        }

        let value: ReferentDescription | null = null;

        if (
            this.referentVariable !== undefined &&
            this.downstreamComponentIndices.length === 1
        ) {
            value = describeReferentVariable(
                this.dependencyHandler._components[
                    this.downstreamComponentIndices[0]
                ],
                this.referentVariable,
            );
        }

        return { value, changes };
    }

    deleteFromUpdateTriggers() {
        if (this.specifiedComponentName !== undefined) {
            this.deleteUpdateTriggerForMissingComponent(
                this.specifiedComponentName,
            );
        }
    }
}
