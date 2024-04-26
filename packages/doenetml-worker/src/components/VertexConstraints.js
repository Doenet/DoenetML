import { convertValueToMathExpression } from "@doenet/utils";
import BaseComponent from "./abstract/BaseComponent";
import { applyConstraintFromComponentConstraints } from "../utils/constraints";
import me from "math-expressions";

export class VertexConstraints extends BaseComponent {
    static componentType = "vertexConstraints";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "constraints",
                componentTypes: ["_constraint"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.scales = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xscale", "yscale"],
                },
                shadowedConstraints: {
                    dependencyType: "shadowSource",
                    variableNames: ["scales"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.graphAncestor) {
                    let SVs = dependencyValues.graphAncestor.stateValues;
                    let scales = [SVs.xscale, SVs.yscale, 1];

                    if (scales.every((x) => Number.isFinite(x) && x > 0)) {
                        return { setValue: { scales } };
                    }
                } else if (dependencyValues.shadowedConstraints) {
                    // if we are shadowing a constraints and not in a graph
                    // use the scales from the shadow
                    // Rationale: if we copy a component to a location outside a graph
                    // (e.g. to display the coordinates of a point)
                    // we don't intend to remove the constraints imposed by the graph.
                    return {
                        setValue: {
                            scales: dependencyValues.shadowedConstraints
                                .stateValues.scales,
                        },
                    };
                }

                return { setValue: { scales: [1, 1, 1] } };
            },
        };

        stateVariableDefinitions.graphXmin = {
            additionalStateVariablesDefined: [
                "graphXmax",
                "graphYmin",
                "graphYmax",
            ],
            returnDependencies: () => ({
                graphAncestor: {
                    dependencyType: "ancestor",
                    componentType: "graph",
                    variableNames: ["xmin", "xmax", "ymin", "ymax"],
                },
                shadowedConstraints: {
                    dependencyType: "shadowSource",
                    variableNames: [
                        "graphXmin",
                        "graphXmax",
                        "graphYmin",
                        "graphYmax",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (!dependencyValues.graphAncestor) {
                    if (dependencyValues.shadowedConstraints) {
                        // if we are shadowing a constraints and not in a graph
                        // use the limits from the shadow
                        // Rationale: if we copy a component to a location outside a graph
                        // (e.g. to display the coordinates of a point)
                        // we don't intend to remove the constraints imposed by the graph.
                        let { graphXmin, graphXmax, graphYmin, graphYmax } =
                            dependencyValues.shadowedConstraints.stateValues;
                        return {
                            setValue: {
                                graphXmin,
                                graphXmax,
                                graphYmin,
                                graphYmax,
                            },
                        };
                    } else {
                        return {
                            setValue: {
                                graphXmin: null,
                                graphXmax: null,
                                graphYmin: null,
                                graphYmax: null,
                            },
                        };
                    }
                }

                let graphXmin = dependencyValues.graphAncestor.stateValues.xmin;
                let graphXmax = dependencyValues.graphAncestor.stateValues.xmax;
                let graphYmin = dependencyValues.graphAncestor.stateValues.ymin;
                let graphYmax = dependencyValues.graphAncestor.stateValues.ymax;

                if (
                    [graphXmin, graphXmax, graphYmin, graphYmax].every(
                        Number.isFinite,
                    )
                ) {
                    return {
                        setValue: {
                            graphXmin,
                            graphXmax,
                            graphYmin,
                            graphYmax,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            graphXmin: null,
                            graphXmax: null,
                            graphYmin: null,
                            graphYmax: null,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.constraintFunction = {
            returnDependencies: () => ({
                constraintChildren: {
                    dependencyType: "child",
                    childGroups: ["constraints"],
                    variableNames: [
                        "applyConstraint",
                        "applyComponentConstraint",
                    ],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                let constraintFunction = function (
                    unconstrainedVertices,
                    enforceRigid = true,
                ) {
                    let constrainedVertices = [];
                    let constraintUsedForVertex = [];

                    for (let unconstrainedVertex of unconstrainedVertices) {
                        // apply constraint to whole array (even if just one array key requested)
                        let variables = {};
                        let constraintUsed = false;

                        for (let ind in unconstrainedVertex) {
                            variables[`x${Number(ind) + 1}`] =
                                unconstrainedVertex[ind];
                        }

                        for (let constraintChild of dependencyValues.constraintChildren) {
                            let constraintResult;
                            if (constraintChild.stateValues.applyConstraint) {
                                constraintResult =
                                    constraintChild.stateValues.applyConstraint(
                                        variables,
                                    );
                            } else {
                                constraintResult =
                                    applyConstraintFromComponentConstraints(
                                        variables,
                                        constraintChild.stateValues
                                            .applyComponentConstraint,
                                    );
                            }

                            if (constraintResult.constrained) {
                                for (let varName in constraintResult.variables) {
                                    variables[varName] =
                                        convertValueToMathExpression(
                                            constraintResult.variables[varName],
                                        );
                                }
                                constraintUsed = true;
                            }
                        }

                        let constrainedVertex = [];
                        for (let ind in unconstrainedVertex) {
                            constrainedVertex.push(
                                variables[`x${Number(ind) + 1}`],
                            );
                        }
                        constrainedVertices.push(constrainedVertex);
                        constraintUsedForVertex.push(constraintUsed);
                    }

                    if (constraintUsedForVertex.every((v) => !v)) {
                        return unconstrainedVertices;
                    } else if (!enforceRigid) {
                        return constrainedVertices;
                    }

                    // since have constrained vertices, and we treat them as constraining
                    // the vertices as a whole,
                    // find the minimum deviation
                    // from an unconstrained vertex to the corresponding constrained vertex
                    // and add that deviation to all unconstrained vertices
                    // to be the new constrained vertices
                    let minDeviation = [];
                    let minDeviationMagnitude2 = Infinity;
                    for (let vertexInd in unconstrainedVertices) {
                        if (!constraintUsedForVertex[vertexInd]) {
                            continue;
                        }

                        let deviation = [];
                        let deviationMag2 = 0;

                        let unconstrainedVertex =
                            unconstrainedVertices[vertexInd];
                        let constrainedVertex = constrainedVertices[vertexInd];

                        for (let dim in unconstrainedVertex) {
                            let unconstrainedX =
                                unconstrainedVertex[dim].evaluate_to_constant();
                            let constrainedX =
                                constrainedVertex[dim].evaluate_to_constant();
                            let dx = constrainedX - unconstrainedX;
                            deviation.push(dx);
                            deviationMag2 += dx * dx;
                        }

                        if (deviationMag2 < minDeviationMagnitude2) {
                            minDeviationMagnitude2 = deviationMag2;
                            minDeviation = deviation;
                        }
                    }

                    if (minDeviationMagnitude2 > 0) {
                        // we had a non-zero deviation from the unconstrained,
                        // so move all vertices by that amount

                        return unconstrainedVertices.map(
                            (unconstrainedVertex) =>
                                unconstrainedVertex.map((v, i) =>
                                    me.fromAst(
                                        v.evaluate_to_constant() +
                                            minDeviation[i],
                                    ),
                                ),
                        );
                    } else {
                        // there were no deviations so just use the unconstrained vertices
                        return unconstrainedVertices;
                    }
                };

                return { setValue: { constraintFunction } };
            },
        };

        return stateVariableDefinitions;
    }
}
