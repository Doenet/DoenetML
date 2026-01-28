import { renameStateVariable } from "../utils/stateVariables";
import { textFromChildren } from "../utils/text";
import InlineComponent from "./abstract/InlineComponent";
import me from "math-expressions";

export default class Choice extends InlineComponent {
    static componentType = "choice";
    static rendererType = "containerInline";
    static renderChildren = true;

    static variableForImplicitProp = "submitted";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.credit = {
            createComponentOfType: "number",
            createStateVariable: "credit",
            defaultValue: 0,
            public: true,
            attributesForCreatedComponent: { convertBoolean: "true" },
        };
        attributes.feedbackCodes = {
            createComponentOfType: "textList",
            createStateVariable: "feedbackCodes",
            defaultValue: [],
            public: true,
        };
        attributes.feedbackText = {
            createComponentOfType: "text",
            createStateVariable: "feedbackText",
            defaultValue: null,
            public: true,
        };
        attributes.preSelect = {
            createComponentOfType: "boolean",
            createStateVariable: "preSelect",
            defaultValue: false,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "children",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        // rename disabled to disabledOriginal
        renameStateVariable({
            stateVariableDefinitions,
            oldName: "disabled",
            newName: "disabledOriginal",
        });

        // The text state variable uses hiddenIgnoreParent
        // rather than hidden so that it does not depend
        // on the hidden state variable of its ancestors.
        // If a multiple choice is inside a cascade,
        // the hidden of the parent could change after answer submission.
        // Since a choice's text could be a credit achieved dependency
        // of the answer, this could lead to the answer's justSubmitted
        // state variable becoming false immediately after submission.
        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["children"],
                    variableNames: ["text", "hiddenIgnoreParent"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                const inlineChildren = dependencyValues.inlineChildren.map(
                    (child) => {
                        if (typeof child !== "object") {
                            return child;
                        } else {
                            child = { ...child };
                            child.stateValues = { ...child.stateValues };
                            child.stateValues.hidden =
                                child.stateValues.hiddenIgnoreParent;
                            delete child.stateValues.hiddenIgnoreParent;
                            return child;
                        }
                    },
                );

                inlineChildren.compositeReplacementRange =
                    dependencyValues.inlineChildren.compositeReplacementRange;

                let text = textFromChildren(inlineChildren);

                return { setValue: { text } };
            },
        };

