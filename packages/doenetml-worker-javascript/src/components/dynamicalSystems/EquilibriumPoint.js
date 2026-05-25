import Point from "../Point";
import { markerStyleValuesWithFillVariants } from "@doenet/utils";

export default class EquilibriumPoint extends Point {
    static componentType = "equilibriumPoint";
    static rendererType = "point";

    static componentDocs = {
        summary:
            "An equilibrium point of a dynamical system, rendered as a filled point if stable or open if unstable",
    };

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        // EquilibriumPoints render open/closed based on the `stable` attribute,
        // so the markerStyle picker hides shapes whose open/closed states would
        // be visually indistinguishable (cross, plus — no interior to fill).
        attributes.markerStyle = {
            ...attributes.markerStyle,
            validValues: markerStyleValuesWithFillVariants,
        };
        // `stable` is the authoritative fill toggle here. Drop the per-component
        // `markerFilled` attribute so authors can't write a confusing-but-inert
        // `<equilibriumPoint markerFilled="false">` on a point whose fill is
        // already controlled by `stable`. A styleDefinition can still populate
        // `selectedStyle.markerFilled` via inheritance — the point renderer
        // ignores it when SVs.open is defined (and `open` here derives from
        // `stable`).
        delete attributes.markerFilled;

        attributes.stable = {
            createComponentOfType: "boolean",
            createStateVariable: "stable",
            defaultValue: true,
            public: true,
            description:
                "Whether the equilibrium is stable (rendered filled) or unstable (rendered open).",
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

        stateVariableDefinitions.open = {
            forRenderer: true,
            returnDependencies: () => ({
                stable: {
                    dependencyType: "stateVariable",
                    variableName: "stable",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { open: !dependencyValues.stable },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "stable",
                            desiredValue: !desiredStateVariableValues.open,
                        },
                    ],
                };
            },
        };

        return stateVariableDefinitions;
    }

    async switchPoint({
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
