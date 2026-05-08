import GraphicalComponent from "./abstract/GraphicalComponent";

export default class RegionHalfPlane extends GraphicalComponent {
    static componentType = "regionHalfPlane";

    static componentDocs = {
        summary: "A half-plane region bounded by a line.",
    };
    static rendererType = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.horizontal = {
            description:
                "Whether the half-plane is bounded by a horizontal line.",
            createComponentOfType: "boolean",
            createStateVariable: "horizontal",
            defaultValue: true,
            public: true,
        };

        attributes.boundaryValue = {
            description: "Value of the bounding line (e.g. y = boundaryValue).",
            createComponentOfType: "number",
            createStateVariable: "boundaryValue",
            defaultValue: 0,
            public: true,
        };

        attributes.greaterThan = {
            description:
                "Whether the region is the side where the inequality is greater than the boundary.",
            createComponentOfType: "boolean",
            createStateVariable: "greaterThan",
            defaultValue: true,
            public: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.nearestPoint = {
            returnDependencies: () => ({
                horizontal: {
                    dependencyType: "stateVariable",
                    variableName: "horizontal",
                },
                boundaryValue: {
                    dependencyType: "stateVariable",
                    variableName: "boundaryValue",
                },
                greaterThan: {
                    dependencyType: "stateVariable",
                    variableName: "greaterThan",
                },
            }),
            definition({ dependencyValues }) {
                let value = dependencyValues.boundaryValue;

                return {
                    setValue: {
                        nearestPoint: function ({ variables, scales }) {
                            if (!Number.isFinite(value)) {
                                return {};
                            }

                            if (dependencyValues.horizontal) {
                                if (dependencyValues.greaterThan) {
                                    if (variables.x1 < value) {
                                        let result = Object.assign(
                                            {},
                                            variables,
                                        );
                                        result.x1 = value;
                                        return result;
                                    } else {
                                        return {};
                                    }
                                } else {
                                    if (variables.x1 > value) {
                                        let result = Object.assign(
                                            {},
                                            variables,
                                        );
                                        result.x1 = value;
                                        return result;
                                    } else {
                                        return {};
                                    }
                                }
                            } else {
                                if (dependencyValues.greaterThan) {
                                    if (variables.x2 < value) {
                                        let result = Object.assign(
                                            {},
                                            variables,
                                        );
                                        result.x2 = value;
                                        return result;
                                    } else {
                                        return {};
                                    }
                                } else {
                                    if (variables.x2 > value) {
                                        let result = Object.assign(
                                            {},
                                            variables,
                                        );
                                        result.x2 = value;
                                        return result;
                                    } else {
                                        return {};
                                    }
                                }
                            }
                        },
                    },
                };
            },
        };

        return stateVariableDefinitions;
    }
}