        stateVariableDefinitions.math = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "math",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["children"],
                    variableNames: ["value", "latex"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let math = null;

                if (dependencyValues.inlineChildren.length === 1) {
                    let child = dependencyValues.inlineChildren[0];
                    if (typeof child === "object") {
                        let value = child.stateValues.value;
                        if (value instanceof me.class) {
                            math = value;
                        } else if (typeof value === "number") {
                            math = me.fromAst(value);
                        } else if (
                            typeof child.stateValues.latex === "string"
                        ) {
                            try {
                                math = me.fromLatex(child.stateValues.latex);
                            } catch (e) {}
                        }
                    }
                }

                return { setValue: { math } };
            },
        };

        stateVariableDefinitions.selected = {
            defaultValue: false,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                countAmongSiblings: {
                    dependencyType: "countAmongSiblings",
                    sameType: true,
                },
                childIndicesSelected: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "choiceInput",
                    variableName: "childIndicesSelected",
                },
                // Note: existence of primary shadow means that the choice is inside a shuffle or sort
                // and the replacement from the shuffle/sort is the primary shadow (and the only one visible to parent)
                primaryShadow: {
                    dependencyType: "primaryShadow",
                    variableNames: ["selected"],
                },
            }),
            definition({ dependencyValues }) {
                let selected;
                if (dependencyValues.childIndicesSelected) {
                    selected = dependencyValues.childIndicesSelected.includes(
                        dependencyValues.countAmongSiblings,
                    );
                } else if (dependencyValues.primaryShadow) {
                    selected =
                        dependencyValues.primaryShadow.stateValues.selected;
                } else {
                    selected = false;
                }

                return { setValue: { selected } };
            },
        };

        stateVariableDefinitions.submitted = {
            defaultValue: false,
            hasEssential: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            doNotShadowEssential: true,
            additionalStateVariablesDefined: [
                {
                    variableName: "hasBeenSubmitted",
                    defaultValue: false,
                    hasEssential: true,
                    doNotShadowEssential: true,
                },
            ],
            returnDependencies: () => ({
                // Note: existence of primary shadow means that the choice is inside a shuffle or sort
                // and the replacement from the shuffle/sort is the primary shadow (and the only one visible to parent)
                primaryShadow: {
                    dependencyType: "primaryShadow",
                    variableNames: ["submitted", "hasBeenSubmitted"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.primaryShadow) {
                    return {
                        setValue: {
                            submitted:
                                dependencyValues.primaryShadow.stateValues
                                    .submitted,
                            hasBeenSubmitted:
                                dependencyValues.primaryShadow.stateValues
                                    .hasBeenSubmitted,
                        },
                    };
                } else
                    return {
                        useEssentialOrDefaultValue: {
                            submitted: true,
                            hasBeenSubmitted: true,
                        },
                    };
            },
            inverseDefinition: function ({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (dependencyValues.primaryShadow) {
                    // if have a primary shadow, then inverse definition should never be called
                    // as it will be called only on the shadow
                    return { success: false };
                } else {
                    const instructions = [
                        {
                            setEssentialValue: "submitted",
                            value: desiredStateVariableValues.submitted,
                        },
                    ];
                    if (desiredStateVariableValues.submitted) {
                        instructions.push({
                            setEssentialValue: "hasBeenSubmitted",
                            value: desiredStateVariableValues.submitted,
                        });
                    }
                    return {
                        success: true,
                        instructions,
                    };
                }
            },
        };

        stateVariableDefinitions.disabled = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            forRenderer: true,
            returnDependencies: () => ({
                disabledOriginal: {
                    dependencyType: "stateVariable",
                    variableName: "disabledOriginal",
                },
                hasBeenSubmitted: {
                    dependencyType: "stateVariable",
                    variableName: "hasBeenSubmitted",
                },
                credit: {
                    dependencyType: "stateVariable",
                    variableName: "credit",
                },
                disableWrongChoices: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "choiceInput",
                    variableName: "disableWrongChoices",
                },
                selectMultiple: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "choiceInput",
                    variableName: "selectMultiple",
                },
            }),
            definition({ dependencyValues }) {
                const disabled =
                    dependencyValues.disabledOriginal ||
                    (dependencyValues.disableWrongChoices &&
                        dependencyValues.hasBeenSubmitted &&
                        dependencyValues.credit < 1 &&
                        !dependencyValues.selectMultiple);
                return { setValue: { disabled } };
            },
        };

        stateVariableDefinitions.feedbacks = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "feedbacktext",
            },
            // isArray: true,
            // entireArrayAtOnce: true,
            // entryPrefixes: ['feedback'],
            returnDependencies: () => ({
                feedbackText: {
                    dependencyType: "stateVariable",
                    variableName: "feedbackText",
                },
                feedbackCodes: {
                    dependencyType: "stateVariable",
                    variableName: "feedbackCodes",
                },
                feedbackDefinitionAncestor: {
                    dependencyType: "ancestor",
                    variableNames: ["feedbackDefinitions"],
                },
                submitted: {
                    dependencyType: "stateVariable",
                    variableName: "submitted",
                },
            }),
            definition({ dependencyValues }) {
                if (!dependencyValues.submitted) {
                    return { setValue: { feedbacks: [] } };
                }

                let feedbacks = [];

                let feedbackDefinitions =
                    dependencyValues.feedbackDefinitionAncestor.stateValues
                        .feedbackDefinitions;

                for (let feedbackCode of dependencyValues.feedbackCodes) {
                    let code = feedbackCode.toLowerCase();
                    let feedbackText = feedbackDefinitions[code];
                    if (feedbackText) {
                        feedbacks.push(feedbackText);
                    }
                }

                if (dependencyValues.feedbackText !== null) {
                    feedbacks.push(dependencyValues.feedbackText);
                }

                return { setValue: { feedbacks } };
            },
        };

        return stateVariableDefinitions;
    }

    static includeBlankStringChildren = true;

    static adapters = ["text", "math"];
}
