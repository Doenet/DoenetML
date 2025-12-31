import BaseComponent from "./BaseComponent";

export default class LineListComponent extends BaseComponent {
    static componentType = "_lineListComponent";
    static rendererType = "containerInline";
    static renderChildren = true;

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["math", "string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let breakStringsIntoLinesBySpaces = function ({
            matchedChildren,
            nComponents,
            stateIdInfo,
        }) {
            // break any string by white space and wrap pieces with line

            let newChildren = matchedChildren.reduce(function (a, c) {
                if (typeof c === "string") {
                    return [
                        ...a,
                        ...c
                            .split(/\s+/)
                            .filter((s) => s)
                            .map((s) => ({
                                type: "serialized",
                                componentType: "line",
                                componentIdx: nComponents++,
                                stateId: stateIdInfo
                                    ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                                    : undefined,
                                children: [s],
                                attributes: {},
                                doenetAttributes: {},
                                state: {},
                            })),
                    ];
                } else {
                    return [...a, c];
                }
            }, []);

            return {
                success: true,
                newChildren: newChildren,
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: breakStringsIntoLinesBySpaces,
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "lines",
                componentTypes: ["line"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numLines = {
            returnDependencies: () => ({
                lineChildren: {
                    dependencyType: "child",
                    childGroups: ["lines"],
                    skipComponentIndices: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        numLines: dependencyValues.lineChildren.length,
                    },
                    checkForActualChange: { numLines: true },
                };
            },
        };

        stateVariableDefinitions.lineNames = {
            isArray: true,
            entryPrefixes: ["lineName"],
            returnArraySizeDependencies: () => ({
                numLines: {
                    dependencyType: "stateVariable",
                    variableName: "numLines",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numLines];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        lineChild: {
                            dependencyType: "child",
                            childGroups: ["lines"],
                            childIndices: [arrayKey],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let lineNames = {};

                for (let arrayKey of arrayKeys) {
                    let lineChild =
                        dependencyValuesByKey[arrayKey].lineChild[0];
                    if (lineChild) {
                        lineNames[arrayKey] = lineChild.componentIdx;
                    }
                }

                return { setValue: { lineNames } };
            },
        };

        return stateVariableDefinitions;
    }
}
