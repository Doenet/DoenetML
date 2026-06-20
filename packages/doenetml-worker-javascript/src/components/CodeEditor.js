import BlockComponent from "./abstract/BlockComponent";

export default class CodeEditor extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateImmediateValue: this.updateImmediateValue.bind(this),
            updateValue: this.updateValue.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "codeEditor";

    static componentDocs = {
        summary: "An interactive DoenetML code editor",
    };
    static variableForImplicitProp = "value";

    static renderChildren = true;

    static ignoreVariantsFromChildren = true;

    static processWhenJustUpdatedForNewComponent = true;

    static ignoreErrorsFromChildren = true;

    static get stateVariablesShadowedForReference() {
        return ["value"];
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.prefill = {
            description:
                "Initial code shown in the editor before the user types.",
            createComponentOfType: "text",
            createStateVariable: "prefill",
            defaultValue: "",
            public: true,
        };
        attributes.bindValueTo = {
            createComponentOfType: "text",
            description: "Two-way binding target for the input's value.",
        };

        attributes.width = {
            description: 'Editor width (e.g. "100%" or "600px").',
            createComponentOfType: "componentSize",
            createStateVariable: "width",
            defaultValue: { size: `100`, isAbsolute: false },
            forRenderer: true,
            public: true,
        };
        attributes.height = {
            description: 'Editor height (e.g. "500px").',
            createComponentOfType: "componentSize",
            createStateVariable: "height",
            defaultValue: { size: 400, isAbsolute: true },
            forRenderer: true,
            public: true,
        };

        // TODO: deprecate this attribute
        attributes.viewerRatio = {
            createComponentOfType: "number",
            description:
                "Fraction of the editor area allotted to the live viewer.",
        };

        attributes.showResults = {
            description:
                "Whether to render the results panel alongside the editor.",
            createComponentOfType: "boolean",
            createStateVariable: "showResults",
            defaultValue: false,
            forRenderer: true,
            public: true,
        };

        attributes.showFormatter = {
            description: "Whether to show a code formatter button.",
            createComponentOfType: "boolean",
            createStateVariable: "showFormatter",
            defaultValue: false,
            forRenderer: true,
            public: true,
        };

        attributes.resultsLocation = {
            description:
                "Position of the results panel relative to the editor.",
            createComponentOfType: "text",
            createStateVariable: "resultsLocation",
            defaultValue: "bottom",
            forRenderer: true,
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "bottom",
                    description: "Place the results panel below the editor.",
                },
                {
                    value: "left",
                    description:
                        "Place the results panel to the left of the editor.",
                },
                {
                    value: "right",
                    description:
                        "Place the results panel to the right of the editor.",
                },
            ],
        };

        attributes.readOnly = {
            description: "Whether the editor is read-only.",
            createComponentOfType: "boolean",
            createStateVariable: "readOnly",
            defaultValue: false,
            forRenderer: true,
            public: true,
        };

        attributes.initialOpenTab = {
            description: "Which diagnostics/responses tab to open initially.",
            createComponentOfType: "text",
            createStateVariable: "initialOpenTab",
            defaultValue: "first",
            forRenderer: true,
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "none",
                    description: "Panel starts closed.",
                },
                {
                    value: "first",
                    description: "Open the first available tab.",
                },
                {
                    value: "errors",
                    description: "Open the errors tab.",
                },
                {
                    value: "warnings",
                    description: "Open the warnings tab.",
                },
                {
                    value: "info",
                    description: "Open the info tab.",
                },
                {
                    value: "accessibility",
                    description: "Open the accessibility tab.",
                },
                {
                    value: "responses",
                    description: "Open the responses tab.",
                },
                {
                    value: "help",
                    description: "Open the help tab.",
                },
            ],
        };

        // TODO: deprecate these attributes
        // Note: these attributes don't accomplish anything
        // until we can find a way to communicate with the
        // rendered DoenetML again
        attributes.renderedName = {
            createPrimitiveOfType: "string",
            description:
                "Name to assign to the dynamically-rendered DoenetML output.",
        };

        attributes.staticName = {
            createPrimitiveOfType: "string",
            description: "Name to assign to the static DoenetML source.",
        };

        return attributes;
    }

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.prefillFromChildren = {
            returnDependencies: () => ({
                childrenDoenetML: {
                    dependencyType: "doenetML",
                    displayOnlyChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                let prefillFromChildren = dependencyValues.childrenDoenetML;
                if (prefillFromChildren) {
                    prefillFromChildren += "\n";
                }
                return {
                    setValue: { prefillFromChildren },
                };
            },
        };

        stateVariableDefinitions.valueChanged = {
            description:
                "Whether the value has been changed from its initial state.",
            public: true,
            hasEssential: true,
            defaultValue: false,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition() {
                return { useEssentialOrDefaultValue: { valueChanged: true } };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "valueChanged",
                            value: Boolean(
                                desiredStateVariableValues.valueChanged,
                            ),
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.value = {
            description: "The code value of the input.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            hasEssential: true,
            forRenderer: true,
            returnDependencies: () => ({
                bindValueTo: {
                    dependencyType: "attributeComponent",
                    attributeName: "bindValueTo",
                    variableNames: ["value"],
                },
                prefill: {
                    dependencyType: "stateVariable",
                    variableName: "prefill",
                },
                prefillFromChildren: {
                    dependencyType: "stateVariable",
                    variableName: "prefillFromChildren",
                },
                valueChanged: {
                    dependencyType: "stateVariable",
                    variableName: "valueChanged",
                    onlyToSetInInverseDefinition: true,
                },
                immediateValueChanged: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValueChanged",
                    onlyToSetInInverseDefinition: true,
                },
            }),
            definition: function ({ dependencyValues, usedDefault }) {
                if (!dependencyValues.bindValueTo) {
                    return {
                        useEssentialOrDefaultValue: {
                            value: {
                                variablesToCheck: "value",
                                get defaultValue() {
                                    if (usedDefault.prefill) {
                                        return dependencyValues.prefillFromChildren;
                                    } else {
                                        return dependencyValues.prefill;
                                    }
                                },
                            },
                        },
                    };
                }
                return {
                    setValue: {
                        value: dependencyValues.bindValueTo.stateValues.value,
                    },
                };
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let instructions = [
                    {
                        setDependency: "valueChanged",
                        desiredValue: true,
                    },
                    {
                        setDependency: "immediateValueChanged",
                        desiredValue: true,
                    },
                ];

                if (dependencyValues.bindValueTo) {
                    instructions.push({
                        setDependency: "bindValueTo",
                        desiredValue: desiredStateVariableValues.value,
                        variableIndex: 0,
                    });
                } else {
                    // no bindValueTo, so value is essential and give it the desired value
                    instructions.push({
                        setEssentialValue: "value",
                        value: desiredStateVariableValues.value,
                    });
                }

                return { success: true, instructions };
            },
        };

        stateVariableDefinitions.immediateValueChanged = {
            description:
                "Whether the value, including in-progress edits, has been changed from its initial state.",
            public: true,
            hasEssential: true,
            defaultValue: false,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({}),
            definition() {
                return {
                    useEssentialOrDefaultValue: { immediateValueChanged: true },
                };
            },
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "immediateValueChanged",
                            value: Boolean(
                                desiredStateVariableValues.immediateValueChanged,
                            ),
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.immediateValue = {
            description:
                "The code value reflecting the user's in-progress edits.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            hasEssential: true,
            shadowVariable: true,
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
                immediateValueChanged: {
                    dependencyType: "stateVariable",
                    variableName: "immediateValueChanged",
                    onlyToSetInInverseDefinition: true,
                },
            }),
            definition: function ({
                dependencyValues,
                changes,
                justUpdatedForNewComponent,
                usedDefault,
            }) {
                // console.log(`definition of immediateValue`)
                // console.log(dependencyValues)
                // console.log(changes);

                if (
                    changes.value &&
                    !justUpdatedForNewComponent &&
                    !usedDefault.value
                ) {
                    // only update to value when it changes
                    // (otherwise, let its essential value change)
                    return {
                        setValue: { immediateValue: dependencyValues.value },
                        setEssentialValue: {
                            immediateValue: dependencyValues.value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            immediateValue: {
                                variablesToCheck: "immediateValue",
                                defaultValue: dependencyValues.value,
                            },
                        },
                    };
                }
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                initialChange,
                shadowedVariable,
            }) {
                // value is essential; give it the desired value
                let instructions = [
                    {
                        setEssentialValue: "immediateValue",
                        value: desiredStateVariableValues.immediateValue,
                    },
                    {
                        setDependency: "immediateValueChanged",
                        desiredValue: true,
                    },
                ];

                // if from outside sources, also set value
                if (!(initialChange || shadowedVariable)) {
                    instructions.push({
                        setDependency: "value",
                        desiredValue: desiredStateVariableValues.immediateValue,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The current code as a plain text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: function ({ dependencyValues }) {
                return { setValue: { text: dependencyValues.value } };
            },
        };

        stateVariableDefinitions.componentType = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { componentType: "text" } }),
        };

        stateVariableDefinitions.allChildren = {
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { allChildren: dependencyValues.allChildren },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async updateImmediateValue({
        text,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.disabled)) {
            let updateInstructions = [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "immediateValue",
                    value: text,
                },
                {
                    updateType: "setComponentNeedingUpdateValue",
                    componentIdx: this.componentIdx,
                },
            ];

            return await this.coreFunctions.performUpdate({
                updateInstructions,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async updateValue({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        //Only update when value is out of date
        if (!(await this.stateValues.disabled)) {
            let immediateValue = await this.stateValues.immediateValue;

            if ((await this.stateValues.value) !== immediateValue) {
                let updateInstructions = [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "value",
                        value: immediateValue,
                    },
                    // in case value ended up being a different value than requested
                    // we set immediate value to whatever was the result
                    // (hence the need to execute update first)
                    // Also, this makes sure immediateValue is saved to the database,
                    // since in updateImmediateValue, immediateValue is note saved to database
                    {
                        updateType: "executeUpdate",
                    },
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "immediateValue",
                        valueOfStateVariable: "value",
                    },
                    {
                        updateType: "unsetComponentNeedingUpdateValue",
                    },
                ];

                let event = {
                    verb: "answered",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                    result: {
                        response: immediateValue,
                        responseText: immediateValue,
                    },
                };

                let answerAncestor = await this.stateValues.answerAncestor;
                if (answerAncestor) {
                    event.context = {
                        answerAncestor: answerAncestor.componentIdx,
                    };
                }

                await this.coreFunctions.performUpdate({
                    updateInstructions,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate: true,
                    event,
                });
                await this.coreFunctions.triggerChainedActions({
                    componentIdx: this.componentIdx,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                });
            }
        }
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
