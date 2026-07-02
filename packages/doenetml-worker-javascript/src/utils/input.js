/**
 * Building blocks shared by all input components (math inputs, text inputs,
 * code editors, boolean inputs, choice inputs, …), independent of the kind of
 * value the input holds.
 */

/**
 * Define a `submitAnswer` external action on an input component that delegates
 * to its `answerAncestor`. Call from the component constructor.
 */
export function defineSubmitAnswerExternalAction(component) {
    component.externalActions = {};

    // Complex because the stateValues isn't defined until later
    Object.defineProperty(component.externalActions, "submitAnswer", {
        enumerable: true,
        get: async function () {
            let answerAncestor = await this.stateValues.answerAncestor;
            if (answerAncestor !== null) {
                return {
                    componentIdx: answerAncestor.componentIdx,
                    actionName: "submitAnswer",
                };
            } else {
                return;
            }
        }.bind(component),
    });
}

/**
 * The `valueChanged` / `immediateValueChanged` essential booleans, public so
 * authors can detect whether a user has edited the input.
 */
export function returnInputValueChangedStateVariableDefinitions({
    valueChangedDescription,
    immediateValueChangedDescription,
} = {}) {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.valueChanged = {
        description: valueChangedDescription,
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
                        value: Boolean(desiredStateVariableValues.valueChanged),
                    },
                ],
            };
        },
    };

    stateVariableDefinitions.immediateValueChanged = {
        description: immediateValueChangedDescription,
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

    return stateVariableDefinitions;
}

/**
 * Build the event recorded when an input's value is committed (or a choice is
 * selected), attaching the `answerAncestor` context when the input is inside an
 * `<answer>`. Awaits the component's `answerAncestor` state variable.
 */
export async function buildInputResponseEvent({
    component,
    verb = "answered",
    response,
    responseText,
}) {
    const event = {
        verb,
        object: {
            componentIdx: component.componentIdx,
            componentType: component.componentType,
        },
        result: {
            response,
            responseText,
        },
    };

    const answerAncestor = await component.stateValues.answerAncestor;
    if (answerAncestor) {
        event.context = {
            answerAncestor: answerAncestor.componentIdx,
        };
    }

    return event;
}

/**
 * The `immediateValue` state variable used by inputs whose value is committed
 * on blur/enter (`textInput`, `codeEditor`): it mirrors `value`, but only
 * follows `value` when `value` itself changes — otherwise it holds the user's
 * in-progress edits. Its inverse writes back to `value` when the change comes
 * from outside (not from the renderer typing into this input).
 */
export function returnImmediateValueStateVariableDefinition({
    description,
    createComponentOfType = "text",
} = {}) {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.immediateValue = {
        description,
        public: true,
        shadowingInstructions: {
            createComponentOfType,
        },
        forRenderer: true,
        hasEssential: true,
        shadowVariable: true,
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

    return stateVariableDefinitions;
}

/**
 * The `updateImmediateValue` action for inputs that commit on blur/enter
 * (`textInput`, `codeEditor`): record the user's in-progress edit into
 * `immediateValue` and flag the component as needing a later `updateValue`.
 * Bind to the component (`inputUpdateImmediateValue.bind(this)`).
 */
export async function inputUpdateImmediateValue({
    text,
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
}) {
    if (!(await this.stateValues.disabled)) {
        return await this.coreFunctions.performUpdate({
            updateInstructions: [
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
            ],
            transient: true,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }
}

/**
 * The `updateValue` action for inputs that commit on blur/enter (`textInput`,
 * `codeEditor`): when `immediateValue` differs from `value`, commit it into
 * `value`, sync `immediateValue` back to the resulting `value`, record the
 * "answered" event, and trigger any chained actions. Bind to the component
 * (`inputUpdateValue.bind(this)`).
 */
export async function inputUpdateValue({
    actionId,
    sourceInformation = {},
    skipRendererUpdate = false,
}) {
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
                // since in updateImmediateValue, immediateValue is not saved to database
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

            let event = await buildInputResponseEvent({
                component: this,
                verb: "answered",
                response: immediateValue,
                responseText: immediateValue,
            });

            await this.coreFunctions.performUpdate({
                updateInstructions,
                actionId,
                sourceInformation,
                skipRendererUpdate: true,
                event,
            });

            return await this.coreFunctions.triggerChainedActions({
                componentIdx: this.componentIdx,
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}
