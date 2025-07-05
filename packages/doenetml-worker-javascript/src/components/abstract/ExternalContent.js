import CompositeComponent from "./CompositeComponent";
import { deepClone } from "@doenet/utils";
export default class ExternalContent extends CompositeComponent {
    static componentType = "_externalContent";

    static includeBlankStringChildren = true;

    static serializeReplacementsForChildren = true;
    static replacementsAlreadyInResolver = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static useSerializedChildrenComponentIndices = true;
    static addExtraSerializedChildrenWhenShadowing = true;

    static resolveToParent = true;

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.doenetMLSource = {
            createPrimitiveOfType: "string",
        };
        attributes.forType = {
            createPrimitiveOfType: "string",
        };

        return attributes;
    }

    // don't need child groups
    // as all children will remain serialized

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.serializedChildren = {
            returnDependencies: () => ({
                serializedChildren: {
                    dependencyType: "serializedChildren",
                    doNotProxy: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        serializedChildren: dependencyValues.serializedChildren,
                    },
                };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({}),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({ component, nComponents }) {
        let errors = [];
        let warnings = [];

        let replacements = deepClone(
            await component.state.serializedChildren.value,
        );

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    get allPotentialRendererTypes() {
        let allPotentialRendererTypes = super.allPotentialRendererTypes;

        let additionalRendererTypes =
            this.potentialRendererTypesFromSerializedComponents(
                this.serializedChildren,
            );
        for (let rendererType of additionalRendererTypes) {
            if (!allPotentialRendererTypes.includes(rendererType)) {
                allPotentialRendererTypes.push(rendererType);
            }
        }

        return allPotentialRendererTypes;
    }
}
