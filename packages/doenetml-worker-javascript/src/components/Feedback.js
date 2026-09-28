import BlockComponent from "./abstract/BlockComponent";

export default class Feedback extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            updateHide: this.updateHide.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "feedback";

    static componentDocs = {
        summary: "Targeted feedback shown when conditions are met",
    };
    static renderChildren = true;

    static primaryStateVariableForDefinition = "feedbackText";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        delete attributes.hide;
        attributes.condition = {
            createComponentOfType: "boolean",
            description:
                "Boolean expression; the feedback is shown when the condition is true.",
        };
        attributes.updateWith = {
            createReferences: true,
            description:
                "References whose changes trigger re-evaluation of the feedback.",
        };

        return attributes;
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

        stateVariableDefinitions.updateWith = {
            returnDependencies: () => ({
                updateWith: {
                    dependencyType: "attributeRefResolutions",
                    attributeName: "updateWith",
                },
            }),
            definition({ dependencyValues }) {
                let updateWith = [];
                if (dependencyValues.updateWith !== null) {
                    for (let refResolution of dependencyValues.updateWith) {
                        if (refResolution.unresolvedPath === null) {
                            updateWith.push(refResolution.componentIdx);
                        }
                    }
                }

                if (updateWith.length === 0) {
                    updateWith = null;
                }

                return { setValue: { updateWith } };
            },
        };

        stateVariableDefinitions.updateWithComponentIds = {
            chainActionOnActionOfStateVariableTargets: {
                triggeredAction: "updateHide",
            },
            returnDependencies: () => ({
                updateWith: {
                    dependencyType: "stateVariable",
                    variableName: "updateWith",
                },
            }),
            definition({ dependencyValues }) {
                let updateWithComponentIds = [];

                if (dependencyValues.updateWith) {
                    for (let cIdx of dependencyValues.updateWith) {
                        if (!updateWithComponentIds.includes(cIdx)) {
                            updateWithComponentIds.push(cIdx);
                        }
                    }
                }

                return { setValue: { updateWithComponentIds } };
            },
            markStale() {
                return { updateActionChaining: true };
            },
        };

        stateVariableDefinitions.hideWhenUpdated = {
            returnDependencies: () => ({
                condition: {
                    dependencyType: "attributeComponent",
                    attributeName: "condition",
                    variableNames: ["value"],
                },
                showFeedback: {
                    dependencyType: "flag",
                    flagName: "showFeedback",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (!dependencyValues.showFeedback) {
                    return { setValue: { hideWhenUpdated: true } };
                }

                let hideWhenUpdated;
                if (dependencyValues.condition === null) {
                    hideWhenUpdated = false;
                } else {
                    hideWhenUpdated =
                        !dependencyValues.condition.stateValues.value;
                }

                return { setValue: { hideWhenUpdated } };
            },
        };

        // True when this feedback comes from an empty prop, such as
        // `$award.feedback` for an award with no feedback, so it is hidden.
        // A plain copy (from `extend`, a reference, or `<shuffle>`) has no
        // prop variable of its own and inherits the value from its source,
        // so a copy of an empty prop is hidden too.
        stateVariableDefinitions.fromEmptyProp = {
            returnDependencies: () => ({
                propShadowSource: {
                    dependencyType: "shadowSource",
                    givePropVariableValue: true,
                },
                copySource: {
                    dependencyType: "shadowSource",
                    variableNames: ["fromEmptyProp"],
                },
            }),
            definition: function ({ dependencyValues }) {
                // Only a prop shadow gets the prop variable's value
                const propValues =
                    dependencyValues.propShadowSource?.stateValues;
                if (propValues && Object.keys(propValues).length > 0) {
                    return {
                        setValue: {
                            fromEmptyProp:
                                Object.values(propValues)[0] == undefined,
                        },
                    };
                }

                return {
                    setValue: {
                        fromEmptyProp: Boolean(
                            dependencyValues.copySource?.stateValues
                                ?.fromEmptyProp,
                        ),
                    },
                };
            },
        };

        stateVariableDefinitions.hide = {
            forRenderer: true,
            defaultValue: true,
            hasEssential: true,
            returnDependencies: () => ({
                updateWith: {
                    dependencyType: "stateVariable",
                    variableName: "updateWith",
                },
                condition: {
                    dependencyType: "attributeComponent",
                    attributeName: "condition",
                    variableNames: ["value"],
                },
                showFeedback: {
                    dependencyType: "flag",
                    flagName: "showFeedback",
                },
                fromEmptyProp: {
                    dependencyType: "stateVariable",
                    variableName: "fromEmptyProp",
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.updateWith) {
                    return {
                        useEssentialOrDefaultValue: { hide: true },
                    };
                }

                if (!dependencyValues.showFeedback) {
                    return { setValue: { hide: true } };
                }

                if (dependencyValues.fromEmptyProp) {
                    return { setValue: { hide: true } };
                }

                let hide;
                if (dependencyValues.condition === null) {
                    hide = false;
                } else {
                    hide = !dependencyValues.condition.stateValues.value;
                }

                return { setValue: { hide } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (!dependencyValues.updateWith) {
                    return { success: false };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "hide",
                                value: desiredStateVariableValues.hide,
                            },
                        ],
                    };
                }
            },
        };

        // for case when created from a copy prop
        stateVariableDefinitions.feedbackText = {
            forRenderer: true,
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    feedbackText: true,
                },
            }),
        };

        return stateVariableDefinitions;
    }

    async updateHide({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let updateInstructions = [
            {
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "hide",
                value: await this.stateValues.hideWhenUpdated,
            },
        ];

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
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
