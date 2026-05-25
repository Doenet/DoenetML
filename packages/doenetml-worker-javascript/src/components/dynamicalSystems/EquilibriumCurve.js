import Curve from "../Curve";

export default class EquilibriumCurve extends Curve {
    static componentType = "equilibriumCurve";
    static rendererType = "curve";

    static componentDocs = {
        summary:
            "An equilibrium curve of a dynamical system, rendered solid if stable or dashed if unstable",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // `stable` is the authoritative source for solid/dashed rendering, so
        // suppress the inherited lineStyle override to avoid a styleDefinition
        // value contradicting authored stability.
        delete attributes.lineStyle;

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
