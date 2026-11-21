import ConstraintComponent from "./abstract/ConstraintComponent";
import { findFiniteNumericalValue } from "../utils/math";

export default class AttractToGrid extends ConstraintComponent {
    static componentType = "attractToGrid";

    static componentDocs = {
        summary:
            "Attracts a graphical component's position to grid lines when nearby",
    };
    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.dx = {
            createComponentOfType: "number",
            createStateVariable: "dx",
            defaultValue: 1,
            public: true,
            description: "Horizontal grid spacing.",
        };
        attributes.dy = {
            createComponentOfType: "number",
            createStateVariable: "dy",
            defaultValue: 1,
            public: true,
            description: "Vertical grid spacing.",
        };
        attributes.dz = {
            createComponentOfType: "number",
            createStateVariable: "dz",
            defaultValue: 1,
            public: true,
            description: "Depth-wise grid spacing.",
        };
        attributes.xOffset = {
            createComponentOfType: "number",
            createStateVariable: "xOffset",
            defaultValue: 0,
            public: true,
            description: "Horizontal offset of the grid origin.",
        };
        attributes.yOffset = {
            createComponentOfType: "number",
            createStateVariable: "yOffset",
            defaultValue: 0,
            public: true,
            description: "Vertical offset of the grid origin.",
        };
        attributes.zOffset = {
            createComponentOfType: "number",
            createStateVariable: "zOffset",
            defaultValue: 0,
            public: true,
            description: "Depth-wise offset of the grid origin.",
        };
        attributes.xThreshold = {
            createComponentOfType: "number",
            createStateVariable: "xThreshold",
            defaultValue: 0.2,
            public: true,
            description:
                "Horizontal distance within which the position attracts to a grid line.",
        };
        attributes.yThreshold = {
            createComponentOfType: "number",
            createStateVariable: "yThreshold",
            defaultValue: 0.2,
            public: true,
            description:
                "Vertical distance within which the position attracts to a grid line.",
        };
        attributes.zThreshold = {
            createComponentOfType: "number",
            createStateVariable: "zThreshold",
            defaultValue: 0.2,
            public: true,
            description:
                "Depth-wise distance within which the position attracts to a grid line.",
        };
        attributes.includeGridlines = {
            createComponentOfType: "boolean",
            createStateVariable: "includeGridlines",
            defaultValue: false,
            public: true,
            description:
                "Whether to attract to entire grid lines (in addition to grid intersection points).",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.independentComponentConstraints = {
            returnDependencies: () => ({
                includeGridlines: {
                    dependencyType: "stateVariable",
                    variableName: "includeGridlines",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    independentComponentConstraints:
                        dependencyValues.includeGridlines,
                },
            }),
        };

        // Since state variable independentComponentConstraints may be true,
        // expect function applyComponentConstraint to be called with
        // a single component value as the object, for example,  {x1: 13}

        // use the convention of x1, x2, and x3 for variable names
        // so that components can call constraints generically for n-dimensions
        // use x,y,z for properties so that authors can use the more familar tag names
        stateVariableDefinitions.applyComponentConstraint = {
            returnDependencies: () => ({
                dx: {
                    dependencyType: "stateVariable",
                    variableName: "dx",
                },
                dy: {
                    dependencyType: "stateVariable",
                    variableName: "dy",
                },
                dz: {
                    dependencyType: "stateVariable",
                    variableName: "dz",
                },
                xOffset: {
                    dependencyType: "stateVariable",
                    variableName: "xOffset",
                },
                yOffset: {
                    dependencyType: "stateVariable",
                    variableName: "yOffset",
                },
                zOffset: {
                    dependencyType: "stateVariable",
                    variableName: "zOffset",
                },
                xThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "xThreshold",
                },
                yThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "yThreshold",
                },
                zThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "zThreshold",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    applyComponentConstraint: function (variables) {
                        // if given the value of x1, apply to constraint to x1
                        // and ignore any other arguments (which shouldn't be given)
                        if ("x1" in variables) {
                            let x1 = findFiniteNumericalValue(variables.x1);
                            // if found a non-numerical value, return no constraint
                            if (!Number.isFinite(x1)) {
                                return {};
                            }

                            let dx = dependencyValues.dx;
                            let xOffset = dependencyValues.xOffset;
                            let x1grid =
                                Math.round((x1 - xOffset) / dx) * dx + xOffset;

                            if (!Number.isFinite(x1grid)) {
                                return {};
                            }

                            if (
                                Math.abs(x1 - x1grid) <
                                dependencyValues.xThreshold
                            ) {
                                return {
                                    constrained: true,
                                    variables: { x1: x1grid },
                                };
                            } else {
                                return {};
                            }
                        }

                        // if given the value of x2, apply to constraint to x2
                        // and ignore any other arguments (which shouldn't be given)
                        if ("x2" in variables) {
                            let x2 = findFiniteNumericalValue(variables.x2);
                            // if found a non-numerical value, return no constraint
                            if (!Number.isFinite(x2)) {
                                return {};
                            }

                            let dy = dependencyValues.dy;
                            let yOffset = dependencyValues.yOffset;
                            let x2grid =
                                Math.round((x2 - yOffset) / dy) * dy + yOffset;
                            if (!Number.isFinite(x2grid)) {
                                return {};
                            }

                            if (
                                Math.abs(x2 - x2grid) <
                                dependencyValues.yThreshold
                            ) {
                                return {
                                    constrained: true,
                                    variables: { x2: x2grid },
                                };
                            } else {
                                return {};
                            }
                        }

                        // if given the value of x3, apply to constraint to x3
                        // and ignore any other arguments (which shouldn't be given)
                        if ("x3" in variables) {
                            let x3 = findFiniteNumericalValue(variables.x3);
                            // if found a non-numerical value, return no constraint
                            if (!Number.isFinite(x3)) {
                                return {};
                            }

                            let dz = dependencyValues.dz;
                            let zOffset = dependencyValues.zOffset;
                            let x3grid =
                                Math.round((x3 - zOffset) / dz) * dz + zOffset;
                            if (
                                Number.isFinite(x3grid) &&
                                Math.abs(x3 - x3grid) <
                                    dependencyValues.zThreshold
                            ) {
                                return {
                                    constrained: true,
                                    variables: { x3: x3grid },
                                };
                            } else {
                                return {};
                            }
                        }

                        // if didn't get x1, x2, or x3 as argument, don't constrain anything
                        return {};
                    },
                },
            }),
        };

        stateVariableDefinitions.applyConstraint = {
            returnDependencies: () => ({
                dx: {
                    dependencyType: "stateVariable",
                    variableName: "dx",
                },
                dy: {
                    dependencyType: "stateVariable",
                    variableName: "dy",
                },
                dz: {
                    dependencyType: "stateVariable",
                    variableName: "dz",
                },
                xOffset: {
                    dependencyType: "stateVariable",
                    variableName: "xOffset",
                },
                yOffset: {
                    dependencyType: "stateVariable",
                    variableName: "yOffset",
                },
                zOffset: {
                    dependencyType: "stateVariable",
                    variableName: "zOffset",
                },
                xThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "xThreshold",
                },
                yThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "yThreshold",
                },
                zThreshold: {
                    dependencyType: "stateVariable",
                    variableName: "zThreshold",
                },
                includeGridlines: {
                    dependencyType: "stateVariable",
                    variableName: "includeGridlines",
                },
                applyComponentConstraint: {
                    dependencyType: "stateVariable",
                    variableName: "applyComponentConstraint",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: {
                    applyConstraint: function (variables) {
                        let newVariables = {};
                        let constrained = false;

                        for (let varName in variables) {
                            let result =
                                dependencyValues.applyComponentConstraint({
                                    [varName]: variables[varName],
                                });
                            if (result.constrained) {
                                constrained = true;
                                newVariables[varName] =
                                    result.variables[varName];
                            }
                        }

                        if (!constrained) {
                            return {};
                        }

                        if (!dependencyValues.includeGridlines) {
                            // if didn't specify to include gridlines
                            // then don't constrain unless all variables were constrained
                            if (
                                variables.x1 !== undefined &&
                                newVariables.x1 === undefined
                            ) {
                                return {};
                            }
                            if (
                                variables.x2 !== undefined &&
                                newVariables.x2 === undefined
                            ) {
                                return {};
                            }
                            if (
                                variables.x3 !== undefined &&
                                newVariables.x3 === undefined
                            ) {
                                return {};
                            }
                        }

                        return {
                            constrained,
                            variables: newVariables,
                        };
                    },
                },
            }),
        };

        return stateVariableDefinitions;
    }
}
