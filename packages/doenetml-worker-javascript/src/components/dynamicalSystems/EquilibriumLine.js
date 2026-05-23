import Line from "../Line";

export default class EquilibriumLine extends Line {
    static componentType = "equilibriumLine";
    static rendererType = "line";

    static componentDocs = {
        summary:
            "An equilibrium line of a dynamical system, rendered solid if stable or dashed if unstable",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.stable = {
            createComponentOfType: "boolean",
            createStateVariable: "stable",
            defaultValue: true,
            public: true,
            description:
                "Whether the equilibrium is stable (rendered solid) or unstable (rendered dashed).",
        };

        attributes.switchable = {
            createComponentOfType: "boolean",
            createStateVariable: "switchable",
            defaultValue: false,
            public: true,
            forRenderer: true,
            description:
                "Whether the user can toggle the stability of this equilibrium by clicking it.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

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

    async switchLine({
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
