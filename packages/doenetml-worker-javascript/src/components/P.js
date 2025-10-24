import {
    returnScoredSectionAttributes,
    returnScoredSectionStateVariableDefinition,
    submitAllAnswers,
} from "../utils/scoredSection";
import { textFromChildren } from "../utils/text";
import BlockComponent from "./abstract/BlockComponent";

export default class P extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            submitAllAnswers: this.submitAllAnswers.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "p";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        let scoredSectionAttributes = returnScoredSectionAttributes();
        Object.assign(attributes, scoredSectionAttributes);
        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "inlinesAndLists",
                componentTypes: ["_inline", "ol", "ul"],
            },
            {
                group: "errors",
                componentTypes: ["_error"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnScoredSectionStateVariableDefinition(),
        );

        stateVariableDefinitions.text = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlinesAndLists"],
                    variableNames: ["text", "hidden"],
                    variablesOptional: true,
                },
            }),
            definition: function ({ dependencyValues }) {
                let text = textFromChildren(dependencyValues.inlineChildren);

                return { setValue: { text } };
            },
        };

        return stateVariableDefinitions;
    }

    async submitAllAnswers({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        return submitAllAnswers({
            component: this,
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
