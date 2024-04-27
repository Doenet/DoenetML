import me from "math-expressions";

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

export function returnStickyGroupDefinitions() {
    return {
        inStickyGroup: {
            returnDependencies: () => ({
                stickyParent: {
                    dependencyType: "parentIdentity",
                    parentComponentType: "stickyGroup",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        inStickyGroup: Boolean(dependencyValues.stickyParent),
                    },
                };
            },
        },
        stickyVerticesConstraintFunction: {
            returnDependencies: () => ({
                verticesConstraintFunction: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "stickyGroup",
                    variableName: "verticesConstraintFunction",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        stickyVerticesConstraintFunction:
                            dependencyValues.verticesConstraintFunction,
                    },
                };
            },
        },
        stickyPointConstraintFunction: {
            returnDependencies: () => ({
                pointConstraintFunction: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "stickyGroup",
                    variableName: "pointConstraintFunction",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        stickyPointConstraintFunction:
                            dependencyValues.pointConstraintFunction,
                    },
                };
            },
        },
        stickyObjectIndex: {
            returnDependencies: () => ({
                countAmongSiblings: {
                    dependencyType: "countAmongSiblings",
                    componentType: "_graphical",
                    includeInheritedComponentTypes: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        stickyObjectIndex:
                            dependencyValues.countAmongSiblings - 1,
                    },
                };
            },
        },
    };
}

// Create a vertex constraint function that applies the origin constraintFunction
// to the vertices and optionally find the best rigid translation is closest to the constraint.
//
// If enforceRigid is true, then after evaluation constraintFunction,
// it attempts to find translations that, if applying constraintFunction again,
// maximizes the number of vertices that are constrained but don't move
export function returnVertexConstraintFunction(constraintFunction) {
    return function (unconstrainedVertices, enforceRigid, ...args) {
        let { constrainedVertices, constraintUsedForVertex } =
            constraintFunction(unconstrainedVertices, ...args);

        if (constraintUsedForVertex.every((v) => !v)) {
            return unconstrainedVertices;
        } else if (!enforceRigid) {
            return constrainedVertices;
        }

        // Since have constrained vertices and we keep the shape rigid,
        // we look for a translation that "best" satisfies the constraints.
        // For each vertex that was constrained,
        // we translate all vertices to make that vertex's constraint,
        // apply the constraint again, and count how many vertices were both
        // constrained and did not move.
        // We pick the translation that maximizes this count.
        // To break ties, we pick the minimum translation.

        let translationResults = [];

        let numericalUnconstrainedVertices = unconstrainedVertices.map(
            (vertex) => vertex.map((v) => v.evaluate_to_constant()),
        );

        let maxConstrainedUnmoved = 0;

        for (let vertexInd in unconstrainedVertices) {
            if (!constraintUsedForVertex[vertexInd]) {
                continue;
            }

            let translation = [];

            let numericalUnconstrainedVertex =
                numericalUnconstrainedVertices[vertexInd];
            let constrainedVertex = constrainedVertices[vertexInd];

            for (let dim in numericalUnconstrainedVertex) {
                let numericalUnconstrainedX = numericalUnconstrainedVertex[dim];
                let constrainedX =
                    constrainedVertex[dim].evaluate_to_constant();
                let dx = constrainedX - numericalUnconstrainedX;
                translation.push(dx);
            }

            let translatedVertices = numericalUnconstrainedVertices.map(
                (numericalUnconstrainedVertex) =>
                    numericalUnconstrainedVertex.map((v, i) =>
                        me.fromAst(v + translation[i]),
                    ),
            );

            // try constraining from the translation
            let {
                constrainedVertices: newVertices,
                constraintUsedForVertex: newConstraintsUsed,
            } = constraintFunction(translatedVertices, ...args);

            let numVerticesConstrainedUnmoved = 0;

            for (let vertexInd2 in translatedVertices) {
                if (!newConstraintsUsed[vertexInd2]) {
                    continue;
                }

                // TODO: make a relative threshold?
                let threshold = 1e-6;

                // vertex was constrained, check if each component didn't move more than the threshold
                let moved = false;
                let translatedVertex = translatedVertices[vertexInd2];
                let newVertex = newVertices[vertexInd2];

                for (let dim in numericalUnconstrainedVertex) {
                    let translatedVertexX =
                        translatedVertex[dim].evaluate_to_constant();
                    let newX = newVertex[dim].evaluate_to_constant();
                    let dx = newX - translatedVertexX;

                    if (Math.abs(dx) > threshold) {
                        moved = true;
                        break;
                    }
                }

                if (!moved) {
                    numVerticesConstrainedUnmoved++;
                }
            }

            if (numVerticesConstrainedUnmoved > maxConstrainedUnmoved) {
                // reset the translation results as we found a better option
                translationResults = [
                    {
                        translation,
                        vertexInd,
                    },
                ];
                maxConstrainedUnmoved = numVerticesConstrainedUnmoved;
            } else if (numVerticesConstrainedUnmoved == maxConstrainedUnmoved) {
                translationResults.push({
                    translation,
                    vertexInd,
                });
            }
        }

        if (translationResults.length === 1) {
            // we found the unique best choice
            let translation = translationResults[0].translation;
            return numericalUnconstrainedVertices.map((unconstrainedVertex) =>
                unconstrainedVertex.map((v, i) =>
                    me.fromAst(v + translation[i]),
                ),
            );
        }

        // Have multiple best choices.
        // Break tie by finding the minimum translation.
        let minTranslation = [];
        let minTranslationMagnitude2 = Infinity;
        for (result of translationResults) {
            let translation = result.translation;
            let translationMag2 = translation.reduce((a, c) => a + c * c, 0);

            if (translationMag2 < minTranslationMagnitude2) {
                minTranslationMagnitude2 = translationMag2;
                minTranslation = translation;
            }
        }

        if (minTranslationMagnitude2 > 0) {
            // we had a non-zero deviation from the unconstrained,
            // so move all vertices by that amount

            return numericalUnconstrainedVertices.map((unconstrainedVertex) =>
                unconstrainedVertex.map((v, i) =>
                    me.fromAst(v + minTranslation[i]),
                ),
            );
        } else {
            // there were no deviations so just use the unconstrained vertices
            return unconstrainedVertices;
        }
    };
}
