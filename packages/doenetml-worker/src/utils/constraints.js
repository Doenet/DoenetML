export function applyConstraintFromComponentConstraints(
    variables,
    applyComponentConstraint,
) {
    let newVariables = {};
    let constrained = false;

    for (let varName in variables) {
        let result = applyComponentConstraint({
            [varName]: variables[varName],
        });
        if (result.constrained) {
            constrained = true;
            newVariables[varName] = result.variables[varName];
        }
    }
    if (constrained) {
        return {
            constrained,
            variables: newVariables,
        };
    } else {
        return {};
    }
}

export function returnConstraintGraphInfoDefinitions() {
    return {
        scales: {
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
        },

        graphXmin: {
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
        },
    };
}
