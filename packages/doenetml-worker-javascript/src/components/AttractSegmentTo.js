import { attractSegment } from "../utils/constraintUtils";
import SegmentConstraintComponent from "./abstract/SegmentConstraintComponent";
import me from "math-expressions";

export default class AttractSegmentTo extends SegmentConstraintComponent {
    static componentType = "attractSegmentTo";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.relativeToGraphScales = {
            createComponentOfType: "boolean",
            createStateVariable: "relativeToGraphScales",
            defaultValue: false,
            public: true,
        };

        attributes.threshold = {
            createComponentOfType: "number",
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "graphical",
                componentTypes: ["_graphical"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.threshold = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            hasEssential: true,
            returnDependencies: () => ({
                thresholdAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "threshold",
                    variableNames: ["value"],
                },
                constraintsAncestor: {
                    dependencyType: "ancestor",
                    componentType: "_graphical",
                    variableNames: ["graphXmin"],
                },
                relativeToGraphScales: {
                    dependencyType: "stateVariable",
                    variableName: "relativeToGraphScales",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.thresholdAttr) {
                    return {
                        setValue: {
                            threshold:
                                dependencyValues.thresholdAttr.stateValues
                                    .value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            threshold: {
                                get defaultValue() {
                                    let useRelative =
                                        dependencyValues.relativeToGraphScales &&
                                        dependencyValues.constraintsAncestor !==
                                            null &&
                                        dependencyValues.constraintsAncestor
                                            .stateValues.graphXmin !== null;

                                    return useRelative ? 0.02 : 0.5;
                                },
                            },
                        },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.thresholdAttr) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "thresholdAttr",
                                desiredValue:
                                    desiredStateVariableValues.threshold,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "threshold",
                                value: desiredStateVariableValues.threshold,
                            },
                        ],
                    };
                }
            },
        };

        // nearestPointFunctions: normal nearestPoint functions that graphical component supply
        // nearestPointAsLineFunctions: use a nearestPointAsLine function if a component supplies it,
        // otherwise fall back to nearestPoint function
        stateVariableDefinitions.nearestPointFunctions = {
            additionalStateVariablesDefined: ["nearestPointAsLineFunctions"],
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                    variableNames: ["nearestPoint", "nearestPointAsLine"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let nearestPointFunctions = [];
                let nearestPointAsLineFunctions = [];
                let warnings = [];

                for (let child of dependencyValues.graphicalChildren) {
                    if (!child.stateValues.nearestPoint) {
                        warnings.push({
                            message: `Cannot attract to a <${child.componentType}> as it doesn't have a nearestPoint state variable.`,
                            level: 1,
                        });
                        continue;
                    }
                    nearestPointFunctions.push(child.stateValues.nearestPoint);

                    if (child.stateValues.nearestPointAsLine) {
                        nearestPointAsLineFunctions.push(
                            child.stateValues.nearestPointAsLine,
                        );
                    } else {
                        nearestPointAsLineFunctions.push(
                            child.stateValues.nearestPoint,
                        );
                    }
                }

                return {
                    setValue: {
                        nearestPointFunctions,
                        nearestPointAsLineFunctions,
                    },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.applyConstraint = {
            returnDependencies() {
                let dependencies = {
                    nearestPointFunctions: {
                        dependencyType: "stateVariable",
                        variableName: "nearestPointFunctions",
                    },
                    nearestPointAsLineFunctions: {
                        dependencyType: "stateVariable",
                        variableName: "nearestPointAsLineFunctions",
                    },
                    threshold: {
                        dependencyType: "stateVariable",
                        variableName: "threshold",
                    },
                    relativeToGraphScales: {
                        dependencyType: "stateVariable",
                        variableName: "relativeToGraphScales",
                    },
                    constraintsAncestor: {
                        dependencyType: "ancestor",
                        componentType: "_graphical",
                        variableNames: ["scales"],
                        variablesOptional: true,
                    },
                };

                return dependencies;
            },
            definition({ dependencyValues }) {
                let scales;

                if (dependencyValues.relativeToGraphScales) {
                    scales = dependencyValues.constraintsAncestor?.stateValues
                        .scales || [1, 1, 1];
                } else {
                    scales = [1, 1, 1];
                }

                let numericalNearestPointFunctions =
                    dependencyValues.nearestPointFunctions.map(
                        mapToNumericalNearestPointFunction,
                    );

                let numericalNearestPointAsLineFunctions =
                    dependencyValues.nearestPointAsLineFunctions.map(
                        mapToNumericalNearestPointFunction,
                    );

                return {
                    setValue: {
                        applyConstraint: function (segment, allowRotation) {
                            let threshold2 =
                                dependencyValues.threshold *
                                dependencyValues.threshold;

                            let result = attractSegment({
                                segment,
                                allowRotation,
                                scales,
                                threshold2,
                                numericalNearestPointFunctions,
                                numericalNearestPointAsLineFunctions,
                            });

                            return result;
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}

function mapToNumericalNearestPointFunction(nearestPointFunction) {
    return function (point, scales) {
        let variables = {};
        for (let ind = 0; ind < point.length; ind++) {
            let varName = "x" + (ind + 1);
            variables[varName] = me.fromAst(point[ind]);
        }

        let nearestPointAsVariables = nearestPointFunction({
            variables,
            scales,
        });

        if (nearestPointAsVariables === undefined) {
            return null;
        }

        let nearestPoint = [];
        for (let ind = 0; ind < point.length; ind++) {
            let varName = "x" + (ind + 1);
            if (nearestPointAsVariables[varName] === undefined) {
                break;
            }
            nearestPoint.push(nearestPointAsVariables[varName]);
        }
        if (nearestPoint.length !== point.length) {
            return null;
        }

        return nearestPoint;
    };
}
