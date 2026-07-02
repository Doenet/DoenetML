/**
 * Dependency subclasses backed by data lifted off a single component
 * (doenet attributes, extension target, primitive attribute values).
 * All three reuse `StateVariableDependency`'s downstream-component
 * machinery; only the `getValue` payload differs.
 */

import { StateVariableDependency } from "./stateVariableDependencies";

export class DoenetAttributeDependency extends StateVariableDependency {
    static dependencyType = "doenetAttribute";

    setUpParameters() {
        this.attributeName = this.definition.attributeName;

        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
    }

    async getValue({ consumeChanges = true }: any = {}) {
        let value = null;
        let changes: any = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.componentIdentitiesChanged = false;
            }
        }

        if (this.downstreamComponentIndices.length === 1) {
            let depComponent =
                this.dependencyHandler.components[
                    this.downstreamComponentIndices[0]
                ];

            value = depComponent.doenetAttributes[this.attributeName];
        }

        // if (!this.doNotProxy && value !== null && typeof value === 'object') {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes };
    }
}

// TODO: added this dependency but then didn't use it.
// Delete if don't end up using it.
export class ExtendingDependency extends StateVariableDependency {
    static dependencyType = "extending";

    setUpParameters() {
        if (this.definition.componentIdx != undefined) {
            this.componentIdx = this.definition.componentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
    }

    async getValue({ consumeChanges = true }: any = {}) {
        let value = null;
        let changes: any = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.componentIdentitiesChanged = false;
            }
        }

        if (this.downstreamComponentIndices.length === 1) {
            let depComponent =
                this.dependencyHandler.components[
                    this.downstreamComponentIndices[0]
                ];

            value = depComponent.extending;
        }

        return { value, changes };
    }
}

export class AttributePrimitiveDependency extends StateVariableDependency {
    static dependencyType = "attributePrimitive";

    setUpParameters() {
        this.attributeName = this.definition.attributeName;

        if (this.definition.parentIdx != undefined) {
            this.componentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.componentIdx;
        } else {
            this.componentIdx = this.upstreamComponentIdx;
        }
    }

    async getValue({ consumeChanges = true }: any = {}) {
        let value = null;
        let changes: any = {};

        if (this.componentIdentitiesChanged) {
            changes.componentIdentitiesChanged = true;
            if (consumeChanges) {
                this.componentIdentitiesChanged = false;
            }
        }

        if (this.downstreamComponentIndices.length === 1) {
            let parent = this.dependencyHandler.components[this.componentIdx];

            if (parent) {
                value = parent.attributes[this.attributeName];
                if (value && value.type === "primitive") {
                    value = value.primitive.value;
                } else {
                    value = null;
                }
            }
        }

        // if (!this.doNotProxy && value !== null && typeof value === 'object') {
        //   value = new Proxy(value, readOnlyProxyHandler)
        // }

        return { value, changes };
    }
}
