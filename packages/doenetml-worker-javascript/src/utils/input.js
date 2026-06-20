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
