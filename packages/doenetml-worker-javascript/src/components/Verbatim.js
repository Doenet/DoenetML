import {
    returnSelectedStyleStateVariableDefinition,
    returnTextStyleDescriptionDefinitions,
} from "@doenet/utils";
import BlockComponent from "./abstract/BlockComponent";
import InlineComponent from "./abstract/InlineComponent";
import { returnPassThroughListItemChildStateVariableDefinitions } from "../utils/listItemChild";

export class Pre extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "pre";

    static componentDocs = {
        summary: "A preformatted block preserving whitespace",
    };
    static renderChildren = true;

    static includeBlankStringChildren = true;

    static returnChildGroups() {
        return [
            {
                group: "allChildren",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnPassThroughListItemChildStateVariableDefinitions(),
        );

        stateVariableDefinitions.displayDoenetMLIndices = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    childGroups: ["allChildren"],
                },
            }),
            definition({ dependencyValues }) {
                let displayDoenetMLIndices = [];
                for (let [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (child.componentType === "displayDoenetML") {
                        displayDoenetMLIndices.push(ind);
                    }
                }

                return { setValue: { displayDoenetMLIndices } };
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

export class DisplayDoenetML extends InlineComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "displayDoenetML";
    static rendererType = "text";

    static componentDocs = {
        summary: "Displays a DoenetML source string verbatim",
    };

    static keepChildrenSerialized({ serializedComponent }) {
        if (serializedComponent.children === undefined) {
            return [];
        } else {
            return Object.keys(serializedComponent.children);
        }
    }

    static includeBlankStringChildren = true;

    static returnChildGroups() {
        return [
            {
                group: "allChildren",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        let selectedStyleDefinition =
            returnSelectedStyleStateVariableDefinition();
        Object.assign(stateVariableDefinitions, selectedStyleDefinition);

        let styleDescriptionDefinitions =
            returnTextStyleDescriptionDefinitions();
        Object.assign(stateVariableDefinitions, styleDescriptionDefinitions);

        stateVariableDefinitions.value = {
            shadowVariable: true,
            returnDependencies: () => ({
                childrenDoenetML: {
                    dependencyType: "doenetML",
                    displayOnlyChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: { value: dependencyValues.childrenDoenetML },
                };
            },
        };

        stateVariableDefinitions.text = {
            description: "The verbatim text content.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            forRenderer: true,
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            }),
            definition: ({ dependencyValues }) => ({
                setValue: { text: dependencyValues.value },
            }),
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
