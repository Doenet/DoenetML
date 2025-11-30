import { convertValueToMathExpression } from "@doenet/utils";
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
                    variableNames: ["xMin", "xMax", "yMin", "yMax"],
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

                let graphXmin = dependencyValues.graphAncestor.stateValues.xMin;
                let graphXmax = dependencyValues.graphAncestor.stateValues.xMax;
                let graphYmin = dependencyValues.graphAncestor.stateValues.yMin;
                let graphYmax = dependencyValues.graphAncestor.stateValues.yMax;

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

export function returnConstraintDefinitions(
    arrayVariableForConstraints,
    arrayEntryPrefixForConstraints,
) {
    let stateVariableDefinitions = returnConstraintGraphInfoDefinitions();

    stateVariableDefinitions.independentComponentConstraints = {
        returnDependencies: () => ({
            constraintChildren: {
                dependencyType: "child",
                childGroups: ["constraints"],
                variableNames: ["independentComponentConstraints"],
            },
        }),
        definition: ({ dependencyValues }) => ({
            setValue: {
                independentComponentConstraints:
                    dependencyValues.constraintChildren.every(
                        (x) => x.stateValues.independentComponentConstraints,
                    ),
            },
        }),
    };

    stateVariableDefinitions.constraintResults = {
        additionalStateVariablesDefined: [
            {
                variableName: "constraintUsedByComponent",
                isArray: true,
                entryPrefixes: ["constraintUsedByComponent"],
            },
        ],
        isArray: true,
        entryPrefixes: ["constraintResult"],
        stateVariablesDeterminingDependencies: [
            "independentComponentConstraints",
        ],
        returnArraySizeDependencies: () => ({
            numDimensions: {
                dependencyType: "stateVariable",
                variableName: "numDimensionsForConstraints",
            },
        }),
        returnArraySize({ dependencyValues }) {
            return [dependencyValues.numDimensions];
        },
        returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
            // console.log(`return array dependencies of constraintResults`)
            // console.log(JSON.parse(JSON.stringify(arrayKeys)))
            // console.log(JSON.parse(JSON.stringify(stateValues)))

            let globalDependencies = {
                constraintChildren: {
                    dependencyType: "child",
                    childGroups: ["constraints"],
                    variableNames: [
                        "applyConstraint",
                        "applyComponentConstraint",
                    ],
                    variablesOptional: true,
                },
                independentComponentConstraints: {
                    dependencyType: "stateVariable",
                    variableName: "independentComponentConstraints",
                },
            };

            let arrayEntryPrefix = arrayEntryPrefixForConstraints;

            let dependenciesByKey = {};
            if (stateValues.independentComponentConstraints) {
                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        x: {
                            dependencyType: "stateVariable",
                            variableName:
                                arrayEntryPrefix + (Number(arrayKey) + 1),
                        },
                    };
                }
            } else {
                globalDependencies.xs = {
                    dependencyType: "stateVariable",
                    variableName: arrayVariableForConstraints,
                };
            }

            return { globalDependencies, dependenciesByKey };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            dependencyValuesByKey,
            arrayKeys,
        }) {
            // console.log("array constraintResult definition")
            // console.log(globalDependencyValues);
            // console.log(dependencyValuesByKey);
            // console.log(arrayKeys)

            if (globalDependencyValues.independentComponentConstraints) {
                let constraintResults = {};
                let constraintUsedByComponent = {};
                for (let arrayKey of arrayKeys) {
                    let varEnding = Number(arrayKey) + 1;
                    let variables = {
                        ["x" + varEnding]: dependencyValuesByKey[arrayKey].x,
                    };
                    let constraintUsed = false;

                    for (let constraintChild of globalDependencyValues.constraintChildren) {
                        let result =
                            constraintChild.stateValues.applyComponentConstraint(
                                variables,
                            );

                        if (result.constrained) {
                            variables["x" + varEnding] =
                                convertValueToMathExpression(
                                    result.variables["x" + varEnding],
                                );
                            constraintUsed = true;
                        }
                    }

                    constraintResults[arrayKey] = variables["x" + varEnding];
                    constraintUsedByComponent[arrayKey] = constraintUsed;
                }

                return {
                    setValue: {
                        constraintResults,
                        constraintUsedByComponent,
                    },
                };
            } else {
                // apply constraint to whole array (even if just one array key requested)
                let variables = {};
                let constraintUsed = false;

                for (let arrayKey in globalDependencyValues.xs) {
                    variables[`x${Number(arrayKey) + 1}`] =
                        globalDependencyValues.xs[arrayKey];
                }

                for (let constraintChild of globalDependencyValues.constraintChildren) {
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
                            variables[varName] = convertValueToMathExpression(
                                constraintResult.variables[varName],
                            );
                        }
                        constraintUsed = true;
                    }
                }

                let constraintResults = {};
                let constraintUsedByComponent = {};

                for (let arrayKey in globalDependencyValues.xs) {
                    constraintResults[arrayKey] =
                        variables[`x${Number(arrayKey) + 1}`];
                    constraintUsedByComponent[arrayKey] = constraintUsed;
                }

                return {
                    setValue: {
                        constraintResults,
                        constraintUsedByComponent,
                    },
                };
            }
        },

        inverseArrayDefinitionByKey: async function ({
            desiredStateVariableValues,
            globalDependencyValues,
            dependencyValuesByKey,
            dependencyNamesByKey,
            stateValues,
            workspace,
        }) {
            // console.log('inverse definition of constraints')
            // console.log(desiredStateVariableValues);
            // console.log(globalDependencyValues)
            // console.log(stateValues)

            // Note: the idea is that we want the constrain applied even in the reverse direction
            // so that downstream variables will see the effect of the constraint

            // To accomplish this, we send the unconstrained value in desiredStateVariableValues.constrainResult
            // and will send the constraint result to the xs (or xs arrayKey) dependency

            if (globalDependencyValues.independentComponentConstraints) {
                // we applied constraint to each component separately

                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.constraintResults) {
                    let varEnding = Number(arrayKey) + 1;

                    let variables = {
                        ["x" + varEnding]: convertValueToMathExpression(
                            desiredStateVariableValues.constraintResults[
                                arrayKey
                            ],
                        ),
                    };

                    for (let constraintChild of globalDependencyValues.constraintChildren) {
                        let result =
                            constraintChild.stateValues.applyComponentConstraint(
                                variables,
                            );

                        if (result.constrained) {
                            variables["x" + varEnding] =
                                convertValueToMathExpression(
                                    result.variables["x" + varEnding],
                                );
                        }
                    }

                    instructions.push({
                        setDependency: dependencyNamesByKey[arrayKey].x,
                        desiredValue: variables["x" + varEnding],
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            } else {
                // we applied constraint to whole array
                let variables = {};

                // desiredStateVariableValues.constraintResult could just a
                // subset of keys (if arrayKeys specified)
                // but we should apply constraint function to all values
                // We start with previous values of constraintResults
                // and then modify any that are in desiredStateVariableValues.constraintResults

                // accumulate different desired results from multiple passes
                if (!workspace.desiredConstraintResults) {
                    workspace.desiredConstraintResults = {};
                }
                Object.assign(
                    workspace.desiredConstraintResults,
                    desiredStateVariableValues.constraintResults,
                );

                let SVconstraintResults = await stateValues.constraintResults;
                for (let arrayKey in SVconstraintResults) {
                    let varEnding = Number(arrayKey) + 1;
                    if (arrayKey in workspace.desiredConstraintResults) {
                        variables["x" + varEnding] =
                            convertValueToMathExpression(
                                workspace.desiredConstraintResults[arrayKey],
                            );
                    } else {
                        variables["x" + varEnding] =
                            convertValueToMathExpression(
                                SVconstraintResults[arrayKey],
                            );
                    }
                }

                for (let constraintChild of globalDependencyValues.constraintChildren) {
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
                            variables[varName] = convertValueToMathExpression(
                                constraintResult.variables[varName],
                            );
                        }
                    }
                }

                let constraintResults = {};
                for (let arrayKey in workspace.desiredConstraintResults) {
                    constraintResults[arrayKey] =
                        variables[`x${Number(arrayKey) + 1}`];
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "xs",
                            desiredValue: constraintResults,
                        },
                    ],
                };
            }
        },
    };

    stateVariableDefinitions.constraintUsed = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        returnDependencies: () => ({
            constraintUsedByComponent: {
                dependencyType: "stateVariable",
                variableName: "constraintUsedByComponent",
            },
        }),
        definition: function ({ dependencyValues }) {
            let constraintUsed = Object.values(
                dependencyValues.constraintUsedByComponent,
            ).some((x) => x);

            return { setValue: { constraintUsed } };
        },
    };

    return stateVariableDefinitions;
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

