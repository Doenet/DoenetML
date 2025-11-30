import ConstraintComponent from "./abstract/ConstraintComponent";
import { findFiniteNumericalValue } from "../utils/math";

export default class ConstrainToGraph extends ConstraintComponent {
    static componentType = "constrainToGraph";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.buffer = {
            createComponentOfType: "number",
            createStateVariable: "buffer",
            defaultValue: 0.01,
            public: true,
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.independentComponentConstraints = {
            returnDependencies: () => ({}),
            definition: () => ({
                setValue: { independentComponentConstraints: true },
            }),
        };

        // Since state variable independentComponentConstraints is true,
        // expect function applyComponentConstraint to be called with
        // a single component value as the object, for example,  {x1: 13}

        // use the convention of x1, x2, and x3 for variable names
        // so that components can call constraints generically for n-dimensions
        // use x,y,z for properties so that authors can use the more familiar tag names

        stateVariableDefinitions.applyComponentConstraint = {
            returnDependencies: () => ({
                constraintAncestor: {
                    dependencyType: "ancestor",
                    componentType: "_graphical",
                    variableNames: [
                        "graphXmin",
                        "graphXmax",
                        "graphYmin",
                        "graphYmax",
                    ],
                    variablesOptional: true,
                },
                buffer: {
                    dependencyType: "stateVariable",
                    variableName: "buffer",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    applyComponentConstraint: function (variables) {
                        if (
                            dependencyValues.constraintAncestor === null ||
                            dependencyValues.constraintAncestor.stateValues
                                .graphXmin === null
                        ) {
                            return {};
                        }

                        // if given the value of x1, apply to constraint to x1
                        // and ignore any other arguments (which shouldn't be given)
                        if ("x1" in variables) {
                            let x1 = findFiniteNumericalValue(variables.x1);

                            // if found a non-numerical value, return no constraint
                            if (!Number.isFinite(x1)) {
                                return {};
                            }

                            let xMin =
                                dependencyValues.constraintAncestor.stateValues
                                    .graphXmin;
                            let xMax =
                                dependencyValues.constraintAncestor.stateValues
                                    .graphXmax;

                            if (
                                !(
                                    Number.isFinite(xMin) &&
                                    Number.isFinite(xMax)
                                )
                            ) {
                                return {};
                            }

                            let lowerBound = xMin;
                            let upperBound = xMax;
                            let buffer = dependencyValues.buffer;
                            if (buffer > 0) {
                                let bufferAdjust = buffer * (xMax - xMin);
                                lowerBound += bufferAdjust;
                                upperBound -= bufferAdjust;
                            }

                            let x1constrained = Math.max(
                                lowerBound,
                                Math.min(upperBound, x1),
                            );
                            return {
                                constrained: true,
                                variables: { x1: x1constrained },
                            };
                        }

                        // if given the value of x2, apply to constraint to x2
                        // and ignore any other arguments (which shouldn't be given)
                        if ("x2" in variables) {
                            let x2 = findFiniteNumericalValue(variables.x2);
                            // if found a non-numerical value, return no constraint
                            if (!Number.isFinite(x2)) {
                                return {};
                            }

                            let yMin =
                                dependencyValues.constraintAncestor.stateValues
                                    .graphYmin;
                            let yMax =
                                dependencyValues.constraintAncestor.stateValues
                                    .graphYmax;

                            if (
                                !(
                                    Number.isFinite(yMin) &&
                                    Number.isFinite(yMax)
                                )
                            ) {
                                return {};
                            }

                            let lowerBound = yMin;
                            let upperBound = yMax;
                            let buffer = dependencyValues.buffer;
                            if (buffer > 0) {
                                let bufferAdjust = buffer * (yMax - yMin);
                                lowerBound += bufferAdjust;
                                upperBound -= bufferAdjust;
                            }

                            let x2constrained = Math.max(
                                lowerBound,
                                Math.min(upperBound, x2),
                            );
                            return {
                                constrained: true,
                                variables: { x2: x2constrained },
                            };
                        }

                        // if didn't get x1, or x2 as argument, don't constrain anything
                        return {};
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}
