import BaseComponent from "./abstract/BaseComponent";

export default class Case extends BaseComponent {
    static componentType = "case";
    static rendererType = undefined;

    static inSchemaOnlyInheritAs = [];
    static allowInSchemaAsComponent = undefined;
    static includeBlankStringChildren = true;

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    // since don't have child groups, tell schema about children here
    static additionalSchemaChildren = ["_base"];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.condition = {
            createComponentOfType: "boolean",
        };

        return attributes;
    }

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

        stateVariableDefinitions.conditionSatisfied = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                condition: {
                    dependencyType: "attributeComponent",
                    attributeName: "condition",
                    variableNames: ["value"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let conditionSatisfied;
                if (dependencyValues.condition === null) {
                    conditionSatisfied = true;
                } else {
                    conditionSatisfied =
                        dependencyValues.condition.stateValues.value;
                }

                return { setValue: { conditionSatisfied } };
            },
        };

        return stateVariableDefinitions;
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
