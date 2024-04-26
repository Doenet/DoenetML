import { convertValueToMathExpression } from "@doenet/utils";
import BaseComponent from "./abstract/BaseComponent";
import {
    applyConstraintFromComponentConstraints,
    returnConstraintGraphInfoDefinitions,
} from "../utils/constraints";
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

        let graphInfoDefinitions = returnConstraintGraphInfoDefinitions();

        Object.assign(stateVariableDefinitions, graphInfoDefinitions);

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
