import Curve from "../Curve";

export default class EquilibriumCurve extends Curve {
    static componentType = "equilibriumCurve";
    static rendererType = "curve";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.stable = {
            createComponentOfType: "boolean",
            createStateVariable: "stable",
            defaultValue: true,
            public: true,
        };

        attributes.switchable = {
            createComponentOfType: "boolean",
            createStateVariable: "switchable",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions(numerics) {
        let stateVariableDefinitions = super.returnStateVariableDefinitions(
            numerics,
        );

        stateVariableDefinitions.dashed = {
            forRenderer: true,
            returnDependencies: () => ({
                stable: {
                    dependencyType: "stateVariable",
                    variableName: "stable",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { dashed: !dependencyValues.stable },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "stable",
                            desiredValue: !desiredStateVariableValues.dashed,
                        },
                    ],
                };
            },
        };

        return stateVariableDefinitions;
    }

    async switchCurve({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (await this.stateValues.switchable) {
            return await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "stable",
                        value: !this.stateValues.stable,
                    },
                ],
                actionId,
                sourceInformation,
                skipRendererUpdate,
                event: {
                    verb: "interacted",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                    result: {
                        stable: !this.stateValues.stable,
                    },
                },
            });
        }
    }
}
