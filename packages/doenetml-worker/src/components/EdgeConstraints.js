import { convertValueToMathExpression } from "@doenet/utils";
import BaseComponent from "./abstract/BaseComponent";
import {
    returnConstraintGraphInfoDefinitions,
    returnVertexConstraintFunctionFromEdges,
} from "../utils/constraints";

export default class EdgeConstraints extends BaseComponent {
    static componentType = "edgeConstraints";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "constraints",
                componentTypes: ["_segmentConstraint"],
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
                    variableNames: ["applyConstraint"],
                },
            }),
            definition({ dependencyValues }) {
                let constraintSub = function ({
                    unconstrainedEdges,
                    allowRotation,
                    enforceRigid,
                }) {
                    let constrainedEdges = [];
                    let constraintUsedForEdge = [];

                    for (let unconstrainedEdge of unconstrainedEdges) {
                        let constraintUsed = false;

                        let edge = [...unconstrainedEdge];

                        for (let constraintChild of dependencyValues.constraintChildren) {
                            let constraintResult =
                                constraintChild.stateValues.applyConstraint(
                                    edge,
                                    allowRotation,
                                    enforceRigid,
                                );

                            if (constraintResult.constrained) {
                                edge = constraintResult.segment.map((vertex) =>
                                    vertex.map((x) =>
                                        convertValueToMathExpression(x),
                                    ),
                                );

                                constraintUsed = true;
                            }
                        }

                        constrainedEdges.push(edge);
                        constraintUsedForEdge.push(constraintUsed);
                    }

                    return { constrainedEdges, constraintUsedForEdge };
                };

                let constraintFunction =
                    returnVertexConstraintFunctionFromEdges(constraintSub);

                return { setValue: { constraintFunction } };
            },
        };

        return stateVariableDefinitions;
    }
}
