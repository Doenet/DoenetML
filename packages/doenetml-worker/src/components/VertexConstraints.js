import { convertValueToMathExpression } from "@doenet/utils";
import BaseComponent from "./abstract/BaseComponent";
import {
    applyConstraintFromComponentConstraints,
    returnConstraintGraphInfoDefinitions,
    returnVertexConstraintFunction,
} from "../utils/constraints";

export default class VertexConstraints extends BaseComponent {
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

        Object.assign(
            stateVariableDefinitions,
            returnConstraintGraphInfoDefinitions(),
        );

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
                let constraintSub = function (unconstrainedVertices) {
                    let constrainedVertices = [];
                    let constraintUsedForVertex = [];

                    for (let unconstrainedVertex of unconstrainedVertices) {
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

                    return { constrainedVertices, constraintUsedForVertex };
                };

                let constraintFunction =
                    returnVertexConstraintFunction(constraintSub);

                return { setValue: { constraintFunction } };
            },
        };

        return stateVariableDefinitions;
    }
}
