import BlockComponent from "./abstract/BlockComponent";
import { returnPassThroughListItemChildStateVariableDefinitions } from "../utils/listItemChild";
import { textFromChildren } from "../utils/text";

/**
 * One candidate step of a `<parsons>` problem.
 *
 * A block is a plain block-level container, drawn by the same renderer as
 * `<div>`. The enclosing `<parsons>` decides where it is shown — in the
 * solution area or among the unused blocks — and whether it belongs in the
 * solution at all (`isDistractor`).
 */
export default class Block extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "block";

    static componentDocs = {
        summary:
            "A candidate step of a `<parsons>` problem, which the reader moves into or out of the solution",
        docsSlug: "parsons",
    };
    static rendererType = "containerBlock";
    static renderChildren = true;

    static canDisplayChildErrors = true;

    static includeBlankStringChildren = true;

    static createAttributesObject() {
        const attributes = super.createAttributesObject();

        attributes.isDistractor = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "isDistractor",
            defaultValue: false,
            public: true,
            description:
                "Whether this block is a distractor: a step that does not belong in the solution and must be left unused.",
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
        const stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnPassThroughListItemChildStateVariableDefinitions(),
        );

        stateVariableDefinitions.text = {
            description: "The block's content as a text string.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                children: {
                    dependencyType: "child",
                    childGroups: ["anything"],
                    variableNames: ["text"],
                    variablesOptional: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        text: textFromChildren(dependencyValues.children),
                    },
                };
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
