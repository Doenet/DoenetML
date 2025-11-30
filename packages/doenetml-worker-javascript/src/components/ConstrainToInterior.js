import { findFiniteNumericalValue } from "../utils/math";
import ConstraintComponent from "./abstract/ConstraintComponent";

export default class ConstrainToInterior extends ConstraintComponent {
    static componentType = "constrainToInterior";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.relativeToGraphScales = {
            createComponentOfType: "boolean",
            createStateVariable: "relativeToGraphScales",
            defaultValue: false,
            public: true,
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

        stateVariableDefinitions.constraintFunctions = {
            returnDependencies: () => ({
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                    variableNames: ["nearestPoint", "containsPoint"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let constraintFunctions = [];
                let warnings = [];

                for (let child of dependencyValues.graphicalChildren) {
                    if (!child.stateValues.nearestPoint) {
                        warnings.push({
                            message: `Cannot constrain to interior of a <${child.componentType}> as it doesn't have a nearestPoint state variable.`,
                            level: 1,
                        });
                        continue;
                    }
                    let fs = { nearestPoint: child.stateValues.nearestPoint };
                    if (child.stateValues.containsPoint) {
                        fs.containsPoint = child.stateValues.containsPoint;
                    }
                    constraintFunctions.push(fs);
                }

                return {
                    setValue: { constraintFunctions },
                    sendWarnings: warnings,
                };
            },
        };

        stateVariableDefinitions.applyConstraint = {
            returnDependencies: () => ({
                constraintFunctions: {
                    dependencyType: "stateVariable",
                    variableName: "constraintFunctions",
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
            }),
            definition({ dependencyValues, componentIdx }) {
                let scales;

                if (dependencyValues.relativeToGraphScales) {
                    scales = dependencyValues.constraintsAncestor?.stateValues
                        .scales || [1, 1, 1];
                } else {
                    scales = [1, 1, 1];
                }

                return {
                    setValue: {
                        applyConstraint: function (variables) {
                            let closestDistance2 = Infinity;
                            let closestPoint = {};

                            let constrained = false;

                            let numericalVariables = {};
                            for (let varName in variables) {
                                numericalVariables[varName] =
                                    findFiniteNumericalValue(
                                        variables[varName],
                                    );
                            }

                            for (let constraintFunctionsForObject of dependencyValues.constraintFunctions) {
                                if (
                                    constraintFunctionsForObject.containsPoint
                                ) {
                                    if (
                                        numericalVariables.x1 !== undefined &&
                                        numericalVariables.x2 !== undefined
                                    ) {
                                        let pointInInterior =
                                            constraintFunctionsForObject.containsPoint(
                                                [
                                                    numericalVariables.x1,
                                                    numericalVariables.x2,
                                                ],
                                            );

                                        if (pointInInterior) {
                                            return {
                                                constrained: true,
                                                variables,
                                            };
                                        }
                                    }
                                }

                                let nearestPoint =
                                    constraintFunctionsForObject.nearestPoint({
                                        variables,
                                        scales,
                                    });

                                if (nearestPoint === undefined) {
                                    continue;
                                }

                                let constrainedVariables = {};
                                let distance2 = 0;

                                if (numericalVariables.x1 !== undefined) {
                                    if (nearestPoint.x1 === undefined) {
                                        continue;
                                    }
                                    constrainedVariables.x1 = nearestPoint.x1;
                                    distance2 += Math.pow(
                                        numericalVariables.x1 - nearestPoint.x1,
                                        2,
                                    );
                                }
                                if (numericalVariables.x2 !== undefined) {
                                    if (nearestPoint.x2 === undefined) {
                                        continue;
                                    }
                                    constrainedVariables.x2 = nearestPoint.x2;
                                    distance2 += Math.pow(
                                        numericalVariables.x2 - nearestPoint.x2,
                                        2,
                                    );
                                }
                                if (numericalVariables.x3 !== undefined) {
                                    if (nearestPoint.x3 === undefined) {
                                        continue;
                                    }
                                    constrainedVariables.x3 = nearestPoint.x3;
                                    distance2 += Math.pow(
                                        numericalVariables.x3 - nearestPoint.x3,
                                        2,
                                    );
                                }

                                if (distance2 < closestDistance2) {
                                    closestPoint = constrainedVariables;
                                    closestDistance2 = distance2;
                                    constrained = true;
                                }
                            }

                            if (!constrained) {
                                return {};
                            }

                            return { constrained, variables: closestPoint };
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
