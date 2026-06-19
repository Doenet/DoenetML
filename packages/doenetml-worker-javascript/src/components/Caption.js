import { textFromChildren } from "../utils/text";
import BlockComponent from "./abstract/BlockComponent";

export default class Caption extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "caption";
    static rendererType = "containerInline";
    static canDisplayChildErrors = true;

    static componentDocs = {
        summary: "A caption attached to a figure or table",
    };

    static renderChildren = true;

    static includeBlankStringChildren = true;

    static returnChildGroups() {
        return [
            {
                group: "inlinesBlocks",
                componentTypes: ["_inline", "_block"],
            },
            {
                group: "errors",
                componentTypes: ["_error"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.text = {
            description: "The caption rendered as a plain text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                inlineChildren: {
                    dependencyType: "child",
                    childGroups: ["inlinesBlocks"],
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
