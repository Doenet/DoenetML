import MathComponent from "./Math";
import me from "math-expressions";
import { deepClone } from "@doenet/utils";
import {
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";

export default class PeriodicSet extends MathComponent {
    static componentType = "periodicSet";

    static componentDocs = {
        summary: "A periodic set of real numbers",
    };
    static rendererType = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.minIndex = {
            description:
                "Smallest period index considered when listing offsets.",
            createComponentOfType: "integer",
            createStateVariable: "minIndex",
            defaultValue: -Infinity,
            public: true,
        };

        attributes.maxIndex = {
            description:
                "Largest period index considered when listing offsets.",
            createComponentOfType: "integer",
            createStateVariable: "maxIndex",
            defaultValue: Infinity,
            public: true,
        };

        attributes.offsets = {
            description: "Offsets within one period.",
            createComponentOfType: "mathList",
            createStateVariable: "offsets",
            defaultValue: null,
            public: true,
        };

        attributes.period = {
            description: "The period of the set.",
            createComponentOfType: "math",
            createStateVariable: "period",
            defaultValue: null,
            public: true,
        };

        attributes.minIndexAsList = {
            description: "Smallest period index when rendered as a list.",
            createComponentOfType: "integer",
            createStateVariable: "minIndexAsList",
            defaultValue: -1,
            public: true,
        };
        attributes.maxIndexAsList = {
            description: "Largest period index when rendered as a list.",
            createComponentOfType: "integer",
            createStateVariable: "maxIndexAsList",
            defaultValue: 1,
            public: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        delete stateVariableDefinitions.codePre;
        delete stateVariableDefinitions.expressionWithCodes;
        delete stateVariableDefinitions.mathChildrenFunctionSymbols;
        delete stateVariableDefinitions.codesAdjacentToStrings;
        delete stateVariableDefinitions.mathChildrenByVectorComponent;
        delete stateVariableDefinitions.mathChildrenWithCanBeModified;
        delete stateVariableDefinitions.unordered;

        let roundingDefinitions = returnNumberDisplayStateVariableDefinitions({
            mathChildGroups: [],
            otherChildGroups: [],
        });
        Object.assign(stateVariableDefinitions, roundingDefinitions);

        stateVariableDefinitions.canBeModified = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { canBeModified: false } }),
        };

        stateVariableDefinitions.numOffsets = {
            description: "The number of distinct offsets within one period.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                offsets: {
                    dependencyType: "stateVariable",
                    variableName: "offsets",
                },
            }),
            definition({ dependencyValues }) {
                let numOffsets = 0;
                if (dependencyValues.offsets !== null) {
                    numOffsets = dependencyValues.offsets.length;
                }
                return { setValue: { numOffsets } };
            },
        };

        stateVariableDefinitions.unnormalizedValue = {
            returnDependencies: () => ({
                offsets: {
                    dependencyType: "stateVariable",
                    variableName: "offsets",
                },
                period: {
                    dependencyType: "stateVariable",
                    variableName: "period",
                },
                minIndex: {
                    dependencyType: "stateVariable",
                    variableName: "minIndex",
                },
                maxIndex: {
                    dependencyType: "stateVariable",
                    variableName: "maxIndex",
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.offsets === null ||
                    dependencyValues.offsets.length === 0 ||
                    (dependencyValues.offsets.length === 1 &&
                        dependencyValues.offsets[0].tree === "\uff3f") ||
                    dependencyValues.period === null ||
                    dependencyValues.period.tree === "\uff3f"
                ) {
                    return {
                        setValue: { unnormalizedValue: me.fromAst("\uff3f") },
                    };
                }

                let periodicInfo = [];
                let period = dependencyValues.period.tree;
                let minIndex = dependencyValues.minIndex;
                let maxIndex = dependencyValues.maxIndex;

                for (let offset of dependencyValues.offsets) {
                    periodicInfo.push([
                        "tuple",
                        offset.tree,
                        period,
                        minIndex,
                        maxIndex,
                    ]);
                }

                let unnormalizedValue = me.fromAst([
                    "periodic_set",
                    ...periodicInfo,
                ]);

                return { setValue: { unnormalizedValue } };
            },
        };

        stateVariableDefinitions.redundantOffsets = {
            description: "Offsets that are redundant given the period.",
            additionalStateVariablesDefined: ["uniqueOffsets"],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                numOffsets: {
                    dependencyType: "stateVariable",
                    variableName: "numOffsets",
                },
                offsets: {
                    dependencyType: "stateVariable",
                    variableName: "offsets",
                },
                period: {
                    dependencyType: "stateVariable",
                    variableName: "period",
                },
            }),
            definition({ dependencyValues }) {
                // check if have duplicate offsets
                let redundantOffsets = false;
                let uniqueOffsets = [];
                if (dependencyValues.period !== null) {
                    let periodValue =
                        dependencyValues.period.evaluate_to_constant();
                    if (!Number.isNaN(periodValue)) {
                        for (
                            let ind1 = 0;
                            ind1 < dependencyValues.numOffsets;
                            ind1++
                        ) {
                            let isUnique = true;
                            for (let ind2 = 0; ind2 < ind1; ind2++) {
                                let offsetDiff = dependencyValues.offsets[ind1]
                                    .subtract(dependencyValues.offsets[ind2])
                                    .evaluate_to_constant();
                                if (
                                    Math.abs(offsetDiff % periodValue) <
                                    1e-10 * periodValue
                                ) {
                                    redundantOffsets = true;
                                    isUnique = false;
                                    break;
                                }
                            }
                            if (isUnique) {
                                uniqueOffsets.push(
                                    dependencyValues.offsets[ind1],
                                );
                            }
                        }
                    }
                }

                return { setValue: { redundantOffsets, uniqueOffsets } };
            },
        };

        stateVariableDefinitions.asList = {
            description:
                "The periodic set rendered as a list of explicit values.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "mathList",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                uniqueOffsets: {
                    dependencyType: "stateVariable",
                    variableName: "uniqueOffsets",
                },
                period: {
                    dependencyType: "stateVariable",
                    variableName: "period",
                },
                minIndexAsList: {
                    dependencyType: "stateVariable",
                    variableName: "minIndexAsList",
                },
                maxIndexAsList: {
                    dependencyType: "stateVariable",
                    variableName: "maxIndexAsList",
                },
            }),
            definition({ dependencyValues }) {
                let asList = [];
                // remove redundant offsets
                if (dependencyValues.period !== null) {
                    let periodValue =
                        dependencyValues.period.evaluate_to_constant();
                    if (!Number.isNaN(periodValue)) {
                        let period = dependencyValues.period.simplify();

                        let allFinite = true;
                        let shiftedOffsetsWithNumeric = [];
                        for (let offset of dependencyValues.uniqueOffsets) {
                            let offsetValue = offset.evaluate_to_constant();
                            if (Number.isNaN(offsetValue)) {
                                allFinite = false;
                                break;
                            } else {
                                let shiftedOffset = offset
                                    .subtract(
                                        period.multiply(
                                            Math.floor(
                                                offsetValue / periodValue,
                                            ),
                                        ),
                                    )
                                    .simplify();
                                let shiftedOffsetValue =
                                    shiftedOffset.evaluate_to_constant();
                                shiftedOffsetsWithNumeric.push({
                                    num: shiftedOffsetValue,
                                    offset: shiftedOffset,
                                });
                            }
                        }

                        if (allFinite) {
                            asList.push(me.fromAst(["ldots"]));
                            // sort by numeric value
                            shiftedOffsetsWithNumeric.sort(
                                (a, b) => a.num - b.num,
                            );

                            let minIndex = -1,
                                maxIndex = 1;

                            if (
                                Number.isFinite(dependencyValues.minIndexAsList)
                            ) {
                                minIndex = dependencyValues.minIndexAsList;
                            }
                            if (
                                Number.isFinite(dependencyValues.maxIndexAsList)
                            ) {
                                maxIndex = dependencyValues.maxIndexAsList;
                            }

                            for (let i = minIndex; i <= maxIndex; i++) {
                                for (let offsetObj of shiftedOffsetsWithNumeric) {
                                    asList.push(
                                        offsetObj.offset
                                            .add(period.multiply(i))
                                            .simplify(),
                                    );
                                }
                            }
                            asList.push(me.fromAst(["ldots"]));
                        }
                    }
                }

                return { setValue: { asList } };
            },
        };

        return stateVariableDefinitions;
    }
}