// Create a vertex constraint function that applies the given constraintFunction
// to the vertices and optionally find the best rigid translation is closest to the constraint.
//
// If enforceRigid is true, then after evaluation of constraintFunction,
// it attempts to find translations that, if applying constraintFunction again,
// maximizes the number of vertices that are constrained but don't move
export function returnVertexConstraintFunction(constraintFunction) {
    return function (
        {
            unconstrainedVertices,
            closed,
            enforceRigid,
            shrinkThreshold,
            vertexIndMoved,
        },
        ...args
    ) {
        let numericalUnconstrainedVertices = unconstrainedVertices.map(
            (vertex) => vertex.map((v) => v.evaluate_to_constant()),
        );

        let onlyMoveVertexInd = enforceRigid ? null : vertexIndMoved;

        let { numericalConstrainedVertices, constraintUsedForVertex } =
            constraintFunction(
                {
                    numericalUnconstrainedVertices,
                    closed,
                    shrinkThreshold,
                    onlyMoveVertexInd,
                },
                ...args,
            );

        if (constraintUsedForVertex.every((v) => !v)) {
            return unconstrainedVertices;
        } else if (!enforceRigid) {
            return numericalConstrainedVertices.map((vertex) =>
                vertex.map((v) => me.fromAst(v)),
            );
        }

        // Since we have constrained vertices and we need to keep the shape rigid,
        // we look for a translation that "best" satisfies the constraints.
        // For each vertex that was constrained,
        // we translate all vertices to match that vertex's constraint,
        // apply the constraint again, and count how many vertices were both
        // constrained and did not move.
        // We pick the translation that maximizes this count.
        // To break ties, we pick the minimum translation.

        let translationResults = [];

        let maxConstrainedUnmoved = 0;

        for (let vertexInd in unconstrainedVertices) {
            if (!constraintUsedForVertex[vertexInd]) {
                continue;
            }

            let translation = [];

            let numericalUnconstrainedVertex =
                numericalUnconstrainedVertices[vertexInd];
            let numericalConstrainedVertex =
                numericalConstrainedVertices[vertexInd];

            for (let dim in numericalUnconstrainedVertex) {
                let unconstrainedX = numericalUnconstrainedVertex[dim];
                let constrainedX = numericalConstrainedVertex[dim];
                let dx = constrainedX - unconstrainedX;
                translation.push(dx);
            }

            let translatedNumericalVertices =
                numericalUnconstrainedVertices.map(
                    (numericalUnconstrainedVertex) =>
                        numericalUnconstrainedVertex.map(
                            (v, i) => v + translation[i],
                        ),
                );

            // try constraining from the translation
            let {
                numericalConstrainedVertices: newVertices,
                constraintUsedForVertex: newConstraintsUsed,
            } = constraintFunction(
                {
                    numericalUnconstrainedVertices: translatedNumericalVertices,
                    closed,
                    shrinkThreshold,
                },
                ...args,
            );

            let numVerticesConstrainedUnmoved = 0;

            for (let vertexInd2 in translatedNumericalVertices) {
                if (!newConstraintsUsed[vertexInd2]) {
                    continue;
                }

                let eps = 1e-6;

                // vertex was constrained, check if each component didn't move more than eps
                let moved = false;
                let translatedVertex = translatedNumericalVertices[vertexInd2];
                let newVertex = newVertices[vertexInd2];

                for (let dim in numericalUnconstrainedVertex) {
                    let translatedVertexX = translatedVertex[dim];
                    let newX = newVertex[dim];
                    let dx = newX - translatedVertexX;

                    if (Math.abs(dx) > eps) {
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
        for (let result of translationResults) {
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

// Create a vertex constraint function that applies the given constraintFunction
// to the edges, optionally allowing rotations and forcing a rigid transformation.
//
// If enforceRigid is false, move edges independently, assuming consistent change for each vertex.
//
// If enforceRigid is true, then find the transformation the moves an edge the least amount,
// and then apply that transformation to all vertices.
export function returnVertexConstraintFunctionFromEdges(constraintFunction) {
    return function (
        {
            unconstrainedVertices,
            closed,
            enforceRigid,
            allowRotation,
            shrinkThreshold,
            rotationPoint,
        },
        ...args
    ) {
        let numericalUnconstrainedVertices = unconstrainedVertices.map(
            (vertex) => vertex.map((v) => v.evaluate_to_constant()),
        );

        // calculate the edges and apply the constraint function
        let numericalUnconstrainedEdges = [];
        for (let ind = 1; ind < numericalUnconstrainedVertices.length; ind++) {
            numericalUnconstrainedEdges.push([
                numericalUnconstrainedVertices[ind - 1],
                numericalUnconstrainedVertices[ind],
            ]);
        }
        if (closed) {
            numericalUnconstrainedEdges.push([
                numericalUnconstrainedVertices[
                    numericalUnconstrainedVertices.length - 1
                ],
                numericalUnconstrainedVertices[0],
            ]);
        }

        let { numericalConstrainedEdges, constraintUsedForEdge } =
            constraintFunction(
                {
                    numericalUnconstrainedEdges,
                    allowRotation,
                    enforceRigid,
                    shrinkThreshold,
                    rotationPoint,
                },
                ...args,
            );

        if (constraintUsedForEdge.every((v) => !v)) {
            return unconstrainedVertices;
        }

        // for each constrained edge, calculate the deviation from the unconstrained edge to constrained edge
        let deviation2ByEdge = [];
        for (let edgeInd in numericalUnconstrainedEdges) {
            if (!constraintUsedForEdge[edgeInd]) {
                continue;
            }

            let numericalConstrainedEdge = numericalConstrainedEdges[edgeInd];

            let numericalUnconstrainedEdge =
                numericalUnconstrainedEdges[edgeInd];

            let deviation2 = 0;

            // just add up the squared deviation for each vertex of the edge
            for (let vertexInd in numericalUnconstrainedEdge) {
                let numericalUnconstrainedVertex =
                    numericalUnconstrainedEdge[vertexInd];
                let numericalConstrainedVertex =
                    numericalConstrainedEdge[vertexInd];

                for (let dim in numericalUnconstrainedVertex) {
                    let numericalUnconstrainedX =
                        numericalUnconstrainedVertex[dim];
                    let numericalConstrainedX = numericalConstrainedVertex[dim];
                    deviation2 += Math.pow(
                        numericalUnconstrainedX - numericalConstrainedX,
                        2,
                    );
                }
            }

            deviation2ByEdge.push({ edgeInd, deviation2 });
        }

        if (!enforceRigid) {
            // if not enforcing rigid, the move the vertices
            // according to the edges, starting with the edges that moved the least,
            // and ignoring later edges that aren't consistent with the earlier ones

            deviation2ByEdge.sort((a, b) => a.deviation2 - b.deviation2);

            let constrainedVertices = [...numericalUnconstrainedVertices];

            let vertexIndsConstrained = [];
            let eps2 = 1e-6 ** 2;

            for (let { edgeInd, deviation2 } of deviation2ByEdge) {
                let vertexInd1 = Number(edgeInd);
                let vertexInd2 =
                    (vertexInd1 + 1) % numericalUnconstrainedVertices.length;

                if (vertexIndsConstrained.includes(vertexInd1)) {
                    // This vertex is being constrained again.
                    // Check that we got the same value again
                    let vec1 = constrainedVertices[vertexInd1];
                    let vec2 = numericalConstrainedEdges[edgeInd][0];

                    if (
                        Math.pow(vec1[0] - vec2[0], 2) +
                            Math.pow(vec1[1] - vec2[1], 2) >
                        eps2
                    ) {
                        // inconsistent position for vertexInd1, so skip
                        continue;
                    }
                }
                if (vertexIndsConstrained.includes(vertexInd2)) {
                    // This vertex is being constrained again.
                    // Check that we got the same value again
                    let vec1 = constrainedVertices[vertexInd2];
                    let vec2 = numericalConstrainedEdges[edgeInd][1];

                    if (
                        Math.pow(vec1[0] - vec2[0], 2) +
                            Math.pow(vec1[1] - vec2[1], 2) >
                        eps2
                    ) {
                        // inconsistent position for vertexInd2, so skip
                        continue;
                    }
                }

                constrainedVertices[vertexInd1] =
                    numericalConstrainedEdges[edgeInd][0];
                constrainedVertices[vertexInd2] =
                    numericalConstrainedEdges[edgeInd][1];
                vertexIndsConstrained.push(vertexInd1);
                vertexIndsConstrained.push(vertexInd2);
            }

            return constrainedVertices.map((vertex) =>
                vertex.map((v) => me.fromAst(v)),
            );
        }

        // We are enforcing a rigid transformation.
        // We will find the edge that was constrained and moved the minimal amount.
        // We will then rotate and translate all vertices according to that transformation.
        // Note: if allowRotation was false, the transformations found by the constraint function, above,
        // won't contain rotations.

        let minDeviationInd = null;
        let minDeviation2 = Infinity;

        for (let { edgeInd, deviation2 } of deviation2ByEdge) {
            if (deviation2 < minDeviation2) {
                minDeviation2 = deviation2;
                minDeviationInd = Number(edgeInd);
            }
        }

        let numericalUnconstrainedEdge =
            numericalUnconstrainedEdges[minDeviationInd];
        let numericalConstrainedEdge =
            numericalConstrainedEdges[minDeviationInd];

        // translate based on how the first vertex of the edge moved
        let translation = numericalConstrainedEdge[0].map(
            (v, i) => v - numericalUnconstrainedEdge[0][i],
        );

        let constrained_rel = [
            numericalConstrainedEdge[1][0] - numericalConstrainedEdge[0][0],
            numericalConstrainedEdge[1][1] - numericalConstrainedEdge[0][1],
        ];
        let unconstrained_rel = [
            numericalUnconstrainedEdge[1][0] - numericalUnconstrainedEdge[0][0],
            numericalUnconstrainedEdge[1][1] - numericalUnconstrainedEdge[0][1],
        ];

        // rotate around constrained vertex based on change in angle
        let theta =
            Math.atan2(constrained_rel[1], constrained_rel[0]) -
            Math.atan2(unconstrained_rel[1], unconstrained_rel[0]);
        let sin_theta = Math.sin(theta);
        let cos_theta = Math.cos(theta);

        let constrainedVertices = numericalUnconstrainedVertices.map(
            (vertex) => {
                let dx =
                    vertex[0] + translation[0] - numericalConstrainedEdge[0][0];
                let dy =
                    vertex[1] + translation[1] - numericalConstrainedEdge[0][1];

                let x = me.fromAst(
                    numericalConstrainedEdge[0][0] +
                        dx * cos_theta -
                        dy * sin_theta,
                );
                let y = me.fromAst(
                    numericalConstrainedEdge[0][1] +
                        dx * sin_theta +
                        dy * cos_theta,
                );

                return [x, y];
            },
        );

        return constrainedVertices;
    };
}
