import BlockScoredComponent from "./abstract/BlockScoredComponent";

export default class Pretzel extends BlockScoredComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
            submitAnswer: this.submitAnswer.bind(this),
        });
    }

    static componentType = "pretzel";
    static renderChildren = true;
    static canDisplayChildErrors = true;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        attributes.maxNumColumns = {
            createComponentOfType: "integer",
            createStateVariable: "maxNumColumns",
            defaultValue: 2,
            public: true,
            forRenderer: true,
            clamp: [1, 4],
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "problems",
                componentTypes: ["statement"],
            },
            {
                group: "textInputs",
                componentTypes: ["textInput"],
            },
            {
                group: "givenAnswers",
                componentTypes: ["span"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.textInputs = {
            returnDependencies: () => ({
                textInputs: {
                    dependencyType: "child",
                    childGroups: ["textInputs"],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        textInputs: dependencyValues.textInputs,
                    },
                };
            },
        };

        // TODO: this is a workaround to get to a state variable of the pretzel arranger.
        // We should create a more straightforward way to get that variable.
        stateVariableDefinitions.problemOrder = {
            stateVariablesDeterminingDependencies: ["textInputs"],
            returnDependencies({ stateValues }) {
                if (stateValues.textInputs.length > 0) {
                    return {
                        problemOrder: {
                            dependencyType: "sourceCompositeStateVariable",
                            replacementIdx:
                                stateValues.textInputs[0].componentIdx,
                            variableName: "problemOrder",
                        },
                    };
                } else {
                    return {};
                }
            },
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        problemOrder: dependencyValues.problemOrder ?? [],
                    },
                };
            },
        };

        stateVariableDefinitions.numProblems = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "integer",
            },
            returnDependencies: () => ({
                problemChildren: {
                    dependencyType: "child",
                    childGroups: ["problems"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numProblems: dependencyValues.problemChildren.length,
                    },
                };
            },
        };

        stateVariableDefinitions.currentResponses = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            isArray: true,
            entryPrefixes: ["currentResponse"],
            returnArraySizeDependencies: () => ({
                numProblems: {
                    dependencyType: "stateVariable",
                    variableName: "numProblems",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numProblems];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                const dependenciesByKey = {};
                for (const arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        textInput: {
                            dependencyType: "child",
                            childGroups: ["textInputs"],
                            childIndices: [arrayKey],
                            variableNames: ["value"],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey }) {
                const currentResponses = {};

                for (const arrayKey in dependencyValuesByKey) {
                    currentResponses[arrayKey] =
                        dependencyValuesByKey[
                            arrayKey
                        ].textInput[0].stateValues.value;
                }

                return {
                    setValue: { currentResponses },
                };
            },
        };

        stateVariableDefinitions.creditAchievedIfSubmit = {
            returnDependencies: () => ({
                problemOrder: {
                    dependencyType: "stateVariable",
                    variableName: "problemOrder",
                },
                currentResponses: {
                    dependencyType: "stateVariable",
                    variableName: "currentResponses",
                },
            }),
            definition({ dependencyValues }) {
                const problemOrder = dependencyValues.problemOrder.map(
                    (p) => p - 1,
                );

                const numProblems = problemOrder.length;

                const offsets = dependencyValues.currentResponses.map(
                    (resp, i) =>
                        ((resp.trim() === "" ? NaN : Number(resp)) -
                            dependencyValues.problemOrder[i] +
                            numProblems) %
                        numProblems,
                );

                const offset0 = offsets[0];

                const sameOffsets = offsets
                    .slice(1)
                    .every((offset) => offset === offset0);

                return {
                    setValue: { creditAchievedIfSubmit: sameOffsets ? 1 : 0 },
                };
            },
        };

        stateVariableDefinitions.numSubmittedResponses = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            hasEssential: true,
            defaultValue: 0,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    numSubmittedResponses: true,
                },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "numSubmittedResponses",
                            value: desiredStateVariableValues.numSubmittedResponses,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.submittedResponses = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            isArray: true,
            allowExtraArrayKeysInInverse: true,
            entryPrefixes: ["submittedResponse"],
            defaultValueByArrayKey: () => "\uFF3F",
            hasEssential: true,
            inverseShadowToSetEntireArray: true,
            doNotCombineInverseArrayInstructions: true,
            returnArraySizeDependencies: () => ({
                numSubmittedResponses: {
                    dependencyType: "stateVariable",
                    variableName: "numSubmittedResponses",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numSubmittedResponses];
            },
            returnArrayDependenciesByKey() {
                let globalDependencies = {
                    numSubmittedResponses: {
                        dependencyType: "stateVariable",
                        variableName: "numSubmittedResponses",
                    },
                };
                return { globalDependencies };
            },
            arrayDefinitionByKey({ globalDependencyValues }) {
                let componentType = [];

                if (globalDependencyValues.submittedResponsesComponentType) {
                    componentType.push(
                        ...globalDependencyValues.submittedResponsesComponentType.slice(
                            0,
                            globalDependencyValues.numSubmittedResponses,
                        ),
                    );
                }

                let essentialSubmittedResponses = {};

                for (
                    let ind = 0;
                    ind < globalDependencyValues.numSubmittedResponses;
                    ind++
                ) {
                    // this function doesn't change the values once they set for the first time
                    // (The values will just be changed using the inverse function)
                    essentialSubmittedResponses[ind] = true;
                }

                return {
                    useEssentialOrDefaultValue: {
                        submittedResponses: essentialSubmittedResponses,
                    },
                };
            },
            inverseArrayDefinitionByKey: function ({
                desiredStateVariableValues,
                initialChange,
            }) {
                if (!initialChange) {
                    return { success: false };
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "numSubmittedResponses",
                            desiredValue:
                                desiredStateVariableValues.submittedResponses
                                    .length,
                        },
                        {
                            setEssentialValue: "submittedResponses",
                            value: [
                                ...desiredStateVariableValues.submittedResponses,
                            ],
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.showCheckWork = {
            forRenderer: true,
            returnDependencies: () => ({
                suppressCheckWork: {
                    dependencyType: "stateVariable",
                    variableName: "suppressCheckWork",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        showCheckWork: !dependencyValues.suppressCheckWork,
                    },
                };
            },
        };

        return stateVariableDefinitions;
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

    async submitAnswer({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        const numAttemptsLeft = await this.stateValues.numAttemptsLeft;
        if (numAttemptsLeft < 1) {
            return;
        }

        const disabled = await this.stateValues.disabled;
        if (disabled) {
            return;
        }

        const creditAchieved = (await this.stateValues.handGraded)
            ? 0
            : await this.stateValues.creditAchievedIfSubmit;

        // request to update credit
        let instructions = [
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "creditAchieved",
                value: creditAchieved,
            },
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "responseHasBeenSubmitted",
                value: true,
            },
        ];

        // add submitted responses to instruction for answer
        let currentResponses = await this.stateValues.currentResponses;

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "submittedResponses",
            value: currentResponses,
        });

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "justSubmitted",
            value: true,
        });

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "creditAchievedDependenciesAtSubmit",
            value: await this.stateValues.creditAchievedDependencies,
        });

        instructions.push({
            updateType: "updateValue",
            componentIdx: this.componentIdx,
            stateVariable: "numSubmissions",
            value: (await this.stateValues.numSubmissions) + 1,
        });

        if (creditAchieved < 1) {
            instructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "numIncorrectSubmissions",
                value: (await this.stateValues.numIncorrectSubmissions) + 1,
            });
        }

        const responseText = [];
        for (const response of currentResponses) {
            if (response.toString) {
                try {
                    responseText.push(response.toString());
                } catch (e) {
                    responseText.push("\uff3f");
                }
            } else {
                responseText.push(response);
            }
        }

        instructions.push({
            updateType: "recordItemSubmission",
            componentNumber: await this.stateValues.inComponentNumber,
            submittedComponent: this.componentIdx,
            response: currentResponses,
            responseText,
            creditAchieved,
        });

        await this.coreFunctions.performUpdate({
            updateInstructions: instructions,
            actionId,
            sourceInformation,
            skipRendererUpdate: true,
            event: {
                verb: "submitted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                    answerNumber: this.answerNumber,
                    rootName: this.rootName,
                },
                result: {
                    response: currentResponses,
                    responseText,
                    componentTypes: Array(currentResponses.length).fill("text"),
                    creditAchieved,
                },
            },
        });

        return await this.coreFunctions.triggerChainedActions({
            componentIdx: this.componentIdx,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }
}
