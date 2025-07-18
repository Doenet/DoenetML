import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import { subsets, buildSubsetFromMathExpression } from "@doenet/utils";
import { returnPointsIntervalsFromSubsetStateVariableDefinitions } from "./SubsetOfReals";

export default class SubsetOfRealsInput extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            addPoint: this.addPoint.bind(this),
            deletePoint: this.deletePoint.bind(this),
            movePoint: this.movePoint.bind(this),
            togglePoint: this.togglePoint.bind(this),
            toggleInterval: this.toggleInterval.bind(this),
            clear: this.clear.bind(this),
            setToR: this.setToR.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "subsetOfRealsInput";

    static variableForImplicitProp = "subsetValue";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.xMin = {
            createComponentOfType: "number",
            createStateVariable: "xMin",
            defaultValue: -10,
            public: true,
            forRenderer: true,
        };
        attributes.xMax = {
            createComponentOfType: "number",
            createStateVariable: "xMax",
            defaultValue: 10,
            public: true,
            forRenderer: true,
        };
        attributes.width = {
            createComponentOfType: "componentSize",
            createStateVariable: "width",
            defaultValue: 800,
            public: true,
            forRenderer: true,
        };
        attributes.height = {
            createComponentOfType: "componentSize",
            createStateVariable: "height",
            defaultValue: 300,
            public: true,
            forRenderer: true,
        };
        attributes.xlabel = {
            createComponentOfType: "text",
            createStateVariable: "xlabel",
            defaultValue: "",
            public: true,
            forRenderer: true,
        };
        //interval type buttons includeIntervalBasedControls
        //point type buttons includePointBasedControls

        attributes.dx = {
            createComponentOfType: "number",
            createStateVariable: "dx",
            defaultValue: 0.5,
            public: true,
        };

        attributes.variable = {
            createComponentOfType: "_variableName",
            createStateVariable: "variable",
            defaultValue: me.fromAst("x"),
            public: true,
        };
        attributes.format = {
            createComponentOfType: "text",
            createStateVariable: "format",
            defaultValue: "text",
            public: true,
            toLowerCase: true,
            validValues: ["text", "latex"],
        };
        attributes.prefill = {
            createComponentOfType: "text",
            createStateVariable: "prefill",
            defaultValue: "",
            public: true,
        };

        attributes.bindValueTo = {
            createComponentOfType: "subsetOfReals",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.subsetValue = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "subsetOfReals",
            },
            hasEssential: true,
            returnDependencies: () => ({
                bindValueTo: {
                    dependencyType: "attributeComponent",
                    attributeName: "bindValueTo",
                    variableNames: ["subsetValue"],
                },
                prefill: {
                    dependencyType: "stateVariable",
                    variableName: "prefill",
                },
                variable: {
                    dependencyType: "stateVariable",
                    variableName: "variable",
                },
                format: {
                    dependencyType: "stateVariable",
                    variableName: "format",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (!dependencyValues.bindValueTo) {
                    // TODO: should we round prefill using dx?
                    return {
                        useEssentialOrDefaultValue: {
                            subsetValue: {
                                get defaultValue() {
                                    return parseValueIntoSubset({
                                        inputString: dependencyValues.prefill,
                                        format: dependencyValues.format,
                                        variable: dependencyValues.variable,
                                    });
                                },
                            },
                        },
                    };
                }

                return {
                    setValue: {
                        subsetValue:
                            dependencyValues.bindValueTo.stateValues
                                .subsetValue,
                    },
                };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.bindValueTo) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "bindValueTo",
                                desiredValue:
                                    desiredStateVariableValues.subsetValue,
                                variableIndex: 0,
                            },
                        ],
                    };
                }
                // subsetValue is essential; give it the desired value

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "subsetValue",
                            value: desiredStateVariableValues.subsetValue,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.additionalPoints = {
            defaultValue: [],
            hasEssential: true,
            returnDependencies: () => ({}),
            definition() {
                return {
                    useEssentialOrDefaultValue: {
                        additionalPoints: true,
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                if (
                    desiredStateVariableValues.additionalPoints.every(
                        Number.isFinite,
                    )
                ) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "additionalPoints",
                                value: [
                                    ...desiredStateVariableValues.additionalPoints,
                                ].sort((a, b) => a - b),
                            },
                        ],
                    };
                } else {
                    return { success: false };
                }
            },
        };

        stateVariableDefinitions.pointsDisplayed = {
            additionalStateVariablesDefined: [
                { variableName: "intervalsDisplayed", forRenderer: true },
            ],
            forRenderer: true,
            returnDependencies: () => ({
                pointsFromSubset: {
                    dependencyType: "stateVariable",
                    variableName: "pointsFromSubset",
                },
                intervalsFromSubset: {
                    dependencyType: "stateVariable",
                    variableName: "intervalsFromSubset",
                },
                additionalPoints: {
                    dependencyType: "stateVariable",
                    variableName: "additionalPoints",
                },
            }),
            definition({ dependencyValues }) {
                let pointsSub = [...dependencyValues.pointsFromSubset];
                let intervalsSub = [...dependencyValues.intervalsFromSubset];
                let additionalPoints = [
                    ...dependencyValues.additionalPoints,
                ].sort((a, b) => a - b);

                let pointsDisplayed = [];
                let intervalsDisplayed = [];

                let intervalInd = 0;

                let nextAdditionalPoint = Infinity;
                let additionalPointInd = 0;
                if (additionalPoints.length > 0) {
                    nextAdditionalPoint = additionalPoints[0];
                }
                let nextInterval = intervalsSub[0];

                let lastIntervalEnd = -Infinity;

                // append point at Infinity for simplicity
                pointsSub.push({ value: Infinity, inSubset: false });

                for (let point of pointsSub) {
                    let inSubset = false;
                    if (nextInterval && nextInterval[0] < point.value) {
                        inSubset = true;
                    }

                    while (nextAdditionalPoint < point.value) {
                        // add extra point.  Will be inSubset if inside an interval

                        // skip if point is on top of previous point
                        if (nextAdditionalPoint !== lastIntervalEnd) {
                            pointsDisplayed.push({
                                value: nextAdditionalPoint,
                                inSubset,
                                isAdditional: true,
                                additionalPointInd,
                            });

                            intervalsDisplayed.push({
                                left: lastIntervalEnd,
                                right: nextAdditionalPoint,
                                inSubset,
                            });

                            lastIntervalEnd = nextAdditionalPoint;
                        }

                        additionalPointInd++;
                        nextAdditionalPoint =
                            additionalPoints[additionalPointInd];
                        if (nextAdditionalPoint === undefined) {
                            nextAdditionalPoint = Infinity;
                        }
                    }

                    pointsDisplayed.push(point);

                    intervalsDisplayed.push({
                        left: lastIntervalEnd,
                        right: point.value,
                        inSubset,
                    });

                    lastIntervalEnd = point.value;

                    if (inSubset) {
                        intervalInd++;
                        nextInterval = intervalsSub[intervalInd];
                    }
                }

                // delete extra point at infinity
                pointsDisplayed = pointsDisplayed.slice(
                    0,
                    pointsDisplayed.length - 1,
                );

                return {
                    setValue: { pointsDisplayed, intervalsDisplayed },
                };
            },
        };

        const pointAndIntervalDefinitions =
            returnPointsIntervalsFromSubsetStateVariableDefinitions();
        Object.assign(stateVariableDefinitions, pointAndIntervalDefinitions);

        return stateVariableDefinitions;
    }

    async addPoint({
        value,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let dx = await this.stateValues.dx;
        let roundedValue =
            Math.round(
                Math.max(
                    await this.stateValues.xMin,
                    Math.min(await this.stateValues.xMax, value),
                ) / dx,
            ) * dx;

        // add point only if not equal to another point
        // (which could happen due to rounding)

        let pointsFromSubset = [...(await this.stateValues.pointsFromSubset)];
        let intervalsFromSubset = [
            ...(await this.stateValues.intervalsFromSubset),
        ];
        let additionalPoints = [...(await this.stateValues.additionalPoints)];

        if (!additionalPoints.includes(roundedValue)) {
            let subsetPointValues = pointsFromSubset.map((x) => x.value);

            if (!subsetPointValues.includes(roundedValue)) {
                let insideInterval = false;
                for (let interval of intervalsFromSubset) {
                    if (
                        interval[0] < roundedValue &&
                        interval[1] > roundedValue
                    ) {
                        insideInterval = true;
                        break;
                    }
                }

                // the new point should be in the subset

                if (insideInterval) {
                    // if point is inside an interval, make it an additional point
                    additionalPoints.push(roundedValue);
                    return await this.coreFunctions.performUpdate({
                        updateInstructions: [
                            {
                                componentIdx: this.componentIdx,
                                updateType: "updateValue",
                                stateVariable: "additionalPoints",
                                value: additionalPoints,
                            },
                        ],
                        actionId,
                        sourceInformation,
                        skipRendererUpdate,
                        event: {
                            verb: "interacted",
                            object: {
                                componentIdx: this.componentIdx,
                                componentType: this.componentType,
                            },
                            result: {
                                addedPoint: roundedValue,
                                intervalsFromSubset,
                                pointsFromSubset,
                                additionalPoints,
                            },
                        },
                    });
                } else {
                    // if point is not inside an interval, add a point
                    pointsFromSubset.push({
                        value: roundedValue,
                        inSubset: true,
                    });

                    let updateInstructions =
                        await this.createUpdateInstructions({
                            intervalsFromSubset,
                            pointsFromSubset,
                            modifiedAdditionalPoints: false,
                            additionalPoints,
                        });

                    return await this.coreFunctions.performUpdate({
                        updateInstructions,
                        actionId,
                        sourceInformation,
                        skipRendererUpdate,
                        event: {
                            verb: "interacted",
                            object: {
                                componentIdx: this.componentIdx,
                                componentType: this.componentType,
                            },
                            result: {
                                addedPoint: roundedValue,
                                intervalsFromSubset,
                                pointsFromSubset,
                                additionalPoints,
                            },
                        },
                    });
                }
            }
        }
    }

    async deletePoint({
        pointInd,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let point = await this.stateValues.pointsDisplayed[pointInd];
        let additionalPoints = [...(await this.stateValues.additionalPoints)];
        let pointsFromSubset = [...(await this.stateValues.pointsFromSubset)];
        let intervalsFromSubset = [
            ...(await this.stateValues.intervalsFromSubset),
        ];

        if (point.isAdditional) {
            additionalPoints.splice(point.additionalPointInd, 1);
            return await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        componentIdx: this.componentIdx,
                        updateType: "updateValue",
                        stateVariable: "additionalPoints",
                        value: additionalPoints,
                    },
                ],
                actionId,
                sourceInformation,
                skipRendererUpdate,
                event: {
                    verb: "interacted",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                    result: {
                        deletedPoint: point.value,
                        intervalsFromSubset,
                        pointsFromSubset,
                        additionalPoints,
                    },
                },
            });
        } else {
            // removing a point defining the subset
            // recalculate subset

            let modifiedAdditionalPoints = false;

            let pointSubsetInd = pointsFromSubset
                .map((x) => x.value)
                .indexOf(point.value);

            let leftIntervalInd = intervalsFromSubset
                .map((x) => x[1])
                .indexOf(point.value);
            let rightIntervalInd = intervalsFromSubset
                .map((x) => x[0])
                .indexOf(point.value);

            if (leftIntervalInd !== -1) {
                if (rightIntervalInd !== -1) {
                    // have intervals on both sides of points
                    // merge the intervals
                    intervalsFromSubset[leftIntervalInd] = [
                        intervalsFromSubset[leftIntervalInd][0],
                        intervalsFromSubset[rightIntervalInd][1],
                    ];
                    intervalsFromSubset.splice(rightIntervalInd, 1);

                    pointsFromSubset.splice(pointSubsetInd, 1);
                } else {
                    // interval on the left but not on the right
                    // remove the interval on the left

                    let leftPoint = (await this.stateValues.pointsDisplayed)[
                        pointInd - 1
                    ];
                    if (leftPoint && leftPoint.isAdditional) {
                        // shorten the interval to end at the additional point
                        // and turn the additional point to a subset point
                        intervalsFromSubset[leftIntervalInd] = [
                            intervalsFromSubset[leftIntervalInd][0],
                            leftPoint.value,
                        ];

                        additionalPoints.splice(
                            leftPoint.additionalPointInd,
                            1,
                        );
                        modifiedAdditionalPoints = true;

                        pointsFromSubset.splice(pointSubsetInd, 1, leftPoint);
                    } else {
                        // since bordered by a subset point (or -Infinity)
                        // just remove the interval and the point
                        intervalsFromSubset.splice(leftIntervalInd, 1);
                        pointsFromSubset.splice(pointSubsetInd, 1);

                        if (leftPoint && !leftPoint.inSubset) {
                            // if left point isn't in subset
                            // and don't have an interval to its left
                            // it is not longer part of the subset
                            let leftLeftIntervalInd = intervalsFromSubset
                                .map((x) => x[1])
                                .indexOf(leftPoint.value);
                            if (leftLeftIntervalInd === -1) {
                                // so that point doesn't disappear, add it to additionalPoints
                                additionalPoints.push(leftPoint.value);
                                modifiedAdditionalPoints = true;
                            }
                        }
                    }
                }
            } else {
                // don't have left interval

                if (rightIntervalInd !== -1) {
                    // interval on the right but not on the left
                    // remove the interval on the right

                    let rightPoint = (await this.stateValues.pointsDisplayed)[
                        pointInd + 1
                    ];
                    if (rightPoint && rightPoint.isAdditional) {
                        // shorten the interval to end at the additional point
                        // and turn the additional point to a subset point
                        intervalsFromSubset[rightIntervalInd] = [
                            rightPoint.value,
                            intervalsFromSubset[rightIntervalInd][1],
                        ];

                        additionalPoints.splice(
                            rightPoint.additionalPointInd,
                            1,
                        );
                        modifiedAdditionalPoints = true;

                        pointsFromSubset.splice(pointSubsetInd, 1, rightPoint);
                    } else {
                        // since bordered by a subset point
                        // just remove the interval and the point
                        intervalsFromSubset.splice(rightIntervalInd, 1);
                        pointsFromSubset.splice(pointSubsetInd, 1);

                        if (rightPoint && !rightPoint.inSubset) {
                            // if right point isn't in subset
                            // and don't have an interval to its right
                            // it is not longer part of the subset
                            let rightRightIntervalInd = intervalsFromSubset
                                .map((x) => x[0])
                                .indexOf(rightPoint.value);
                            if (rightRightIntervalInd === -1) {
                                // so that point doesn't disappear, add it to additionalPoints
                                additionalPoints.push(rightPoint.value);
                                modifiedAdditionalPoints = true;
                            }
                        }
                    }
                } else {
                    // don't have interval on either side
                    // just remove the point
                    pointsFromSubset.splice(pointSubsetInd, 1);
                }
            }

            let updateInstructions = await this.createUpdateInstructions({
                intervalsFromSubset,
                pointsFromSubset,
                modifiedAdditionalPoints,
                additionalPoints,
            });

            return await this.coreFunctions.performUpdate({
                updateInstructions,
                actionId,
                sourceInformation,
                skipRendererUpdate,
                event: {
                    verb: "interacted",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                    result: {
                        deletedPoint: point.value,
                        intervalsFromSubset,
                        pointsFromSubset,
                        additionalPoints,
                    },
                },
            });
        }
    }

    async createUpdateInstructions({
        intervalsFromSubset,
        pointsFromSubset,
        modifiedAdditionalPoints,
        additionalPoints,
    }) {
        let dx = await this.stateValues.dx;
        let roundValue = (x) => Math.round(x / dx) * dx;

        // rebuild subset
        let pieces = [];
        for (let interval of intervalsFromSubset) {
            pieces.push(
                subsets.OpenInterval(
                    roundValue(interval[0]),
                    roundValue(interval[1]),
                ),
            );
        }
        for (let point of pointsFromSubset) {
            if (point.inSubset) {
                pieces.push(subsets.Singleton(roundValue(point.value)));
            }
        }

        let newSubset;
        if (pieces.length === 0) {
            newSubset = subsets.EmptySet();
        } else if (pieces.length === 1) {
            newSubset = pieces[0];
        } else {
            newSubset = subsets.Union(pieces);
        }

        let updateInstructions = [
            {
                componentIdx: this.componentIdx,
                updateType: "updateValue",
                stateVariable: "subsetValue",
                value: newSubset,
            },
        ];

        if (modifiedAdditionalPoints) {
            updateInstructions.push({
                componentIdx: this.componentIdx,
                updateType: "updateValue",
                stateVariable: "additionalPoints",
                value: additionalPoints.map(roundValue),
            });
        }
        return updateInstructions;
    }

    async movePoint({
        pointInd,
        value,
        transient,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let dx = await this.stateValues.dx;

        let roundedValue =
            Math.round(
                Math.max(
                    await this.stateValues.xMin,
                    Math.min(await this.stateValues.xMax, value),
                ) / dx,
            ) * dx;

        let pointsDisplayed = await this.stateValues.pointsDisplayed;
        let point = pointsDisplayed[pointInd];

        // value cannot cross another point
        let leftPoint = pointsDisplayed[pointInd - 1];
        if (leftPoint) {
            roundedValue = Math.max(roundedValue, leftPoint.value + dx);
        }
        let rightPoint = pointsDisplayed[pointInd + 1];
        if (rightPoint) {
            roundedValue = Math.min(roundedValue, rightPoint.value - dx);
        }

        let additionalPoints = [...(await this.stateValues.additionalPoints)];
        let pointsFromSubset = [...(await this.stateValues.pointsFromSubset)];
        let intervalsFromSubset = [
            ...(await this.stateValues.intervalsFromSubset),
        ];

        if (point.isAdditional) {
            additionalPoints[point.additionalPointInd] = roundedValue;
            if (transient) {
                return await this.coreFunctions.performUpdate({
                    updateInstructions: [
                        {
                            componentIdx: this.componentIdx,
                            updateType: "updateValue",
                            stateVariable: "additionalPoints",
                            value: additionalPoints,
                        },
                    ],
                    transient: true,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                });
            } else {
                return await this.coreFunctions.performUpdate({
                    updateInstructions: [
                        {
                            componentIdx: this.componentIdx,
                            updateType: "updateValue",
                            stateVariable: "additionalPoints",
                            value: additionalPoints,
                        },
                    ],
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                    event: {
                        verb: "interacted",
                        object: {
                            componentIdx: this.componentIdx,
                            componentType: this.componentType,
                        },
                        result: {
                            movedPoint: roundedValue,
                            intervalsFromSubset,
                            pointsFromSubset,
                            additionalPoints,
                        },
                    },
                });
            }
        } else {
            let pointSubsetInd = pointsFromSubset
                .map((x) => x.value)
                .indexOf(point.value);
            let leftIntervalInd = intervalsFromSubset
                .map((x) => x[1])
                .indexOf(point.value);
            let rightIntervalInd = intervalsFromSubset
                .map((x) => x[0])
                .indexOf(point.value);

            pointsFromSubset[pointSubsetInd] = {
                value: roundedValue,
                inSubset: pointsFromSubset[pointSubsetInd].inSubset,
            };

            if (leftIntervalInd !== -1) {
                intervalsFromSubset[leftIntervalInd] = [
                    intervalsFromSubset[leftIntervalInd][0],
                    roundedValue,
                ];
            }
            if (rightIntervalInd !== -1) {
                intervalsFromSubset[rightIntervalInd] = [
                    roundedValue,
                    intervalsFromSubset[rightIntervalInd][1],
                ];
            }

            let updateInstructions = await this.createUpdateInstructions({
                intervalsFromSubset,
                pointsFromSubset,
                modifiedAdditionalPoints: false,
            });

            if (transient) {
                return await this.coreFunctions.performUpdate({
                    updateInstructions,
                    transient: true,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                });
            } else {
                return await this.coreFunctions.performUpdate({
                    updateInstructions,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                    event: {
                        verb: "interacted",
                        object: {
                            componentIdx: this.componentIdx,
                            componentType: this.componentType,
                        },
                        result: {
                            movedPoint: roundedValue,
                            intervalsFromSubset,
                            pointsFromSubset,
                            additionalPoints,
                        },
                    },
                });
            }
        }
    }

    async togglePoint({
        pointInd,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let point = (await this.stateValues.pointsDisplayed)[pointInd];

        let pointsFromSubset = [...(await this.stateValues.pointsFromSubset)];
        let intervalsFromSubset = [
            ...(await this.stateValues.intervalsFromSubset),
        ];
        let additionalPoints = [...(await this.stateValues.additionalPoints)];

        let modifiedAdditionalPoints = false;

        if (point.isAdditional) {
            // after toggling, point is no longer additional

            additionalPoints.splice(point.additionalPointInd, 1);

            modifiedAdditionalPoints = true;

            if (point.inSubset) {
                // point is in the middle of a interval
                // split that interval

                for (let [ind, interval] of intervalsFromSubset.entries()) {
                    if (
                        interval[0] < point.value &&
                        interval[1] > point.value
                    ) {
                        // replace interval with two new
                        let newIntervals = [
                            [interval[0], point.value],
                            [point.value, interval[1]],
                        ];

                        intervalsFromSubset.splice(ind, 1, ...newIntervals);
                        break;
                    }
                }
            } else {
                // point is not in the middle of interval
                // so it becomes a point in the subset
                pointsFromSubset.push({
                    value: point.value,
                    inSubset: true,
                });
            }
        } else {
            // have a point that is already part of the subset

            let pointSubsetInd = pointsFromSubset
                .map((x) => x.value)
                .indexOf(point.value);

            let leftIntervalInd = intervalsFromSubset
                .map((x) => x[1])
                .indexOf(point.value);
            let rightIntervalInd = intervalsFromSubset
                .map((x) => x[0])
                .indexOf(point.value);

            if (leftIntervalInd !== -1) {
                if (rightIntervalInd !== -1) {
                    // have intervals on both sides of points
                    // merge the intervals and point becomes additional
                    intervalsFromSubset[leftIntervalInd] = [
                        intervalsFromSubset[leftIntervalInd][0],
                        intervalsFromSubset[rightIntervalInd][1],
                    ];
                    intervalsFromSubset.splice(rightIntervalInd, 1);

                    pointsFromSubset.splice(pointSubsetInd, 1);
                    additionalPoints.push(point.value);
                    modifiedAdditionalPoints = true;
                } else {
                    // since interval on only one side
                    // simply toggle point
                    pointsFromSubset[pointSubsetInd] = {
                        value: point.value,
                        inSubset: !point.inSubset,
                    };
                }
            } else {
                // don't have left interval

                if (rightIntervalInd !== -1) {
                    // since interval on only one side
                    // simply toggle point
                    pointsFromSubset[pointSubsetInd] = {
                        value: point.value,
                        inSubset: !point.inSubset,
                    };
                } else {
                    // don't have interval on either side
                    // so was an isolated point that toggled off
                    // point becomes additional
                    pointsFromSubset.splice(pointSubsetInd, 1);
                    additionalPoints.push(point.value);
                    modifiedAdditionalPoints = true;
                }
            }
        }

        let updateInstructions = await this.createUpdateInstructions({
            intervalsFromSubset,
            pointsFromSubset,
            modifiedAdditionalPoints,
            additionalPoints,
        });

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    toggledPoint: point.value,
                    intervalsFromSubset,
                    pointsFromSubset,
                    additionalPoints,
                },
            },
        });
    }

    async toggleInterval({
        intervalInd,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let interval = (await this.stateValues.intervalsDisplayed)[intervalInd];

        let pointsDisplayed = await this.stateValues.pointsDisplayed;
        let leftPoint = pointsDisplayed[intervalInd - 1];
        let rightPoint = pointsDisplayed[intervalInd];

        let pointsFromSubset = [...(await this.stateValues.pointsFromSubset)];
        let intervalsFromSubset = [
            ...(await this.stateValues.intervalsFromSubset),
        ];
        let additionalPoints = [...(await this.stateValues.additionalPoints)];

        let modifiedAdditionalPoints = false;

        if (interval.inSubset) {
            let intervalSubsetInd, intervalSubset;

            // find interval in subset containing interval
            for (let [ind, interval2] of intervalsFromSubset.entries()) {
                if (
                    interval2[0] <= interval.left &&
                    interval2[1] >= interval.right
                ) {
                    intervalSubset = interval2;
                    intervalSubsetInd = ind;
                    break;
                }
            }

            if (interval.left === intervalSubset[0]) {
                if (interval.right === intervalSubset[1]) {
                    // interval is an interval from the subset
                    // just remove the interval
                    intervalsFromSubset.splice(intervalSubsetInd, 1);

                    if (leftPoint && !leftPoint.inSubset) {
                        // if leftPoint doesn't have an interval to the left
                        // then it is no longer part of the subset
                        // and becomes additional
                        let leftLeftIntervalInd = intervalsFromSubset
                            .map((x) => x[1])
                            .indexOf(leftPoint.value);
                        if (leftLeftIntervalInd === -1) {
                            let leftPointSubsetInd = pointsFromSubset
                                .map((x) => x.value)
                                .indexOf(leftPoint.value);
                            pointsFromSubset.splice(leftPointSubsetInd, 1);
                            additionalPoints.push(leftPoint.value);
                            modifiedAdditionalPoints = true;
                        }
                    }

                    if (rightPoint && !rightPoint.inSubset) {
                        // if rightPoint doesn't have an interval to the right
                        // then it is no longer part of the subset
                        // and becomes additional
                        let rightRightIntervalInd = intervalsFromSubset
                            .map((x) => x[0])
                            .indexOf(rightPoint.value);
                        if (rightRightIntervalInd === -1) {
                            let rightPointSubsetInd = pointsFromSubset
                                .map((x) => x.value)
                                .indexOf(rightPoint.value);
                            pointsFromSubset.splice(rightPointSubsetInd, 1);
                            additionalPoints.push(rightPoint.value);
                            modifiedAdditionalPoints = true;
                        }
                    }
                } else {
                    // just left point of interval is in subset

                    // remove left portion of intervalSubset
                    intervalsFromSubset[intervalSubsetInd] = [
                        interval.right,
                        intervalSubset[1],
                    ];

                    if (leftPoint && !leftPoint.inSubset) {
                        // if leftPoint doesn't have an interval to the left
                        // then it is no longer part of the subset
                        // and becomes additional
                        let leftLeftIntervalInd = intervalsFromSubset
                            .map((x) => x[1])
                            .indexOf(leftPoint.value);
                        if (leftLeftIntervalInd === -1) {
                            let leftPointSubsetInd = pointsFromSubset
                                .map((x) => x.value)
                                .indexOf(leftPoint.value);
                            pointsFromSubset.splice(leftPointSubsetInd, 1);
                            additionalPoints.push(leftPoint.value);
                            modifiedAdditionalPoints = true;
                        }
                    }

                    // rightPoint becomes part of the subset
                    pointsFromSubset.push({
                        value: rightPoint.value,
                        inSubset: true,
                    });

                    additionalPoints.splice(rightPoint.additionalPointInd, 1);
                    modifiedAdditionalPoints = true;
                }
            } else {
                // left point is not in subset
                if (interval.right === intervalSubset[1]) {
                    // just right point of interval is in subset

                    // remove right portion of intervalSubset
                    intervalsFromSubset[intervalSubsetInd] = [
                        intervalSubset[0],
                        interval.left,
                    ];

                    if (rightPoint && !rightPoint.inSubset) {
                        // if rightPoint doesn't have an interval to the right
                        // then it is no longer part of the subset
                        // and becomes additional
                        let rightRightIntervalInd = intervalsFromSubset
                            .map((x) => x[0])
                            .indexOf(rightPoint.value);
                        if (rightRightIntervalInd === -1) {
                            let rightPointSubsetInd = pointsFromSubset
                                .map((x) => x.value)
                                .indexOf(rightPoint.value);
                            pointsFromSubset.splice(rightPointSubsetInd, 1);
                            additionalPoints.push(rightPoint.value);
                            modifiedAdditionalPoints = true;
                        }
                    }

                    // leftPoint becomes part of the subset
                    pointsFromSubset.push({
                        value: leftPoint.value,
                        inSubset: true,
                    });

                    additionalPoints.splice(leftPoint.additionalPointInd, 1);
                    modifiedAdditionalPoints = true;
                } else {
                    // neither endpoint of interval is in subset
                    // remove middle portion intervalSubset to create two new intervals

                    let newIntervals = [
                        [intervalSubset[0], interval.left],
                        [interval.right, intervalSubset[1]],
                    ];
                    intervalsFromSubset.splice(
                        intervalSubsetInd,
                        1,
                        ...newIntervals,
                    );

                    // leftPoint and rightPoint become part of the subset
                    pointsFromSubset.push({
                        value: leftPoint.value,
                        inSubset: true,
                    });
                    pointsFromSubset.push({
                        value: rightPoint.value,
                        inSubset: true,
                    });

                    additionalPoints.splice(rightPoint.additionalPointInd, 1);
                    additionalPoints.splice(leftPoint.additionalPointInd, 1);
                    modifiedAdditionalPoints = true;
                }
            }
        } else {
            // interval is not in subset

            // determine if have adjacent interval in subset

            let leftIntervalInd = intervalsFromSubset
                .map((x) => x[1])
                .indexOf(interval.left);
            let rightIntervalInd = intervalsFromSubset
                .map((x) => x[0])
                .indexOf(interval.right);

            if (leftIntervalInd === -1) {
                if (rightIntervalInd === -1) {
                    // no adjacent intervals

                    // add the interval to the subset
                    intervalsFromSubset.push([interval.left, interval.right]);

                    // if either endpoint is additional
                    // it is no longer additional
                    // Note: we don't need to add it to the subset
                    // as isSubset must be false

                    if (rightPoint && rightPoint.isAdditional) {
                        additionalPoints.splice(
                            rightPoint.additionalPointInd,
                            1,
                        );
                        modifiedAdditionalPoints = true;
                    }
                    if (leftPoint && leftPoint.isAdditional) {
                        additionalPoints.splice(
                            leftPoint.additionalPointInd,
                            1,
                        );
                        modifiedAdditionalPoints = true;
                    }
                } else {
                    // just interval to right is in subset

                    if (rightPoint.inSubset) {
                        // extend interval that is on the right
                        intervalsFromSubset[rightIntervalInd] = [
                            interval.left,
                            intervalsFromSubset[rightIntervalInd][1],
                        ];

                        // point becomes additional
                        additionalPoints.push(rightPoint.value);
                        modifiedAdditionalPoints = true;

                        // Note: don't need to remove rightPoint from pointsFromSubset
                        // since the Union will eliminate it
                    } else {
                        // add the interval to the subset
                        intervalsFromSubset.push([
                            interval.left,
                            interval.right,
                        ]);
                    }

                    // if left endpoint is additional
                    // it is no longer additional
                    // Note: we don't need to add it to the subset
                    // as isSubset must be false

                    if (leftPoint && leftPoint.isAdditional) {
                        additionalPoints.splice(
                            leftPoint.additionalPointInd,
                            1,
                        );
                        modifiedAdditionalPoints = true;
                    }
                }
            } else {
                // interval to left is in subset

                if (rightIntervalInd === -1) {
                    // just interval to left is in subset

                    if (leftPoint.inSubset) {
                        // extend interval that is on the left
                        intervalsFromSubset[leftIntervalInd] = [
                            intervalsFromSubset[leftIntervalInd][0],
                            interval.right,
                        ];

                        // point becomes additional
                        additionalPoints.push(leftPoint.value);
                        modifiedAdditionalPoints = true;

                        // Note: don't need to remove leftPoint from pointsFromSubset
                        // since the Union will eliminate it
                    } else {
                        // add the interval to the subset
                        intervalsFromSubset.push([
                            interval.left,
                            interval.right,
                        ]);
                    }

                    // if right endpoint is additional
                    // it is no longer additional
                    // Note: we don't need to add it to the subset
                    // as isSubset must be false

                    if (rightPoint && rightPoint.isAdditional) {
                        additionalPoints.splice(
                            rightPoint.additionalPointInd,
                            1,
                        );
                        modifiedAdditionalPoints = true;
                    }
                } else {
                    // both adjacent intervals are in the subset
                    if (leftPoint.inSubset) {
                        if (rightPoint.inSubset) {
                            // merge intervals
                            let newInterval = [
                                intervalsFromSubset[leftIntervalInd][0],
                                intervalsFromSubset[rightIntervalInd][1],
                            ];

                            intervalsFromSubset.splice(
                                leftIntervalInd,
                                2,
                                newInterval,
                            );

                            // point becomes additional
                            additionalPoints.push(leftPoint.value);
                            additionalPoints.push(rightPoint.value);
                            modifiedAdditionalPoints = true;

                            // Note: don't need to remove points from pointsFromSubset
                            // since the Union will eliminate it
                        } else {
                            // just left point is in subset
                            // extend interval that is on the left
                            intervalsFromSubset[leftIntervalInd] = [
                                intervalsFromSubset[leftIntervalInd][0],
                                interval.right,
                            ];

                            // left point becomes additional
                            additionalPoints.push(leftPoint.value);
                            modifiedAdditionalPoints = true;

                            // Note: don't need to remove leftPoint from pointsFromSubset
                            // since the Union will eliminate it
                        }
                    } else {
                        // left point is not in subset

                        if (rightPoint.inSubset) {
                            // just right point is in subset
                            // extend interval that is on the right
                            intervalsFromSubset[rightIntervalInd] = [
                                interval.left,
                                intervalsFromSubset[rightIntervalInd][1],
                            ];

                            // right point becomes additional
                            additionalPoints.push(rightPoint.value);
                            modifiedAdditionalPoints = true;

                            // Note: don't need to remove rightPoint from pointsFromSubset
                            // since the Union will eliminate it
                        } else {
                            // neither point is in subset
                            // add the interval to the subset
                            intervalsFromSubset.push([
                                interval.left,
                                interval.right,
                            ]);
                        }
                    }
                }
            }
        }

        let updateInstructions = await this.createUpdateInstructions({
            intervalsFromSubset,
            pointsFromSubset,
            modifiedAdditionalPoints,
            additionalPoints,
        });

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    toggledInterval: [interval.left, interval.right],
                    intervalsFromSubset,
                    pointsFromSubset,
                    additionalPoints,
                },
            },
        });
    }

    async clear({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let updateInstructions = await this.createUpdateInstructions({
            intervalsFromSubset: [],
            pointsFromSubset: [],
            modifiedAdditionalPoints: true,
            additionalPoints: [],
        });

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    cleared: true,
                    intervalsFromSubset: [],
                    pointsFromSubset: [],
                    additionalPoints: [],
                },
            },
        });
    }

    async setToR({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let updateInstructions = await this.createUpdateInstructions({
            intervalsFromSubset: [[-Infinity, Infinity]],
            pointsFromSubset: [],
            modifiedAdditionalPoints: true,
            additionalPoints: [],
        });

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    setToR: true,
                    intervalsFromSubset: [[-Infinity, Infinity]],
                    pointsFromSubset: [],
                    additionalPoints: [],
                },
            },
        });
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }
}

function parseValueIntoSubset({ inputString, format, variable }) {
    if (!inputString) {
        return subsets.EmptySet();
    }

    let expression;
    if (format === "latex") {
        try {
            expression = me.fromLatex(inputString);
        } catch (e) {
            return subsets.EmptySet();
        }
    } else if (format === "text") {
        try {
            expression = me.fromText(inputString);
        } catch (e) {
            return subsets.EmptySet();
        }
    }
    return buildSubsetFromMathExpression(expression, variable);
}
