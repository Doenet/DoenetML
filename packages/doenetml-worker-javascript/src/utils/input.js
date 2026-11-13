import { fingerprint } from "./fingerprint";

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
 * The state variable, named `valueUnderEditName`, holding the reader's last
 * edit of an input (its `immediateValue`): `{ value, edit }`, fingerprints of
 * the value the edit was typed over and of the edit typed
 * (`valueUnderEditRecord`). It is saved, so that an input made again from
 * saved state after the document has loaded can tell whether its saved
 * `immediateValue` is still that edit, and its value still the one the edit
 * was typed over (`immediateValueFollowsValue`).
 */
export function returnValueUnderEditDefinition(valueUnderEditName) {
    return {
        [valueUnderEditName]: {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { [valueUnderEditName]: true },
            }),
            inverseDefinition: ({ desiredStateVariableValues }) => ({
                success: true,
                instructions: [
                    {
                        setEssentialValue: valueUnderEditName,
                        value: desiredStateVariableValues[valueUnderEditName],
                    },
                ],
            }),
        },
    };
}

/**
 * Whether an input's `immediateValue`, the reader's in-progress edit, is set
 * to its `value`, which it follows only when the value changes.
 *
 * A value restored from saved state is not a change, as the document loads:
 * the saved `immediateValue` is what the reader saw. But a saved
 * `immediateValue` is brought up to date only when it is computed, so one
 * saved while the input was withheld (in a case not shown) can be older than
 * its value, which can change meanwhile (`bindValueTo`). An input made from
 * saved state after the document has loaded (when the case is shown again,
 * or shown for the first time since a reload) therefore keeps the saved
 * `immediateValue` (`savedImmediateValue`) only if it is still the reader's
 * last edit and its value is still the one that edit was typed over
 * (`valueUnderEdit`), and otherwise follows its value, as it would have had
 * it been shown (#2325). An edit the value replaced while the input was
 * shown is not kept, even when the value has come back to what it was typed
 * over.
 */
export function immediateValueFollowsValue({
    valueChanged,
    valueUsedDefault,
    justUpdatedForNewComponent,
    justRestoredAtLoad,
    value,
    valueUnderEdit,
    savedImmediateValue,
}) {
    if (!valueChanged || valueUsedDefault) {
        return false;
    }
    if (!justUpdatedForNewComponent) {
        return true;
    }
    if (justRestoredAtLoad) {
        return false;
    }
    return !(
        valueUnderEdit != null &&
        valueUnderEdit.value !== undefined &&
        valueUnderEdit.value === fingerprint(value) &&
        valueUnderEdit.edit === fingerprint(savedImmediateValue)
    );
}

/**
 * What `valueUnderEdit` holds of an edit `edit` typed over the value
 * `value`: a fingerprint of each, rather than the values, which the saved
 * state holds already as the input's `immediateValue` and `value`. Held
 * again, they would double what an input's edit costs the saved state
 * (Doenet/DoenetML#1940). `edit` is the value saved as `immediateValue`.
 */
export function valueUnderEditRecord({ value, edit }) {
    return { value: fingerprint(value), edit: fingerprint(edit) };
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
    const stateVariableDefinitions =
        returnValueUnderEditDefinition("valueUnderEdit");

    stateVariableDefinitions.immediateValue = {
        // the saved edit, kept only if still the last (`valueUnderEdit`)
        provideEssentialValuesInDefinition: true,
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
            valueUnderEdit: {
                dependencyType: "stateVariable",
                variableName: "valueUnderEdit",
                // bookkeeping, not part of the value (`valueUnderEdit`)
                notInRecursiveDependencyValues: true,
            },
        }),
        definition: function ({
            dependencyValues,
            changes,
            justUpdatedForNewComponent,
            justRestoredAtLoad,
            essentialValues,
            usedDefault,
        }) {
            if (
                immediateValueFollowsValue({
                    valueChanged: changes.value,
                    valueUsedDefault: usedDefault.value,
                    justUpdatedForNewComponent,
                    justRestoredAtLoad,
                    value: dependencyValues.value,
                    valueUnderEdit: dependencyValues.valueUnderEdit,
                    savedImmediateValue: essentialValues.immediateValue,
                })
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
            dependencyValues,
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
                {
                    setDependency: "valueUnderEdit",
                    desiredValue: valueUnderEditRecord({
                        value: dependencyValues.value,
                        edit: desiredStateVariableValues.immediateValue,
                    }),
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
            // Deliberately NOT `transient`. That flag means "a step of a
            // continuous interaction, whose downstream may settle after the
            // interaction rather than during it", and a keystroke's downstream has
            // to keep up: an `<answer>`'s check-work button must drop "Incorrect"
            // on the first character of a correction, and a `$input.immediateValue`
            // echo would otherwise freeze for the length of a typing burst.
            // A keystroke was marked transient until Doenet/DoenetML#1990, to keep
            // it out of the saved state -- but that guard (`if (!transient)` around
            // saving) went away in Doenet/DoenetML#1035 and saving is debounced
            // instead, so the flag had no reader left here.
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
