import BaseComponent from "./abstract/BaseComponent";

export class FeedbackDefinition extends BaseComponent {
    static componentType = "feedbackDefinition";

    static componentDocs = {
        summary:
            "A reusable feedback definition referenced by other components",
    };
    static rendererType = undefined;

    static inSchemaOnlyInheritAs = [];

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.code = {
            createComponentOfType: "text",
            description:
                "Identifier used to reference this feedback definition.",
        };
        attributes.text = {
            createComponentOfType: "text",
            description: "Default feedback text for this code.",
        };
        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.feedbackDefinition = {
            returnDependencies: () => ({
                codeAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "code",
                    variableNames: ["value"],
                },
                textAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "text",
                    variableNames: ["value"],
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.codeAttr !== null &&
                    dependencyValues.textAttr !== null
                ) {
                    let code =
                        dependencyValues.codeAttr.stateValues.value.toLowerCase();
                    return {
                        setValue: {
                            feedbackDefinition: {
                                [code]: dependencyValues.textAttr.stateValues
                                    .value,
                            },
                        },
                    };
                } else {
                    return {
                        setValue: { feedbackDefinition: null },
                    };
                }
            },
        };

        return stateVariableDefinitions;
    }
}

export class FeedbackDefinitions extends BaseComponent {
    static componentType = "feedbackDefinitions";

    static componentDocs = {
        summary: "A container of reusable feedback definitions.",
    };
    static rendererType = undefined;

    static excludeFromSchema = [];
}
