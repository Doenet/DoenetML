import BaseComponent from "../abstract/BaseComponent";
import { textFromChildren } from "../../utils/text";

export class Evaluation extends BaseComponent {
    static componentType = "evaluation";
    static rendererType = undefined;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.forRubric = {
            createTargetComponentNames: true,
        };

        attributes.credit = {
            createComponentOfType: "number",
            createStateVariable: "credit",
            defaultValue: 0,
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

        stateVariableDefinitions.forRubric = {
            returnDependencies: () => ({
                forRubric: {
                    dependencyType: "attributeTargetComponentNames",
                    attributeName: "forRubric",
                },
            }),
            definition({ dependencyValues }) {
                let forRubric = null;
                if (dependencyValues.forRubric?.length === 1) {
                    forRubric = dependencyValues.forRubric[0].absoluteName;
                }
                return { setValue: { forRubric } };
            },
        };

        stateVariableDefinitions.evaluation = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let evaluation = textFromChildren(
                    dependencyValues.inlineChildren,
                );

                return { setValue: { evaluation } };
            },
        };

        stateVariableDefinitions.data = {
            returnDependencies: () => ({
                credit: {
                    dependencyType: "stateVariable",
                    variableName: "credit",
                },
                forRubric: {
                    dependencyType: "stateVariable",
                    variableName: "forRubric",
                },
                evaluation: {
                    dependencyType: "stateVariable",
                    variableName: "evaluation",
                },
            }),
            definition({ dependencyValues }) {
                const data = {
                    credit: dependencyValues.credit,
                    forRubric: dependencyValues.forRubric,
                    evaluation: dependencyValues.evaluation,
                };

                return { setValue: { data } };
            },
        };

        return stateVariableDefinitions;
    }
}

export class Evaluations extends BaseComponent {
    static componentType = "evaluations";
    static rendererType = undefined;

    static returnChildGroups() {
        return [
            {
                group: "evaluation",
                componentTypes: ["evaluation"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.data = {
            returnDependencies: () => ({
                evaluationChildren: {
                    dependencyType: "child",
                    childGroups: ["evaluation"],
                    variableNames: ["data"],
                },
            }),
            definition({ dependencyValues }) {
                const data = dependencyValues.evaluationChildren.map(
                    (c) => c.stateValues.data,
                );

                return { setValue: { data } };
            },
        };

        return stateVariableDefinitions;
    }
}
