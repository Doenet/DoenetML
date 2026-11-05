import { returnGraphicalStyleDescriptionDefinitions } from "@doenet/utils";
import GraphicalComponent from "./abstract/GraphicalComponent";

export default class RegionBetweenCurveXAxis extends GraphicalComponent {
    static componentType = "regionBetweenCurveXAxis";
    static styleOverrideCategories = ["fill"];

    static componentDocs = {
        summary: "A region bounded between a curve and the x-axis",
    };
    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.boundaryValues = {
            description:
                "Boundary values defining the region's left/right edges.",
            createComponentOfType: "numberList",
            createStateVariable: "boundaryValues",
            defaultValue: [0, 1],
            forRenderer: true,
            public: true,
        };

        attributes.function = {
            createComponentOfType: "function",
            description: "The function whose graph bounds the region.",
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnGraphicalStyleDescriptionDefinitions({
                kind: "region",
                noun: "region",
            }),
        );

        stateVariableDefinitions.function = {
            additionalStateVariablesDefined: [
                {
                    variableName: "haveFunction",
                    forRenderer: true,
                },
                {
                    variableName: "fDefinition",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                functionAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "function",
                    variableNames: [
                        "numericalfs",
                        "numInputs",
                        "numOutputs",
                        "fDefinition",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.functionAttr === null ||
                    dependencyValues.functionAttr.stateValues.numInputs !== 1 ||
                    dependencyValues.functionAttr.stateValues.numOutputs !== 1
                ) {
                    return {
                        setValue: {
                            function: () => NaN,
                            haveFunction: false,
                            fDefinition: {},
                        },
                    };
                }

                return {
                    setValue: {
                        function:
                            dependencyValues.functionAttr.stateValues
                                .numericalfs[0],
                        haveFunction: true,
                        fDefinition:
                            dependencyValues.functionAttr.stateValues
                                .fDefinition,
                    },
                };
            },
        };

        stateVariableDefinitions.nearestPoint = {
            returnDependencies: () => ({
                function: {
                    dependencyType: "stateVariable",
                    variableName: "function",
                },
                boundaryValues: {
                    dependencyType: "stateVariable",
                    variableName: "boundaryValues",
                },
                haveFunction: {
                    dependencyType: "stateVariable",
                    variableName: "haveFunction",
                },
            }),
            definition({ dependencyValues }) {
                // if don't have function, then don't return nearest point
                if (!dependencyValues.haveFunction) {
                    return { setValue: { nearestPoint: () => ({}) } };
                }
                const minx = Math.min(
                    dependencyValues.boundaryValues[0],
                    dependencyValues.boundaryValues[1],
                );
                const maxx = Math.max(
                    dependencyValues.boundaryValues[0],
                    dependencyValues.boundaryValues[1],
                );

                const f = dependencyValues.function;

                let nearestPoint = function ({ variables }) {
                    let x1 = variables.x1?.evaluate_to_constant();
                    let x2 = variables.x2?.evaluate_to_constant();

                    // A point with a non-numeric coordinate has no nearest
                    // point; leave it where it is. See the note on
                    // `<polygon>`'s `nearestPoint`: the clamping below read
                    // the engine's old `null` as `0` and silently snapped the
                    // point into the region instead of leaving it alone. The
                    // engine answers `NaN` now; the guard stays for the
                    // `Complex` arm.
                    if (!(Number.isFinite(x1) && Number.isFinite(x2))) {
                        return {};
                    }

                    x1 = Math.max(minx, Math.min(maxx, x1));

                    let [val1, val2] = [0, f(x1)].sort((a, b) => a - b);

                    x2 = Math.max(val1, Math.min(val2, x2));

                    return { x1, x2 };
                };

                return { setValue: { nearestPoint } };
            },
        };

        return stateVariableDefinitions;
    }
}
